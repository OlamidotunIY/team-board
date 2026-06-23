import { CombinedGraphQLErrors } from "@apollo/client/errors";

export const extractGraphQLErrors = (error: unknown) => {
  if (!CombinedGraphQLErrors.is(error)) {
    return [];
  }

  return error.errors.map((err) => ({
    message: err.message,
    extensions: err.extensions,
    path: err.path,
  }));
};
