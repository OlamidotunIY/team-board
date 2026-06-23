import { setContext } from "@apollo/client/link/context"

/**
 * Auth link for HTTP (queries/mutations/uploads)
 * Cookies are automatically sent with credentials: 'include'
 */
export const authLink = setContext(async (_, { headers }) => {
  const accessToken =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessToken")
      : null
  const version =
    typeof window !== "undefined"
      ? (import.meta.env.NEXT_PUBLIC_APP_VERSION ?? "web-unknown")
      : "web-unknown"

  return {
    headers: {
      ...headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      "x-teamBoard-client-platform": "web",
      "x-teamBoard-client-version": version,
    },
  }
})
