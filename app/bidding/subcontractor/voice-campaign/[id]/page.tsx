"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Phone, ArrowUpDown, Play, Download } from "lucide-react"
import { format } from "date-fns"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

// Mock data for voice campaign results - simplified
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
    interest: "high",
    responses: [
      {
        section: "Project Fit",
        questions: [
          {
            question: "Are you available to work from May through August?",
            answer: "Yes, we have availability during that timeframe.",
          },
          {
            question: "How interested are you in this airport renovation project?",
            answer: "Very interested. We specialize in airport work.",
          },
          {
            question: "Can your team handle 50,000 square feet of electrical work?",
            answer: "Yes, we can handle that scope size.",
          },
        ],
      },
      {
        section: "Experience & Capabilities",
        questions: [
          {
            question: "Have you worked on airport projects before?",
            answer: "Yes, we completed Terminal B at Denver International last year.",
          },
          {
            question: "Do you have a team ready for this project?",
            answer: "Yes, we have a 12-person crew available.",
          },
          {
            question: "Can you install the specialized security systems needed?",
            answer: "Yes, we're certified for those systems.",
          },
        ],
      },
      {
        section: "Compliance & Safety",
        questions: [
          {
            question: "Do you have $2M in liability insurance?",
            answer: "Yes, we carry $3M in coverage.",
          },
          {
            question: "What's your current bonding capacity?",
            answer: "$4.5 million per project.",
          },
          {
            question: "What's your safety EMR rating?",
            answer: "Our current EMR is 0.82.",
          },
          {
            question: "Is your workers' comp coverage current?",
            answer: "Yes, our policy is active through December.",
          },
        ],
      },
    ],
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
    interest: "medium",
    responses: [
      {
        section: "Project Fit",
        questions: [
          {
            question: "Are you available to work from May through August?",
            answer: "We have some ongoing projects but could accommodate this timeline with proper planning.",
          },
          {
            question: "How interested are you in this airport renovation project?",
            answer: "Moderately interested. We have some experience with similar projects.",
          },
          {
            question: "Can your team handle 50,000 square feet of electrical work?",
            answer: "Yes, though we might need to bring on additional staff for a project of this size.",
          },
        ],
      },
      {
        section: "Experience & Capabilities",
        questions: [
          {
            question: "Have you worked on airport projects before?",
            answer: "We've worked on smaller airport facilities, but not major terminals.",
          },
          {
            question: "Do you have a team ready for this project?",
            answer: "We have an 8-person crew that could be assigned.",
          },
          {
            question: "Can you install the specialized security systems needed?",
            answer: "We have limited experience with these systems but are willing to get certified.",
          },
        ],
      },
      {
        section: "Compliance & Safety",
        questions: [
          {
            question: "Do you have $2M in liability insurance?",
            answer: "We currently have $1.5M but can increase if needed for this project.",
          },
          {
            question: "What's your current bonding capacity?",
            answer: "$3 million per project.",
          },
          {
            question: "What's your safety EMR rating?",
            answer: "Our current EMR is 0.91.",
          },
          {
            question: "Is your workers' comp coverage current?",
            answer: "Yes, fully up to date.",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Circuit Solutions",
    trade: "Electrical",
    contact: "Michael Brown",
    phone: "(512) 555-9012",
    callStatus: "failed",
    callDate: "2025-03-13T10:15:00",
    callDuration: "0:45",
    interest: "low",
    responses: [
      {
        section: "Project Fit",
        questions: [
          {
            question: "Are you available to work from May through August?",
            answer: "No, we're fully booked during that period.",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "FlowMaster Plumbing",
    trade: "Plumbing",
    contact: "Robert Garcia",
    phone: "(512) 555-3456",
    callStatus: "completed",
    callDate: "2025-03-13T13:20:00",
    callDuration: "3:50",
    interest: "high",
    responses: [
      {
        section: "Project Fit",
        questions: [
          {
            question: "Are you available to work from May through August?",
            answer: "Yes, we have availability during that timeframe.",
          },
          {
            question: "How interested are you in this airport renovation project?",
            answer: "Very interested. We've been looking to expand into airport work.",
          },
          {
            question: "Can your team handle the plumbing scope for this project?",
            answer: "Yes, we can handle projects of this size and complexity.",
          },
        ],
      },
      {
        section: "Experience & Capabilities",
        questions: [
          {
            question: "Have you worked on airport projects before?",
            answer: "We've worked on one smaller airport facility in Austin.",
          },
          {
            question: "Do you have a team ready for this project?",
            answer: "Yes, we have a 10-person crew available.",
          },
        ],
      },
      {
        section: "Compliance & Safety",
        questions: [
          {
            question: "Do you have $2M in liability insurance?",
            answer: "Yes, we carry $2.5M in coverage.",
          },
          {
            question: "What's your current bonding capacity?",
            answer: "$3.8 million per project.",
          },
          {
            question: "What's your safety EMR rating?",
            answer: "Our current EMR is 0.79.",
          },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Cool Air Systems",
    trade: "HVAC",
    contact: "David Wilson",
    phone: "(512) 555-7890",
    callStatus: "scheduled",
    callDate: "2025-03-14T09:00:00",
    callDuration: "-",
    interest: "-",
    responses: [],
  },
]

// Trade options for filter
const tradeOptions = [
  { value: "all", label: "All Trades" },
  { value: "Electrical", label: "Electrical" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "HVAC", label: "HVAC" },
]

// Status options for filter
const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "completed", label: "Completed" },
  { value: "scheduled", label: "Scheduled" },
  { value: "failed", label: "Failed" },
]

// Interest options for filter
const interestOptions = [
  { value: "all", label: "All Interest Levels" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

export default function TradeOutreachResultsPage({ params }: { params: { id: string } }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTrade, setSelectedTrade] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedInterest, setSelectedInterest] = useState("all")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<number | null>(null)

  // Handle view details
  const handleViewDetails = (id: number) => {
    setSelectedSubcontractor(id)
  }

  const handlePlayRecording = (id: number) => {
    // In a real application, this would play the actual recording
    alert("Playing call recording...")
  }

  // Get selected subcontractor
  const getSelectedSubcontractor = () => {
    return mockSubcontractors.find((s) => s.id === selectedSubcontractor)
  }

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Filter and sort subcontractors
  const filteredAndSortedSubcontractors = mockSubcontractors
    .filter((sub) => {
      const matchesSearch =
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.contact.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTrade = selectedTrade === "all" || sub.trade === selectedTrade
      const matchesStatus = selectedStatus === "all" || sub.callStatus === selectedStatus
      const matchesInterest = selectedInterest === "all" || sub.interest === selectedInterest

      return matchesSearch && matchesTrade && matchesStatus && matchesInterest
    })
    .sort((a, b) => {
      if (!sortColumn) return 0

      const direction = sortDirection === "asc" ? 1 : -1

      switch (sortColumn) {
        case "name":
          return direction * a.name.localeCompare(b.name)
        case "trade":
          return direction * a.trade.localeCompare(b.trade)
        case "date":
          return direction * (new Date(a.callDate).getTime() - new Date(b.callDate).getTime())
        default:
          return 0
      }
    })

  // Get interest badge
  const getInterestBadge = (interest: string) => {
    switch (interest) {
      case "high":
        return (
          <Badge variant="outline" className="border-green-600">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="border-yellow-600">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="border-gray-400">
            Low
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-gray-300">
            -
          </Badge>
        )
    }
  }

  // Get call status badge
  const getCallStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="border-blue-600">
            Completed
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="border-purple-600">
            Scheduled
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="border-red-600">
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <PageHeader
          title="Downtown Office Project - Q2"
          backUrl="/bidding/subcontractor/voice-campaign"
          backLabel="Back to Trade Outreach Summary"
        />
        <div className="mt-2 text-gray-500">
          <p>Campaign Period: April 15, 2025 - April 30, 2025</p>
        </div>
      </div>

      {/* Summary Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Calls</h3>
              <p className="text-2xl font-semibold">{mockSubcontractors.length}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Completed</h3>
              <p className="text-2xl font-semibold">
                {mockSubcontractors.filter((s) => s.callStatus === "completed").length}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">High Interest</h3>
              <p className="text-2xl font-semibold">{mockSubcontractors.filter((s) => s.interest === "high").length}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Duration</h3>
              <p className="text-2xl font-semibold">4:12</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search subcontractors"
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by trade" />
                </SelectTrigger>
                <SelectContent>
                  {tradeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedInterest} onValueChange={setSelectedInterest}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by interest" />
                </SelectTrigger>
                <SelectContent>
                  {interestOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <div className="border rounded-md overflow-hidden bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Subcontractor
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSort("trade")}
              >
                <div className="flex items-center gap-2">
                  Trade
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-2">
                  Call Date
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedSubcontractors.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">{sub.name}</div>
                  <div className="text-sm text-gray-500">{sub.contact}</div>
                </td>
                <td className="px-4 py-4 text-gray-500">{sub.trade}</td>
                <td className="px-4 py-4">{format(new Date(sub.callDate), "MMM d, yyyy")}</td>
                <td className="px-4 py-4">{getCallStatusBadge(sub.callStatus)}</td>
                <td className="px-4 py-4">{getInterestBadge(sub.interest)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(sub.id)}
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Details
                    </Button>
                    {sub.callStatus === "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlayRecording(sub.id)}
                        className="flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Listen
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredAndSortedSubcontractors.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No subcontractors found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Call Detail Drawer */}
      <Sheet open={selectedSubcontractor !== null} onOpenChange={() => setSelectedSubcontractor(null)}>
        <SheetContent className="w-full max-w-md sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Call Details</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Call Information */}
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Company</h3>
                  <p className="font-medium">{getSelectedSubcontractor()?.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Contact</h3>
                    <p className="font-medium">{getSelectedSubcontractor()?.contact}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                    <p className="font-medium">{getSelectedSubcontractor()?.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Call Date</h3>
                    <p className="font-medium">
                      {getSelectedSubcontractor()?.callDate &&
                        format(new Date(getSelectedSubcontractor()?.callDate!), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                    <p className="font-medium">{getSelectedSubcontractor()?.callDuration}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call Recording */}
            {getSelectedSubcontractor()?.callStatus === "completed" && (
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3">Call Recording</h3>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handlePlayRecording(selectedSubcontractor!)}
                  >
                    <Play className="h-4 w-4" />
                    Play Recording
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {/* Call Transcript */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-medium">Call Transcript</h3>
              </div>
              <div className="p-4 space-y-6">
                {getSelectedSubcontractor()?.responses.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-4">
                    {section.section && <h4 className="font-medium text-gray-700 border-b pb-2">{section.section}</h4>}
                    <div className="space-y-4">
                      {section.questions?.map((response, index) => (
                        <div key={index} className="space-y-2">
                          <div className="border rounded-lg p-3">
                            <p className="text-sm text-gray-500 mb-1">Question:</p>
                            <p className="font-medium">{response.question}</p>
                          </div>
                          <div className="border rounded-lg p-3 ml-4">
                            <p className="text-sm text-gray-500 mb-1">Response:</p>
                            <p>{response.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedSubcontractor(null)}>
                Close
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Transcript
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
