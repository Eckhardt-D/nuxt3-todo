import { H3Response, EventHandler } from "h3";
import { todosGetRoute } from "~~/src/todos.routes";

export default defineEventHandler(todosGetRoute as EventHandler<H3Response>);
