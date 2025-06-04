"use client"

import { useState, useEffect } from "react"
import { Filter, CheckCircle, AlertTriangle, ArrowLeft, Edit2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingOverlay } from "@/components/loading-overlay"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileSpreadsheet, FileText } from "lucide-react"

// Mock data for the verification screen
const mockItems = [
  {
    id: 1,
    name: 'Copper Pipe - 1/2"',
    category: "Plumbing",
    subcategory: "Piping",
    quantity: 245,
    unit: "LF",
    unitPrice: 3.75,
    confidence: 0.92,
    location: "First Floor",
  },
  {
    id: 2,
    name: 'Ball Valve - 3/4"',
    category: "Plumbing",
    subcategory: "Valves",
    quantity: 18,
    unit: "EA",
    unitPrice: 24.5,
    confidence: 0.88,
    location: "Mechanical Room",
  },
  {
    id: 3,
    name: 'PVC Pipe - 2"',
    category: "Plumbing",
    subcategory: "Piping",
    quantity: 120,
    unit: "LF",
    unitPrice: 2.25,
    confidence: 0.65,
    location: "Basement",
  },
  {
    id: 4,
    name: "Sink Faucet",
    category: "Plumbing",
    subcategory: "Fixtures",
    quantity: 12,
    unit: "EA",
    unitPrice: 85.0,
    confidence: 0.78,
    location: "Restrooms",
  },
  {
    id: 5,
    name: "Floor Drain",
    category: "Plumbing",
    subcategory: "Drainage",
    quantity: 8,
    unit: "EA",
    unitPrice: 45.75,
    confidence: 0.94,
    location: "Basement",
  },
  {
    id: 6,
    name: "Water Heater - 50 Gal",
    category: "Plumbing",
    subcategory: "Equipment",
    quantity: 2,
    unit: "EA",
    unitPrice: 750.0,
    confidence: 0.89,
    location: "Mechanical Room",
  },
  {
    id: 7,
    name: 'Check Valve - 1"',
    category: "Plumbing",
    subcategory: "Valves",
    quantity: 6,
    unit: "EA",
    unitPrice: 32.25,
    confidence: 0.72,
    location: "Mechanical Room",
  },
]

// Subcategories for filtering
const subcategories = ["All", "Piping", "Valves", "Fixtures", "Drainage", "Equipment"]

