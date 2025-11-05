import { apiInstance } from "@/api/api-instance"

export const deleteArticle = async (articleId: number) => {
  const response = await apiInstance.delete(`/articles/${articleId}`)
  return response.data
}
