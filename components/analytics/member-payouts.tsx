"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Send } from "lucide-react"

export default function MemberPayouts({ members, totalProfit }) {
  const handleExportPayouts = () => {
    const csv = [
      [
        "Member Name",
        "Contribution %",
        "Monthly Profit",
        "Total Earnings",
        "Solar Generated",
        "EV Charges",
        "Efficiency",
      ],
      ...members.map((m) => [
        m.name,
        m.contribution,
        m.monthlyProfit,
        m.totalEarnings,
        m.solarGenerated,
        m.evCharges,
        m.efficiency,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "member-payouts.csv"
    a.click()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Member Profit Distribution</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleExportPayouts} className="gap-1 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1">
            <Send className="w-4 h-4" />
            Send Payouts
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-xs text-muted-foreground">Member ID: {member.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{member.monthlyProfit.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Contribution</p>
                  <p className="font-semibold text-foreground">{member.contribution}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                  <p className="font-semibold text-accent">₹{member.totalEarnings.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Solar Generated</p>
                  <p className="font-semibold text-foreground">{member.solarGenerated} kWh</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">EV Charges</p>
                  <p className="font-semibold text-foreground">{member.evCharges}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">System Efficiency</span>
                  <span className="text-sm font-semibold text-green-600">{member.efficiency}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${member.efficiency}%` }}></div>
                </div>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Distributed</p>
                <p className="text-xl font-bold text-primary">₹{totalProfit.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Average Payout</p>
                <p className="text-xl font-bold text-primary">
                  ₹{(totalProfit / members.length).toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Members</p>
                <p className="text-xl font-bold text-primary">{members.length}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
