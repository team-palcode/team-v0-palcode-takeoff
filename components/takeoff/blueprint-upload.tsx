"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { LoadingOverlay } from "@/components/loading-overlay"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock project data
const projects = [
  { id: "88", name: "Airport Runway Expansion" },
  { id: "303", name: "Broadway Bridge Reconstruction" },
  { id: "1234", name: "Sandbox Test Project" },
  { id: "15", name: "Skyline Tower" },
  { id: "54", name: "Tech Campus Development" },
]

// Trade categories
const tradeCategories = [
  { id: "mechanical", name: "Mechanical" },
  { id: "electrical", name: "Electrical" },
  { id: "plumbing", name: "Plumbing" },
  { id: "fire", name: "Fire Protection" },
  { id: "structural", name: "Structural" },
]

export default function BlueprintUpload() {
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedTrade, setSelectedTrade] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles([...files, ...newFiles])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleBeginAnalysis = () => {
    setIsLoading(true)

    // Simulate loading time before navigation
    setTimeout(() => {
      window.location.href = "/takeoff/verification"
    }, 1500)
  }

  const isFormValid = selectedProject && selectedTrade && files.length > 0

  return (
    <>
      {isLoading && <LoadingOverlay message="Analyzing blueprints..." />}

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Project Selection */}
              <div>
                <Label htmlFor="project" className="text-base font-medium">
                  Select Project
                </Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.id} - {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trade Category */}
              <div>
                <Label className="text-base font-medium">Select Trade Category</Label>
                <RadioGroup
                  value={selectedTrade}
                  onValueChange={setSelectedTrade}
                  className="grid grid-cols-2 gap-4 mt-2"
                >
                  {tradeCategories.map((trade) => (
                    <div key={trade.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={trade.id} id={trade.id} />
                      <Label htmlFor={trade.id}>{trade.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* File Upload */}
              <div>
                <Label className="text-base font-medium">Upload Blueprints</Label>
                <div
                  className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-700">Drag and drop your blueprint files here</p>
                    <p className="text-sm text-gray-500 mt-1">Supported formats: PDF, DWG, DXF, PNG, JPG</p>
                    <span className="text-sm text-gray-500 mt-2">or</span>
                    <label className="mt-2 cursor-pointer">
                      <span className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block">
                        Browse Files
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div>
                  <Label className="text-base font-medium">Selected Files ({files.length})</Label>
                  <div className="mt-2 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center">
                          <FileUp className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                        </div>
                        <button onClick={() => handleRemoveFile(index)} className="text-gray-500 hover:text-red-500">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Status */}
              <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-center">
                  <p className="text-blue-700 font-medium mb-1">Ready to Analyze</p>
                  <p className="text-sm text-blue-600">
                    Your blueprints will be processed using AI to extract quantities
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <Button onClick={handleBeginAnalysis} disabled={!isFormValid || isLoading} className="px-6">
                  {isLoading ? (
                    <>
                      <LoadingSpinner className="mr-2" size={16} />
                      Processing...
                    </>
                  ) : (
                    "Begin Analysis"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
