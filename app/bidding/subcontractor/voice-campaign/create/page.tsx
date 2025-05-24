"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, Download, Search, Upload } from "lucide-react"

// Mock projects data
const projects = [
  { id: "1", name: "Downtown Office Complex" },
  { id: "2", name: "Highland Medical Center" },
  { id: "3", name: "Riverfront Residential" },
  { id: "4", name: "Tech Campus Development" },
]

// Mock trade options
const tradeOptions = [
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "hvac", label: "HVAC" },
  { value: "concrete", label: "Concrete" },
  { value: "carpentry", label: "Carpentry" },
  { value: "drywall", label: "Drywall" },
  { value: "painting", label: "Painting" },
  { value: "roofing", label: "Roofing" },
]

// Mock subcontractors data
const mockSubcontractors = [
  {
    id: 1,
    company: "Apex Electrical",
    trade: "Electrical",
    contact: "John Smith",
    phone: "(512) 555-1234",
    location: "Austin, TX",
    yearsInBusiness: 12,
  },
  {
    id: 2,
    company: "FlowMaster Plumbing",
    trade: "Plumbing",
    contact: "Michael Brown",
    phone: "(713) 555-7890",
    location: "Houston, TX",
    yearsInBusiness: 18,
  },
  {
    id: 3,
    company: "Cool Air Systems",
    trade: "HVAC",
    contact: "Robert Johnson",
    phone: "(214) 555-3456",
    location: "Dallas, TX",
    yearsInBusiness: 8,
  },
  {
    id: 4,
    company: "TopNotch Roofing",
    trade: "Roofing",
    contact: "Robert Garcia",
    phone: "(210) 555-6789",
    location: "San Antonio, TX",
    yearsInBusiness: 15,
  },
  {
    id: 5,
    company: "Solid Foundation Co.",
    trade: "Concrete",
    contact: "James Wilson",
    phone: "(512) 555-4567",
    location: "Austin, TX",
    yearsInBusiness: 20,
  },
  {
    id: 6,
    company: "Smooth Finish Drywall",
    trade: "Drywall",
    contact: "David Chen",
    phone: "(713) 555-2345",
    location: "Houston, TX",
    yearsInBusiness: 10,
  },
  {
    id: 7,
    company: "Precision Painting",
    trade: "Painting",
    contact: "Thomas Wright",
    phone: "(214) 555-8901",
    location: "Dallas, TX",
    yearsInBusiness: 7,
  },
  {
    id: 8,
    company: "Glass & Glazing Experts",
    trade: "Glazing",
    contact: "Maria Rodriguez",
    phone: "(210) 555-1234",
    location: "San Antonio, TX",
    yearsInBusiness: 9,
  },
]

// Mock location options
const locationOptions = [
  { value: "all", label: "All Locations" },
  { value: "Austin, TX", label: "Austin, TX" },
  { value: "Houston, TX", label: "Houston, TX" },
  { value: "Dallas, TX", label: "Dallas, TX" },
  { value: "San Antonio, TX", label: "San Antonio, TX" },
]

// Mock screening question templates
const screeningTemplates = [
  { id: 1, name: "General Contractor Screening", questionCount: 8 },
  { id: 2, name: "Electrical Subcontractor Questions", questionCount: 12 },
  { id: 3, name: "Plumbing Qualification", questionCount: 10 },
  { id: 4, name: "HVAC Vendor Assessment", questionCount: 15 },
  { id: 5, name: "Custom Screening Template", questionCount: 6 },
]

