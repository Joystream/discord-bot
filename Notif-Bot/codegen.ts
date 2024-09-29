import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://query.joystream.org/graphql",
  documents: "src/graphql/queries/*.graphql",
  generates: {
    "src/graphql/generated/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
