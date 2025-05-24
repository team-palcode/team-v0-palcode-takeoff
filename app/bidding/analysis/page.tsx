"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Eye, Search } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock data for subcontractors
const mockSubcontractors = [
  {
    id: 1,
    name: "Apex Electrical",
    trade: "Electrical",
    submissionDate: "Mar 10, 2025",
    overallScore: 87,
    priceVariance: -3.2,
    quantityVariance: 1.5,
    violations: { critical: 0, important: 2, advisory: 3 },
    status: "good",
  },
  {
    id: 2,
    name: "FlowMaster Plumbing",
    trade: "Plumbing",
    submissionDate: "Mar 8, 2025",
    overallScore: 72,
    priceVariance: 8.7,
    quantityVariance: 5.2,
    violations: { critical: 1, important: 3, advisory: 2 },
    status: "warning",
  },
  {
    id: 3,
    name: "Structural Solutions",
    trade: "Concrete",
    submissionDate: "Mar 12, 2025",
    overallScore: 45,
    priceVariance: 12.5,
    quantityVariance: 8.7,
    violations: { critical: 3, important: 5, advisory: 2 },
    status: "not-recommended",
  },
  {
    id: 4,
    name: "Skyline HVAC",
    trade: "HVAC",
    submissionDate: "Mar 9, 2025",
    overallScore: 93,
    priceVariance: -1.8,
    quantityVariance: 2.1,
    violations: { critical: 0, important: 1, advisory: 4 },
    status: "good",
  },
]

// Mock scoring templates
const scoringTemplates = [
  { id: "general", name: "General Contractor Evaluation" },
  { id: "electrical", name: "Electrical Subcontractor Assessment" },
  { id: "plumbing", name: "Plumbing Bid Evaluation" },
  { id: "hvac", name: "HVAC Contractor Scorecard" },
]

// Mock constraints
const constraintTemplates = [
  { id: "quantity", name: "Quantity Variance Check" },
  { id: "price", name: "Price Ceiling" },
  { id: "combined", name: "Combined Price & Quantity Check" },
  { id: "none", name: "No Constraints" },
]

// Mock violation details for the expanded view
const mockViolations = [
  {
    rule: "Sub Bid vs. ICE (Internal Cost Estimate)",
    expected: "$245,780",
    actual: "$276,502",
    variance: "+12.5%",
    severity: "critical",
  },
  {
    rule: "Labor Rate vs. Prevailing Wage",
    expected: "$42.50/hr",
    actual: "$38.75/hr",
    variance: "-8.8%",
    severity: "important",
  },
  {
    rule: "Completion Timeline",
    expected: "45 days",
    actual: "60 days",
    variance: "+33.3%",
    severity: "critical",
  },
  {
    rule: "Material Quantities - Concrete",
    expected: "120 cubic yards",
    actual: "130 cubic yards",
    variance: "+8.3%",
    severity: "advisory",
  },
]

// Mock scoring details
const mockScoringDetails = [
  {
    category: "Technical Capability",
    criteria: [
      { name: "Project Understanding", weight: 15, score: 85, weighted: 12.8 },
      { name: "Technical Approach", weight: 20, score: 90, weighted: 18.0 },
    ],
  },
  {
    category: "Experience & Past Performance",
    criteria: [
      { name: "Past Performance", weight: 15, score: 80, weighted: 12.0 },
      { name: "Similar Projects", weight: 10, score: 75, weighted: 7.5 },
    ],
  },
  {
    category: "Financial Stability",
    criteria: [{ name: "Financial Health", weight: 10, score: 95, weighted: 9.5 }],
  },
  {
    category: "Schedule & Planning",
    criteria: [{ name: "Schedule Compliance", weight: 15, score: 85, weighted: 12.8 }],
  },
  {
    category: "Safety Record",
    criteria: [{ name: "Safety History", weight: 10, score: 90, weighted: 9.0 }],
  },
  {
    category: "Quality Control",
    criteria: [{ name: "Quality Assurance", weight: 15, score: 85, weighted: 12.8 }],
  },
]

// Project options
const projectOptions = [
  { value: "highland", label: "Highland Medical Center - Phase 2" },
  { value: "riverfront", label: "Riverfront Office Complex" },
  { value: "metro", label: "Metro Transit Hub" },
  { value: "university", label: "University Science Building" },
]

