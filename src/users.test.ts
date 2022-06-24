import {
  describe,
  test,
  expect,
  afterAll,
  vi,
  afterEach,
  beforeAll,
} from "vitest";
import { TodoModel } from "./todos";
import { User, Users, UserModel } from "./users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("isValidPassword", () => {
  test("returns false if password is invalid", async () => {
    const result = await Users.isValidPassword({
      password: "password",
      hash: "password",
    });

    expect(result).toBe(false);
  });

  test("returns true if password is valid", async () => {
    const hash = await bcrypt.hash("password", 10);

    const result = await Users.isValidPassword({
      password: "password",
      hash,
    });

    expect(result).toBe(true);
  });
});

describe("createToken", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns null if error occurred", () => {
    const mock = vi
      .spyOn(jwt, "sign")
      .mockImplementationOnce((payload, secret, callback) => {
        throw new Error("error");
      });

    // @ts-ignore:TS2431
    const token = Users.createToken({
      id: "1234",
      email: "test@test.com",
    });

    expect(mock).toHaveBeenCalled();
    expect(token).toBeNull();
  });

  test("returns a token", () => {
    // @ts-ignore:TS2431
    const token = Users.createToken({
      id: "1234",
      email: "test@test.com",
    });

    expect(token.length).toBeGreaterThan(0);
  });
});

describe("getUserFromVerificationToken", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns undefined if an error occurred", async () => {
    const mock = vi.spyOn(jwt, "verify").mockImplementationOnce(() => {
      throw new Error();
    });

    const result = await Users.getUserFromVerificationToken("1234");

    expect(mock).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  test("returns a user", async () => {
    // @ts-ignore:TS2431
    const token = Users.createToken({
      id: "1234",
      email: "test@test.com",
    });

    const result = await Users.getUserFromVerificationToken(token);
    expect(result).toStrictEqual({
      id: "1234",
      email: "test@test.com",
    });
  });
});

describe("Users - add", () => {
  const email = "test@test.com";
  const users = new Users();

  afterAll(async () => {
    vi.restoreAllMocks();
    await UserModel.delete({ where: { email } });
  });

  test("creates a hashed password", async () => {
    const plain = "password";
    const hashed = await Users.fromPlainTextToHash(plain);
    expect(hashed).toMatch("$2b$10$");
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(users.add()).rejects.toThrow('"value" is required');
  });

  test("throws if options are invalid", async () => {
    await expect(users.add(null)).rejects.toThrow(
      '"value" must be of type object'
    );
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(users.add({})).rejects.toThrow('"email" is required');
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(users.add({ email: 1 })).rejects.toThrow(
      '"email" must be a string'
    );
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(users.add({ email: "" })).rejects.toThrow(
      '"email" is not allowed to be empty'
    );
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(users.add({ email: "test" })).rejects.toThrow(
      '"email" must be a valid email'
    );
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(users.add({ email: "test@test.com" })).rejects.toThrow(
      '"password" is required'
    );
  });

  test("throws if options are invalid", async () => {
    await expect(
      // @ts-ignore:TS2554
      users.add({ email: "test@test.com", password: null })
    ).rejects.toThrow('"password" must be a string');
  });

  test("throws if options are invalid", async () => {
    await expect(
      // @ts-ignore:TS2554
      users.add({ email: "test@test.com", password: "" })
    ).rejects.toThrow('"password" is not allowed to be empty');
  });

  test("throws if options are invalid", async () => {
    await expect(
      // @ts-ignore:TS2554
      users.add({ email: "test@test.com", password: "123456" })
    ).rejects.toThrow('"password" length must be at least 7 characters long');
  });

  test("throws if options are invalid", async () => {
    await expect(
      // @ts-ignore:TS2554
      users.add({
        email: "test@test.com",
        password: "1234567891011121314151617181920212223",
      })
    ).rejects.toThrow(
      '"password" length must be less than or equal to 36 characters long'
    );
  });

  test("throws if options are invalid", async () => {
    await expect(
      // @ts-ignore:TS2554
      users.add({
        email: "test@test.com",
        password: "password",
      })
    ).rejects.toThrow('"passwordConfirm" is required');
  });

  test("throws if options are invalid", async () => {
    await expect(
      // @ts-ignore:TS2554
      users.add({
        email: "test@test.com",
        password: "password",
        passwordConfirm: "passwor1d",
      })
    ).rejects.toThrow('"passwordConfirm" must be [ref:password]');
  });

  test("successfully creates a user", async () => {
    const user = await users.add({
      email: "test@test.com",
      password: "password",
      passwordConfirm: "password",
    });

    expect(user).toStrictEqual({
      id: expect.any(String),
      email: "test@test.com",
    });
  });

  test("throws if duplicate email", async () => {
    await expect(
      users.add({
        email: "test@test.com",
        password: "password",
        passwordConfirm: "password",
      })
    ).rejects.toThrow("A user with email");
  });

  test("throws non-duplicate error if something goes wrong", async () => {
    const originalCreate = UserModel.create;

    const mocked = vi.fn(() => {
      throw new Error("Error");
    });

    UserModel.create = mocked;

    await expect(
      users.add({
        email: "test@test.com",
        password: "password",
        passwordConfirm: "password",
      })
    ).rejects.toThrow("Error");

    expect(mocked).toHaveBeenCalledTimes(1);
    UserModel.create = originalCreate;
  });
});

