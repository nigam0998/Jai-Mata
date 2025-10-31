"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, CheckCircle } from "lucide-react"

export function PayoutDistribution() {
  const { createPayoutBatch, getPayoutRecords, completePayoutRecord } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [payoutsCreated, setPayoutsCreated] = useState(false)

  const payoutRecords = getPayoutRecords()

  // Mock community members data
  const communityMembers = [
    {
      id: "user-001",
      name: "Sharma Residence",
      energyContribution: 12.5,
      totalEnergy: 45.8,
    },
    {
      id: "user-002",
      name: "Patel House",
      energyContribution: 11.2,
      totalEnergy: 45.8,
    },
  ]

  const handleDistributePayout = async () => {
    setIsProcessing(true)

    // Simulate total revenue from transactions
    const totalRevenue = 1220 // ₹ from charging transactions

    // Calculate payouts based on energy contribution
    const payouts = communityMembers.map((member) => ({
      userId: member.id,
      userName: member.name,
      totalEnergyShared: member.energyContribution,
      sharePercentage: (member.energyContribution / member.totalEnergy) * 100,
      payoutAmount: Math.round((member.energyContribution / member.totalEnergy) * totalRevenue),
      status: "pending" as const,
    }))

    createPayoutBatch(payouts)
    setPayoutsCreated(true)
    setIsProcessing(false)
  }

  const handleConfirmPayout = (payoutId: string) => {
    completePayoutRecord(payoutId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout Distribution</CardTitle>
        <CardDescription>Distribute revenue to community members</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {payoutRecords.length === 0 && !payoutsCreated ? (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Ready to Distribute?</p>
              <p className="text-xs text-muted-foreground">
                Click below to calculate and create payouts based on community members' energy contributions.
              </p>
            </div>

            <Button
              onClick={handleDistributePayout}
              disabled={isProcessing}
              className="w-full bg-accent hover:bg-accent/90 h-12"
            >
              <Send className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Send Payouts"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {payoutRecords.map((payout) => (
              <div key={payout.id} className="p-3 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground text-sm">{payout.userName}</p>
                  <p className="font-bold text-green-600 text-sm">₹{payout.payoutAmount}</p>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Energy Shared: {payout.totalEnergyShared.toFixed(2)} kWh</p>
                  <p>Share: {payout.sharePercentage.toFixed(1)}%</p>
                </div>
                {payout.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => handleConfirmPayout(payout.id)}
                    className="w-full bg-green-600 hover:bg-green-700 h-8 text-xs"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Confirm Payout
                  </Button>
                )}
                {payout.status === "completed" && (
                  <div className="bg-green-50 dark:bg-green-950 rounded px-2 py-1 text-xs text-green-600 font-semibold">
                    ✓ Payout Sent
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
