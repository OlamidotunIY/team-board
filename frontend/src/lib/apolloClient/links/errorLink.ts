import { Observable } from "@apollo/client"
import { ErrorLink } from "@apollo/client/link/error"
import { toast } from "sonner"

import { HTTP_URL } from "../env"

/**
 * Refresh token via fetch (NO circular dependency on ApolloClient)
 * Adjust the mutation name if yours differs.
 *
 * Assumption: better-auth refresh updates cookies, not Bearer tokens.
 */
async function refreshSessionViaFetch(): Promise<boolean> {
  try {
    const headers: HeadersInit = {
      "content-type": "application/json",
    }

    const res = await fetch(HTTP_URL, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({
        query: `
          mutation RefreshToken {
            refreshToken {
              accessToken
              refreshToken
            }
          }
        `,
      }),
    })

    if (!res.ok) return false

    const payload = (await res.json()) as {
      data?: {
        refreshToken?: {
          accessToken?: string
          refreshToken?: string
        }
      }
      errors?: Array<{ message?: string }>
    }

    if (Array.isArray(payload.errors) && payload.errors.length > 0) {
      return false
    }

    return Boolean(payload.data?.refreshToken?.accessToken)
  } catch (e) {
    return false
  }
}

/**
 * Error link with retry-on-UNAUTHENTICATED
 */
let retryCount = 0
const maxRetry = 3

export const errorLink = new ErrorLink(({ error, operation, forward }) => {
  // Destructure `error` (ErrorLike) instead of `graphQLErrors`
  const operationName = operation.operationName || "Unknown Operation"

  // 1. Check for GraphQL Errors
  if (error && "graphQLErrors" in error && Array.isArray(error.graphQLErrors)) {
    for (const err of error.graphQLErrors) {
      const message = err.message
      const code = err.extensions?.code

      console.error(
        `[GraphQL error]: Message: ${message}, Operation: ${operationName}`
      )

      if (code === "UNAUTHENTICATED") {
        if (retryCount >= maxRetry) {
          console.warn(
            `Max retry reached for ${operationName}. Redirecting to login.`
          )
          toast.error("Session expired. Please login again.")
          return
        }

        retryCount++

        return new Observable((observer) => {
          refreshSessionViaFetch()
            .then((ok) => {
              if (!ok) {
                throw new Error("Session refresh failed")
              }

              /**
               * IMPORTANT:
               * - force WS reconnect so subscriptions use the new session
               */
              const oldHeaders = operation.getContext().headers || {}

              // Update headers with new cookies (if environment allows access)
              const newHeaders = { ...oldHeaders }
              if (typeof window !== "undefined") {
                newHeaders.cookie = document.cookie
              }

              operation.setContext({
                headers: newHeaders,
              })

              // Force WS reconnect so new connectionParams are used
              // (wsLink uses document.cookie, so it will pick up new cookies)
              // @ts-ignore
              wsClient.dispose()

              forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              })
            })
            .catch((refreshError) => {
              console.error(
                `[Auth error]: Refresh failed for ${operationName}`,
                refreshError
              )
              observer.error(refreshError)
            })
        })
      }

      toast.error(message || "An unexpected error occurred")
    }
  }

  // 2. Check for Network Errors
  if (error && "networkError" in error && error.networkError) {
    const netErr = error.networkError // Could be Error or ServerError
    console.error(
      `[Network error]: ${String(netErr)} (Operation: ${operationName})`
    )
    toast.error("Network error. Please check your connection.")
  }
})
