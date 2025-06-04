"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search, ChevronDown, ChevronUp, Phone, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"

// Mock data for subcontractors
const mockSubcontractors = [
  {
    id: 1,
    name: "Apex Electrical",
    trade: "Electrical",
    contact: "John Smith",
    phone: "(512) 555-1234",
    callStatus: "completed",
    callDate: "2025-03-12T14:30:00",
    callDuration: "4:32",
    responses: [
      {
        question: "Is your company available to work on this project starting June 15th, 2025?",
        answer: "Yes, we have availability starting from that date.",
      },
      {
        question: "Does your company have experience with commercial office buildings over 50,000 square feet?",
        answer:
          "Yes, we've completed several projects of similar scale, including the Tech Tower and Central Plaza projects.",
      },
      {
        question: "What is your current workload capacity for new projects?",
        answer: "We currently have 60% capacity available for new projects.",
      },
    ],
    interest: "high",
  },
  {
    id: 2,
    name: "Voltage Masters",
    trade: "Electrical",
    contact: "Sarah Johnson",
    phone: "(512) 555-5678",
    callStatus: "completed",
    callDate: "2025-03-12T15:45:00",
    callDuration: "5:15",
    responses: [
      {
        question: "Is your company available to work on this project starting June 15th, 2025?",
        answer: "We have some ongoing projects but could accommodate this timeline.",
      },
      {
        question: "Does your company have experience with commercial office buildings over 50,000 square feet?",
        answer: "Yes, we specialize in large commercial projects.",
      },
      {
        question: "What is your current workload capacity for new projects?",
        answer: "We're at about 75% capacity but can allocate resources for this project.",
      },
    ],
    interest: "medium",
  },
  // Add more mock data as needed
]

export default function CampaignResultsPage({ params }: { params: { id: string } }) {
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTrade, setSelectedTrade] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Toggle row expansion
  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  // Get interest badge
  const getInterestBadge = (interest: string) => {
    switch (interest) {
      case "high":
        return <Badge className="bg-green-100 text-green-800">High Interest</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Interest</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Low Interest</Badge>
      default:
        return null
    }
  }

  // Get call status badge
  const getCallStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case "scheduled":
        return <Badge className="bg-purple-100 text-purple-800">Scheduled</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <PageHeader
          title="Downtown Office Project - Q2"
          backUrl="/bidding/subcontractor/progress"
          backLabel="Back to Campaigns"
        />
        <div className="mt-2 text-gray-500">
          <p>Campaign Period: April 15, 2025 - April 30, 2025</p>
          <p>32 Subcontractors • 5 Trades • 21 Responses</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subcontractors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trade</label>
            <Select value={selectedTrade} onValueChange={setSelectedTrade}>
              <SelectTrigger>
                <SelectValue placeholder="All Trades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Call Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="w-10 px-4 py-3 text-left"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subcontractor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trade</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockSubcontractors.map((sub) => (
                <>
                  <tr
                    key={sub.id}
                    onClick={() => toggleRowExpansion(sub.id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-4">
                      {expandedRows.includes(sub.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{sub.name}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-500">{sub.trade}</td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{sub.contact}</div>
                        <div className="text-gray-500">{sub.phone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">{getCallStatusBadge(sub.callStatus)}</td>
                    <td className="px-4 py-4">{getInterestBadge(sub.interest)}</td>
                  </tr>

                  {/* Expanded View */}
                  {expandedRows.includes(sub.id) && (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 bg-gray-50">
                        <div className="max-w-4xl mx-auto space-y-6">
                          {/* Call Details */}
                          <div className="bg-white rounded-lg border p-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                  <Phone className="h-4 w-4" />
                                  Call Status
                                </div>
                                <div className="font-medium">{getCallStatusBadge(sub.callStatus)}</div>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                  <Calendar className="h-4 w-4" />
                                  Call Date & Time
                                </div>
                                <div className="font-medium">
                                  {format(new Date(sub.callDate), "MMM d, yyyy h:mm a")}
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                  <Clock className="h-4 w-4" />
                                  Duration
                                </div>
                                <div className="font-medium">{sub.callDuration}</div>
                              </div>
                            </div>
                          </div>

                          {/* Q&A Transcript */}
                          <div className="bg-white rounded-lg border p-4">
                            <h4 className="font-medium text-gray-900 mb-4">Q&A Transcript</h4>
                            <div className="space-y-4">
                              {sub.responses.map((response, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <div className="text-sm text-gray-500 mb-1">Question</div>
                                    <div className="font-medium">{response.question}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500 mb-1">Response</div>
                                    <div>{response.answer}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end">
                            <Button variant="outline">Download Transcript</Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
