import { EventHandler, H3Response } from "h3";
import { todosAddRoute } from "~~/src/todos.routes";

export default defineEventHandler(todosAddRoute as EventHandler<H3Response>);
