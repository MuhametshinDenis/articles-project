import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Article } from "@/types/article"
import { DeleteArticleButton } from "@/components/articles/delete-article-button"
import { EditArticleDialog } from "@/components/articles/edit-article-dialog"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card key={article.id}>
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
        <CardDescription>Published: {article.updatedAt}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{article.content}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <EditArticleDialog
          articleId={article.id}
          title={article.title}
          content={article.content}
          published={article.published}
        />
        <DeleteArticleButton articleId={article.id} />
      </CardFooter>
    </Card>
  )
}