export default function CreateVoiceCampaignPage() {
  const router = useRouter()

  // Campaign basic info
  const [campaignName, setCampaignName] = useState("")
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedTrade, setSelectedTrade] = useState("")
  const [scheduleDate, setScheduleDate] = useState<Date>()
  const [selectedTemplate, setSelectedTemplate] = useState("")

  // Subcontractor selection
  const [activeTab, setActiveTab] = useState("search")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])

  // Search filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedTradeFilter, setSelectedTradeFilter] = useState("all")
  const [selectedSubcontractors, setSelectedSubcontractors] = useState<number[]>([])

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Simulate CSV parsing with preview data
      setPreviewData(mockSubcontractors.slice(0, 3))
    }
  }

  // Handle file drop
  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setUploadedFile(file)
      // Simulate CSV parsing with preview data
      setPreviewData(mockSubcontractors.slice(0, 3))
    }
  }

  // Filter subcontractors based on search criteria
  const filteredSubcontractors = mockSubcontractors.filter((sub) => {
    const matchesTrade = selectedTradeFilter === "all" || sub.trade === selectedTradeFilter
    const matchesLocation = selectedLocation === "all" || sub.location === selectedLocation
    const matchesSearch =
      sub.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.phone.includes(searchQuery)

    return matchesTrade && matchesLocation && matchesSearch
  })

  // Toggle subcontractor selection
  const toggleSubcontractor = (id: number) => {
    setSelectedSubcontractors((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  // Select all subcontractors
  const toggleSelectAll = () => {
    if (selectedSubcontractors.length === filteredSubcontractors.length) {
      setSelectedSubcontractors([])
    } else {
      setSelectedSubcontractors(filteredSubcontractors.map((sub) => sub.id))
    }
  }

  // Download CSV template
  const handleDownloadTemplate = () => {
    const template = `Company,Trade,Contact Name,Phone Number
Example Corp,Electrical,John Doe,(555) 123-4567`
    const blob = new Blob([template], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "subcontractor-template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Handle campaign creation
  const handleCreateCampaign = () => {
    // Here you would submit the campaign data to your backend
    console.log({
      campaignName,
      project: selectedProject,
      trade: selectedTrade,
      scheduleDate,
      screeningTemplate: selectedTemplate,
      subcontractors: selectedSubcontractors.map((id) => mockSubcontractors.find((sub) => sub.id === id)),
      uploadedFile: uploadedFile ? uploadedFile.name : null,
    })

    // Navigate back to campaigns list
    router.push("/bidding/subcontractor/voice-campaign")
  }

  // Check if form is valid
  const isFormValid =
    campaignName &&
    selectedProject &&
    selectedTrade &&
    scheduleDate &&
    selectedTemplate &&
    (selectedSubcontractors.length > 0 || uploadedFile)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Create Trade Outreach Campaign"
        backUrl="/bidding/subcontractor/voice-campaign"
        backLabel="Back to Trade Outreach Summary"
      />

      <div className="mt-6 space-y-8">
        {/* Campaign Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Downtown Office Project - Q2"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="project">Project</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger id="project" className="mt-1">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="trade">Trade</Label>
                <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                  <SelectTrigger id="trade" className="mt-1">
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

              <div>
                <Label>Schedule Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-1 justify-start text-left font-normal",
                        !scheduleDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduleDate ? format(scheduleDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={scheduleDate} onSelect={setScheduleDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="screening-template">Screening Questions</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger id="screening-template" className="mt-1">
                    <SelectValue placeholder="Select screening questions template" />
                  </SelectTrigger>
                  <SelectContent>
                    {screeningTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name} ({template.questionCount} questions)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subcontractor Selection */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Subcontractor Selection</h2>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload List</TabsTrigger>
                <TabsTrigger value="search">Search Database</TabsTrigger>
              </TabsList>

              {/* Upload List Tab */}
              <TabsContent value="upload" className="mt-4 space-y-4">
                <div className="flex justify-end">
                  <Button variant="outline" onClick={handleDownloadTemplate} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download CSV Template
                  </Button>
                </div>

                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8",
                    "transition-colors duration-200",
                    uploadedFile ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400",
                  )}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                  <div className="flex flex-col items-center text-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-4" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {uploadedFile ? uploadedFile.name : "Drag and drop your CSV file here"}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      {uploadedFile ? "Click to upload a different file" : "or click to browse"}
                    </p>
                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} id="file-upload" />
                    <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                      Browse Files
                    </Button>
                  </div>
                </div>

                {uploadedFile && previewData.length > 0 && (
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <h4 className="font-medium">Preview</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Company</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Trade</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Contact</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Phone</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, index) => (
                            <tr key={index} className="border-t">
                              <td className="px-4 py-2">{row.company}</td>
                              <td className="px-4 py-2">{row.trade}</td>
                              <td className="px-4 py-2">{row.contact}</td>
                              <td className="px-4 py-2">{row.phone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Search Database Tab */}
              <TabsContent value="search" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, contact, or phone"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <div>
                    <Select value={selectedTradeFilter} onValueChange={setSelectedTradeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by trade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Trades</SelectItem>
                        {tradeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.label}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by location" />
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
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                    <h4 className="font-medium">Subcontractor Results</h4>
                    <div className="text-sm text-gray-500">
                      {selectedSubcontractors.length} of {filteredSubcontractors.length} selected
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="w-16 px-4 py-2 text-left text-xs font-medium text-gray-500">
                            <Checkbox
                              checked={
                                filteredSubcontractors.length > 0 &&
                                selectedSubcontractors.length === filteredSubcontractors.length
                              }
                              onCheckedChange={toggleSelectAll}
                              aria-label="Select all"
                            />
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Company</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Trade</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Contact</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Phone</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubcontractors.map((sub) => (
                          <tr key={sub.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">
                              <Checkbox
                                checked={selectedSubcontractors.includes(sub.id)}
                                onCheckedChange={() => toggleSubcontractor(sub.id)}
                                aria-label={`Select ${sub.company}`}
                              />
                            </td>
                            <td className="px-4 py-2">{sub.company}</td>
                            <td className="px-4 py-2">{sub.trade}</td>
                            <td className="px-4 py-2">{sub.contact}</td>
                            <td className="px-4 py-2">{sub.phone}</td>
                            <td className="px-4 py-2">{sub.location}</td>
                          </tr>
                        ))}

                        {filteredSubcontractors.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                              No subcontractors found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push("/bidding/subcontractor/voice-campaign")}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateCampaign}
            disabled={!isFormValid}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Create Trade Outreach Campaign
          </Button>
        </div>
      </div>
    </div>
  )
}
