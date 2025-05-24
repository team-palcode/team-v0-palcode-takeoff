"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Edit2, Trash2 } from "lucide-react"

// Sample rule data
const initialRules = [
  { id: 1, enabled: true, type: "Sub Qty vs. Internal Takeoff", threshold: "±15%", importance: "critical" },
  { id: 2, enabled: true, type: "Sub Bid vs. ICE (Internal Cost Estimate)", threshold: "±10%", importance: "warning" },
  { id: 3, enabled: true, type: "Sub Bid vs. Bid Average", threshold: "±20%", importance: "advisory" },
  { id: 4, enabled: false, type: "Unit Price vs. ICE", threshold: "±25%", importance: "warning" },
  { id: 5, enabled: true, type: "Labor Rate vs. Prevailing Wage", threshold: "±15%", importance: "critical" },
]

// Rule type options
const ruleTypeOptions = [
  { value: "qty-takeoff", label: "Sub Qty vs. Internal Takeoff" },
  { value: "bid-ice", label: "Sub Bid vs. ICE (Internal Cost Estimate)" },
  { value: "bid-average", label: "Sub Bid vs. Bid Average" },
  { value: "unit-price", label: "Unit Price vs. ICE" },
  { value: "labor-rate", label: "Labor Rate vs. Prevailing Wage" },
  { value: "overhead-markup", label: "Overhead & Markup %" },
  { value: "completion-time", label: "Completion Time" },
]

// Trade options
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

// Template options
const templateOptions = [
  { value: "default-electrical", label: "Default Electrical Rules" },
  { value: "default-plumbing", label: "Default Plumbing Rules" },
  { value: "default-hvac", label: "Default HVAC Rules" },
  { value: "custom-1", label: "Custom Template 1" },
  { value: "custom-2", label: "Custom Template 2" },
]

interface BidFlagSetupProps {
  onClose: () => void
}

export function BidFlagSetup({ onClose }: BidFlagSetupProps) {
  const [rules, setRules] = useState(initialRules)
  const [selectedTrade, setSelectedTrade] = useState("electrical")
  const [selectedTemplate, setSelectedTemplate] = useState("default-electrical")

  // New rule state
  const [newRuleType, setNewRuleType] = useState("")
  const [newRuleThreshold, setNewRuleThreshold] = useState("15")
  const [newRuleImportance, setNewRuleImportance] = useState("warning")

  // Toggle rule enabled state
  const toggleRuleEnabled = (id: number) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  // Delete rule
  const deleteRule = (id: number) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  // Add new rule
  const addRule = () => {
    if (!newRuleType) return

    const newRule = {
      id: Math.max(0, ...rules.map((r) => r.id)) + 1,
      enabled: true,
      type: ruleTypeOptions.find((option) => option.value === newRuleType)?.label || "",
      threshold: `±${newRuleThreshold}%`,
      importance: newRuleImportance,
    }

    setRules([...rules, newRule])
    setNewRuleType("")
    setNewRuleThreshold("15")
    setNewRuleImportance("warning")
  }

  // Get importance color
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical":
        return "bg-red-500"
      case "warning":
        return "bg-amber-400"
      case "advisory":
        return "bg-blue-500"
      default:
        return "bg-gray-400"
    }
  }

  // Get importance label
  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case "critical":
        return "CRITICAL"
      case "warning":
        return "WARNING"
      case "advisory":
        return "ADVISORY"
      default:
        return importance.toUpperCase()
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bid Flag Setup</h1>
        <div className="text-gray-700">
          <span className="font-medium">Project:</span> Highland Medical Center - Phase 2
        </div>
      </div>

      {/* Trade & Template Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center">
          <label className="mr-2 font-medium">Trade:</label>
          <Select value={selectedTrade} onValueChange={setSelectedTrade}>
            <SelectTrigger className="w-[180px]">
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

        <div className="flex items-center">
          <label className="mr-2 font-medium">Load Template:</label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline">Save As Template</Button>
      </div>

      {/* Rule Configuration Table */}
      <div className="mb-8 border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600 w-16">On/Off</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Rule Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 w-28">Threshold</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 w-28">Importance</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, index) => (
              <tr key={rule.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3">
                  <Switch checked={rule.enabled} onCheckedChange={() => toggleRuleEnabled(rule.id)} />
                </td>
                <td className="px-4 py-3">{rule.type}</td>
                <td className="px-4 py-3">{rule.threshold}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${getImportanceColor(rule.importance)}`}></div>
                    <span className="text-sm font-medium">{getImportanceLabel(rule.importance)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button className="text-gray-500 hover:text-blue-500">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="text-gray-500 hover:text-red-500" onClick={() => deleteRule(rule.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick-Add Rule */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div>
          <Select value={newRuleType} onValueChange={setNewRuleType}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Add Rule Type" />
            </SelectTrigger>
            <SelectContent>
              {ruleTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center">
          <label className="mr-2">Threshold %:</label>
          <Input
            type="number"
            value={newRuleThreshold}
            onChange={(e) => setNewRuleThreshold(e.target.value)}
            className="w-20"
          />
        </div>

        <div>
          <Select value={newRuleImportance} onValueChange={setNewRuleImportance}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Importance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">CRITICAL</SelectItem>
              <SelectItem value="warning">WARNING</SelectItem>
              <SelectItem value="advisory">ADVISORY</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={addRule} disabled={!newRuleType}>
          Add
        </Button>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            // Add save logic here
            onClose()
          }}
        >
          Save Rules
        </Button>
      </div>
    </div>
  )
}
