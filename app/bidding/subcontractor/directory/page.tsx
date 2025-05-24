"use client"

import React from "react"

import { useState } from "react"
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowLeft, Phone, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Mock data for subcontractors - simplified to match research criteria
const mockSubcontractors = [
  {
    id: 1,
    companyName: "Apex Electrical",
    primaryTrade: "Electrical",
    location: "Austin, TX",
    licenseStatus: "Active",
    yearsInBusiness: 12,
    previousWork: true,
    dataStatus: "complete",
    phone: "(512) 555-1234",
    email: "info@apexelectrical.com",
    website: "www.apexelectrical.com",
    contactName: "John Smith",
    contactRole: "Estimator",
    projectSize: "$50K - $2M",
    rating: 4.5,
  },
  {
    id: 2,
    companyName: "FlowMaster Plumbing",
    primaryTrade: "Plumbing",
    location: "Houston, TX",
    licenseStatus: "Active",
    yearsInBusiness: 18,
    previousWork: true,
    dataStatus: "past-partner",
    phone: "(713) 555-7890",
    email: "contact@flowmasterplumbing.com",
    website: "www.flowmasterplumbing.com",
    contactName: "Michael Brown",
    contactRole: "Estimator",
    projectSize: "$100K - $5M",
    rating: 4.5,
  },
  {
    id: 3,
    companyName: "Cool Air Systems",
    primaryTrade: "HVAC",
    location: "Dallas, TX",
    licenseStatus: "Active",
    yearsInBusiness: 8,
    previousWork: false,
    dataStatus: "basic",
    phone: "(214) 555-3456",
    email: "info@coolairsystems.com",
    website: "www.coolairsystems.com",
    contactName: "",
    contactRole: "",
    projectSize: "",
    rating: 4.5,
  },
  {
    id: 4,
    companyName: "TopNotch Roofing",
    primaryTrade: "Roofing",
    location: "San Antonio, TX",
    licenseStatus: "Active",
    yearsInBusiness: 15,
    previousWork: false,
    dataStatus: "complete",
    phone: "(210) 555-6789",
    email: "info@topnotchroofing.com",
    website: "www.topnotchroofing.com",
    contactName: "Robert Garcia",
    contactRole: "Estimator",
    projectSize: "$25K - $1.5M",
    rating: 4.5,
  },
  {
    id: 5,
    companyName: "Solid Foundation Co.",
    primaryTrade: "Concrete",
    location: "Austin, TX",
    licenseStatus: "Active",
    yearsInBusiness: 20,
    previousWork: false,
    dataStatus: "basic",
    phone: "(512) 555-4567",
    email: "contact@solidfoundation.com",
    website: "www.solidfoundation.com",
    contactName: "",
    contactRole: "",
    projectSize: "",
    rating: 4.5,
  },
  {
    id: 6,
    companyName: "Smooth Finish Drywall",
    primaryTrade: "Drywall",
    location: "Houston, TX",
    licenseStatus: "Active",
    yearsInBusiness: 10,
    previousWork: true,
    dataStatus: "past-partner",
    phone: "(713) 555-2345",
    email: "info@smoothfinishdrywall.com",
    website: "www.smoothfinishdrywall.com",
    contactName: "David Chen",
    contactRole: "Estimator",
    projectSize: "$20K - $1M",
    rating: 4.5,
  },
  {
    id: 7,
    companyName: "Precision Painting",
    primaryTrade: "Painting",
    location: "Dallas, TX",
    licenseStatus: "Active",
    yearsInBusiness: 7,
    previousWork: false,
    dataStatus: "complete",
    phone: "(214) 555-8901",
    email: "contact@precisionpainting.com",
    website: "www.precisionpainting.com",
    contactName: "Thomas Wright",
    contactRole: "Estimator",
    projectSize: "$10K - $750K",
    rating: 4.5,
  },
  {
    id: 8,
    companyName: "Glass & Glazing Experts",
    primaryTrade: "Glazing",
    location: "San Antonio, TX",
    licenseStatus: "Active",
    yearsInBusiness: 9,
    previousWork: false,
    dataStatus: "basic",
    phone: "(210) 555-1234",
    email: "info@glassexperts.com",
    website: "www.glassexperts.com",
    contactName: "",
    contactRole: "",
    projectSize: "",
    rating: 4.5,
  },
]

