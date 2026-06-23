import { ApolloClient, ApolloLink, InMemoryCache, split } from "@apollo/client"
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev"
import { getMainDefinition } from "@apollo/client/utilities"
import { errorLink } from "./links/errorLink"
import { authLink } from "./links/authLink"
import { createLoadingLink } from "./links/loadingLink";



loadErrorMessages()
loadDevMessages()

/**
 * Split: subscriptions => WS, everything else => HTTP chain
 */
export const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  ApolloLink.from([createLoadingLink(), errorLink, authLink])
)

/**
 * Apollo Client
 */
export const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      ChatRoom: {
        fields: {
          messages: {
            merge(existing = [], incoming = [], { readField }) {
              if (!existing.length) {
                return incoming
              }

              const merged = [...incoming]
              const seen = new Set<string>()

              for (const ref of merged) {
                const id = readField<string>("id", ref)
                if (id) {
                  seen.add(id)
                }
              }

              for (const ref of existing) {
                const id = readField<string>("id", ref)
                if (id && seen.has(id)) {
                  continue
                }
                if (id) {
                  seen.add(id)
                }
                merged.push(ref)
              }

              return merged
            },
          },
        },
      },
    },
  }),
})
