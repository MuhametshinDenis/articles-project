import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { useMutation } from "@tanstack/react-query"
import { updateArticle } from "@/api/articles/update-article"
import { JSX } from "react"
import { queryClient } from "@/layouts/react-query-layout"
import { toast } from "sonner"

export const formSchema = z.object({
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface EditArticleFormProps {
  articleId: number
  title?: string
  content?: string
  published?: boolean
}

export function EditArticleForm({
  articleId,
  title,
  content,
  published,
}: EditArticleFormProps): JSX.Element {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title || "",
      content: content || "",
      published: published || true,
    },
  })

  const { mutate } = useMutation({
    mutationFn: async (variables: { articleId: number; data: FormValues }) => {
      return await updateArticle(variables.data, variables.articleId)
    },
    onError: (error) => {
      console.error(error)
      toast.error(`Error updating article: ${error.message}`)
    },
    onSuccess: async () => {
      toast.success("Successful updating article")
      await queryClient.invalidateQueries({ queryKey: ["articles"] })
    },
  })

  const onSubmit = (data: FormValues) => {
    mutate({ articleId, data })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New title</FormLabel>
              <FormControl>
                <Input placeholder="Please enter a new title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New content</FormLabel>
              <FormControl>
                <Input
                  placeholder="Please enter a new content of article"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Published</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(val) => field.onChange(val === "true")}
                  value={field.value ? "true" : "false"}
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="r1" />
                    <Label htmlFor="r1">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="r2" />
                    <Label htmlFor="r2">No</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit">Save changes</Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  )
}
