import { UserLoginOptions } from "./users";
import { Users, UserAddOptions } from "./users";

export const createUser = async (options: UserAddOptions) => {
  return new Users().add(options);
};

export const loginUser = async (options: UserLoginOptions) => {
  return new Users().login(options);
};
