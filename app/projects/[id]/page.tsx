"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Link from "next/link"

// Mock project data
const projectData = {
  id: "1234",
  name: "Skyline Tower",
  type: "Commercial",
  client: "Acme Development Corp",
  location: "123 Main Street, Austin, TX 78701",
  startDate: "03/15/2025",
  endDate: "09/30/2026",
  budget: "$4,250,000",
  projectManager: "Sarah Johnson",
  leadEstimator: "Michael Chen",
  takeoffStatus: {
    blueprintUpload: { status: "Complete", date: "03/10/2025" },
    quantityTakeoff: { status: "In Progress", date: "03/12/2025" },
    pricing: { status: "Not Started", date: null },
  },
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const projectId = params.id

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800 border border-green-200"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "Not Started":
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  // Handle upload blueprints action
  const handleUploadBlueprints = () => {
    router.push("/takeoff")
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <PageHeader title={`${projectData.name} (ID: ${projectId})`} backUrl="/" backLabel="Back to Projects" />
        <Button onClick={handleUploadBlueprints} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Blueprints
        </Button>
      </div>

      {/* Project Information Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Project Information</h2>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <tbody className="divide-y">
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700 w-1/3">Project Type</td>
                <td className="px-4 py-3">{projectData.type}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700">Client</td>
                <td className="px-4 py-3">{projectData.client}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">Location</td>
                <td className="px-4 py-3">{projectData.location}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700">Start Date</td>
                <td className="px-4 py-3">{projectData.startDate}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">End Date</td>
                <td className="px-4 py-3">{projectData.endDate}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700">Budget</td>
                <td className="px-4 py-3">{projectData.budget}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">Project Manager</td>
                <td className="px-4 py-3">{projectData.projectManager}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700">Lead Estimator</td>
                <td className="px-4 py-3">{projectData.leadEstimator}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Takeoff Status Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Takeoff Status</h2>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Stage</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3">Blueprint Upload</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(projectData.takeoffStatus.blueprintUpload.status)}`}
                  >
                    {projectData.takeoffStatus.blueprintUpload.status}
                  </span>
                </td>
                <td className="px-4 py-3">{projectData.takeoffStatus.blueprintUpload.date || "-"}</td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                    onClick={handleUploadBlueprints}
                  >
                    {projectData.takeoffStatus.blueprintUpload.status === "Complete" ? "View" : "Upload"}
                  </Button>
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3">Quantity Takeoff</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(projectData.takeoffStatus.quantityTakeoff.status)}`}
                  >
                    {projectData.takeoffStatus.quantityTakeoff.status}
                  </span>
                </td>
                <td className="px-4 py-3">{projectData.takeoffStatus.quantityTakeoff.date || "-"}</td>
                <td className="px-4 py-3">
                  {(projectData.takeoffStatus.blueprintUpload.status === "Complete" ||
                    projectData.takeoffStatus.quantityTakeoff.status === "In Progress") && (
                    <Link href="/takeoff/verification">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                      >
                        View
                      </Button>
                    </Link>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Pricing</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(projectData.takeoffStatus.pricing.status)}`}
                  >
                    {projectData.takeoffStatus.pricing.status}
                  </span>
                </td>
                <td className="px-4 py-3">{projectData.takeoffStatus.pricing.date || "-"}</td>
                <td className="px-4 py-3">
                  {projectData.takeoffStatus.quantityTakeoff.status === "Complete" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                    >
                      Start
                    </Button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

