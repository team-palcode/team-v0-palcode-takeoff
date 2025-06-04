"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, Save, X, Copy, Eye } from "lucide-react"

// Mock data for existing templates
const mockTemplates = [
  {
    id: 1,
    name: "General Contractor Evaluation",
    trade: "General",
    criteriaCount: 8,
    lastModified: "Mar 15, 2025",
    status: "active",
  },
  {
    id: 2,
    name: "Electrical Subcontractor Assessment",
    trade: "Electrical",
    criteriaCount: 12,
    lastModified: "Mar 10, 2025",
    status: "active",
  },
  {
    id: 3,
    name: "Plumbing Bid Evaluation",
    trade: "Plumbing",
    criteriaCount: 10,
    lastModified: "Feb 28, 2025",
    status: "active",
  },
  {
    id: 4,
    name: "HVAC Contractor Scorecard",
    trade: "HVAC",
    criteriaCount: 15,
    lastModified: "Mar 5, 2025",
    status: "draft",
  },
]

// Mock data for criteria categories
const criteriaCategories = [
  { id: "technical", name: "Technical Capability" },
  { id: "financial", name: "Financial Stability" },
  { id: "experience", name: "Experience & Past Performance" },
  { id: "schedule", name: "Schedule & Planning" },
  { id: "safety", name: "Safety Record" },
  { id: "quality", name: "Quality Control" },
]

// Mock data for trades
const trades = [
  { value: "general", label: "General Contractor" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "hvac", label: "HVAC" },
  { value: "concrete", label: "Concrete" },
  { value: "carpentry", label: "Carpentry" },
  { value: "masonry", label: "Masonry" },
  { value: "roofing", label: "Roofing" },
]

