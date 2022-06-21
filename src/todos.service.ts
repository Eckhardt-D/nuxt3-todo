import {
  Todos,
  TodosAddOptions,
  TodosUpdateByIdOptions,
  TodosListByUserIdOptions,
  TodosDeleteByIdOptions,
} from "./todos";

const todos = new Todos();

export const listTodos = async (options: TodosListByUserIdOptions) =>
  todos.listByUserId(options);

export const addTodo = async (options: TodosAddOptions) => todos.add(options);

export const deleteTodo = async (options: TodosDeleteByIdOptions) =>
  todos.deleteById(options);

export const updateTodo = async (options: TodosUpdateByIdOptions) =>
  todos.updateById(options);
