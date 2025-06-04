import { PageHeader } from "@/components/page-header"
import BlueprintUpload from "@/components/takeoff/blueprint-upload"

export default function TakeoffPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="Takeoff Analysis" />
      <p className="text-gray-500 mt-1 mb-6">Upload blueprints for AI analysis</p>

      <BlueprintUpload />
    </div>
  )
}
