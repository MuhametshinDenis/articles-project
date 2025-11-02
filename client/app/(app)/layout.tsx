"use client"

import React from "react"
import { Header } from "@/components/header/header"
import { useUser } from "@/hooks/auth/use-user"

function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useUser()

  if (isLoading) {
    return <div>Loading account...</div>
  }

  return (
    <main className="container mx-auto">
      <Header />
      {children}
    </main>
  )
}

export default AppLayout
