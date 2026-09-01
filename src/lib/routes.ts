export const routes = {
  signIn: "/auth/signin",
  signOut: "/auth/signout",
  signUp: "/auth/signup",
  error: "/auth/error",
  forgotPassword: "/auth/forgot-password",

  home: "/",
  chatRoom: (slug: string) => `/chats/${slug}`,
  profile: "/profile",
  search: "/search",
  settings: "/settings",
  changePassword: "/change-password",
};
