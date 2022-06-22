import { CompatibilityEvent, sendRedirect } from "h3";

export interface ApiResponse {
  data: null | Record<string, any> | string;
  error: null | string;
  [key: string]: any;
}

export const useAuthRedirect = async (event: CompatibilityEvent) => {
  if (!event.context.user) {
    return sendRedirect(event, "/auth");
  }
};
