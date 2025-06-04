"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp } from "lucide-react"

interface CampaignReviewProps {
  campaignData: any
  onBack: () => void
  onSaveDraft: () => void
  onLaunchCampaign: () => void
}

export default function CampaignReview({ campaignData, onBack, onSaveDraft, onLaunchCampaign }: CampaignReviewProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  // Count selected questions
  const countSelectedQuestions = () => {
    const standardCount = campaignData.questions.standard.filter((q: any) => q.selected).length
    const tradeCount = Object.values(campaignData.questions.trade).flatMap((qs: any) =>
      qs.filter((q: any) => q.selected),
    ).length
    const customCount = campaignData.questions.custom.filter((q: any) => q.selected).length

    return standardCount + tradeCount + customCount
  }

  // Get project name from ID
  const getProjectName = (id: string) => {
    const projects = [
      { id: "1", name: "Downtown Office Complex" },
      { id: "2", name: "Highland Medical Center" },
      { id: "3", name: "Riverfront Residential" },
      { id: "4", name: "Tech Campus Development" },
    ]

    return projects.find((p) => p.id === id)?.name || id
  }

  return (
    <div className="space-y-6">
      {/* Campaign Summary */}
      <div className="bg-gray-50 p-4 rounded-md border">
        <h3 className="text-lg font-medium mb-3">Campaign Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Campaign</p>
            <p className="font-medium">{campaignData.name || "Commercial Office Project - Downtown"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Project</p>
            <p className="font-medium">{getProjectName(campaignData.project) || "Downtown Office Complex"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Subcontractors</p>
            <p className="font-medium">27 (5 trades)</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Questions</p>
            <p className="font-medium">{countSelectedQuestions()}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-medium">Est. 2-3 days</p>
          </div>
        </div>
      </div>

      {/* Call Settings */}
      <div>
        <h3 className="text-lg font-medium mb-3">Call Settings</h3>
        <div className="bg-white p-4 rounded-md border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-500">Call Hours</Label>
              <p className="font-medium">9:00 AM - 4:00 PM</p>
            </div>
          </div>

          <div>
            <Label className="text-sm text-gray-500 mb-2 block">Days</Label>
            <div className="flex space-x-2">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <div
                  key={day}
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    campaignData.callSettings.days[index]
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm text-gray-500">Max Attempts</Label>
            <p className="font-medium">{campaignData.callSettings.maxAttempts}</p>
          </div>
        </div>
      </div>

      {/* Review Sections */}
      <div className="space-y-3">
        {/* Subcontractors */}
        <div className="border rounded-md overflow-hidden">
          <div
            className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection("subcontractors")}
          >
            <h4 className="font-medium">View Subcontractors (27)</h4>
            {expandedSections.includes("subcontractors") ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {expandedSections.includes("subcontractors") && (
            <div className="p-3">
              <div className="max-h-60 overflow-y-auto border rounded-md">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Trade</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i}>
                        <td className="px-4 py-2">Subcontractor {i}</td>
                        <td className="px-4 py-2">Electrical</td>
                        <td className="px-4 py-2">(555) 123-4567</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="border rounded-md overflow-hidden">
          <div
            className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection("questions")}
          >
            <h4 className="font-medium">View Questions (11)</h4>
            {expandedSections.includes("questions") ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {expandedSections.includes("questions") && (
            <div className="p-3">
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium mb-2">Standard Questions</h5>
                  <ul className="space-y-1 text-sm">
                    {campaignData.questions.standard
                      .filter((q: any) => q.selected)
                      .map((q: any) => (
                        <li key={q.id} className="p-2 bg-gray-50 rounded-md">
                          {q.text}
                        </li>
                      ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">Trade Questions</h5>
                  <ul className="space-y-1 text-sm">
                    {Object.entries(campaignData.questions.trade).flatMap(([trade, questions]: [string, any]) =>
                      questions
                        .filter((q: any) => q.selected)
                        .map((q: any) => (
                          <li key={q.id} className="p-2 bg-gray-50 rounded-md">
                            <span className="text-gray-500">[{trade}]</span> {q.text}
                          </li>
                        )),
                    )}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">Custom Questions</h5>
                  <ul className="space-y-1 text-sm">
                    {campaignData.questions.custom
                      .filter((q: any) => q.selected)
                      .map((q: any) => (
                        <li key={q.id} className="p-2 bg-gray-50 rounded-md">
                          {q.text}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="space-x-3">
          <Button type="button" variant="outline" onClick={onSaveDraft}>
            Save Draft
          </Button>
          <Button type="button" onClick={onLaunchCampaign}>
            Launch Campaign
          </Button>
        </div>
      </div>
    </div>
  )
}