export default function BidAnalysisPage() {
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] = useState("highland")
  const [selectedScoringTemplate, setSelectedScoringTemplate] = useState("")
  const [selectedConstraint, setSelectedConstraint] = useState("")
  const [selectedSubcontractors, setSelectedSubcontractors] = useState<number[]>([])
  const [shortlistDialogOpen, setShortlistDialogOpen] = useState(false)
  const [collectionName, setCollectionName] = useState("")

  // View details handler
  const handleViewDetails = (id: number) => {
    setSelectedSubcontractor(id)
  }

  // Handle checkbox selection
  const handleSelectSubcontractor = (id: number) => {
    setSelectedSubcontractors((prev) => (prev.includes(id) ? prev.filter((subId) => subId !== id) : [...prev, id]))
  }

  // Handle shortlist submission
  const handleShortlistSubmit = () => {
    if (!collectionName.trim()) {
      alert("Please enter a collection name")
      return
    }

    // Here you would typically submit the shortlisted subcontractors to your backend
    alert(`Shortlisted ${selectedSubcontractors.length} subcontractors to collection: ${collectionName}`)

    // Reset state
    setShortlistDialogOpen(false)
    setCollectionName("")
    setSelectedSubcontractors([])
  }

  // Handle approve bid
  const handleApproveBid = (id: number) => {
    // Here you would typically submit the approval to your backend
    alert(`Approved bid from ${mockSubcontractors.find((sub) => sub.id === id)?.name}`)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge className="bg-gray-100 text-gray-800 border-green-600 border">Good</Badge>
      case "warning":
        return <Badge className="bg-gray-100 text-gray-800 border-amber-600 border">Warning</Badge>
      case "not-recommended":
        return <Badge className="bg-gray-100 text-gray-800 border-red-600 border">Not Recommended</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  // Get variance text
  const getVarianceText = (variance: number) => {
    if (variance < 0) return `${variance}% (Under)`
    if (variance > 0) return `+${variance}% (Over)`
    return "0% (Match)"
  }

  // Get selected subcontractor
  const getSelectedSubcontractor = () => {
    return mockSubcontractors.find((sub) => sub.id === selectedSubcontractor)
  }

  // Calculate summary stats
  const summaryStats = {
    good: mockSubcontractors.filter((sub) => sub.status === "good").length,
    warning: mockSubcontractors.filter((sub) => sub.status === "warning").length,
    notRecommended: mockSubcontractors.filter((sub) => sub.status === "not-recommended").length,
    total: mockSubcontractors.length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Bid Package Analysis" backUrl="/bidding" backLabel="Back to Bid Management" />
        <div className="flex gap-3">
          <Link href="/bidding/scorecard/evaluate">
            <Button className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700">
              Create Bid Package
            </Button>
          </Link>
        </div>
      </div>

      {/* Project, Scoring Template, and Constraint Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Scoring Template</label>
          <Select value={selectedScoringTemplate} onValueChange={setSelectedScoringTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Select scoring template" />
            </SelectTrigger>
            <SelectContent>
              {scoringTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Constraint Template</label>
          <Select value={selectedConstraint} onValueChange={setSelectedConstraint}>
            <SelectTrigger>
              <SelectValue placeholder="Select constraint" />
            </SelectTrigger>
            <SelectContent>
              {constraintTemplates.map((constraint) => (
                <SelectItem key={constraint.id} value={constraint.id}>
                  {constraint.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center">
                  <p className="text-base font-medium text-gray-700">
                    Drag and drop bid documents here or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Accepts PDF, Excel, CSV formats</p>
                  <Button variant="outline" className="mt-3 text-sm h-8">
                    Select Files
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Evaluated Bid Packages</h2>
        <p className="text-gray-500">Results based on selected scoring template and constraints</p>
      </div>

      {/* Summary Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Subcontractors</h3>
              <p className="text-2xl font-bold">{summaryStats.total}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Good</h3>
              <div className="flex items-center">
                <p className="text-2xl font-bold mr-2">{summaryStats.good}</p>
                <span className="text-sm text-gray-500">
                  ({Math.round((summaryStats.good / summaryStats.total) * 100)}%)
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Warning</h3>
              <div className="flex items-center">
                <p className="text-2xl font-bold mr-2">{summaryStats.warning}</p>
                <span className="text-sm text-gray-500">
                  ({Math.round((summaryStats.warning / summaryStats.total) * 100)}%)
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Not Recommended</h3>
              <div className="flex items-center">
                <p className="text-2xl font-bold mr-2">{summaryStats.notRecommended}</p>
                <span className="text-sm text-gray-500">
                  ({Math.round((summaryStats.notRecommended / summaryStats.total) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Search subcontractors" className="pl-9" />
      </div>

      {/* Approve Shortlisted Bids Button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setShortlistDialogOpen(true)}
          disabled={selectedSubcontractors.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Create Bids Collection ({selectedSubcontractors.length})
        </Button>
      </div>

      {/* Subcontractor List */}
      <Card className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedSubcontractors.length === mockSubcontractors.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSubcontractors(mockSubcontractors.map((sub) => sub.id))
                      } else {
                        setSelectedSubcontractors([])
                      }
                    }}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subcontractor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overall Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price Variance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Violations
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockSubcontractors.map((subcontractor) => (
                <tr key={subcontractor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedSubcontractors.includes(subcontractor.id)}
                      onChange={() => handleSelectSubcontractor(subcontractor.id)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{subcontractor.name}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{subcontractor.trade}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subcontractor.submissionDate}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{subcontractor.overallScore}/100</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{getVarianceText(subcontractor.priceVariance)}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {subcontractor.violations.critical > 0 && (
                        <span className="inline-flex items-center mr-2">
                          <span className="h-2 w-2 rounded-full bg-gray-400 border border-red-600 mr-1"></span>
                          <span>{subcontractor.violations.critical} Critical</span>
                        </span>
                      )}
                      {subcontractor.violations.important > 0 && (
                        <span className="inline-flex items-center mr-2">
                          <span className="h-2 w-2 rounded-full bg-gray-400 border border-amber-600 mr-1"></span>
                          <span>{subcontractor.violations.important} Important</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(subcontractor.status)}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleViewDetails(subcontractor.id)}
                      >
                        <Eye className="h-3 w-3" />
                        View Score
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleApproveBid(subcontractor.id)}
                      >
                        Approve Bid
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Score Detail Slider */}
      <Sheet open={selectedSubcontractor !== null} onOpenChange={() => setSelectedSubcontractor(null)}>
        <SheetContent className="w-[40%] sm:max-w-none overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Score Details: {getSelectedSubcontractor()?.name}</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Overall Score */}
            <div className="bg-gray-50 p-4 rounded-md border">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Overall Score</h3>
                <span className="text-3xl font-bold">{getSelectedSubcontractor()?.overallScore}/100</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Based on{" "}
                {scoringTemplates.find((t) => t.id === selectedScoringTemplate)?.name ||
                  "General Contractor Evaluation"}
              </p>
            </div>

            {/* Scoring Details */}
            <div>
              <h3 className="text-base font-medium mb-3">Scoring Breakdown</h3>
              <div className="space-y-4">
                {mockScoringDetails.map((category, index) => (
                  <div key={index} className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 font-medium border-b">{category.category}</div>
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Criterion</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Weight</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Score</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Weighted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.criteria.map((criterion, cIndex) => (
                          <tr key={cIndex} className="border-t">
                            <td className="px-4 py-2">{criterion.name}</td>
                            <td className="px-4 py-2 text-center">{criterion.weight}%</td>
                            <td className="px-4 py-2 text-center">{criterion.score}/100</td>
                            <td className="px-4 py-2 text-center font-medium">{criterion.weighted}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>

            {/* Violations Section */}
            {getSelectedSubcontractor()?.violations.critical > 0 && (
              <div>
                <h3 className="text-base font-medium mb-3">Constraint Violations</h3>
                <div className="space-y-2">
                  {mockViolations.map((violation, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{violation.rule}</span>
                        <Badge
                          className={
                            violation.severity === "critical"
                              ? "bg-red-100 text-red-800"
                              : violation.severity === "important"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                        <div>
                          <span className="text-gray-500">Expected:</span>
                          <span className="ml-1">{violation.expected}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Actual:</span>
                          <span className="ml-1">{violation.actual}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Variance:</span>
                          <span className="ml-1">{violation.variance}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setSelectedSubcontractor(null)}>
                Close
              </Button>
              <Button>Export Report</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {/* Shortlist Dialog */}
      <Dialog open={shortlistDialogOpen} onOpenChange={setShortlistDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Bids Collection</DialogTitle>
            <DialogDescription>Enter a name for this collection of bids.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Collection Name</Label>
              <Input
                id="collection-name"
                placeholder="e.g., Phase 1 Electrical Contractors"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Selected subcontractors: {selectedSubcontractors.length}</p>
              <ul className="mt-2 text-sm text-gray-700 max-h-40 overflow-y-auto">
                {selectedSubcontractors.map((id) => (
                  <li key={id} className="py-1">
                    • {mockSubcontractors.find((sub) => sub.id === id)?.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShortlistDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShortlistSubmit} className="bg-green-600 hover:bg-green-700">
              Create Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

