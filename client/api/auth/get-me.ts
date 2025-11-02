import { apiInstance } from "@/api/api-instance"
import { User } from "@/types/user"

export const getMe = async (): Promise<User> => {
  const response = await apiInstance.get<User>("/auth/me")
  return response.data
}
