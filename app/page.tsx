"use client"

import { useState } from "react"
import { Plus, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import ProjectGrid from "@/components/projects/project-grid"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"

export default function HomePage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <PageHeader title="Projects" backUrl={null} />
          <Button className="flex items-center gap-2" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search projects" className="pl-9" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <select className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Group By: None</option>
              <option value="status">Status</option>
              <option value="location">Location</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <ProjectGrid />
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  )
}
