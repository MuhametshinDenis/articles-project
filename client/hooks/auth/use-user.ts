"use client"

import { useUserStore } from "@/store/user-store"
import { useQuery } from "@tanstack/react-query"
import { getMe } from "@/api/auth/get-me"
import { useEffect } from "react"

export const useUser = () => {
  const { user, setUser } = useUserStore()

  const { data, isLoading, isSuccess, error } = useQuery({
    queryFn: getMe,
    queryKey: ["user"],
    retry: 1,
  })

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data)
    }
  }, [data, isSuccess, setUser])

  return {
    user: data ?? user,
    isLoading,
    isSuccess,
    error,
  }
}