// Trade options for filter - matching research criteria
const tradeOptions = [
  { value: "all", label: "All Trades" },
  { value: "Electrical", label: "Electrical" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "HVAC", label: "HVAC" },
  { value: "Roofing", label: "Roofing" },
  { value: "Concrete", label: "Concrete" },
  { value: "Drywall", label: "Drywall" },
  { value: "Painting", label: "Painting" },
  { value: "Glazing", label: "Glazing" },
]

// Location options for filter
const locationOptions = [
  { value: "all", label: "All Locations" },
  { value: "Austin, TX", label: "Austin, TX" },
  { value: "Houston, TX", label: "Houston, TX" },
  { value: "Dallas, TX", label: "Dallas, TX" },
  { value: "San Antonio, TX", label: "San Antonio, TX" },
]

// Data status options for filter
const dataStatusOptions = [
  { value: "all", label: "All Data Status" },
  { value: "basic", label: "Basic" },
  { value: "complete", label: "Complete" },
  { value: "past-partner", label: "Past Partner" },
]

// Mock existing campaigns
const existingCampaigns = [
  { id: 1, name: "Q2 Electrical Contractors", project: "Downtown Office Complex", trade: "Electrical" },
  { id: 2, name: "Airport Project Plumbing", project: "Airport Expansion", trade: "Plumbing" },
  { id: 3, name: "Downtown HVAC Vendors", project: "Tech Campus Development", trade: "HVAC" },
]

// Mock projects for dropdown
const projects = [
  { id: 1, name: "Downtown Office Complex" },
  { id: 2, name: "Airport Expansion" },
  { id: 3, name: "Tech Campus Development" },
  { id: 4, name: "Highland Medical Center" },
]

// Mock questioner templates for dropdown
const questionerTemplates = [
  { id: 1, name: "General Contractor Screening", questionCount: 8 },
  { id: 2, name: "Electrical Subcontractor Questions", questionCount: 12 },
  { id: 3, name: "Plumbing Qualification", questionCount: 10 },
  { id: 4, name: "HVAC Vendor Assessment", questionCount: 15 },
  { id: 5, name: "Custom Screening Template", questionCount: 6 },
]

