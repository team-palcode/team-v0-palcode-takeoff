"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Upload, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock projects data
const projects = [
  { id: "1", name: "Downtown Office Complex" },
  { id: "2", name: "Highland Medical Center" },
  { id: "3", name: "Riverfront Residential" },
  { id: "4", name: "Tech Campus Development" },
]

// Mock subcontractors data
const subcontractors = [
  { id: 1, company: "Apex Electrical", trade: "Electrical", contact: "John Smith", phone: "(512) 555-1234" },
  { id: 2, company: "FlowMaster Plumbing", trade: "Plumbing", contact: "Michael Brown", phone: "(713) 555-7890" },
  { id: 3, company: "Cool Air Systems", trade: "HVAC", contact: "Robert Johnson", phone: "(214) 555-3456" },
  { id: 4, company: "TopNotch Roofing", trade: "Roofing", contact: "Robert Garcia", phone: "(210) 555-6789" },
  { id: 5, company: "Solid Foundation Co.", trade: "Concrete", contact: "James Wilson", phone: "(512) 555-4567" },
]

// Trade options for filter
const tradeOptions = [
  { value: "all", label: "All Trades" },
  { value: "Electrical", label: "Electrical" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "HVAC", label: "HVAC" },
  { value: "Roofing", label: "Roofing" },
  { value: "Concrete", label: "Concrete" },
]

interface CampaignSetupProps {
  campaignData: any
  updateCampaignData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export default function CampaignSetup({ campaignData, updateCampaignData, onNext, onBack }: CampaignSetupProps) {
  // Local state
  const [selectedTab, setSelectedTab] = useState("upload")
  const [selectedTrade, setSelectedTrade] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedSubcontractors, setSelectedSubcontractors] = useState<number[]>([])
  const [previewData, setPreviewData] = useState<any[]>([])

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Simulate CSV parsing with preview data
      setPreviewData(subcontractors.slice(0, 3))
    }
  }

  // Handle file drop
  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setUploadedFile(file)
      // Simulate CSV parsing with preview data
      setPreviewData(subcontractors.slice(0, 3))
    }
  }

  // Filter subcontractors based on trade and search
  const filteredSubcontractors = subcontractors.filter((sub) => {
    const matchesTrade = selectedTrade === "all" || sub.trade === selectedTrade
    const matchesSearch =
      sub.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.contact.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTrade && matchesSearch
  })

  // Toggle subcontractor selection
  const toggleSubcontractor = (id: number) => {
    setSelectedSubcontractors((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  // Download CSV template
  const handleDownloadTemplate = () => {
    const template = "Company,Trade,Contact Name,Phone Number\nExample Corp,Electrical,John Doe,(555) 123-4567"
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

  // Handle next step
  const handleNext = () => {
    // Update campaign data with current selections
    updateCampaignData({
      selectedSubcontractors: selectedSubcontractors.map((id) => subcontractors.find((sub) => sub.id === id)),
      uploadedFile: uploadedFile,
    })
    onNext()
  }

  return (
    <div className="space-y-8">
      {/* Basic Info Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="campaign-name">Campaign Name</Label>
          <Input
            id="campaign-name"
            placeholder="e.g., Downtown Office Project - Q2"
            value={campaignData.name}
            onChange={(e) => updateCampaignData({ name: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="project">Project</Label>
          <Select value={campaignData.project} onValueChange={(value) => updateCampaignData({ project: value })}>
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

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1 justify-start text-left font-normal",
                    !campaignData.startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {campaignData.startDate ? format(campaignData.startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={campaignData.startDate}
                  onSelect={(date) => updateCampaignData({ startDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1 justify-start text-left font-normal",
                    !campaignData.endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {campaignData.endDate ? format(campaignData.endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={campaignData.endDate}
                  onSelect={(date) => updateCampaignData({ endDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Subcontractor Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4">Subcontractor Selection</h3>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload List</TabsTrigger>
            <TabsTrigger value="select">Select from Database</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
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

          <TabsContent value="select" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-48">
                <Label>Filter by Trade</Label>
                <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                  <SelectTrigger className="mt-1">
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

              <div className="flex-1">
                <Label>Search</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by company or contact name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="w-16 px-4 py-2 text-left text-xs font-medium text-gray-500">
                        <Label htmlFor="select-all" className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="select-all"
                            className="rounded border-gray-300"
                            checked={
                              filteredSubcontractors.length > 0 &&
                              filteredSubcontractors.every((sub) => selectedSubcontractors.includes(sub.id))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubcontractors(filteredSubcontractors.map((sub) => sub.id))
                              } else {
                                setSelectedSubcontractors([])
                              }
                            }}
                          />
                        </Label>
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Company</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Trade</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubcontractors.map((sub) => (
                      <tr key={sub.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedSubcontractors.includes(sub.id)}
                            onChange={() => toggleSubcontractor(sub.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-2">{sub.company}</td>
                        <td className="px-4 py-2">{sub.trade}</td>
                        <td className="px-4 py-2">{sub.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-sm text-gray-500">Selected: {selectedSubcontractors.length} subcontractors</div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  )
}
