"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock data for dropdowns
const projectManagers = [
  { id: "1", name: "Sarah Johnson" },
  { id: "2", name: "Michael Chen" },
  { id: "3", name: "David Rodriguez" },
]

const leadEstimators = [
  { id: "1", name: "Jennifer Smith" },
  { id: "2", name: "Robert Taylor" },
  { id: "3", name: "Emily Davis" },
]

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  // Form state
  const [projectName, setProjectName] = useState("")
  const [projectType, setProjectType] = useState("")
  const [clientName, setClientName] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [location, setLocation] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [completionDate, setCompletionDate] = useState<Date>()
  const [budget, setBudget] = useState("")
  const [projectManager, setProjectManager] = useState("")
  const [leadEstimator, setLeadEstimator] = useState("")

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!projectName.trim()) newErrors.projectName = "Project name is required"
    if (!projectType) newErrors.projectType = "Project type is required"
    if (!clientName.trim()) newErrors.clientName = "Client name is required"

    if (contactEmail && !/^\S+@\S+\.\S+$/.test(contactEmail)) {
      newErrors.contactEmail = "Invalid email format"
    }

    if (contactPhone && !/^[0-9()\-\s+]*$/.test(contactPhone)) {
      newErrors.contactPhone = "Invalid phone format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Here you would typically submit the form data to your backend
      console.log({
        projectName,
        projectType,
        clientName,
        contactName,
        contactEmail,
        contactPhone,
        location,
        startDate,
        completionDate,
        budget,
        projectManager,
        leadEstimator,
      })

      // Close the dialog and reset form
      onOpenChange(false)
      resetForm()
    }
  }

  const resetForm = () => {
    setProjectName("")
    setProjectType("")
    setClientName("")
    setContactName("")
    setContactEmail("")
    setContactPhone("")
    setLocation("")
    setStartDate(undefined)
    setCompletionDate(undefined)
    setBudget("")
    setProjectManager("")
    setLeadEstimator("")
    setErrors({})
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Project Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectName" className="text-base font-medium">
                Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={cn(errors.projectName && "border-red-500")}
              />
              {errors.projectName && <p className="text-sm text-red-500 mt-1">{errors.projectName}</p>}
            </div>

            <div>
              <Label htmlFor="projectType" className="text-base font-medium">
                Project Type <span className="text-red-500">*</span>
              </Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger className={cn(errors.projectType && "border-red-500")}>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                </SelectContent>
              </Select>
              {errors.projectType && <p className="text-sm text-red-500 mt-1">{errors.projectType}</p>}
            </div>
          </div>

          {/* Client Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">Client Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientName" className="text-base font-medium">
                  Client Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={cn(errors.clientName && "border-red-500")}
                />
                {errors.clientName && <p className="text-sm text-red-500 mt-1">{errors.clientName}</p>}
              </div>

              <div>
                <Label htmlFor="contactName" className="text-base font-medium">
                  Contact Name
                </Label>
                <Input id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="contactEmail" className="text-base font-medium">
                  Contact Email
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={cn(errors.contactEmail && "border-red-500")}
                />
                {errors.contactEmail && <p className="text-sm text-red-500 mt-1">{errors.contactEmail}</p>}
              </div>

              <div>
                <Label htmlFor="contactPhone" className="text-base font-medium">
                  Contact Phone
                </Label>
                <Input
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={cn(errors.contactPhone && "border-red-500")}
                />
                {errors.contactPhone && <p className="text-sm text-red-500 mt-1">{errors.contactPhone}</p>}
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h3 className="text-lg font-medium mb-3">Project Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-base font-medium">
                  Location/Address
                </Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-base font-medium">Expected Completion</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !completionDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {completionDate ? format(completionDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={completionDate}
                        onSelect={setCompletionDate}
                        initialFocus
                        disabled={(date) => (startDate ? date < startDate : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="budget" className="text-base font-medium">
                  Estimated Budget
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="budget"
                    value={budget}
                    onChange={(e) => {
                      // Only allow numbers and decimal points
                      const value = e.target.value.replace(/[^0-9.]/g, "")
                      setBudget(value)
                    }}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project Team */}
          <div>
            <h3 className="text-lg font-medium mb-3">Project Team</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectManager" className="text-base font-medium">
                  Project Manager
                </Label>
                <Select value={projectManager} onValueChange={setProjectManager}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectManagers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="leadEstimator" className="text-base font-medium">
                  Lead Estimator
                </Label>
                <Select value={leadEstimator} onValueChange={setLeadEstimator}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead estimator" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadEstimators.map((estimator) => (
                      <SelectItem key={estimator.id} value={estimator.id}>
                        {estimator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
