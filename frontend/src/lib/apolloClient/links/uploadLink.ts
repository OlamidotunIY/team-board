import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

import { HTTP_URL } from "../env";

/**
 * Upload link (HTTP)
 * Using UploadHttpLink class for v19+
 */
export const uploadLink = new UploadHttpLink({
  uri: HTTP_URL,
  credentials: "include",
  headers: {
    "apollo-require-preflight": "true",
    "x-oyana-client-platform": "web",
    "x-oyana-client-version": import.meta.env.NEXT_PUBLIC_APP_VERSION ?? "web-unknown",
  }
});
