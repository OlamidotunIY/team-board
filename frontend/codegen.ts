import process from "node:process";
import type { CodegenConfig } from "@graphql-codegen/cli";

const schemaUrl = process.env.VITE_GRAPHQL_URL ?? "http://localhost:3100/graphql";

const config: CodegenConfig = {
  schema: schemaUrl,
  documents: ["src/graphql/**/*.ts", "src/**/*.graphql", "src/**/*.gql"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
    },
    "./src/gql/schema-types.ts": {
      plugins: ["typescript"],
      config: {
        enumsAsTypes: true,
        avoidOptionals: false,
        maybeValue: "T | null",
      },
    },
  },
};

export default config;
