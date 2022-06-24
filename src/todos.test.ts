import { v4 as uuid } from "uuid";
import { Todo, User } from "@prisma/client";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { TodoModel, Todos } from "./todos";
import { UserModel } from "./users";

const todos = new Todos();

describe("Todos - add", () => {
  let userRecord: User;

  beforeAll(async () => {
    let user = {} as User;
    user.id = uuid();
    user.email = `${uuid()}_test@test.com`;
    user.password = "password";

    userRecord = await UserModel.create({ data: user });
  });

  afterAll(async () => {
    await TodoModel.deleteMany({ where: { ownerId: userRecord.id } });
    await UserModel.delete({ where: { id: userRecord.id } });
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(todos.add()).rejects.toThrow('"value" is required');
  });

  test("throws if options are invalid", async () => {
    await expect(todos.add(null)).rejects.toThrow(
      '"value" must be of type object'
    );
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2345
    await expect(todos.add({})).rejects.toThrow('"userId" is required');
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2345
    await expect(todos.add({ userId: null })).rejects.toThrow(
      '"userId" must be a string'
    );
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2345
    await expect(todos.add({ userId: "" })).rejects.toThrow(
      '"userId" is not allowed to be empty'
    );
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2345
    await expect(todos.add({ userId: "2345" })).rejects.toThrow(
      '"label" is required'
    );
  });

  test("throws if options are invalid", async () => {
    await expect(todos.add({ userId: "2345", label: null })).rejects.toThrow(
      '"label" must be a string'
    );
  });

  test("throws if options are invalid", async () => {
    await expect(todos.add({ userId: "2345", label: "" })).rejects.toThrow(
      '"label" is not allowed to be empty'
    );
  });

  test("throws if options are invalid", async () => {
    await expect(todos.add({ userId: "2345", label: "" })).rejects.toThrow(
      '"label" is not allowed to be empty'
    );
  });

  test("returns undefined if a user does not exist", async () => {
    const result = await todos.add({ userId: "notExist", label: "Do tests" });
    expect(result).toBeUndefined();
  });

  test("returns a todo after creating it", async () => {
    const result = await todos.add({
      userId: userRecord.id,
      label: "I shall pass",
    });

    expect(result).toStrictEqual({
      id: expect.any(String),
      label: "I shall pass",
      ownerId: userRecord.id,
      done: false,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});

describe("Todos - listByUserId", () => {
  let userRecord: User;

  beforeAll(async () => {
    let user = {} as User;
    user.id = uuid();
    user.email = `${uuid()}_test@test.com`;
    user.password = "password";

    userRecord = await UserModel.create({ data: user });
  });

  afterAll(async () => {
    await TodoModel.deleteMany({ where: { ownerId: userRecord.id } });
    await UserModel.deleteMany({ where: { id: userRecord.id } });
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(todos.listByUserId()).rejects.toThrow('"value" is required');
  });

  test("throws if options are invalid", async () => {
    await expect(todos.listByUserId(null)).rejects.toThrow(
      '"value" must be of type object'
    );
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2345
    await expect(todos.listByUserId({})).rejects.toThrow('"id" is required');
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2345
    await expect(todos.listByUserId({ id: null })).rejects.toThrow(
      '"id" must be a string'
    );
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2345
    await expect(todos.listByUserId({ id: "" })).rejects.toThrow(
      '"id" is not allowed to be empty'
    );
  });

  test("returns undefined if a user does not exist", async () => {
    const result = await todos.listByUserId({ id: "notExist" });
    expect(result).toBeUndefined();
  });

  test("returns a list of todos", async () => {
    await TodoModel.createMany({
      data: [
        {
          id: uuid(),
          ownerId: userRecord.id,
          label: "I shall pass",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          ownerId: userRecord.id,
          label: "I shall pass",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    const result = await todos.listByUserId({
      id: userRecord.id,
    });

    expect(result).toStrictEqual([
      {
        id: expect.any(String),
        label: "I shall pass",
        ownerId: userRecord.id,
        done: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        label: "I shall pass",
        ownerId: userRecord.id,
        done: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ]);
  });
});

describe("Todos - updateById", () => {
  let userRecord: User;
  let todoRecord1: Todo;
  let todoRecord2: Todo;

  beforeAll(async () => {
    let user = {} as User;
    let todo1 = {} as Todo;
    let todo2 = {} as Todo;

    user.id = uuid();
    user.email = `${uuid()}_test@test.com`;
    user.password = "password";

    userRecord = await UserModel.create({ data: user });

    todo1.id = uuid();
    todo1.label = "todo1";

    todo2.id = uuid();
    todo2.label = "todo2";

    todoRecord1 = await TodoModel.create({
      data: {
        id: todo1.id,
        ownerId: user.id,
        done: false,
        label: todo1.label,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    todoRecord2 = await TodoModel.create({
      data: {
        id: todo2.id,
        ownerId: user.id,
        done: false,
        label: todo2.label,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await TodoModel.deleteMany({ where: { ownerId: userRecord.id } });
    await UserModel.deleteMany({ where: { id: userRecord.id } });
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(todos.updateById()).rejects.toThrow('"value" is required');
  });

  test("throws if options are invalid", async () => {
    await expect(todos.updateById(null)).rejects.toThrow(
      '"value" must be of type object'
    );
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2345
    await expect(todos.updateById({})).rejects.toThrow('"id" is required');
  });

  test("throws if options are invalid", async () => {
    await expect(todos.updateById({ id: null })).rejects.toThrow(
      '"id" must be a string'
    );
  });

  test("throws if options are invalid", async () => {
    await expect(todos.updateById({ id: "" })).rejects.toThrow(
      '"id" is not allowed to be empty'
    );
  });

  test("updates no fields of the record", async () => {
    const result = await todos.updateById({
      id: todoRecord1.id,
    });

    expect(result).toStrictEqual(todoRecord1);
  });

  test("updates all fields of the record", async () => {
    const result = await todos.updateById({
      id: todoRecord1.id,
      label: "updated",
      done: true,
    });

    expect(result).toStrictEqual({
      ...todoRecord1,
      label: "updated",
      done: true,
    });
  });

  test("does not update unspecified record", async () => {
    await todos.updateById({
      id: todoRecord1.id,
      label: "updated",
      done: true,
    });

    const result = await TodoModel.findFirst({
      where: {
        id: todoRecord2.id,
      },
    });

    expect(result).toStrictEqual(todoRecord2);
  });
});

describe("Todo - deleteById", () => {
  let userRecord: User;
  let todoRecord: Todo;

  beforeAll(async () => {
    let user = {} as User;
    let todo1 = {} as Todo;
    let todo2 = {} as Todo;

    user.id = uuid();
    user.email = `${uuid()}_test@test.com`;
    user.password = "password";

    userRecord = await UserModel.create({ data: user });

    todo1.id = uuid();
    todo1.label = "todo1";

    todo2.id = uuid();
    todo2.label = "todo2";

    todoRecord = await TodoModel.create({
      data: {
        id: todo1.id,
        ownerId: user.id,
        done: false,
        label: todo1.label,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await TodoModel.deleteMany({ where: { ownerId: userRecord.id } });
    await UserModel.deleteMany({ where: { id: userRecord.id } });
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(todos.deleteById()).rejects.toThrow('"value" is required');
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(todos.deleteById(null)).rejects.toThrow(
      '"value" must be of type object'
    );
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(todos.deleteById({})).rejects.toThrow('"id" is required');
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(todos.deleteById({ id: null })).rejects.toThrow(
      '"id" must be a string'
    );
  });

  test("throws if options are invalid", async () => {
    // @ts-ignore:TS2554
    await expect(todos.deleteById({ id: "" })).rejects.toThrow(
      '"id" is not allowed to be empty'
    );
  });

  test("returns false if todo does not exist", async () => {
    const result = await todos.deleteById({ id: "noExist" });
    expect(result).toBe(false);
  });

  test("returns true if todo deleted", async () => {
    const result = await todos.deleteById({ id: todoRecord.id });
    expect(result).toBe(true);
  });
});
