"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"

// Trade options
const tradeOptions = [
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "hvac", label: "HVAC" },
  { value: "carpentry", label: "Carpentry" },
  { value: "concrete", label: "Concrete" },
  { value: "masonry", label: "Masonry" },
  { value: "roofing", label: "Roofing" },
  { value: "painting", label: "Painting" },
  { value: "flooring", label: "Flooring" },
  { value: "drywall", label: "Drywall" },
  { value: "landscaping", label: "Landscaping" },
  { value: "fire_protection", label: "Fire Protection" },
  { value: "low_voltage", label: "Low Voltage" },
  { value: "mechanical", label: "Mechanical" },
]

// Project size options
const projectSizeOptions = [
  { value: "small", label: "Small ($0 - $50,000)" },
  { value: "medium", label: "Medium ($50,000 - $250,000)" },
  { value: "large", label: "Large ($250,000+)" },
]

export default function ResearchCriteriaPage() {
  // Form state
  const [researchName, setResearchName] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [primaryTrade, setPrimaryTrade] = useState("")
  const [secondaryTrade, setSecondaryTrade] = useState("")

  // Criteria state
  const [licenseRequired, setLicenseRequired] = useState(true)
  const [yearsInBusiness, setYearsInBusiness] = useState(5)
  const [locationRadius, setLocationRadius] = useState(50)
  const [projectSize, setProjectSize] = useState("medium")
  const [contactInfo, setContactInfo] = useState({
    phone: true,
    email: true,
  })

  // Custom criteria
  const [customCriteria, setCustomCriteria] = useState<
    Array<{
      id: number
      text: string
      importance: "must" | "nice"
    }>
  >([])
  const [newCriterion, setNewCriterion] = useState("")
  const [newImportance, setNewImportance] = useState<"must" | "nice">("must")

  // Add custom criterion
  const handleAddCriterion = () => {
    if (newCriterion.trim() === "") return

    setCustomCriteria([
      ...customCriteria,
      {
        id: Date.now(),
        text: newCriterion,
        importance: newImportance,
      },
    ])

    setNewCriterion("")
    setNewImportance("must")
  }

  // Remove custom criterion
  const handleRemoveCriterion = (id: number) => {
    setCustomCriteria(customCriteria.filter((criterion) => criterion.id !== id))
  }

  // Create research cycle
  const handleStartResearch = () => {
    // Here you would typically submit the form data to your backend
    console.log({
      researchName,
      dateRange: { startDate, endDate },
      trades: { primaryTrade, secondaryTrade },
      criteria: {
        licenseRequired,
        yearsInBusiness,
        locationRadius,
        projectSize,
        contactInfo,
        customCriteria,
      },
    })

    // Navigate to the research page
    window.location.href = "/bidding/subcontractor/research"
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with back button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Link href="/bidding/subcontractor/progress">
            <Button variant="outline" className="flex items-center gap-1 h-10">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Research Criteria</h1>
        </div>
        <Button
          onClick={handleStartResearch}
          disabled={!researchName || !primaryTrade || !startDate || !endDate}
          className="h-10 px-6"
        >
          Start Research
        </Button>
      </div>

      {/* Main form - simplified layout */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="space-y-8">
          {/* Basic Info Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Basic Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="research-name" className="text-base font-medium block mb-2">
                  Research Name
                </Label>
                <Input
                  id="research-name"
                  value={researchName}
                  onChange={(e) => setResearchName(e.target.value)}
                  placeholder="e.g., Q2 Electrical Contractors"
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium block mb-2">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        {startDate ? format(startDate, "MMM d, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-base font-medium block mb-2">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        {endDate ? format(endDate, "MMM d, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => (startDate ? date < startDate : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          {/* Trade Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Trade Selection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="primary-trade" className="text-base font-medium block mb-2">
                  Primary Trade
                </Label>
                <Select value={primaryTrade} onValueChange={setPrimaryTrade}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select primary trade" />
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
                <Label htmlFor="secondary-trade" className="text-base font-medium block mb-2">
                  Secondary Trade (Optional)
                </Label>
                <Select value={secondaryTrade} onValueChange={setSecondaryTrade}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select secondary trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {tradeOptions
                      .filter((option) => option.value !== primaryTrade)
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Key Criteria */}
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Key Criteria</h2>
            <div className="space-y-6">
              {/* License Required */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                <div>
                  <Label htmlFor="license-required" className="text-base font-medium">
                    License Required
                  </Label>
                  <p className="text-gray-500 mt-1">Require subcontractors to have appropriate licensing</p>
                </div>
                <Switch
                  id="license-required"
                  checked={licenseRequired}
                  onCheckedChange={setLicenseRequired}
                  className="scale-125"
                />
              </div>

              {/* Years in Business */}
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="years-in-business" className="text-base font-medium">
                    Years in Business
                  </Label>
                  <span className="text-base font-medium bg-white px-3 py-1 rounded-md border">
                    {yearsInBusiness} {yearsInBusiness === 1 ? "year" : "years"}
                  </span>
                </div>
                <Slider
                  id="years-in-business"
                  min={1}
                  max={20}
                  step={1}
                  value={[yearsInBusiness]}
                  onValueChange={(value) => setYearsInBusiness(value[0])}
                  className="h-2"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">1 year</span>
                  <span className="text-sm text-gray-500">20+ years</span>
                </div>
              </div>

              {/* Location */}
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="location-radius" className="text-base font-medium">
                    Location Radius
                  </Label>
                  <span className="text-base font-medium bg-white px-3 py-1 rounded-md border">
                    {locationRadius} miles
                  </span>
                </div>
                <Slider
                  id="location-radius"
                  min={25}
                  max={200}
                  step={25}
                  value={[locationRadius]}
                  onValueChange={(value) => setLocationRadius(value[0])}
                  className="h-2"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">25 miles</span>
                  <span className="text-sm text-gray-500">200 miles</span>
                </div>
              </div>

              {/* Project Size */}
              <div className="p-4 bg-gray-50 rounded-md">
                <Label htmlFor="project-size" className="text-base font-medium block mb-3">
                  Project Size
                </Label>
                <RadioGroup
                  id="project-size"
                  value={projectSize}
                  onValueChange={setProjectSize}
                  className="flex flex-col space-y-3"
                >
                  {projectSizeOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 bg-white p-3 rounded-md border">
                      <RadioGroupItem value={option.value} id={`size-${option.value}`} className="scale-125" />
                      <Label htmlFor={`size-${option.value}`} className="text-base">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Contact Info Needed */}
              <div className="p-4 bg-gray-50 rounded-md">
                <Label className="text-base font-medium block mb-3">Contact Info Required</Label>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-md border">
                    <Checkbox
                      id="contact-phone"
                      checked={contactInfo.phone}
                      onCheckedChange={(checked) => setContactInfo({ ...contactInfo, phone: checked as boolean })}
                      className="scale-125"
                    />
                    <Label htmlFor="contact-phone" className="text-base">
                      Phone Number
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-md border">
                    <Checkbox
                      id="contact-email"
                      checked={contactInfo.email}
                      onCheckedChange={(checked) => setContactInfo({ ...contactInfo, email: checked as boolean })}
                      className="scale-125"
                    />
                    <Label htmlFor="contact-email" className="text-base">
                      Email Address
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Criteria - Simplified */}
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Additional Criteria (Optional)</h2>
            <div className="space-y-4">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Label htmlFor="new-criterion" className="text-base font-medium block mb-2">
                    Add Criterion
                  </Label>
                  <Input
                    id="new-criterion"
                    value={newCriterion}
                    onChange={(e) => setNewCriterion(e.target.value)}
                    placeholder="e.g., Experience with high-rise buildings"
                    className="h-12"
                  />
                </div>

                <div className="w-40">
                  <Label htmlFor="importance" className="text-base font-medium block mb-2">
                    Importance
                  </Label>
                  <Select value={newImportance} onValueChange={(value: "must" | "nice") => setNewImportance(value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="must">Must Have</SelectItem>
                      <SelectItem value="nice">Nice to Have</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  onClick={handleAddCriterion}
                  disabled={!newCriterion.trim()}
                  className="flex items-center gap-2 h-12 mt-8"
                >
                  <Plus className="h-5 w-5" />
                  Add
                </Button>
              </div>

              {/* Custom criteria list */}
              {customCriteria.length > 0 && (
                <div className="mt-4 space-y-3">
                  {customCriteria.map((criterion) => (
                    <div key={criterion.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <p className="font-medium">{criterion.text}</p>
                        <span
                          className={cn(
                            "inline-block mt-1 px-3 py-1 rounded-full text-sm",
                            criterion.importance === "must"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200",
                          )}
                        >
                          {criterion.importance === "must" ? "Must Have" : "Nice to Have"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCriterion(criterion.id)}
                        className="text-gray-500 hover:text-red-500 h-10 w-10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t flex justify-end">
            <Button
              onClick={handleStartResearch}
              disabled={!researchName || !primaryTrade || !startDate || !endDate}
              className="h-12 px-8 text-base"
            >
              Start Research
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
