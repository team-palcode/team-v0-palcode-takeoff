import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ClipboardList, Activity, Users } from "lucide-react"

export default function SubcontractorManagementPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Subcontractor Research</h1>
        <p className="text-gray-500 mt-1">Research, track, and manage subcontractors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/bidding/subcontractor/research/criteria">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Research Criteria</CardTitle>
              <CardDescription>Define search criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Set up criteria for finding and evaluating potential subcontractors based on your project needs.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/bidding/subcontractor/progress">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Research Progress</CardTitle>
              <CardDescription>Track research campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Monitor ongoing research campaigns and view results of completed searches.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/bidding/subcontractor/directory">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Subcontractors</CardTitle>
              <CardDescription>View and manage subcontractors</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Access your subcontractor database, view details, and manage relationships.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
