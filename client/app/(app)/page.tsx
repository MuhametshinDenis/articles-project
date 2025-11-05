"use client"

import { useQuery } from "@tanstack/react-query"
import { findAllArticles } from "@/api/articles/find-all-articles"
import { ArticleCard } from "@/components/articles/article-card"

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
          <ArticleCard article={article} key={article.id} />
        ))}
      </section>
    </div>
  )
}
