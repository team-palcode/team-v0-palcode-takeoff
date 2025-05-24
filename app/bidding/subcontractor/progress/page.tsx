"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Calendar,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data for research campaigns
const mockCampaigns = [
  {
    id: 1,
    name: "Q2 Electrical Contractors",
    trade: "Electrical",
    startDate: new Date(2025, 2, 10), // March 10, 2025
    endDate: new Date(2025, 3, 10), // April 10, 2025
    progress: 65,
    subcontractorsFound: 8,
    status: "in-progress",
    recentDiscoveries: [
      { name: "Apex Electrical", date: "2 hours ago" },
      { name: "Voltage Masters", date: "5 hours ago" },
      { name: "Circuit Solutions", date: "1 day ago" },
      { name: "PowerGrid Services", date: "2 days ago" },
      { name: "ElectraTech", date: "3 days ago" },
    ],
    estimatedCompletion: "2 days",
    responses: 5,
    subcontractors: 20,
    trades: 2,
  },
  {
    id: 2,
    name: "Airport Project Plumbing",
    trade: "Plumbing",
    startDate: new Date(2025, 1, 15), // Feb 15, 2025
    endDate: new Date(2025, 2, 15), // March 15, 2025
    progress: 100,
    subcontractorsFound: 14,
    status: "complete",
    recentDiscoveries: [
      { name: "FlowMaster Plumbing", date: "15 days ago" },
      { name: "Aqua Solutions", date: "16 days ago" },
      { name: "Pipeline Experts", date: "18 days ago" },
      { name: "H2O Systems", date: "20 days ago" },
      { name: "Drain Doctors", date: "21 days ago" },
    ],
    estimatedCompletion: "Completed",
    responses: 12,
    subcontractors: 25,
    trades: 1,
  },
  {
    id: 3,
    name: "Downtown HVAC Vendors",
    trade: "HVAC",
    startDate: new Date(2025, 0, 22), // Jan 22, 2025
    endDate: new Date(2025, 1, 22), // Feb 22, 2025
    progress: 100,
    subcontractorsFound: 11,
    status: "complete",
    recentDiscoveries: [
      { name: "Cool Air Systems", date: "30 days ago" },
      { name: "Climate Control", date: "32 days ago" },
      { name: "Ventilation Pros", date: "35 days ago" },
      { name: "ThermoTech", date: "38 days ago" },
      { name: "AirFlow Solutions", date: "40 days ago" },
    ],
    estimatedCompletion: "Completed",
    responses: 9,
    subcontractors: 18,
    trades: 3,
  },
  {
    id: 4,
    name: "Commercial Roofing Specialists",
    trade: "Roofing",
    startDate: new Date(2025, 2, 5), // March 5, 2025
    endDate: new Date(2025, 3, 20), // April 20, 2025
    progress: 30,
    subcontractorsFound: 5,
    status: "in-progress",
    recentDiscoveries: [
      { name: "TopNotch Roofing", date: "1 day ago" },
      { name: "Summit Roofing", date: "3 days ago" },
      { name: "Skyline Roofers", date: "4 days ago" },
      { name: "Peak Performance Roofing", date: "6 days ago" },
      { name: "Weather Shield Roofing", date: "7 days ago" },
    ],
    estimatedCompletion: "10 days",
    responses: 3,
    subcontractors: 15,
    trades: 1,
  },
  {
    id: 5,
    name: "Concrete Foundation Contractors",
    trade: "Concrete",
    startDate: new Date(2025, 2, 15), // March 15, 2025
    endDate: new Date(2025, 4, 1), // May 1, 2025
    progress: 15,
    subcontractorsFound: 3,
    status: "in-progress",
    recentDiscoveries: [
      { name: "Solid Foundation Co.", date: "12 hours ago" },
      { name: "Concrete Masters", date: "2 days ago" },
      { name: "Foundation Experts", date: "4 days ago" },
    ],
    estimatedCompletion: "15 days",
    responses: 2,
    subcontractors: 10,
    trades: 1,
  },
  {
    id: 6,
    name: "Interior Drywall Specialists",
    trade: "Drywall",
    startDate: new Date(2025, 1, 28), // Feb 28, 2025
    endDate: new Date(2025, 3, 15), // April 15, 2025
    progress: 45,
    subcontractorsFound: 7,
    status: "in-progress",
    recentDiscoveries: [
      { name: "Smooth Finish Drywall", date: "1 day ago" },
      { name: "Wall Systems Inc.", date: "3 days ago" },
      { name: "Precision Drywall", date: "5 days ago" },
      { name: "Interior Solutions", date: "6 days ago" },
      { name: "Drywall Experts", date: "8 days ago" },
    ],
    estimatedCompletion: "7 days",
    responses: 6,
    subcontractors: 12,
    trades: 1,
  },
]

// Trade options for filter
const tradeOptions = [
  { value: "all", label: "All Trades" },
  { value: "Electrical", label: "Electrical" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "HVAC", label: "HVAC" },
  { value: "Roofing", label: "Roofing" },
  { value: "Concrete", label: "Concrete" },
  { value: "Drywall", label: "Drywall" },
]

// Status options for filter
const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "in-progress", label: "In Progress" },
  { value: "complete", label: "Complete" },
]

