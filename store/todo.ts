import { defineStore } from "pinia";
import { ApiResponse } from "~~/src/helpers";

export interface Todo {
  id: string;
  label: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Todos = Todo[] | undefined[];

export interface TodoAdd {
  label: string;
}

export interface TodoUpdate {
  label?: string;
  done?: boolean;
}

interface TodoState {
  items: Todos;
}

const state = (): TodoState => ({
  items: [],
});

const getters = {
  getTodoById: (state: TodoState) => {
    return (id: string) =>
      state.items.find((item) => !!item && (item as Todo).id === id);
  },
  getSortedTodos: (state: TodoState) => {
    return [...state.items].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  },
};

export const useTodoStore = defineStore("todoStore", {
  state,
  getters,
  actions: {
    async add(todo: TodoAdd) {
      const response = (await $fetch("/api/todo/todos", {
        method: "POST",
        body: todo,
      })) as ApiResponse;

      this.items.push(response.data);
    },
    async remove(id: string) {
      this.items = this.items.filter((item) => item.id !== id);

      await $fetch("/api/todo/todos", {
        method: "DELETE",
        body: {
          id,
        },
      });
    },
    async update(id: string, update: TodoUpdate) {
      const items = this.items as Todos;
      const index = items.findIndex(
        (item) => !!item && (item as Todo).id === id
      );

      items[index] = { ...items[index], ...update, updatedAt: new Date() };
      await $fetch("/api/todo/todos", {
        method: "PUT",
        body: {
          id,
          ...update,
        },
      });
    },
    async fetchTodos() {
      const response = (await $fetch("/api/todo/todos", {
        headers: useRequestHeaders(["cookie"]),
      })) as ApiResponse;

      if (response.data !== null) {
        this.items = response.data;
      }
    },
  },
});
