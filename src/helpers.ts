import { CompatibilityEvent, sendRedirect } from "h3";

export interface ResponseShape {
  data: null | Record<string, any>;
  error: null | string;
}

export const useAuthRedirect = async (event: CompatibilityEvent) => {
  if (!event.context.user) {
    return sendRedirect(event, "/auth");
  }
};
