import { setActivePinia, createPinia } from "pinia";
import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
} from "vitest";
import { useTodoStore } from "./todo";

function getFirstId(store: ReturnType<typeof useTodoStore>) {
  return store.items[0].id;
}

beforeAll(() => {
  setActivePinia(createPinia());

  // @ts-ignore
  global.$fetch = async () => {
    return {
      data: {
        id: "1234",
        label: "Clean Home",
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  };

  // @ts-ignore
  global.useRequestHeaders = () => "cookier";
});

afterAll(() => {
  global.$fetch = $fetch;
});

describe("initializes", () => {
  test("works", () => {
    expect(true).toBe(true);
  });
});

describe("useTodoStore", () => {
  let store: ReturnType<typeof useTodoStore>;

  beforeEach(() => {
    store = useTodoStore();
  });

  afterEach(() => {
    store.$reset();
  });

  test("references a store", () => {
    expect(store).toBeDefined();
  });

  test("has empty todos on init", () => {
    expect(store.items).toStrictEqual([]);
  });

  test("adds a todo", async () => {
    await store.add({
      label: "Clean Home",
    });

    expect(store.items).toStrictEqual([
      {
        id: expect.any(String),
        label: "Clean Home",
        done: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ]);
  });

  test("gets todo by id", async () => {
    await store.add({
      label: "Clean Home",
    });

    const item = store.getTodoById("1234");
    expect(item.label).toBe("Clean Home");
  });

  test("gets ordered items without mutating original", async () => {
    const items = [
      {
        createdAt: new Date(2021, 1, 22),
      },
      {
        createdAt: new Date(2023, 1, 22),
      },
      {
        createdAt: new Date(2020, 1, 22),
      },
      {
        createdAt: new Date(1994, 1, 22),
      },
    ];

    // @ts-ignore
    store.items = items;

    const sortedItems = store.getSortedTodos;

    expect(sortedItems[0].createdAt.getFullYear()).toBe(1994);
    expect(sortedItems[1].createdAt.getFullYear()).toBe(2020);
    expect(sortedItems[2].createdAt.getFullYear()).toBe(2021);
    expect(sortedItems[3].createdAt.getFullYear()).toBe(2023);
    expect(store.items[0].createdAt.getFullYear()).toBe(2021);
  });

  test("deletes a todo", async () => {
    await store.add({ label: "Delete Me" });
    const id = getFirstId(store);
    store.remove(id);
    expect(store.items).toStrictEqual([]);
  });

  test("updates a todo label", async () => {
    await store.add({ label: "Edit Me" });
    const id = getFirstId(store);
    await store.update(id, { label: "Edited" });
    expect(store.getTodoById(id).label).toBe("Edited");
  });

  test("updates a todo done", async () => {
    await store.add({ label: "Edit Me" });
    const id = getFirstId(store);
    await store.update(id, { done: true });
    expect(store.getTodoById(id).done).toBe(true);
  });

  test("fetches todos", async () => {
    // @ts-ignore
    global.$fetch = () => ({
      data: [
        {
          id: "1234",
          label: "Clean Home",
          done: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    await store.fetchTodos();
    expect(store.items.length).toBeGreaterThan(0);
  });
});
