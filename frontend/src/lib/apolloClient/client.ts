import { ApolloClient, ApolloLink, InMemoryCache, split } from "@apollo/client"
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev"
import { getMainDefinition } from "@apollo/client/utilities"
import { errorLink } from "./links/errorLink"
import { authLink } from "./links/authLink"
import { createLoadingLink } from "./links/loadingLink";
import { uploadLink } from "./links/uploadLink"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { WS_URL } from "./env"



loadErrorMessages()
loadDevMessages()

const wsClient = createClient({ url: WS_URL });
const wsLink = new GraphQLWsLink(wsClient);

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
  wsLink,
  ApolloLink.from([createLoadingLink(), errorLink, authLink, uploadLink])
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
