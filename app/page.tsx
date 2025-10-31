"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, Sun, TrendingUp, ArrowRight } from "lucide-react"
import { SolarShareLogo } from "@/components/logo"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to appropriate dashboard based on role
      if (user.role === "admin") {
        router.push("/admin-dashboard")
      } else if (user.role === "ev-owner") {
        router.push("/ev-charging-dashboard")
      } else {
        router.push("/user-dashboard")
      }
    }
  }, [user, isLoading])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <SolarShareLogo className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SolarShare</h1>
              <p className="text-sm text-muted-foreground">Community EV Charging Network</p>
            </div>
          </div>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90">Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Power Your Community with Solar
              </h2>
              <p className="text-xl text-muted-foreground">
                Join a network of homeowners sharing solar energy to charge electric vehicles. Earn passive income while
                reducing carbon emissions.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 border border-primary/20">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Sun className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Solar Generation</p>
                  <p className="text-sm text-muted-foreground">45.8 kWh today</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">EV Charging</p>
                  <p className="text-sm text-muted-foreground">32.5 kWh delivered</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Monthly Profit</p>
                  <p className="text-sm text-muted-foreground">₹12,450 shared</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <Sun className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Generate Solar Energy</h4>
              <p className="text-muted-foreground">
                Your residential solar panels generate clean energy. Any surplus is automatically pooled with your
                community.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Charge EVs Together</h4>
              <p className="text-muted-foreground">
                Community charging stations use the pooled solar energy to charge electric vehicles efficiently and
                sustainably.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-green-500/10 rounded-lg w-fit mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Earn Passive Income</h4>
              <p className="text-muted-foreground">
                Profits from EV charging are distributed fairly based on your energy contribution percentage.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-card border border-border rounded-xl p-12 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">4</p>
              <p className="text-muted-foreground">Active Communities</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">2.4</p>
              <p className="text-muted-foreground">Tons CO₂ Saved</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">₹12.4K</p>
              <p className="text-muted-foreground">Monthly Profit</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">71%</p>
              <p className="text-muted-foreground">System Efficiency</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-12 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Join the Solar Revolution?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start earning passive income while contributing to a sustainable future. Sign up today and become part of
            the SolarShare community.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Sign In or Create Account
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 SolarShare. Powering sustainable energy for India.</p>
        </div>
      </footer>
    </div>
  )
}
