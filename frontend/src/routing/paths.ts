export const PATHS = {
  root: "/",
  auth: {
    root: "/auth",
    login: "/auth/login",
    signup: "/auth/signup",
  },
  projects: {
    detail: (projectId: string) => `/p/${projectId}`,
  },

  error: {
    root: "/error",
    notFound: "/error/404",
    server: "/error/500",
  },
} as const
