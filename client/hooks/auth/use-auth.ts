import { useMutation } from "@tanstack/react-query"
import { useUserStore } from "@/store/user-store"
import { User } from "@/types/user"
import { toast } from "sonner"

interface Auth<T> {
  callback: (data: T) => Promise<User>
}

export const useAuth = <T>({ callback }: Auth<T>) => {
  const { setUser } = useUserStore()

  return useMutation({
    mutationFn: callback,
    onSuccess: (user: User) => {
      setUser(user)
      toast("Successful login")
    },
    onError: (error) => {
      console.error(`Error logging in: ${error.message}`)
    },
  })
}
