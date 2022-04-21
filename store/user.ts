import { defineStore } from "pinia";
import { v4 as uuid } from "uuid";

export interface User {
  id: string;
  email: string;
  /**
   * @todo need to add
   * emailVerified perhaps
   */
}

export interface UserRegisterOptions {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface UserLoginOptions {
  email: string;
  password: string;
}

export interface UserState {
  user: User | null;
}

const state = (): UserState => ({
  user: null
})

export const useUserStore = defineStore('userStore', {
  state,
  actions: {
    async register(input: UserRegisterOptions) {
      /**
       * @todo make request to server
       * to sign user up.
       */
      this.user = {
        id: uuid(),
        email: input.email,
      } as User;
    },
    async login(input: UserLoginOptions) {
      /**
       * @todo make request for login
       * retrieve token cookie
       */
      this.user = {
        id: uuid(),
        email: input.email,
      } as User;
    }
  }
})
