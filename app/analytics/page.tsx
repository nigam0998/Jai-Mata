"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, BarChart3, DollarSign } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import ProfitOverview from "@/components/analytics/profit-overview"
import DistributionAnalysis from "@/components/analytics/distribution-analysis"
import MemberPayouts from "@/components/analytics/member-payouts"
import RevenueForecasting from "@/components/analytics/revenue-forecasting"
import RecentPayments from "@/components/analytics/recent-payments"
import PayoutRequestsSection from "@/components/analytics/payout-requests-section"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [selectedMetric, setSelectedMetric] = useState("all")
  const { getAdminTransactions, getPayoutRequests, approvePayoutRequest, rejectPayoutRequest } = useAuth()

  const transactions = getAdminTransactions()
  const payoutRequests = getPayoutRequests()

  // Mock data for analytics
  const analyticsData = {
    totalRevenue: 45230,
    totalProfit: 12450,
    profitMargin: 27.5,
    activeMembers: 4,
    averagePayout: 3112.5,
    growthRate: 15.2,
    monthlyData: [
      { month: "Jan", revenue: 28500, profit: 8200, expenses: 20300 },
      { month: "Feb", revenue: 31200, profit: 9500, expenses: 21700 },
      { month: "Mar", revenue: 35400, profit: 10800, expenses: 24600 },
      { month: "Apr", revenue: 36800, profit: 11200, expenses: 25600 },
      { month: "May", revenue: 40950, profit: 12450, expenses: 28500 },
    ],
    weeklyData: [
      { week: "W1", revenue: 8200, profit: 2100, charges: 12 },
      { week: "W2", revenue: 9100, profit: 2450, charges: 14 },
      { week: "W3", revenue: 10500, profit: 2800, charges: 16 },
      { week: "W4", revenue: 12150, profit: 3100, charges: 18 },
    ],
    members: [
      {
        id: 1,
        name: "Sharma Residence",
        contribution: 27.3,
        monthlyProfit: 3390,
        totalEarnings: 10170,
        solarGenerated: 12.5,
        evCharges: 8,
        efficiency: 94,
      },
      {
        id: 2,
        name: "Patel House",
        contribution: 24.5,
        monthlyProfit: 3045,
        totalEarnings: 9135,
        solarGenerated: 11.2,
        evCharges: 6,
        efficiency: 91,
      },
      {
        id: 3,
        name: "Kumar Villa",
        contribution: 28.6,
        monthlyProfit: 3555,
        totalEarnings: 10665,
        solarGenerated: 13.1,
        evCharges: 10,
        efficiency: 96,
      },
      {
        id: 4,
        name: "Singh Bungalow",
        contribution: 19.6,
        monthlyProfit: 2460,
        totalEarnings: 7380,
        solarGenerated: 9.0,
        evCharges: 3,
        efficiency: 88,
      },
    ],
    revenueStreams: [
      { source: "EV Charging", amount: 28500, percentage: 63 },
      { source: "Solar Export", amount: 12300, percentage: 27 },
      { source: "Grid Services", amount: 4430, percentage: 10 },
    ],
    expenses: [
      { category: "Maintenance", amount: 8500, percentage: 30 },
      { category: "Operations", amount: 12000, percentage: 42 },
      { category: "Infrastructure", amount: 8000, percentage: 28 },
    ],
  }

  const getStatsByTimeRange = () => {
    let revenue = 0
    let profit = 0
    let expenseTotal = 0

    if (timeRange === "week") {
      analyticsData.weeklyData.forEach((week) => {
        revenue += week.revenue
        profit += week.profit
      })
    } else if (timeRange === "month") {
      analyticsData.monthlyData.forEach((month) => {
        revenue += month.revenue
        profit += month.profit
        expenseTotal += month.expenses
      })
    } else if (timeRange === "quarter") {
      analyticsData.monthlyData.slice(-3).forEach((month) => {
        revenue += month.revenue
        profit += month.profit
        expenseTotal += month.expenses
      })
    } else if (timeRange === "year") {
      analyticsData.monthlyData.forEach((month) => {
        revenue += month.revenue
        profit += month.profit
        expenseTotal += month.expenses
      })
    }

    const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0
    const growthRate = ((profit / (revenue - profit)) * 100).toFixed(1)

    return {
      totalRevenue: revenue,
      totalProfit: profit,
      profitMargin: Number.parseFloat(profitMargin),
      growthRate: Number.parseFloat(growthRate),
    }
  }

  const dynamicStats = getStatsByTimeRange()

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${dynamicStats.totalRevenue.toLocaleString("en-IN")}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Profit",
      value: `₹${dynamicStats.totalProfit.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Profit Margin",
      value: `${dynamicStats.profitMargin}%`,
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Growth Rate",
      value: `+${dynamicStats.growthRate}%`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics & Profit Distribution</h1>
              <p className="text-sm text-muted-foreground">Financial insights and member payouts</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {["week", "month", "quarter", "year"].map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProfitOverview data={analyticsData} timeRange={timeRange} />
          </div>
          <div>
            <DistributionAnalysis data={analyticsData} />
          </div>
        </div>

        {/* Revenue Forecasting */}
        <div className="mb-8">
          <RevenueForecasting data={analyticsData} />
        </div>

        {/* Recent Payments Section */}
        <div className="mb-8">
          <RecentPayments transactions={transactions} />
        </div>

        {/* Payout Requests Section */}
        <div className="mb-8">
          <PayoutRequestsSection
            requests={payoutRequests}
            onApprove={approvePayoutRequest}
            onReject={rejectPayoutRequest}
          />
        </div>

        {/* Member Payouts */}
        <div>
          <MemberPayouts members={analyticsData.members} totalProfit={analyticsData.totalProfit} />
        </div>
      </main>
    </div>
  )
}