describe("Users - login", () => {
  let user: User;
  const password = "password";

  beforeAll(async () => {
    user = await new Users().add({
      email: "test@test.com",
      password,
      passwordConfirm: password,
    });
  });

  afterAll(async () => {
    await TodoModel.deleteMany();
    await UserModel.deleteMany();
  });

  test("it throws if an error occurred", async () => {
    // @ts-ignore:TS2554
    await expect(new Users().login()).rejects.toThrow('"value" is required');
  });

  test("it throws if an error occurred", async () => {
    // @ts-ignore:TS2554
    await expect(new Users().login(null)).rejects.toThrow(
      '"value" must be of type object'
    );
  });

  test("it throws if an error occurred", async () => {
    // @ts-ignore:TS2554
    await expect(new Users().login({})).rejects.toThrow('"email" is required');
  });

  test("it throws if an error occurred", async () => {
    // @ts-ignore:TS2554
    await expect(new Users().login({ email: null })).rejects.toThrow(
      '"email" must be a string'
    );
  });

  test("it throws if an error occurred", async () => {
    // @ts-ignore:TS2554
    await expect(new Users().login({ email: "" })).rejects.toThrow(
      '"email" is not allowed to be empty'
    );
  });

  test("it throws if an error occurred", async () => {
    // @ts-ignore:TS2554
    await expect(new Users().login({ email: "test@test.com" })).rejects.toThrow(
      '"password" is required'
    );
  });

  test("it throws if an error occurred", async () => {
    // @ts-ignore:TS2554
    await expect(
      new Users().login({ email: "test@test.com", password: null })
    ).rejects.toThrow('"password" must be a string');
  });

  test("it throws if an error occurred", async () => {
    // @ts-ignore:TS2554
    await expect(
      new Users().login({ email: "test@test.com", password: "" })
    ).rejects.toThrow('"password" is not allowed to be empty');
  });

  test("it throws if an error occurred", async () => {
    // @ts-ignore:TS2554
    await expect(
      new Users().login({ email: "test@test.com", password: "test" })
    ).rejects.toThrow("Invalid login, ");
  });

  test("throws if user does not exist", async () => {
    // @ts-ignore:TS2554
    await expect(
      new Users().login({ email: "test2@test2.com", password: "test" })
    ).rejects.toThrow("Invalid login, ");
  });

  test("returns a token if user successfully logged in", async () => {
    const result = await new Users().login({
      email: "test@test.com",
      password,
    });
    expect(result).toStrictEqual({
      token: expect.any(String),
      tokenExpiryInDays: expect.any(Number),
    });
  });
});
