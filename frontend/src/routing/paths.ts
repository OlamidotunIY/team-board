export const PATHS = {
  root: "/",
  auth: {
    root: "/auth",
    login: "/auth/login",
    signup: "/auth/signup",
  },
  projects: {
    root: "/projects",
    detail: (projectId: string) => `/projects/${projectId}`,
    tasks: {
      root: "/tasks",
      detail: (taskId: string) => `/tasks/${taskId}`,
    },
  },

  error: {
    root: "/error",
    notFound: "/error/404",
    server: "/error/500",
  },
} as const
