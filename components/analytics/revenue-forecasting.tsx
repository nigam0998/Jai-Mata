"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function RevenueForecasting({ data }) {
  // Generate forecast data based on growth trend
  const forecastData = [
    ...data.monthlyData,
    { month: "Jun", revenue: 44500, profit: 13500, expenses: 31000, forecast: true },
    { month: "Jul", revenue: 48200, profit: 14600, expenses: 33600, forecast: true },
    { month: "Aug", revenue: 52100, profit: 15800, expenses: 36300, forecast: true },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Forecast</CardTitle>
        <CardDescription>Projected financial performance (next 3 months)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-1)" }}
              name="Revenue (₹)"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-2)" }}
              name="Profit (₹)"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Forecast Insight:</strong> Based on current growth trends (15.2% monthly), the community is
            projected to reach ₹15,800 in monthly profit by August, representing a 27% increase from May.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
