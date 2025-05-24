"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FileText, Hammer, FileCodeIcon as FileContract, Menu, X, Users, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

export function TopNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    {
      name: "Smart Takeoff",
      href: "/takeoff",
      icon: FileText,
    },
    {
      name: "Trade Research",
      href: "/bidding/subcontractor/progress",
      icon: Users,
    },
    {
      name: "Trade Outreach",
      href: "/bidding/subcontractor/voice-campaign",
      icon: Phone,
    },
    {
      name: "Bid Management",
      href: "/bidding",
      icon: Hammer,
    },
    {
      name: "Contracts",
      href: "/contracts",
      icon: FileContract,
    },
  ]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/takeoff">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Palcode%20Logo%20Black-02-Ys7QndwUKFrgEUvwpk50OACgUJKPZS.png"
                  alt="Palcode Logo"
                  width={140}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-blue-500 hover:border-blue-500 transition-colors"
                >
                  <item.icon className="mr-2 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("sm:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-500 hover:bg-gray-50"
            >
              <item.icon className="mr-3 h-5 w-5 text-gray-400" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

