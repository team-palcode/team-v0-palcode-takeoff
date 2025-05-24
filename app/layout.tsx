import type React from "react"
import { TopNavigation } from "@/components/navigation/top-nav"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <TopNavigation />
        <main>{children}</main>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
