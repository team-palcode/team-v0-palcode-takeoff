"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, Plus } from "lucide-react"

interface CampaignQuestionsProps {
  campaignData: any
  updateCampaignData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export default function CampaignQuestions({
  campaignData,
  updateCampaignData,
  onNext,
  onBack,
}: CampaignQuestionsProps) {
  // State for expanded trade sections
  const [expandedTrades, setExpandedTrades] = useState<string[]>(["electrical"])
  const [newQuestion, setNewQuestion] = useState("")

  // Toggle trade expansion
  const toggleTrade = (trade: string) => {
    setExpandedTrades((prev) => (prev.includes(trade) ? prev.filter((t) => t !== trade) : [...prev, trade]))
  }

  // Toggle question selection
  const toggleStandardQuestion = (id: number) => {
    const updatedQuestions = {
      ...campaignData.questions,
      standard: campaignData.questions.standard.map((q: any) => (q.id === id ? { ...q, selected: !q.selected } : q)),
    }
    updateCampaignData({ questions: updatedQuestions })
  }

  // Toggle trade question selection
  const toggleTradeQuestion = (trade: string, id: number) => {
    const updatedTradeQuestions = {
      ...campaignData.questions.trade,
      [trade]: campaignData.questions.trade[trade].map((q: any) => (q.id === id ? { ...q, selected: !q.selected } : q)),
    }

    const updatedQuestions = {
      ...campaignData.questions,
      trade: updatedTradeQuestions,
    }

    updateCampaignData({ questions: updatedQuestions })
  }

  // Toggle custom question selection
  const toggleCustomQuestion = (id: number) => {
    const updatedQuestions = {
      ...campaignData.questions,
      custom: campaignData.questions.custom.map((q: any) => (q.id === id ? { ...q, selected: !q.selected } : q)),
    }
    updateCampaignData({ questions: updatedQuestions })
  }

  // Add custom question
  const addCustomQuestion = () => {
    if (newQuestion.trim() === "") return

    const newId =
      Math.max(
        ...campaignData.questions.standard.map((q: any) => q.id),
        ...Object.values(campaignData.questions.trade).flatMap((qs: any) => qs.map((q: any) => q.id)),
        ...campaignData.questions.custom.map((q: any) => q.id),
        0,
      ) + 1

    const updatedQuestions = {
      ...campaignData.questions,
      custom: [...campaignData.questions.custom, { id: newId, text: newQuestion, selected: true }],
    }

    updateCampaignData({ questions: updatedQuestions })
    setNewQuestion("")
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

  // Get selected trades
  const selectedTrades = [
    { name: "Electrical", count: 3 },
    { name: "Plumbing", count: 2 },
    { name: "HVAC", count: 2 },
    { name: "Concrete", count: 2 },
    { name: "Drywall", count: 2 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left Side: Selected Trades */}
      <div className="md:col-span-1">
        <h3 className="text-lg font-medium mb-3">Selected Trades</h3>
        <div className="bg-gray-50 p-4 rounded-md border">
          <ul className="space-y-2">
            {selectedTrades.map((trade) => (
              <li key={trade.name} className="flex justify-between items-center">
                <span>{trade.name}</span>
                <span className="text-sm text-gray-500">({trade.count})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side: Question Selection */}
      <div className="md:col-span-3 space-y-6">
        {/* Standard Questions */}
        <div>
          <h3 className="text-lg font-medium mb-3">Standard Questions (All Trades)</h3>
          <div className="space-y-2">
            {campaignData.questions.standard.map((question: any) => (
              <div key={question.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-50">
                <Checkbox
                  id={`standard-${question.id}`}
                  checked={question.selected}
                  onCheckedChange={() => toggleStandardQuestion(question.id)}
                  className="mt-1"
                />
                <Label htmlFor={`standard-${question.id}`} className="text-sm cursor-pointer">
                  {question.text}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Trade Questions */}
        <div>
          <h3 className="text-lg font-medium mb-3">Trade Questions</h3>
          <div className="space-y-3">
            {/* Electrical */}
            <div className="border rounded-md overflow-hidden">
              <div
                className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleTrade("electrical")}
              >
                <h4 className="font-medium">Electrical</h4>
                {expandedTrades.includes("electrical") ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>

              {expandedTrades.includes("electrical") && (
                <div className="p-3 space-y-2">
                  {campaignData.questions.trade.electrical.map((question: any) => (
                    <div key={question.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-50">
                      <Checkbox
                        id={`electrical-${question.id}`}
                        checked={question.selected}
                        onCheckedChange={() => toggleTradeQuestion("electrical", question.id)}
                        className="mt-1"
                      />
                      <Label htmlFor={`electrical-${question.id}`} className="text-sm cursor-pointer">
                        {question.text}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plumbing */}
            <div className="border rounded-md overflow-hidden">
              <div
                className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleTrade("plumbing")}
              >
                <h4 className="font-medium">Plumbing</h4>
                {expandedTrades.includes("plumbing") ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>

              {expandedTrades.includes("plumbing") && (
                <div className="p-3 space-y-2">
                  {campaignData.questions.trade.plumbing.map((question: any) => (
                    <div key={question.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-50">
                      <Checkbox
                        id={`plumbing-${question.id}`}
                        checked={question.selected}
                        onCheckedChange={() => toggleTradeQuestion("plumbing", question.id)}
                        className="mt-1"
                      />
                      <Label htmlFor={`plumbing-${question.id}`} className="text-sm cursor-pointer">
                        {question.text}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* HVAC */}
            <div className="border rounded-md overflow-hidden">
              <div
                className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleTrade("hvac")}
              >
                <h4 className="font-medium">HVAC</h4>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
            </div>

            {/* Concrete */}
            <div className="border rounded-md overflow-hidden">
              <div
                className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleTrade("concrete")}
              >
                <h4 className="font-medium">Concrete</h4>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
            </div>

            {/* Drywall */}
            <div className="border rounded-md overflow-hidden">
              <div
                className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleTrade("drywall")}
              >
                <h4 className="font-medium">Drywall</h4>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Questions */}
        <div>
          <h3 className="text-lg font-medium mb-3">Custom Questions</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              {campaignData.questions.custom.map((question: any) => (
                <div key={question.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-50">
                  <Checkbox
                    id={`custom-${question.id}`}
                    checked={question.selected}
                    onCheckedChange={() => toggleCustomQuestion(question.id)}
                    className="mt-1"
                  />
                  <Label htmlFor={`custom-${question.id}`} className="text-sm cursor-pointer">
                    {question.text}
                  </Label>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="Add a custom question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addCustomQuestion}
                disabled={newQuestion.trim() === ""}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Question Count */}
        <div className="bg-gray-50 p-3 rounded-md border">
          <p className="text-sm">
            <span className="font-medium">{countSelectedQuestions()} questions selected</span> (recommended: 10-12)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="button" onClick={onNext}>
            Next →
          </Button>
        </div>
      </div>
    </div>
  )
}

