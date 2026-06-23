import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3000/graphql",
  documents: ["./**/*.{ts,tsx}", "!./src/gql/**/*", "!./node_modules/**"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      config: {
        useTypeImports: true,
        documentMode: "string",
      },
      plugins: [],
    },
  },
};

export default config;