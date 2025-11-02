import { apiInstance } from "@/api/api-instance"
import { Article } from "@/types/article"

export const findAllArticles = async (): Promise<Article[]> => {
  const response = await apiInstance<Article[]>("/articles")
  return response.data
}
