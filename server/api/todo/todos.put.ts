import { EventHandler, H3Response } from "h3";
import { todosUpdateRoute } from "~~/src/todos.routes";

export default defineEventHandler(todosUpdateRoute as EventHandler<H3Response>);
