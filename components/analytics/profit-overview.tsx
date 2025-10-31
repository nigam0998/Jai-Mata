"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function ProfitOverview({ data, timeRange }) {
  const getChartData = () => {
    switch (timeRange) {
      case "week":
        return data.weeklyData || data.monthlyData.slice(-1)
      case "month":
        return data.monthlyData || []
      case "quarter":
        return data.monthlyData?.slice(-3) || []
      case "year":
        return data.monthlyData || []
      default:
        return data.monthlyData || []
    }
  }

  const chartData = getChartData()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Profit Trend</CardTitle>
          <CardDescription>
            {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} financial performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey={timeRange === "week" ? "week" : "month"} stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
              <Legend />
              <Bar dataKey="revenue" fill="var(--chart-1)" name="Revenue (₹)" />
              <Bar dataKey="profit" fill="var(--chart-2)" name="Profit (₹)" />
              <Bar dataKey="expenses" fill="var(--chart-3)" name="Expenses (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profit Growth Trajectory</CardTitle>
          <CardDescription>Cumulative profit over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey={timeRange === "week" ? "week" : "month"} stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="var(--chart-1)"
                strokeWidth={3}
                dot={{ fill: "var(--chart-1)", r: 5 }}
                name="Monthly Profit (₹)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
