import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart4, CheckSquare, Sliders } from "lucide-react"

export default function BiddingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bid Management</h1>
        <p className="text-gray-500 mt-1">Manage and evaluate bid packages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/bidding/analysis">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <BarChart4 className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Evaluate Bid Package</CardTitle>
              <CardDescription>Analyze and evaluate submitted bids</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Review submitted bids, compare pricing and qualifications, and identify potential issues.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/bidding/scorecard">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CheckSquare className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Create Bid Score Card</CardTitle>
              <CardDescription>Define evaluation criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Create custom scoring criteria to evaluate and compare bids consistently across projects.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/bidding/constraint">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Sliders className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Create Constraint</CardTitle>
              <CardDescription>Set up bid evaluation rules</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Define constraints and rules for automatically flagging potential issues in submitted bids.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

