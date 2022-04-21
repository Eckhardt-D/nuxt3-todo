import {Users, UserAddOptions} from './users';

export const createUser = async (options: UserAddOptions) => {
  return new Users().add(options);
}