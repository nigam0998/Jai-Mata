import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SolarShare - Community EV Charging",
  description: "AI-Optimized Microgrid for EV Charging powered by residential solar surplus",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (typeof window !== "undefined") {
    window.addEventListener("unhandledrejection", (event) => {
      // Suppress MetaMask and other extension connection errors
      if (event.reason?.message?.includes("MetaMask") || event.reason?.message?.includes("Failed to connect")) {
        event.preventDefault()
      }
    })
  }

  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