export default function SubcontractorDirectoryPage() {
  // State for filters
  const [selectedTrade, setSelectedTrade] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedDataStatus, setSelectedDataStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // State for selected subcontractors
  const [selectedSubcontractors, setSelectedSubcontractors] = useState<number[]>([])

  // State for outreach modal
  const [outreachModalOpen, setOutreachModalOpen] = useState(false)
  const [campaignType, setCampaignType] = useState<"existing" | "new">("existing")
  const [selectedCampaign, setSelectedCampaign] = useState("")

  // State for new campaign
  const [newCampaignName, setNewCampaignName] = useState("")
  const [selectedProject, setSelectedProject] = useState("")
  const [campaignTrade, setCampaignTrade] = useState("")
  const [scheduleDate, setScheduleDate] = useState<Date>()
  const [selectedTemplate, setSelectedTemplate] = useState("")

  // Toggle row expansion
  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(id) ? prevExpandedRows.filter((rowId) => rowId !== id) : [...prevExpandedRows, id],
    )
  }

  // Toggle subcontractor selection
  const toggleSubcontractorSelection = (id: number) => {
    setSelectedSubcontractors((prev) => (prev.includes(id) ? prev.filter((subId) => subId !== id) : [...prev, id]))
  }

  // Select all subcontractors
  const toggleSelectAll = () => {
    if (selectedSubcontractors.length === filteredSubcontractors.length) {
      setSelectedSubcontractors([])
    } else {
      setSelectedSubcontractors(filteredSubcontractors.map((sub) => sub.id))
    }
  }

  // Handle create outreach
  const handleCreateOutreach = () => {
    // Here you would handle the creation of the outreach campaign
    console.log({
      type: campaignType,
      campaignId: selectedCampaign,
      newCampaign: {
        name: newCampaignName,
        project: selectedProject,
        trade: campaignTrade,
        scheduleDate,
        questionerTemplate: selectedTemplate,
      },
      selectedSubcontractors,
    })

    // Close modal and reset form
    setOutreachModalOpen(false)
    resetForm()

    // Navigate to voice campaign page (in a real app)
    // window.location.href = "/bidding/subcontractor/voice-campaign"
  }

  // Reset form
  const resetForm = () => {
    setCampaignType("existing")
    setSelectedCampaign("")
    setNewCampaignName("")
    setSelectedProject("")
    setCampaignTrade("")
    setScheduleDate(undefined)
    setSelectedTemplate("")
  }

  // Filter subcontractors
  const filteredSubcontractors = mockSubcontractors.filter((subcontractor) => {
    // Filter by trade
    if (selectedTrade !== "all" && subcontractor.primaryTrade !== selectedTrade) {
      return false
    }

    // Filter by location
    if (selectedLocation !== "all" && subcontractor.location !== selectedLocation) {
      return false
    }

    // Filter by data status
    if (selectedDataStatus !== "all" && subcontractor.dataStatus !== selectedDataStatus) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !subcontractor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !subcontractor.primaryTrade.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Paginate subcontractors
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSubcontractors = filteredSubcontractors.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredSubcontractors.length / itemsPerPage)

  // Get data status label
  const getDataStatusLabel = (status: string) => {
    if (status === "basic") {
      return (
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-gray-300 mr-2"></div>
          <span>Basic</span>
        </div>
      )
    } else if (status === "complete") {
      return (
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
          <span>Complete</span>
        </div>
      )
    } else if (status === "past-partner") {
      return (
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
          <span>Past Partner</span>
        </div>
      )
    }
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bidding/subcontractor/progress">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Research Campaigns
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Subcontractors ({filteredSubcontractors.length})</h1>
      </div>

      {/* Simple Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Trade filter */}
            <div>
              <label className="block mb-1">Trade</label>
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

            {/* Location filter */}
            <div>
              <label className="block mb-1">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data status filter */}
            <div>
              <label className="block mb-1">Data Status</label>
              <Select value={selectedDataStatus} onValueChange={setSelectedDataStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data status" />
                </SelectTrigger>
                <SelectContent>
                  {dataStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <label className="block mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or trade"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add to Call Outreach Button */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-sm text-gray-500">{selectedSubcontractors.length} subcontractors selected</span>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={selectedSubcontractors.length === 0}
          onClick={() => setOutreachModalOpen(true)}
        >
          <Phone className="h-4 w-4 mr-2" />
          Add To Call Outreach
        </Button>
      </div>

      {/* Simple Table */}
      <div className="bg-white rounded-md border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="w-10 px-4 py-3 text-left">
                  <Checkbox
                    checked={
                      selectedSubcontractors.length === filteredSubcontractors.length &&
                      filteredSubcontractors.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="w-10 px-4 py-3 text-left"></th>
                <th className="px-4 py-3 text-left">Company Name</th>
                <th className="px-4 py-3 text-left">Trade</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">License</th>
                <th className="px-4 py-3 text-left">Previous Work</th>
                <th className="px-4 py-3 text-left">Data Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentSubcontractors.map((subcontractor) => (
                <React.Fragment key={subcontractor.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedSubcontractors.includes(subcontractor.id)}
                        onCheckedChange={() => toggleSubcontractorSelection(subcontractor.id)}
                        aria-label={`Select ${subcontractor.companyName}`}
                      />
                    </td>
                    <td
                      className="px-4 py-4 text-gray-400 cursor-pointer"
                      onClick={() => toggleRowExpansion(subcontractor.id)}
                    >
                      {expandedRows.includes(subcontractor.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </td>
                    <td className="px-4 py-4 cursor-pointer" onClick={() => toggleRowExpansion(subcontractor.id)}>
                      <div className="font-medium">{subcontractor.companyName}</div>
                    </td>
                    <td className="px-4 py-4 cursor-pointer" onClick={() => toggleRowExpansion(subcontractor.id)}>
                      {subcontractor.primaryTrade}
                    </td>
                    <td className="px-4 py-4 cursor-pointer" onClick={() => toggleRowExpansion(subcontractor.id)}>
                      {subcontractor.location}
                    </td>
                    <td className="px-4 py-4 cursor-pointer" onClick={() => toggleRowExpansion(subcontractor.id)}>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {subcontractor.licenseStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 cursor-pointer" onClick={() => toggleRowExpansion(subcontractor.id)}>
                      {subcontractor.previousWork ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-4 cursor-pointer" onClick={() => toggleRowExpansion(subcontractor.id)}>
                      {getDataStatusLabel(subcontractor.dataStatus)}
                    </td>
                    <td
                      className="px-4 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => toggleRowExpansion(subcontractor.id)}
                    >
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{subcontractor.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">/5</span>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded row details */}
                  {expandedRows.includes(subcontractor.id) && (
                    <tr>
                      <td colSpan={9} className="px-6 py-6 bg-gray-50">
                        <div className="max-w-4xl mx-auto">
                          {/* Company Overview */}
                          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="grid grid-cols-3 gap-6">
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Company Status</div>
                                <div className="space-y-1">
                                  <div className="font-medium">{subcontractor.yearsInBusiness} years in business</div>
                                  <div className="text-sm">{subcontractor.licenseStatus} License</div>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Project Scope</div>
                                <div className="space-y-1">
                                  <div className="font-medium">{subcontractor.projectSize || "Not specified"}</div>
                                  <div className="text-sm">
                                    {subcontractor.previousWork ? "Previous Work: Yes" : "Previous Work: No"}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Profile Status</div>
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    {subcontractor.dataStatus === "basic" && "Basic Profile"}
                                    {subcontractor.dataStatus === "complete" && "Verified Profile"}
                                    {subcontractor.dataStatus === "past-partner" && "Past Partner"}
                                  </div>
                                  <div className="text-sm">Rating: {subcontractor.rating}/5</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <div className="text-sm text-gray-500 mb-3">Primary Contact</div>
                                <div className="space-y-2">
                                  <div className="font-medium">{subcontractor.contactName || "Not specified"}</div>
                                  <div className="text-sm">{subcontractor.contactRole || "Role not specified"}</div>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 mb-3">Contact Details</div>
                                <div className="space-y-2">
                                  <div>{subcontractor.phone}</div>
                                  <div>{subcontractor.email}</div>
                                  <a
                                    href={`https://${subcontractor.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    {subcontractor.website}
                                  </a>
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

              {currentSubcontractors.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
                    No subcontractors found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Simple Pagination */}
        <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
          <div>
            <span>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSubcontractors.length)} of{" "}
              {filteredSubcontractors.length} subcontractors
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span>
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

      {/* Outreach Modal */}
      <Dialog open={outreachModalOpen} onOpenChange={setOutreachModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Trade Outreach</DialogTitle>
            <DialogDescription>
              Add {selectedSubcontractors.length} selected subcontractors to a trade outreach campaign.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <RadioGroup value={campaignType} onValueChange={(value: "existing" | "new") => setCampaignType(value)}>
              <div className="flex items-center space-x-2 mb-4">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing">Add to Existing Campaign</Label>
              </div>

              {campaignType === "existing" && (
                <div className="ml-6 mb-4">
                  <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingCampaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id.toString()}>
                          {campaign.name} ({campaign.trade})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center space-x-2 mb-4">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new">Create New Campaign</Label>
              </div>

              {campaignType === "new" && (
                <div className="ml-6 space-y-4">
                  <div>
                    <Label htmlFor="campaign-name" className="block mb-1">
                      Campaign Name
                    </Label>
                    <Input
                      id="campaign-name"
                      value={newCampaignName}
                      onChange={(e) => setNewCampaignName(e.target.value)}
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="project" className="block mb-1">
                      Project
                    </Label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="trade" className="block mb-1">
                      Trade
                    </Label>
                    <Select value={campaignTrade} onValueChange={setCampaignTrade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trade" />
                      </SelectTrigger>
                      <SelectContent>
                        {tradeOptions
                          .filter((t) => t.value !== "all")
                          .map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="block mb-1">Schedule Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !scheduleDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduleDate ? format(scheduleDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={scheduleDate} onSelect={setScheduleDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="questioner-template" className="block mb-1">
                      Screening Questions
                    </Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select questioner template" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionerTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name} ({template.questionCount} questions)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOutreachModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleCreateOutreach}
              disabled={
                (campaignType === "existing" && !selectedCampaign) ||
                (campaignType === "new" &&
                  (!newCampaignName || !selectedProject || !campaignTrade || !scheduleDate || !selectedTemplate))
              }
            >
              <Phone className="h-4 w-4 mr-2" />
              Create Trade Outreach
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

