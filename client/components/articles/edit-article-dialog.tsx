import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { EditArticleForm } from "@/components/articles/edit-article-form"
import { JSX } from "react"

interface EditArticleFormProps {
  articleId: number
  title?: string
  content?: string
  published?: boolean
}

export function EditArticleDialog(
  defaultData: EditArticleFormProps
): JSX.Element {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit article</DialogTitle>
            <DialogDescription>
              Change the information in the article.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <EditArticleForm {...defaultData} />
          </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
