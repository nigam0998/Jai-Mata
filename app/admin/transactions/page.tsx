"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, DollarSign, Zap, Users, TrendingUp } from "lucide-react"
import { SolarShareLogo } from "@/components/logo"
import { AdminTransactionsList } from "@/components/admin/admin-transactions-list"
import { PayoutDistribution } from "@/components/admin/payout-distribution"

export default function AdminTransactions() {
  const { user, logout, isLoading, payments } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const completedPayments = payments.filter((p) => p.status === "completed")
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalEnergyCharged = completedPayments.reduce((sum, p) => sum + p.energyUsed, 0)
  const transactionCount = completedPayments.length

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
              <h1 className="text-2xl font-bold text-foreground">SolarShare Admin</h1>
              <p className="text-sm text-muted-foreground">Transaction Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Payment Transactions</h2>
            <p className="text-muted-foreground">Monitor EV charging payments and distribute payouts</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/payout-requests">
              <Button variant="outline" className="bg-transparent">
                Payout Requests
              </Button>
            </Link>
            <Link href="/admin-dashboard">
              <Button variant="outline" className="bg-transparent">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Revenue KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">All completed transactions</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                Energy Charged
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalEnergyCharged.toFixed(1)} kWh</div>
              <p className="text-xs text-blue-600 mt-1">Total solar energy sold</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{transactionCount}</div>
              <p className="text-xs text-purple-600 mt-1">Completed payments</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                Avg Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                ₹{totalEnergyCharged > 0 ? (totalRevenue / totalEnergyCharged).toFixed(2) : 0}/kWh
              </div>
              <p className="text-xs text-orange-600 mt-1">Per kWh rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions and Payouts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdminTransactionsList payments={completedPayments} />
          </div>
          <div>
            <PayoutDistribution />
          </div>
        </div>
      </main>
    </div>
  )
}
