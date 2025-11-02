import { RegisterParams } from "@/types/register-params"
import { apiInstance } from "@/api/api-instance"
import { User } from "@/types/user"

export const register = async (data: RegisterParams) => {
  const response = await apiInstance.post<User>("/auth/register", data)
  return response.data
}
