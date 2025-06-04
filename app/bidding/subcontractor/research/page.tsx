import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Search, Filter, Clock, CheckCircle, Eye } from "lucide-react"

export default function SubcontractorResearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Subcontractor Research</h1>
          <p className="text-gray-500 mt-1">Define criteria and research subcontractors</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/bidding/subcontractor/directory">
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Subcontractors
            </Button>
          </Link>
          <Link href="/bidding/subcontractor/progress">
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Progress
            </Button>
          </Link>
          <Link href="/bidding/subcontractor/research/criteria">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Research
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search research cycles"
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Created: Mar 10, 2025</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3 mr-1" />
                In Progress
              </span>
            </div>
            <CardTitle className="text-lg">Q2 Electrical Contractors</CardTitle>
            <CardDescription>Electrical, Low Voltage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">15 Criteria Defined</span>
              <span className="text-gray-500">8 Subcontractors Found</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Created: Feb 15, 2025</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </span>
            </div>
            <CardTitle className="text-lg">Airport Project Plumbing</CardTitle>
            <CardDescription>Plumbing, Fire Protection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">12 Criteria Defined</span>
              <span className="text-gray-500">14 Subcontractors Found</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Created: Jan 22, 2025</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </span>
            </div>
            <CardTitle className="text-lg">Downtown HVAC Vendors</CardTitle>
            <CardDescription>HVAC, Mechanical</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">18 Criteria Defined</span>
              <span className="text-gray-500">11 Subcontractors Found</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
