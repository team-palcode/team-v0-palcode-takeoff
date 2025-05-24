import { FileText, Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"

export default function ContractsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="Contracts" />

      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <FileText className="h-10 w-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-lg text-gray-500 mb-8 text-center max-w-2xl">
            We're currently developing the Contracts module to help you manage, track, and execute construction
            contracts more efficiently.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-2">Contract Generation</h3>
              <p className="text-sm text-gray-600">
                Automatically generate contracts based on bid data and project requirements.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-2">Approval Workflows</h3>
              <p className="text-sm text-gray-600">
                Streamline contract approvals with customizable workflows and notifications.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-2">Contract Analytics</h3>
              <p className="text-sm text-gray-600">
                Track contract performance, compliance, and financial metrics in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded-lg">
            <Bell className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-blue-700">
              The Contracts module is scheduled for release in Q2 2025. Check back soon!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
