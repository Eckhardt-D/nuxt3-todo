
import { CompatibilityEvent } from "h3";
import { UserAddOptions } from "./users";
import { createUser } from './users.service';

export const userCreateRoute = async (event: CompatibilityEvent) => {
  const body = await useBody(event);

  const options: UserAddOptions = {
    email: body.email,
    password: body.password,
    passwordConfirm: body.passwordConfirm,
  }
  
  try {
    return {
      data: (await createUser(options as UserAddOptions)),
      error: null,
    }
  } catch(error) {
    return {
      error: error.message,
      data: null,
    }
  }
}