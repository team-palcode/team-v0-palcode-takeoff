"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

// Mock data for templates
const mockTemplates = [
  { id: 1, name: "General Contractor Evaluation", trade: "General" },
  { id: 2, name: "Electrical Subcontractor Assessment", trade: "Electrical" },
  { id: 3, name: "Plumbing Bid Evaluation", trade: "Plumbing" },
  { id: 4, name: "HVAC Contractor Scorecard", trade: "HVAC" },
]

// Mock data for projects
const mockProjects = [
  { id: 1, name: "Highland Medical Center - Phase 2" },
  { id: 2, name: "Riverfront Office Complex" },
  { id: 3, name: "Metro Transit Hub" },
  { id: 4, name: "University Science Building" },
]

// Mock data for subcontractors
const mockSubcontractors = [
  { id: 1, name: "Apex Construction", trade: "General" },
  { id: 2, name: "BuildRight Inc.", trade: "General" },
  { id: 3, name: "Quality Builders", trade: "General" },
]

// Mock data for criteria (based on selected template)
const mockCriteria = [
  {
    id: 1,
    name: "Project Understanding",
    description: "Demonstrated understanding of project requirements",
    category: "Technical Capability",
    weight: 15,
    score: 0,
  },
  {
    id: 2,
    name: "Technical Approach",
    description: "Methodology and approach to completing the work",
    category: "Technical Capability",
    weight: 20,
    score: 0,
  },
  {
    id: 3,
    name: "Past Performance",
    description: "Track record of similar projects",
    category: "Experience & Past Performance",
    weight: 15,
    score: 0,
  },
  {
    id: 4,
    name: "Financial Stability",
    description: "Financial health and stability of the company",
    category: "Financial Stability",
    weight: 10,
    score: 0,
  },
  {
    id: 5,
    name: "Schedule Compliance",
    description: "Ability to meet project timeline",
    category: "Schedule & Planning",
    weight: 15,
    score: 0,
  },
  {
    id: 6,
    name: "Safety Record",
    description: "Safety history and EMR rating",
    category: "Safety Record",
    weight: 10,
    score: 0,
  },
  {
    id: 7,
    name: "Quality Control",
    description: "Quality assurance processes",
    category: "Quality Control",
    weight: 15,
    score: 0,
  },
]

export default function EvaluateBidPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedSubcontractor, setSelectedSubcontractor] = useState("")
  const [criteria, setCriteria] = useState(mockCriteria)
  const [notes, setNotes] = useState("")

  // Calculate total score
  const totalScore = criteria.reduce((sum, criterion) => {
    return sum + (criterion.score * criterion.weight) / 100
  }, 0)

  // Handle score change
  const handleScoreChange = (id: number, score: number) => {
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, score: Math.max(0, Math.min(100, score)) } : c)))
  }

  // Group criteria by category
  const criteriaByCategory = criteria.reduce(
    (acc, criterion) => {
      if (!acc[criterion.category]) {
        acc[criterion.category] = []
      }
      acc[criterion.category].push(criterion)
      return acc
    },
    {} as Record<string, typeof criteria>,
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="Evaluate Bid" backUrl="/bidding/scorecard" backLabel="Back to Templates" />

      <div className="mt-6 space-y-6">
        {/* Selection Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation Template</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcontractor</label>
                <Select value={selectedSubcontractor} onValueChange={setSelectedSubcontractor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcontractor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSubcontractors.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id.toString()}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Form */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Evaluation Criteria</CardTitle>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{totalScore.toFixed(1)}</div>
              <div className="text-sm text-gray-500">/ 100</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress value={totalScore} className="h-2" />
            </div>

            {Object.entries(criteriaByCategory).map(([category, categoryCriteria]) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-medium mb-3">{category}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Criterion</TableHead>
                      <TableHead className="w-[300px]">Description</TableHead>
                      <TableHead className="w-[100px]">Weight</TableHead>
                      <TableHead className="w-[150px]">Score (0-100)</TableHead>
                      <TableHead className="w-[100px]">Weighted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryCriteria.map((criterion) => (
                      <TableRow key={criterion.id}>
                        <TableCell className="font-medium">{criterion.name}</TableCell>
                        <TableCell>{criterion.description}</TableCell>
                        <TableCell>{criterion.weight}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={criterion.score || ""}
                              onChange={(e) => handleScoreChange(criterion.id, Number.parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                            <div className="text-sm text-gray-500">/ 100</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {((criterion.score * criterion.weight) / 100).toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation Notes</label>
              <textarea
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter any additional notes or comments about this evaluation"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Score Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(criteriaByCategory).map(([category, categoryCriteria]) => {
                    const categoryWeight = categoryCriteria.reduce((sum, c) => sum + c.weight, 0)
                    const categoryScore = categoryCriteria.reduce((sum, c) => sum + (c.score * c.weight) / 100, 0)
                    return (
                      <div key={category} className="flex justify-between items-center">
                        <div className="text-sm">{category}</div>
                        <div className="text-sm font-medium">
                          {categoryScore.toFixed(1)} / {categoryWeight}
                        </div>
                      </div>
                    )
                  })}
                  <div className="pt-2 mt-2 border-t flex justify-between items-center">
                    <div className="font-medium">Total Score</div>
                    <div className="font-bold text-lg">{totalScore.toFixed(1)} / 100</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Rating</h3>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold mb-2">{totalScore.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">
                    {totalScore >= 90
                      ? "Excellent"
                      : totalScore >= 80
                        ? "Very Good"
                        : totalScore >= 70
                          ? "Good"
                          : totalScore >= 60
                            ? "Satisfactory"
                            : "Needs Improvement"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Save as Draft</Button>
          <Button>Complete Evaluation</Button>
        </div>
      </div>
    </div>
  )
}

