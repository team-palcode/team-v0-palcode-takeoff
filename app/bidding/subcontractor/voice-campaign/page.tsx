"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock campaigns data
const mockCampaigns = [
  {
    id: 1,
    name: "Downtown Office Project - Q2",
    project: "Downtown Office Complex",
    startDate: "04/15/2025",
    endDate: "04/30/2025",
    subcontractors: 32,
    trades: 5,
    status: "Active",
    progress: 65,
    responses: 21,
    primaryTrade: "Electrical",
  },
  {
    id: 2,
    name: "Medical Center - Specialty Trades",
    project: "Highland Medical Center",
    startDate: "03/01/2025",
    endDate: "03/15/2025",
    subcontractors: 18,
    trades: 3,
    status: "Completed",
    progress: 100,
    responses: 15,
    primaryTrade: "Plumbing",
  },
  {
    id: 3,
    name: "Tech Campus - MEP Contractors",
    project: "Tech Campus Development",
    startDate: "05/01/2025",
    endDate: "05/15/2025",
    subcontractors: 45,
    trades: 4,
    status: "Draft",
    progress: 0,
    responses: 0,
    primaryTrade: "HVAC",
  },
]

// Project options for filter
const projectOptions = [
  { value: "all", label: "All Projects" },
  { value: "Downtown Office Complex", label: "Downtown Office Complex" },
  { value: "Highland Medical Center", label: "Highland Medical Center" },
  { value: "Tech Campus Development", label: "Tech Campus Development" },
]

// Trade options for filter
const tradeOptions = [
  { value: "all", label: "All Trades" },
  { value: "Electrical", label: "Electrical" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "HVAC", label: "HVAC" },
]

export default function VoiceCampaignPage() {
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState("all")
  const [selectedTrade, setSelectedTrade] = useState("all")

  const handleCreateCampaign = () => {
    router.push("/bidding/subcontractor/voice-campaign/create")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-50 text-emerald-700 border-0">Active</Badge>
      case "Completed":
        return <Badge className="bg-blue-50 text-blue-700 border-0">Complete</Badge>
      case "Draft":
        return <Badge className="bg-gray-50 text-gray-700 border-0">Draft</Badge>
      default:
        return null
    }
  }

  // Filter campaigns based on selected project and trade
  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesProject = selectedProject === "all" || campaign.project === selectedProject
    const matchesTrade = selectedTrade === "all" || campaign.primaryTrade === selectedTrade
    return matchesProject && matchesTrade
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Trade Outreach Summary"
          backUrl="/bidding/subcontractor"
          backLabel="Back to Subcontractor Management"
        />
        <Button
          onClick={handleCreateCampaign}
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create New Trade Outreach
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        <div className="w-[200px]">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[200px]">
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
      </div>

      {/* Table with horizontal scroll */}
      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Outreach Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Trade
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Date Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Subcontractors
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign, index) => (
                  <tr
                    key={campaign.id}
                    className={`hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    onClick={() => router.push(`/bidding/subcontractor/voice-campaign/${campaign.id}`)}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{campaign.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{campaign.project}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{campaign.primaryTrade}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {campaign.startDate} - {campaign.endDate}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-medium">{campaign.subcontractors}</span>
                      <span className="text-gray-500 ml-1">({campaign.responses} responses)</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-1" />
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(campaign.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No outreach campaigns found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

