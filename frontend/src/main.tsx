import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { ApolloProvider } from "@apollo/client/react"
import { client } from "./lib/index.ts"
import { TooltipProvider } from "./components/ui/tooltip.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ApolloProvider client={client}>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </ApolloProvider>
    </ThemeProvider>
  </StrictMode>
)
