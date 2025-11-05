import { CreateArticleForm } from "@/components/articles/create-article-form"

function CreateArticle() {
  return (
    <section className="mt-4">
      <h1 className="font-bold text-3xl text-center">Create new article</h1>
      <CreateArticleForm />
    </section>
  )
}

export default CreateArticle