export default function BidScorecardPage() {
  const [activeTab, setActiveTab] = useState("templates")
  const [templateName, setTemplateName] = useState("")
  const [selectedTrade, setSelectedTrade] = useState("")
  const [criteria, setCriteria] = useState<
    Array<{
      id: number
      name: string
      description: string
      category: string
      weight: number
    }>
  >([
    {
      id: 1,
      name: "Project Understanding",
      description: "Demonstrated understanding of project requirements",
      category: "technical",
      weight: 15,
    },
    {
      id: 2,
      name: "Technical Approach",
      description: "Methodology and approach to completing the work",
      category: "technical",
      weight: 20,
    },
    {
      id: 3,
      name: "Past Performance",
      description: "Track record of similar projects",
      category: "experience",
      weight: 15,
    },
    {
      id: 4,
      name: "Financial Stability",
      description: "Financial health and stability of the company",
      category: "financial",
      weight: 10,
    },
    {
      id: 5,
      name: "Schedule Compliance",
      description: "Ability to meet project timeline",
      category: "schedule",
      weight: 15,
    },
    {
      id: 6,
      name: "Safety Record",
      description: "Safety history and EMR rating",
      category: "safety",
      weight: 10,
    },
    {
      id: 7,
      name: "Quality Control",
      description: "Quality assurance processes",
      category: "quality",
      weight: 15,
    },
  ])
  const [newCriterion, setNewCriterion] = useState({
    name: "",
    description: "",
    category: "",
    weight: 0,
  })
  const [editingCriterionId, setEditingCriterionId] = useState<number | null>(null)

  // Calculate total weight
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0)

  // Handle adding new criterion
  const handleAddCriterion = () => {
    if (!newCriterion.name || !newCriterion.category || newCriterion.weight <= 0) return

    const newId = Math.max(0, ...criteria.map((c) => c.id)) + 1
    setCriteria([...criteria, { ...newCriterion, id: newId }])
    setNewCriterion({ name: "", description: "", category: "", weight: 0 })
  }

  // Handle editing criterion
  const handleEditCriterion = (id: number) => {
    setEditingCriterionId(id)
  }

  // Handle saving edited criterion
  const handleSaveCriterion = (id: number) => {
    setEditingCriterionId(null)
  }

  // Handle deleting criterion
  const handleDeleteCriterion = (id: number) => {
    setCriteria(criteria.filter((c) => c.id !== id))
  }

  // Handle weight change
  const handleWeightChange = (id: number, weight: number) => {
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, weight: Math.max(0, Math.min(100, weight)) } : c)))
  }

  // Handle saving template
  const handleSaveTemplate = () => {
    // In a real app, this would save the template to the database
    alert("Template saved successfully!")
    setActiveTab("templates")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="Bid Evaluation Templates" backUrl="/bidding" backLabel="Back to Bid Management" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Template Library</TabsTrigger>
          <TabsTrigger value="create">Create Template</TabsTrigger>
        </TabsList>

        {/* Template Library Tab */}
        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Evaluation Templates</CardTitle>
              <Button onClick={() => setActiveTab("create")} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Template
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Trade</TableHead>
                      <TableHead>Criteria</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{template.trade}</TableCell>
                        <TableCell>{template.criteriaCount} criteria</TableCell>
                        <TableCell>{template.lastModified}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              template.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }
                          >
                            {template.status === "active" ? "Active" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Copy className="h-4 w-4" />
                              <span className="sr-only">Duplicate</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Template Tab */}
        <TabsContent value="create" className="mt-6 space-y-6">
          {/* Template Details */}
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                  <Input
                    placeholder="Enter template name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trade</label>
                  <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trade" />
                    </SelectTrigger>
                    <SelectContent>
                      {trades.map((trade) => (
                        <SelectItem key={trade.value} value={trade.value}>
                          {trade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Criteria */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Evaluation Criteria</CardTitle>
              <div className="flex items-center gap-2">
                <div className={`text-sm font-medium ${totalWeight === 100 ? "text-green-600" : "text-red-600"}`}>
                  Total Weight: {totalWeight}%
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Criterion</TableHead>
                      <TableHead className="w-[300px]">Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="w-[100px]">Weight (%)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {criteria.map((criterion) => (
                      <TableRow key={criterion.id}>
                        <TableCell>
                          {editingCriterionId === criterion.id ? (
                            <Input
                              value={criterion.name}
                              onChange={(e) =>
                                setCriteria(
                                  criteria.map((c) => (c.id === criterion.id ? { ...c, name: e.target.value } : c)),
                                )
                              }
                            />
                          ) : (
                            <div className="font-medium">{criterion.name}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingCriterionId === criterion.id ? (
                            <Input
                              value={criterion.description}
                              onChange={(e) =>
                                setCriteria(
                                  criteria.map((c) =>
                                    c.id === criterion.id ? { ...c, description: e.target.value } : c,
                                  ),
                                )
                              }
                            />
                          ) : (
                            criterion.description
                          )}
                        </TableCell>
                        <TableCell>
                          {editingCriterionId === criterion.id ? (
                            <Select
                              value={criterion.category}
                              onValueChange={(value) =>
                                setCriteria(
                                  criteria.map((c) => (c.id === criterion.id ? { ...c, category: value } : c)),
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {criteriaCategories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            criteriaCategories.find((cat) => cat.id === criterion.category)?.name
                          )}
                        </TableCell>
                        <TableCell>
                          {editingCriterionId === criterion.id ? (
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={criterion.weight}
                              onChange={(e) => handleWeightChange(criterion.id, Number.parseInt(e.target.value))}
                              className="w-20"
                            />
                          ) : (
                            <div className="font-medium">{criterion.weight}%</div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {editingCriterionId === criterion.id ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSaveCriterion(criterion.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Save className="h-4 w-4" />
                                  <span className="sr-only">Save</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingCriterionId(null)}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Cancel</span>
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditCriterion(criterion.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteCriterion(criterion.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Add new criterion row */}
                    <TableRow>
                      <TableCell>
                        <Input
                          placeholder="Criterion name"
                          value={newCriterion.name}
                          onChange={(e) => setNewCriterion({ ...newCriterion, name: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Description"
                          value={newCriterion.description}
                          onChange={(e) => setNewCriterion({ ...newCriterion, description: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={newCriterion.category}
                          onValueChange={(value) => setNewCriterion({ ...newCriterion, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {criteriaCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Weight"
                          value={newCriterion.weight || ""}
                          onChange={(e) =>
                            setNewCriterion({
                              ...newCriterion,
                              weight: Number.parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddCriterion}
                          disabled={!newCriterion.name || !newCriterion.category || newCriterion.weight <= 0}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {totalWeight !== 100 && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                  <p className="text-sm">
                    <strong>Note:</strong> Total weight must equal 100%. Current total: {totalWeight}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setActiveTab("templates")}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={!templateName || !selectedTrade || totalWeight !== 100}>
              Save Template
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
