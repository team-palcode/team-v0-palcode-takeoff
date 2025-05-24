"use client"

import type React from "react"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Edit, Copy, ArrowUpDown } from "lucide-react"

// Mock data for existing constraints
const mockConstraints = [
  {
    id: 1,
    name: "Quantity Variance Check",
    type: "Quantity",
    parameter: "quantity",
    operator: "greater than",
    referenceType: "percentage",
    value: 15,
    action: "flag",
    severity: "medium",
    status: "active",
    trade: "All",
  },
  {
    id: 2,
    name: "Price Ceiling",
    type: "Price",
    parameter: "total price",
    operator: "greater than",
    referenceType: "fixed value",
    value: 500000,
    action: "require approval",
    severity: "high",
    status: "active",
    trade: "Electrical",
  },
  {
    id: 3,
    name: "Unit Price Floor",
    type: "Price",
    parameter: "unit price",
    operator: "less than",
    referenceType: "average",
    value: 10,
    action: "flag",
    severity: "low",
    status: "inactive",
    trade: "Plumbing",
  },
  {
    id: 4,
    name: "Combined Price & Quantity Check",
    type: "Combined",
    parameter: "multiple",
    operator: "multiple",
    referenceType: "multiple",
    value: 0,
    action: "reject",
    severity: "critical",
    status: "active",
    trade: "HVAC",
  },
]

// Options for dropdowns
const constraintTypeOptions = [
  { value: "quantity", label: "Quantity" },
  { value: "price", label: "Price" },
  { value: "combined", label: "Combined" },
]

const parameterOptions = {
  quantity: [
    { value: "quantity", label: "Quantity" },
    { value: "quantity_variance", label: "Quantity Variance" },
  ],
  price: [
    { value: "unit_price", label: "Unit Price" },
    { value: "total_price", label: "Total Price" },
    { value: "price_variance", label: "Price Variance" },
  ],
  combined: [
    { value: "quantity_and_price", label: "Quantity and Price" },
    { value: "quantity_or_price", label: "Quantity or Price" },
  ],
}

const operatorOptions = [
  { value: "less_than", label: "Less Than" },
  { value: "greater_than", label: "Greater Than" },
  { value: "equal_to", label: "Equal To" },
  { value: "not_equal_to", label: "Not Equal To" },
  { value: "between", label: "Between" },
]

const referenceTypeOptions = [
  { value: "fixed_value", label: "Fixed Value" },
  { value: "percentage", label: "Percentage" },
  { value: "average", label: "Average of All Bids" },
  { value: "lowest_bid", label: "Lowest Bid" },
  { value: "highest_bid", label: "Highest Bid" },
]

const actionOptions = [
  { value: "flag", label: "Flag for Review" },
  { value: "reject", label: "Automatically Reject" },
  { value: "require_approval", label: "Require Approval" },
]

const severityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

const tradeOptions = [
  { value: "all", label: "All Trades" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "hvac", label: "HVAC" },
  { value: "concrete", label: "Concrete" },
  { value: "carpentry", label: "Carpentry" },
]

