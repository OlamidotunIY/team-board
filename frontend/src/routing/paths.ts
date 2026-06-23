export const PATHS = {
  root: "/",
  auth: {
    root: "/auth",
    login: "/auth/login",
    signup: "/auth/signup",
  },
  projects: {
    detail: (projectId: string) => `/p/${projectId}`,
    tasks: {
      root: "/tasks",
      detail: (taskId: string) => `/t/${taskId}`,
    },
  },

  error: {
    root: "/error",
    notFound: "/error/404",
    server: "/error/500",
  },
} as const
