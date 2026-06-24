import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3100/graphql",
  documents: ["src/graphql/**/*.ts", "src/**/*.graphql", "src/**/*.gql"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
    },
    "./src/gql/schema-types.ts": {
      plugins: ["typescript"],
      config: {
        enumsAsTypes: false,
        avoidOptionals: false,
        maybeValue: "T | null",
      },
    },
  },
};

export default config;
