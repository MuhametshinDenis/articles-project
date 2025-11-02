import { apiInstance } from "@/api/api-instance"
import { ApiResponse } from "@/types/api-response"

export const logout = async () => {
  const response = await apiInstance.post<ApiResponse<string>>("/auth/logout")
  return response.data
}
