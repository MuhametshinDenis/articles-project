import { apiInstance } from "@/api/api-instance"
import { User } from "@/types/user"

interface LoginData {
  email: string
  password: string
}

export const login = async (data: LoginData): Promise<User> => {
  const response = await apiInstance.post<User>("/auth/login", data)
  return response.data
}
