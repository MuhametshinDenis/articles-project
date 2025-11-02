"use client"

import { useMutation } from "@tanstack/react-query"
import { logout } from "@/api/auth/logout"
import { useUserStore } from "@/store/user-store"
import { toast } from "sonner"

export const useLogout = () => {
  const { clearUser } = useUserStore()

  const { mutate } = useMutation({
    mutationFn: async () => {
      return await logout()
    },
    onSuccess: () => {
      clearUser()
      toast("Sussessfully logged out")
    },
    onError: () => {
      toast("Error while logging out")
      console.error("Error while logging out")
    },
  })

  return () => mutate()
}
