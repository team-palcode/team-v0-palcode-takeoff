"use client"

import { Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"

// Mock project data
const projects = [
  {
    id: "88",
    name: "Airport Runway Expansion",
    location: {
      city: "texas",
      state: "American Samoa",
      country: "United States",
    },
    status: "ACTIVE",
    type: "Course of Construction",
    image: null,
  },
  {
    id: "303",
    name: "Broadway Bridge Reconstruction",
    location: {
      city: "us",
      state: "",
      country: "United States",
    },
    status: "ACTIVE",
    type: "Course of Construction",
    image: null,
  },
  {
    id: "1234",
    name: "Skyline Tower",
    location: {
      city: "Carpinteria",
      state: "California",
      country: "United States",
    },
    status: "ACTIVE",
    type: "",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "15",
    name: "Skyline Tower",
    location: {
      city: "#street 3 indiana",
      state: "Alaska",
      country: "United States",
    },
    status: "ACTIVE",
    type: "Course of Construction",
    image: null,
  },
  {
    id: "54",
    name: "Tech Campus Development",
    location: {
      city: "",
      state: "",
      country: "United States",
    },
    status: "ACTIVE",
    type: "",
    image: null,
  },
]

export default function ProjectGrid() {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Displaying 1 - {projects.length} of {projects.length}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                {project.image ? (
                  <div className="h-48 bg-gray-100">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                      {project.id} - {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {[project.location.city, project.location.state, project.location.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                    {project.status}
                  </Badge>
                </div>
                {project.type && <p className="text-sm text-gray-600">{project.type}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

