import { apiInstance } from "@/api/api-instance"
import { Article } from "@/types/article"

interface UpdateArticleData {
  title?: string
  content?: string
  published?: boolean
}

export const updateArticle = async (
  data: UpdateArticleData,
  articleId: number
) => {
  const response = await apiInstance.patch<Article>(
    `articles/${articleId}`,
    data
  )
  return response.data
}
