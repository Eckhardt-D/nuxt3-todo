import { CompatibilityEvent } from "h3";
import { ApiResponse, useAuthRedirect } from "./helpers";
import { UserAddOptions } from "./users";
import { createUser, loginUser } from "./users.service";

export const userCreateRoute = async (
  event: CompatibilityEvent
): Promise<ApiResponse> => {
  const body = await useBody(event);

  const options: UserAddOptions = {
    email: body.email,
    password: body.password,
    passwordConfirm: body.passwordConfirm,
  };

  try {
    return {
      data: await createUser(options as UserAddOptions),
      error: null,
    };
  } catch (error) {
    return {
      error: error.message,
      data: null,
    };
  }
};

export const userLoginRoute = async (
  event: CompatibilityEvent
): Promise<ApiResponse> => {
  const body = await useBody(event);

  const options = {
    email: body.email,
    password: body.password,
  };

  try {
    const details = await loginUser(options);

    setCookie(event, "nuxt3-todo-token-v1", details.token, {
      expires: new Date(
        Date.now() + details.tokenExpiryInDays * 24 * 60 * 60 * 1000
      ),
    });

    return {
      data: "success",
      error: null,
    };
  } catch (error) {
    return {
      error: error.message,
      data: null,
    };
  }
};

export const userAuthorizeRoute = async (event: CompatibilityEvent) => {
  await useAuthRedirect(event);
  return event.context.user;
};
