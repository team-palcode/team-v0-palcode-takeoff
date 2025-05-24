import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  backUrl?: string
  backLabel?: string
}

export function PageHeader({ title, backUrl = "/", backLabel = "Back to Dashboard" }: PageHeaderProps) {
  return (
    <div className="border-b pb-4 mb-6">
      <div className="flex flex-col gap-1">
        {backUrl && (
          <Link href={backUrl}>
            <Button variant="ghost" className="h-auto p-0 text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {backLabel}
            </Button>
          </Link>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      </div>
    </div>
  )
}