export default function ResearchProgressPage() {
  // State for filters
  const [selectedTrade, setSelectedTrade] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")

  // State for sorting
  const [sortColumn, setSortColumn] = useState("startDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Toggle row expansion
  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(id) ? prevExpandedRows.filter((rowId) => rowId !== id) : [...prevExpandedRows, id],
    )
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

  // Filter campaigns
  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    // Filter by trade
    if (selectedTrade !== "all" && campaign.trade !== selectedTrade) {
      return false
    }

    // Filter by status
    if (selectedStatus !== "all" && campaign.status !== selectedStatus) {
      return false
    }

    // Filter by date range
    if (startDate && campaign.startDate < startDate) {
      return false
    }
    if (endDate && campaign.endDate > endDate) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !campaign.trade.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Sort campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (sortColumn === "name") {
      return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortColumn === "trade") {
      return sortDirection === "asc" ? a.trade.localeCompare(b.trade) : b.trade.localeCompare(a.trade)
    } else if (sortColumn === "startDate") {
      return sortDirection === "asc"
        ? a.startDate.getTime() - b.startDate.getTime()
        : b.startDate.getTime() - a.startDate.getTime()
    } else if (sortColumn === "progress") {
      return sortDirection === "asc" ? a.progress - b.progress : b.progress - a.progress
    } else if (sortColumn === "subcontractorsFound") {
      return sortDirection === "asc"
        ? a.subcontractorsFound - b.subcontractorsFound
        : b.subcontractorsFound - a.subcontractorsFound
    }
    return 0
  })

  // Paginate campaigns
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCampaigns = sortedCampaigns.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedCampaigns.length / itemsPerPage)

  // Get status badge
  const getStatusBadge = (status: string) => {
    if (status === "in-progress") {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          In Progress
        </Badge>
      )
    } else if (status === "complete") {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Complete
        </Badge>
      )
    }
    return null
  }

  const handleViewDetails = (id: number) => {
    alert(`View details for campaign ${id}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Research Campaigns</h1>
        <Link href="/bidding/subcontractor/research/criteria">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Sub-header Navigation */}
      <div className="mb-6 bg-gray-100 rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/bidding/subcontractor/research/criteria" className="flex-1">
            <Button variant="default" className="w-full flex items-center justify-center gap-2 h-12 text-base">
              <FileText className="h-5 w-5" />
              New Research Criteria
            </Button>
          </Link>
          <Link href="/bidding/subcontractor/directory" className="flex-1">
            <Button variant="default" className="w-full flex items-center justify-center gap-2 h-12 text-base">
              <Users className="h-5 w-5" />
              Sub Contractor Database
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Trade filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trade</label>
              <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trade" />
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

            {/* Date range filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <div className="bg-white rounded-md border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-10 px-4 py-3 text-left"></th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Campaign Name
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("trade")}
                >
                  <div className="flex items-center">
                    Trade
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("startDate")}
                >
                  <div className="flex items-center">
                    Dates
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("progress")}
                >
                  <div className="flex items-center">
                    Progress
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("subcontractorsFound")}
                >
                  <div className="flex items-center">
                    Subcontractors
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentCampaigns.map((campaign) => (
                <React.Fragment key={campaign.id}>
                  <tr
                    key={campaign.id}
                    onClick={() => toggleRowExpansion(campaign.id)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleRowExpansion(campaign.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedRows.includes(campaign.id) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{campaign.trade}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(campaign.startDate, "MMM d, yyyy")} - {format(campaign.endDate, "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{campaign.subcontractorsFound}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(campaign.status)}</td>
                  </tr>

                  {/* Expanded row */}
                  {expandedRows.includes(campaign.id) && (
                    <tr>
                      <td colSpan={8} className="px-6 py-6 bg-gray-50">
                        <div className="max-w-4xl mx-auto">
                          {/* Campaign Overview */}
                          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="grid grid-cols-3 gap-6">
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Campaign Status</div>
                                <div className="space-y-1">
                                  <div className="font-medium">{campaign.status}</div>
                                  <div className="text-sm">Progress: {campaign.progress}%</div>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Timeline</div>
                                <div className="space-y-1">
                                  <div className="font-medium">Start: {format(campaign.startDate, "MMM d, yyyy")}</div>
                                  <div className="text-sm">End: {format(campaign.endDate, "MMM d, yyyy")}</div>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Responses</div>
                                <div className="space-y-1">
                                  <div className="font-medium">{campaign.responses} responses</div>
                                  <div className="text-sm">Out of {campaign.subcontractors} subcontractors</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Recent Discoveries */}
                          <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2">
                              <div className="bg-white rounded-lg shadow-sm p-6">
                                <h4 className="font-medium text-gray-900 mb-4">Recent Discoveries</h4>
                                <div className="space-y-3">
                                  {campaign.recentDiscoveries.map((discovery, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                                    >
                                      <span className="font-medium">{discovery.name}</span>
                                      <span className="text-sm text-gray-500">{discovery.date}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Campaign Details */}
                            <div>
                              <div className="bg-white rounded-lg shadow-sm p-6">
                                <h4 className="font-medium text-gray-900 mb-4">Campaign Details</h4>
                                <div className="space-y-4">
                                  <div>
                                    <div className="text-sm text-gray-500 mb-1">Estimated Completion</div>
                                    <div className="font-medium">{campaign.estimatedCompletion}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500 mb-1">Trades Covered</div>
                                    <div className="font-medium">{campaign.trades} trades</div>
                                  </div>
                                  <div className="pt-4 border-t">
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start"
                                      onClick={() => handleViewDetails(campaign.id)}
                                    >
                                      View Full Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

              {currentCampaigns.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No campaigns found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastItem, filteredCampaigns.length)}</span> of{" "}
              <span className="font-medium">{filteredCampaigns.length}</span> results
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center mr-4">
              <span className="text-sm text-gray-700 mr-2">Items per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number.parseInt(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