export default function ConstraintPage() {
  const [activeTab, setActiveTab] = useState("list")
  const [constraints, setConstraints] = useState(mockConstraints)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [groupByType, setGroupByType] = useState(false)
  const [filterType, setFilterType] = useState("all")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    parameter: "",
    operator: "",
    referenceType: "",
    value: "",
    secondValue: "", // For "between" operator
    action: "",
    severity: "",
    trade: "all",
  })

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Filter and sort constraints
  const filteredAndSortedConstraints = [...constraints]
    .filter((constraint) => {
      if (filterType === "all") return true
      return constraint.type.toLowerCase() === filterType.toLowerCase()
    })
    .sort((a, b) => {
      if (!sortColumn) return 0

      const direction = sortDirection === "asc" ? 1 : -1

      switch (sortColumn) {
        case "name":
          return direction * a.name.localeCompare(b.name)
        case "type":
          return direction * a.type.localeCompare(b.type)
        case "severity":
          const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 }
          return (
            direction *
            (severityOrder[a.severity as keyof typeof severityOrder] -
              severityOrder[b.severity as keyof typeof severityOrder])
          )
        case "status":
          return direction * a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

  // Group constraints by type if needed
  const groupedConstraints = groupByType
    ? filteredAndSortedConstraints.reduce(
        (acc, constraint) => {
          const type = constraint.type
          if (!acc[type]) {
            acc[type] = []
          }
          acc[type].push(constraint)
          return acc
        },
        {} as Record<string, typeof constraints>,
      )
    : { All: filteredAndSortedConstraints }

  // Handle form input change
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })

    // Reset dependent fields when type changes
    if (field === "type") {
      setFormData({
        ...formData,
        type: value,
        parameter: "",
        operator: "",
        referenceType: "",
      })
    }

    // Reset value when reference type changes
    if (field === "referenceType") {
      setFormData({
        ...formData,
        referenceType: value,
        value: "",
      })
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.name ||
      !formData.type ||
      !formData.parameter ||
      !formData.operator ||
      !formData.referenceType ||
      !formData.value ||
      !formData.action ||
      !formData.severity
    ) {
      alert("Please fill in all required fields")
      return
    }

    // Create new constraint
    const newConstraint = {
      id: Math.max(0, ...constraints.map((c) => c.id)) + 1,
      name: formData.name,
      type: formData.type.charAt(0).toUpperCase() + formData.type.slice(1),
      parameter: formData.parameter,
      operator: formData.operator,
      referenceType: formData.referenceType,
      value: Number.parseFloat(formData.value) || 0,
      action: formData.action,
      severity: formData.severity,
      status: "active",
      trade: formData.trade === "all" ? "All" : formData.trade.charAt(0).toUpperCase() + formData.trade.slice(1),
    }

    setConstraints([...constraints, newConstraint])

    // Reset form
    setFormData({
      name: "",
      type: "",
      parameter: "",
      operator: "",
      referenceType: "",
      value: "",
      secondValue: "",
      action: "",
      severity: "",
      trade: "all",
    })

    // Switch to list view
    setActiveTab("list")
  }

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      default:
        return null
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    return (
      <Badge className={status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
        {status === "active" ? "Active" : "Inactive"}
      </Badge>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="Bid Constraints" backUrl="/bidding" backLabel="Back to Bid Management" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Constraint Library</TabsTrigger>
          <TabsTrigger value="create">Create Constraint</TabsTrigger>
        </TabsList>

        {/* Constraint List Tab */}
        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Bid Constraints</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="group-by-type" className="text-sm">
                    Group by Type
                  </Label>
                  <Switch id="group-by-type" checked={groupByType} onCheckedChange={setGroupByType} />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="quantity">Quantity</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="combined">Combined</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setActiveTab("create")} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Constraint
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {groupByType ? (
                <div className="space-y-6">
                  {Object.entries(groupedConstraints).map(([type, typeConstraints]) => (
                    <div key={type}>
                      <h3 className="text-lg font-medium mb-3">{type} Constraints</h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[250px]">Name</TableHead>
                              <TableHead>Trade</TableHead>
                              <TableHead>Action</TableHead>
                              <TableHead>Severity</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {typeConstraints.map((constraint) => (
                              <TableRow key={constraint.id}>
                                <TableCell className="font-medium">{constraint.name}</TableCell>
                                <TableCell>{constraint.trade}</TableCell>
                                <TableCell>
                                  {constraint.action === "flag" && "Flag for Review"}
                                  {constraint.action === "reject" && "Automatically Reject"}
                                  {constraint.action === "require approval" && "Require Approval"}
                                </TableCell>
                                <TableCell>{getSeverityBadge(constraint.severity)}</TableCell>
                                <TableCell>{getStatusBadge(constraint.status)}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("name")}>
                          <div className="flex items-center gap-1">
                            Name
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                          <div className="flex items-center gap-1">
                            Type
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Trade</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("severity")}>
                          <div className="flex items-center gap-1">
                            Severity
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                          <div className="flex items-center gap-1">
                            Status
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedConstraints.map((constraint) => (
                        <TableRow key={constraint.id}>
                          <TableCell className="font-medium">{constraint.name}</TableCell>
                          <TableCell>{constraint.type}</TableCell>
                          <TableCell>{constraint.trade}</TableCell>
                          <TableCell>
                            {constraint.action === "flag" && "Flag for Review"}
                            {constraint.action === "reject" && "Automatically Reject"}
                            {constraint.action === "require_approval" && "Require Approval"}
                          </TableCell>
                          <TableCell>{getSeverityBadge(constraint.severity)}</TableCell>
                          <TableCell>{getStatusBadge(constraint.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Constraint Tab */}
        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Constraint</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="constraint-name" className="text-sm font-medium text-gray-700">
                      Constraint Name
                    </Label>
                    <Input
                      id="constraint-name"
                      placeholder="Enter constraint name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="constraint-type" className="text-sm font-medium text-gray-700">
                      Constraint Type
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger id="constraint-type" className="mt-1">
                        <SelectValue placeholder="Select constraint type" />
                      </SelectTrigger>
                      <SelectContent>
                        {constraintTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Condition Builder */}
                {formData.type && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Condition</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="parameter" className="text-sm font-medium text-gray-700">
                          Parameter
                        </Label>
                        <Select
                          value={formData.parameter}
                          onValueChange={(value) => handleInputChange("parameter", value)}
                        >
                          <SelectTrigger id="parameter" className="mt-1">
                            <SelectValue placeholder="Select parameter" />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.type &&
                              parameterOptions[formData.type as keyof typeof parameterOptions]?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="operator" className="text-sm font-medium text-gray-700">
                          Operator
                        </Label>
                        <Select
                          value={formData.operator}
                          onValueChange={(value) => handleInputChange("operator", value)}
                        >
                          <SelectTrigger id="operator" className="mt-1">
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            {operatorOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="reference-type" className="text-sm font-medium text-gray-700">
                          Reference Value Type
                        </Label>
                        <Select
                          value={formData.referenceType}
                          onValueChange={(value) => handleInputChange("referenceType", value)}
                        >
                          <SelectTrigger id="reference-type" className="mt-1">
                            <SelectValue placeholder="Select reference type" />
                          </SelectTrigger>
                          <SelectContent>
                            {referenceTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Value Input */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="value" className="text-sm font-medium text-gray-700">
                          {formData.operator === "between" ? "Minimum Value" : "Value"}
                          {formData.referenceType === "percentage" && " (%)"}
                        </Label>
                        <Input
                          id="value"
                          type="number"
                          placeholder="Enter value"
                          value={formData.value}
                          onChange={(e) => handleInputChange("value", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      {formData.operator === "between" && (
                        <div>
                          <Label htmlFor="second-value" className="text-sm font-medium text-gray-700">
                            Maximum Value
                            {formData.referenceType === "percentage" && " (%)"}
                          </Label>
                          <Input
                            id="second-value"
                            type="number"
                            placeholder="Enter maximum value"
                            value={formData.secondValue}
                            onChange={(e) => handleInputChange("secondValue", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action and Severity */}
                {formData.type && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="action" className="text-sm font-medium text-gray-700">
                        Action
                      </Label>
                      <Select value={formData.action} onValueChange={(value) => handleInputChange("action", value)}>
                        <SelectTrigger id="action" className="mt-1">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          {actionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="severity" className="text-sm font-medium text-gray-700">
                        Severity Level
                      </Label>
                      <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                        <SelectTrigger id="severity" className="mt-1">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          {severityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="trade" className="text-sm font-medium text-gray-700">
                        Apply to Trade
                      </Label>
                      <Select value={formData.trade} onValueChange={(value) => handleInputChange("trade", value)}>
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
                  </div>
                )}

                {/* Preview */}
                {formData.type &&
                  formData.parameter &&
                  formData.operator &&
                  formData.referenceType &&
                  formData.value && (
                    <div className="bg-gray-50 p-4 rounded-md border">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Constraint Preview</h3>
                      <p className="text-sm">
                        When <strong>{formData.parameter.replace("_", " ")}</strong> is{" "}
                        <strong>{formData.operator.replace("_", " ")}</strong>{" "}
                        {formData.operator === "between" ? (
                          <>
                            <strong>{formData.value}</strong> and <strong>{formData.secondValue}</strong>
                          </>
                        ) : (
                          <strong>{formData.value}</strong>
                        )}{" "}
                        {formData.referenceType !== "fixed_value" && (
                          <>
                            <strong>{formData.referenceType.replace("_", " ")}</strong>
                          </>
                        )}
                        {formData.referenceType === "percentage" && "%"}, then{" "}
                        <strong>{actionOptions.find((a) => a.value === formData.action)?.label}</strong> with{" "}
                        <strong>{formData.severity}</strong> severity.
                      </p>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("list")}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Constraint</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

