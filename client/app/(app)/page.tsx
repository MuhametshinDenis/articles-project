"use client"

import { useQuery } from "@tanstack/react-query"
import { findAllArticles } from "@/api/articles/find-all-articles"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { data, isError, error, isLoading } = useQuery({
    queryFn: findAllArticles,
    queryKey: ["articles"],
  })

  if (isLoading) {
    return <div>Loading articles...</div>
  }

  if (isError || !data) {
    return <div>Error loading articles: {error?.message}</div>
  }

  return (
    <div>
      <section className="grid grid-cols-1 gap-4">
        {data.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>Published: {article.updatedAt}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{article.content}</p>
            </CardContent>
            <CardFooter>
              <Button>Read on</Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  )
}
