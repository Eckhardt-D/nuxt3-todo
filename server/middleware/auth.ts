import { Users } from "~~/src/users";
import { useCookie } from "h3";

export default defineEventHandler(async (event) => {
  const cookie = useCookie(event, "nuxt3-todo-token-v1");

  if (!cookie) return;

  const verifiedUser = await Users.getUserFromVerificationToken(cookie);

  if (verifiedUser === undefined) {
    return;
  }

  event.context.user = verifiedUser;
});
