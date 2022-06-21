const ALLOWED_ROUTES = [/^\/auth\/?$/];

export default defineNuxtRouteMiddleware(async (to) => {
  if (ALLOWED_ROUTES.some((route) => route.test(to.fullPath))) {
    return;
  }

  const cookie = useCookie("nuxt3-todo-token-v1");

  if (!cookie || !cookie.value) {
    return navigateTo("/auth");
  }
});
