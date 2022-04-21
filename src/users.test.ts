import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  spyOn,
} from "vitest";
import { Users, UserModel } from "./users";

describe("Users - add", () => {
  const users = new Users();

  afterAll(async () => {
    await UserModel.deleteMany();
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
    const mock = spyOn(UserModel, "create").mockRejectedValue("Error");

    await expect(
      users.add({
        email: "test@test.com",
        password: "password",
        passwordConfirm: "password",
      })
    ).rejects.toThrow("Error");

    expect(mock).toHaveBeenCalledTimes(1);
    mock.mockClear();
  });
});
