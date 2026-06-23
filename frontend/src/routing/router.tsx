import { createBrowserRouter, Navigate } from "react-router-dom"
import { PATHS } from "./paths"
import { RequireAuth } from "@/features/auth/RequireAuth"
import AuthLayout from "@/layout/AuthLayout"
import LoginPage from "@/features/auth/pages/LoginPage"
import RegisterPage from "@/features/auth/pages/RegisterPage"

export const router = createBrowserRouter([
  {
    path: PATHS.root,
    children: [
      {
        path: PATHS.auth.root,
        element: <AuthLayout />,
        children: [
          {
            path: PATHS.auth.login,
            element: <LoginPage />,
          },
          {
            path: PATHS.auth.signup,
            element: <RegisterPage />,
          },
        ],
      },
      {
        path: PATHS.root,
        element: <RequireAuth />,
        children: [
          {

          },
        ],
      },
      {
        path: "*",
        element: <Navigate to={PATHS.error.notFound} replace />,
      },
    ],
  },
])
