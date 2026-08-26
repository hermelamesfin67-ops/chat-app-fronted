export const routes = {
  signIn: "/auth/signin",
  signOut: "/auth/signout",
  signUp: "/auth/signup",
  error: "/auth/error",

  home: "/",
  chatRoom: (slug: string) => `/chats/${slug}`,
  profile: "/profile",
  search: "/search",
  settings: "/settings",
};
