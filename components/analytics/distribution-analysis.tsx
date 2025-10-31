"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface DistributionAnalysisProps {
  data: {
    totalProfit: number
    members: Array<{
      id: string
      name: string
      contribution: number
      monthlyProfit: number
    }>
  }
}

export default function DistributionAnalysis({ data }: DistributionAnalysisProps) {
  const chartData = data.members.map((member) => ({
    name: member.name.split(" ")[0],
    energyShare: member.contribution || 0,
    earnings: Math.round(member.monthlyProfit || 0),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy & Earnings Distribution</CardTitle>
        <CardDescription>Community member contributions and earnings</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
            <Legend />
            <Bar dataKey="energyShare" fill="var(--chart-1)" name="Contribution (%)" />
            <Bar dataKey="earnings" fill="var(--chart-2)" name="Monthly Profit (₹)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
