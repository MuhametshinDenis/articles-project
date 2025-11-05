"use client"

import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { deleteArticle } from "@/api/articles/delete-article"
import { queryClient } from "@/layouts/react-query-layout"
import { JSX } from "react"
import { toast } from "sonner"

interface DeleteArticleButtonProps {
  articleId: number
}

export function DeleteArticleButton({
  articleId,
}: DeleteArticleButtonProps): JSX.Element {
  const { mutate } = useMutation({
    mutationFn: async (articleId: number) => {
      await deleteArticle(articleId)
    },
    onError: (error: Error) => {
      toast.error(`Error deleting article: ${error.message}`)
    },
    onSuccess: async () => {
      toast.success("Successfully deleted articles")
      await queryClient.invalidateQueries({ queryKey: ["articles"] })
    },
  })

  return (
    <Button
      variant="destructive"
      className="cursor-pointer"
      onClick={() => mutate(articleId)}
    >
      Remove
    </Button>
  )
}
