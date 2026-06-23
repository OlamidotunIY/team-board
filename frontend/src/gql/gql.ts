/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation Login($input: LoginDto!) {\n    login(loginInput: $input) {\n      accessToken\n      user {\n        id\n        email\n        name\n        role\n        jobTitle\n        timezone\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Register($input: RegisterDto!) {\n    register(registerInput: $input) {\n      accessToken\n      user {\n        id\n        email\n        name\n        role\n        jobTitle\n        timezone\n      }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  query Me {\n    currentUser {\n      id\n      email\n      name\n      role\n      jobTitle\n      timezone\n    }\n  }\n": typeof types.MeDocument,
};
const documents: Documents = {
    "\n  mutation Login($input: LoginDto!) {\n    login(loginInput: $input) {\n      accessToken\n      user {\n        id\n        email\n        name\n        role\n        jobTitle\n        timezone\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($input: RegisterDto!) {\n    register(registerInput: $input) {\n      accessToken\n      user {\n        id\n        email\n        name\n        role\n        jobTitle\n        timezone\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  query Me {\n    currentUser {\n      id\n      email\n      name\n      role\n      jobTitle\n      timezone\n    }\n  }\n": types.MeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginDto!) {\n    login(loginInput: $input) {\n      accessToken\n      user {\n        id\n        email\n        name\n        role\n        jobTitle\n        timezone\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginDto!) {\n    login(loginInput: $input) {\n      accessToken\n      user {\n        id\n        email\n        name\n        role\n        jobTitle\n        timezone\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($input: RegisterDto!) {\n    register(registerInput: $input) {\n      accessToken\n      user {\n        id\n        email\n        name\n        role\n        jobTitle\n        timezone\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Register($input: RegisterDto!) {\n    register(registerInput: $input) {\n      accessToken\n      user {\n        id\n        email\n        name\n        role\n        jobTitle\n        timezone\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    currentUser {\n      id\n      email\n      name\n      role\n      jobTitle\n      timezone\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    currentUser {\n      id\n      email\n      name\n      role\n      jobTitle\n      timezone\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;