"use client"

import { useState, useEffect } from "react"
import { FileText, Download, X, Flag, Eye, CheckCircle, AlertTriangle, ArrowLeft, Edit2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingOverlay } from "@/components/loading-overlay"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Filter } from "@/components/ui/filter" // Import Filter component

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

  const [showSpecSheet, setShowSpecSheet] = useState(false)
  const [specSheetData, setSpecSheetData] = useState<any[]>([])
  const [includeAiNotes, setIncludeAiNotes] = useState(true)
  const [flaggedItems, setFlaggedItems] = useState<Set<number>>(new Set())
  const [reviewedBy, setReviewedBy] = useState<{ [key: number]: string }>({})
  const [specifications, setSpecifications] = useState<{ [key: number]: string }>({})

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

  const generateSpecSheet = () => {
    const specData = filteredItems.map((item, index) => ({
      ...item,
      sequentialId: index + 1,
      specification: specifications[item.id] || "Standard grade material per project specifications",
      drawingSnippet: `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(item.name)}`,
      reviewedBy: reviewedBy[item.id] || "",
      flagged: flaggedItems.has(item.id),
    }))
    setSpecSheetData(specData)
    setShowSpecSheet(true)
  }

  const handleFlagToggle = (itemId: number) => {
    const newFlagged = new Set(flaggedItems)
    if (newFlagged.has(itemId)) {
      newFlagged.delete(itemId)
    } else {
      newFlagged.add(itemId)
    }
    setFlaggedItems(newFlagged)
  }

  const getConfidenceBadgeClass = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-100 text-green-800 border-green-200"
    if (confidence >= 0.7) return "bg-amber-100 text-amber-800 border-amber-200"
    return "bg-red-100 text-red-800 border-red-200"
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
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approve All
              </Button>
              <Button className="flex items-center gap-2" onClick={generateSpecSheet}>
                <FileText className="h-4 w-4" />
                Generate Spec Sheet
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
                    <Filter className="h-4 w-4 text-gray-500" /> {/* Filter component used here */}
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
                    <div className="bg-gray-100 rounded-md h-[500px] flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=500&width=400"
                        alt="Floor Plan Blueprint"
                        className="max-h-full"
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
      {/* Spec Sheet Modal */}
      <Dialog open={showSpecSheet} onOpenChange={setShowSpecSheet}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl font-semibold">Specification Sheet – Auto Generated</DialogTitle>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Trade:</span> Plumbing
                  </p>
                  <p>
                    <span className="font-medium">Drawing Set:</span> Skyline Tower - Floor Plans
                  </p>
                  <p>
                    <span className="font-medium">Generated On:</span> {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Excel
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowSpecSheet(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="divide-x divide-gray-200">
                    <th className="px-3 py-3 text-left font-medium text-gray-900">#</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900">Material Name</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900">Quantity</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900">Unit</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900">Specification</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900">Location</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900">Drawing</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900">Confidence</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900">Reviewed By</th>
                    <th className="px-3 py-3 text-left font-medium text-gray-900">Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {specSheetData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap text-gray-900 font-medium">{item.sequentialId}</td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.subcategory}</div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newData = specSheetData.map((i) =>
                              i.id === item.id ? { ...i, quantity: Number(e.target.value) } : i,
                            )
                            setSpecSheetData(newData)
                          }}
                          className="w-20 h-8"
                        />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Select
                          value={item.unit}
                          onValueChange={(value) => {
                            const newData = specSheetData.map((i) => (i.id === item.id ? { ...i, unit: value } : i))
                            setSpecSheetData(newData)
                          }}
                        >
                          <SelectTrigger className="w-16 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EA">EA</SelectItem>
                            <SelectItem value="LF">LF</SelectItem>
                            <SelectItem value="SF">SF</SelectItem>
                            <SelectItem value="CF">CF</SelectItem>
                            <SelectItem value="SY">SY</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-3">
                        <Textarea
                          value={specifications[item.id] || item.specification}
                          onChange={(e) => setSpecifications({ ...specifications, [item.id]: e.target.value })}
                          className="min-h-[60px] text-xs"
                          placeholder="Enter material specifications..."
                        />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Input
                          value={item.location}
                          onChange={(e) => {
                            const newData = specSheetData.map((i) =>
                              i.id === item.id ? { ...i, location: e.target.value } : i,
                            )
                            setSpecSheetData(newData)
                          }}
                          className="w-24 h-8 text-xs"
                        />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="relative group">
                          <img
                            src={item.drawingSnippet || "/placeholder.svg"}
                            alt="Drawing snippet"
                            className="h-16 w-16 object-cover rounded-md border cursor-pointer"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Badge className={`${getConfidenceBadgeClass(item.confidence)} border`}>
                          {(item.confidence * 100).toFixed(0)}%
                        </Badge>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Select
                          value={reviewedBy[item.id] || ""}
                          onValueChange={(value) => {
                            setReviewedBy({ ...reviewedBy, [item.id]: value })
                          }}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="john-doe">John Doe</SelectItem>
                            <SelectItem value="jane-smith">Jane Smith</SelectItem>
                            <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <Checkbox
                          checked={flaggedItems.has(item.id)}
                          onCheckedChange={() => handleFlagToggle(item.id)}
                        />
                        {flaggedItems.has(item.id) && <Flag className="h-4 w-4 text-red-500 ml-1 inline" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex-shrink-0 border-t bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Checkbox id="include-ai-notes" checked={includeAiNotes} onCheckedChange={setIncludeAiNotes} />
                <label htmlFor="include-ai-notes" className="text-sm text-gray-700">
                  Include AI Notes in Export
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={() => setShowSpecSheet(false)}>
                  Cancel
                </Button>
                <Button variant="outline" className="text-gray-600">
                  Save Draft
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-700">Export PDF</Button>
                <Button variant="outline">Export Excel</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
