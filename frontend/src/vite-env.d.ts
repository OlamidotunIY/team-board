/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_REDIS_URL?: string
  readonly NEXT_PUBLIC_API_URL?: string
  readonly NEXT_PUBLIC_GRAPHQL_WS_URL?: string
  readonly NEXT_PUBLIC_APP_VERSION?: string
  [key: string]: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
