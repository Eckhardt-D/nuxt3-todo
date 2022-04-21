import * as Joi from "joi";
import * as bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { connect } from "../database";

export const UserModel = connect().user;

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

export class Users {
  static async fromPlainTextToHash(input: string) {
    const saltRounds = 10;
    return bcrypt.hash(input, saltRounds);
  }

  async add(options: UserAddOptions) {
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Reach into error to check if duplicate.
        if (error.code === "P2002") {
          throw new Error(`A user with email ${params.email} already exists.`);
        }
      }
      throw error;
    }
  }
}
