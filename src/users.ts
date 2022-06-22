import Joi from "joi";
import Prisma from "@prisma/client";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import JWT from "jsonwebtoken";
import { connect } from "../database";

const TOKEN_EXPIRY_DAYS = 7;

export const UserModel = connect().user;

export interface User {
  id: string;
  email: string;
}

export interface UserAddOptions {
  email: string;
  password: string;
  passwordConfirm: string;
}

const userAddOptionsSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).max(36).required(),
  passwordConfirm: Joi.string().valid(Joi.ref("password")).required(),
}).required();

export interface UserLoginOptions {
  email: string;
  password: string;
}

const userLoginOptionsSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().max(36).required(),
}).required();

export interface IsValidPasswordOptions {
  password: string;
  hash: string;
}

const isValidPasswordOptionsSchema = Joi.object({
  password: Joi.string().max(36).required(),
  hash: Joi.string().required(),
});

export class Users {
  static async fromPlainTextToHash(input: string) {
    const saltRounds = 10;
    return bcrypt.hash(input, saltRounds);
  }

  static async isValidPassword(
    options: IsValidPasswordOptions
  ): Promise<boolean> {
    const params = (await isValidPasswordOptionsSchema.validateAsync(
      options
    )) as IsValidPasswordOptions;

    try {
      return await bcrypt.compare(params.password, params.hash);
      /* c8 ignore next 3 */
    } catch (error) {
      return false;
    }
  }

  private static createToken(user: User): string | null {
    try {
      return JWT.sign(user, process.env.JWT_TOKEN_SECRET, {
        expiresIn: `${TOKEN_EXPIRY_DAYS}d`,
      });
    } catch (error) {
      return null;
    }
  }

  static async getUserFromVerificationToken(
    token: string
  ): Promise<User | undefined> {
    try {
      const decoded = (await JWT.verify(
        token,
        process.env.JWT_TOKEN_SECRET
      )) as User;
      return {
        id: decoded.id,
        email: decoded.email,
      };
    } catch (error) {
      return undefined;
    }
  }

  async add(options: UserAddOptions): Promise<User> {
    const params = (await userAddOptionsSchema.validateAsync(
      options
    )) as UserAddOptions;

    const passwordHash = await Users.fromPlainTextToHash(params.password);

    try {
      const response = await UserModel.create({
        data: {
          id: uuid(),
          email: params.email,
          password: passwordHash,
        },
      });

      return {
        id: response.id,
        email: response.email,
      };
    } catch (error) {
      if (error instanceof Prisma.Prisma.PrismaClientKnownRequestError) {
        // Reach into error to check if duplicate.
        if (error.code === "P2002") {
          throw new Error(`A user with email ${params.email} already exists.`);
        }
      }
      throw error;
    }
  }

  async login(
    options: UserLoginOptions
  ): Promise<{ token: string; tokenExpiryInDays: number }> {
    const params = (await userLoginOptionsSchema.validateAsync(
      options
    )) as UserLoginOptions;

    const user = await UserModel.findFirst({
      where: { email: params.email },
    });

    if (user === null) {
      throw new Error("Invalid login, please check your details.");
    }

    const isValidPassword = await Users.isValidPassword({
      password: params.password,
      hash: user.password,
    });

    if (!isValidPassword) {
      throw new Error("Invalid login, please check your details.");
    }

    const token = Users.createToken({
      id: user.id,
      email: user.email,
    });

    return {
      token,
      tokenExpiryInDays: TOKEN_EXPIRY_DAYS,
    };
  }
}
