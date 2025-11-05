"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/query-core"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import React from "react"

export const queryClient = new QueryClient()

export function ReactQueryLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
