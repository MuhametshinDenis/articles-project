import { Separator } from "@/components/ui/separator"

function NotFound() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center">
      <div className="flex gap-2 items-center h-10 space-x-4 text-sm">
        <h1 className="font-bold text-3xl">404</h1>
        <Separator orientation="vertical" />
        <p className="text-muted-foreground">Page not found</p>
      </div>
    </main>
  )
}

export default NotFound
