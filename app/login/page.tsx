"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Zap } from "lucide-react"
import { SolarShareLogo } from "@/components/logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const fillAdminCredentials = () => {
    setEmail("admin@solargrid.com")
    setPassword("demo123")
  }

  const fillUserCredentials = () => {
    setEmail("user@solargrid.com")
    setPassword("demo123")
  }

  const fillEVOwnerCredentials = () => {
    setEmail("owner@solargrid.com")
    setPassword("demo123")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-primary rounded-lg">
            <SolarShareLogo className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SolarShare</h1>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your SolarShare account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials Section */}
            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-sm font-semibold text-foreground">Demo Credentials</p>

              {/* EV Owner Account - Highlighted */}
              <div className="space-y-2 p-3 bg-accent/10 border border-accent/30 rounded-lg">
                <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-3 h-3 text-accent" />
                  EV Owner Account (Charge Your Vehicle):
                </p>
                <div className="bg-background rounded-lg p-2 space-y-1">
                  <p className="text-xs text-foreground">
                    <span className="font-semibold">Email:</span> owner@solargrid.com
                  </p>
                  <p className="text-xs text-foreground">
                    <span className="font-semibold">Password:</span> demo123
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="w-full bg-accent hover:bg-accent/90"
                  onClick={fillEVOwnerCredentials}
                  disabled={isLoading}
                >
                  Use EV Owner Demo
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Admin Account:</p>
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <p className="text-xs text-foreground">
                    <span className="font-semibold">Email:</span> admin@solargrid.com
                  </p>
                  <p className="text-xs text-foreground">
                    <span className="font-semibold">Password:</span> demo123
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={fillAdminCredentials}
                  disabled={isLoading}
                >
                  Use Admin Demo
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Solar User Account:</p>
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <p className="text-xs text-foreground">
                    <span className="font-semibold">Email:</span> user@solargrid.com
                  </p>
                  <p className="text-xs text-foreground">
                    <span className="font-semibold">Password:</span> demo123
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={fillUserCredentials}
                  disabled={isLoading}
                >
                  Use Solar User Demo
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <Link href="/" className="text-primary hover:underline">
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