export default function QuantityVerification() {
  const [items, setItems] = useState<typeof mockItems>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNavigating, setIsNavigating] = useState(false)
  const [selectedSubcategory, setSelectedSubcategory] = useState("All")
  const [selectedBlueprint, setSelectedBlueprint] = useState("floor-plan")
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<{
    [key: number]: { name: string; quantity: number; unitPrice: number }
  }>({})

  const [specSheetOpen, setSpecSheetOpen] = useState(false)
  const [includeAINotes, setIncludeAINotes] = useState(true)
  const [reviewFlags, setReviewFlags] = useState<{ [key: number]: boolean }>({})
  const [reviewers, setReviewers] = useState<{ [key: number]: string }>({})

  // Simulate loading data on initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(mockItems)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Filter items based on selected subcategory
  const filteredItems =
    selectedSubcategory === "All" ? items : items.filter((item) => item.subcategory === selectedSubcategory)

  // Calculate totals
  const totalItems = filteredItems.length
  const totalCost = filteredItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  const handleEdit = (item: (typeof mockItems)[0]) => {
    setEditingItemId(item.id)
    setEditValues({
      ...editValues,
      [item.id]: {
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      },
    })
  }

  const handleSave = (id: number) => {
    const newItems = items.map((item) => {
      if (item.id === id && editValues[id]) {
        return {
          ...item,
          name: editValues[id].name,
          quantity: editValues[id].quantity,
          unitPrice: editValues[id].unitPrice,
        }
      }
      return item
    })
    setItems(newItems)
    setEditingItemId(null)
  }

  const handleCancel = (id: number) => {
    setEditingItemId(null)
    const newEditValues = { ...editValues }
    delete newEditValues[id]
    setEditValues(newEditValues)
  }

  const handleBackToUpload = () => {
    setIsNavigating(true)

    // Simulate loading time before navigation
    setTimeout(() => {
      window.location.href = "/takeoff"
    }, 1000)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return "bg-green-100 text-green-800"
    if (confidence >= 0.7) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.85) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (confidence >= 0.7) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <AlertTriangle className="h-4 w-4 text-red-600" />
  }

  const toggleReviewFlag = (id: number) => {
    setReviewFlags((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const setReviewer = (id: number, reviewer: string) => {
    setReviewers((prev) => ({
      ...prev,
      [id]: reviewer,
    }))
  }

  const exportSpecSheet = (format: "pdf" | "excel") => {
    // This would be implemented with a real export library
    alert(`Exporting spec sheet as ${format}...`)
    // Close the dialog after exporting
    setSpecSheetOpen(false)
  }

  if (isLoading) {
    return <LoadingOverlay message="Loading verification data..." />
  }

  return (
    <>
      {isNavigating && <LoadingOverlay message="Navigating..." />}

      <div>
        {/* Header with project info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Project: Skyline Tower</h2>
              <p className="text-sm text-gray-500">Trade: Plumbing</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleBackToUpload}
                disabled={isNavigating}
              >
                {isNavigating ? (
                  <>
                    <LoadingSpinner className="mr-1" size={16} />
                    Navigating...
                  </>
                ) : (
                  <>
                    <ArrowLeft className="h-4 w-4" />
                    Back to Upload
                  </>
                )}
              </Button>
              <Button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setSpecSheetOpen(true)}
              >
                <FileText className="h-4 w-4" />
                Generate Spec Sheet
              </Button>
              <Button className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approve All
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side: Item table */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-medium">Detected Items</h3>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Confidence
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredItems.map((item) => {
                        const isEditing = editingItemId === item.id
                        const editValue = editValues[item.id] || {
                          name: item.name,
                          quantity: item.quantity,
                          unitPrice: item.unitPrice,
                        }

                        return (
                          <tr key={item.id}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div>
                                {isEditing ? (
                                  <Input
                                    type="text"
                                    value={editValue.name}
                                    onChange={(e) =>
                                      setEditValues({
                                        ...editValues,
                                        [item.id]: {
                                          ...editValue,
                                          name: e.target.value,
                                        },
                                      })
                                    }
                                    className="w-full mb-1"
                                  />
                                ) : (
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                )}
                                <div className="text-xs text-gray-500">
                                  {item.subcategory} | {item.location}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {isEditing ? (
                                  <Input
                                    type="number"
                                    value={editValue.quantity}
                                    onChange={(e) =>
                                      setEditValues({
                                        ...editValues,
                                        [item.id]: {
                                          ...editValue,
                                          quantity: Number.parseFloat(e.target.value) || 0,
                                        },
                                      })
                                    }
                                    className="w-24"
                                  />
                                ) : (
                                  <span className="text-sm text-gray-900">{item.quantity}</span>
                                )}
                                <span className="text-sm text-gray-500">{item.unit}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center space-x-1">
                                <span className="text-sm text-gray-500">$</span>
                                {isEditing ? (
                                  <Input
                                    type="number"
                                    value={editValue.unitPrice}
                                    onChange={(e) =>
                                      setEditValues({
                                        ...editValues,
                                        [item.id]: {
                                          ...editValue,
                                          unitPrice: Number.parseFloat(e.target.value) || 0,
                                        },
                                      })
                                    }
                                    className="w-24"
                                  />
                                ) : (
                                  <span className="text-sm text-gray-900">{item.unitPrice.toFixed(2)}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                ${(item.quantity * item.unitPrice).toFixed(2)}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Badge
                                variant="secondary"
                                className={`flex items-center gap-1 ${getConfidenceColor(item.confidence)}`}
                              >
                                {getConfidenceIcon(item.confidence)}
                                {(item.confidence * 100).toFixed(0)}%
                              </Badge>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {isEditing ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                                      onClick={() => handleSave(item.id)}
                                    >
                                      <Save className="h-4 w-4" />
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="flex items-center gap-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                      onClick={() => handleCancel(item.id)}
                                    >
                                      <X className="h-4 w-4" />
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => handleEdit(item)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                    Edit
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">Showing {filteredItems.length} items</div>
                    <div className="text-sm font-medium">Total Estimated Cost: ${totalCost.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side: Blueprint view */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Blueprint View</h3>

                <Tabs value={selectedBlueprint} onValueChange={setSelectedBlueprint}>
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="floor-plan">Floor Plan</TabsTrigger>
                    <TabsTrigger value="detail-view">Detail View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="floor-plan" className="mt-0">
                    <div className="bg-gray-100 rounded-md h-[500px] flex items-center justify-center overflow-hidden">
                      <img
                        src="/images/construction-blueprint.png"
                        alt="Construction Floor Plan Blueprint"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="detail-view" className="mt-0">
                    <div className="bg-gray-100 rounded-md h-[500px] flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=500&width=400"
                        alt="Detail View Blueprint"
                        className="max-h-full"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-4 text-sm text-gray-500">
                  <p>Click on an item in the table to highlight it in the blueprint.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Spec Sheet Generation Modal */}
      <Dialog open={specSheetOpen} onOpenChange={setSpecSheetOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-xl">Specification Sheet – Auto Generated</DialogTitle>
                <DialogDescription className="mt-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
                    <div>
                      <span className="font-medium">Trade:</span> Plumbing
                    </div>
                    <div>
                      <span className="font-medium">Drawing Set:</span> Skyline Tower - Plumbing
                    </div>
                    <div>
                      <span className="font-medium">Generated On:</span> {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </DialogDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => exportSpecSheet("pdf")}
                >
                  <FileText className="h-4 w-4" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => exportSpecSheet("excel")}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export Excel
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-x-auto overflow-y-auto max-h-[60vh] border rounded-md">
            <Table className="text-sm">
              <TableHeader className="bg-gray-50 sticky top-0">
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Material Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Specification</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Drawing Snippet</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Reviewed By</TableHead>
                  <TableHead>Flag</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Input defaultValue={item.name} className="h-8 w-full min-w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={item.quantity} className="h-8 w-20" />
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={item.unit}>
                        <SelectTrigger className="h-8 w-20">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EA">EA</SelectItem>
                          <SelectItem value="LF">LF</SelectItem>
                          <SelectItem value="SF">SF</SelectItem>
                          <SelectItem value="CY">CY</SelectItem>
                          <SelectItem value="GAL">GAL</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        defaultValue={`${item.category} grade, standard ${item.subcategory}`}
                        className="h-8 w-full min-w-[200px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input defaultValue={item.location} className="h-8 w-full min-w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                        <img
                          src={`/placeholder.svg?height=64&width=64&query=blueprint detail of ${item.name}`}
                          alt={`Drawing snippet for ${item.name}`}
                          className="object-cover h-16 w-16 rounded-md"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`flex items-center gap-1 ${getConfidenceColor(item.confidence)}`}
                      >
                        {getConfidenceIcon(item.confidence)}
                        {(item.confidence * 100).toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select value={reviewers[item.id] || ""} onValueChange={(value) => setReviewer(item.id, value)}>
                        <SelectTrigger className="h-8 w-32">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john">John Smith</SelectItem>
                          <SelectItem value="sarah">Sarah Johnson</SelectItem>
                          <SelectItem value="mike">Mike Davis</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Checkbox
                          id={`flag-${item.id}`}
                          checked={reviewFlags[item.id] || false}
                          onCheckedChange={() => toggleReviewFlag(item.id)}
                          className={reviewFlags[item.id] ? "bg-orange-500 text-white" : ""}
                        />
                        <label htmlFor={`flag-${item.id}`} className="sr-only">
                          Flag for review
                        </label>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-ai-notes"
                  checked={includeAINotes}
                  onCheckedChange={(checked) => setIncludeAINotes(!!checked)}
                />
                <label htmlFor="include-ai-notes" className="text-sm">
                  Include AI Notes in Export
                </label>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setSpecSheetOpen(false)}>
                  Cancel
                </Button>
                <Button variant="secondary">Save Draft</Button>
                <Button
                  variant="default"
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => exportSpecSheet("pdf")}
                >
                  Export PDF
                </Button>
                <Button variant="outline" onClick={() => exportSpecSheet("excel")}>
                  Export Excel
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
