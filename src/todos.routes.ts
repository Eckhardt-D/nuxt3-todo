import { CompatibilityEvent } from "h3";
import { listTodos, addTodo, deleteTodo, updateTodo } from "./todos.service";
import { useAuthRedirect } from "./helpers";

export const todosGetRoute = async (event: CompatibilityEvent) => {
  await useAuthRedirect(event);
  const todos = await listTodos({
    id: event.context.user.id,
  });

  try {
    return {
      data: todos,
      error: null,
    };
  } catch (error) {
    return {
      error: error.message,
      data: null,
    };
  }
};

export const todosAddRoute = async (event: CompatibilityEvent) => {
  await useAuthRedirect(event);
  const body = await useBody(event);

  try {
    return {
      data: await addTodo({ label: body.label, userId: event.context.user.id }),
      error: null,
    };
  } catch (error) {
    return {
      error: error.message,
      data: null,
    };
  }
};

export const todosUpdateRoute = async (event: CompatibilityEvent) => {
  await useAuthRedirect(event);

  const body = await useBody(event);

  try {
    return {
      data: await updateTodo(body),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error.message,
    };
  }
};

export const todosDeleteRoute = async (event: CompatibilityEvent) => {
  await useAuthRedirect(event);

  const body = await useBody(event);

  try {
    return {
      data: await deleteTodo(body),
      error: null,
    };
  } catch (error) {
    return {
      error: error.message,
      data: null,
    };
  }
};
