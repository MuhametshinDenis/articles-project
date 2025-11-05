import { apiInstance } from "@/api/api-instance"
import { Article } from "@/types/article"

type CreateArticleData = Omit<Article, "id" | "createdAt" | "updatedAt">

export const createArticle = async (data: CreateArticleData) => {
  const response = await apiInstance.post<Article>("/articles", data)
  return response.data
}
