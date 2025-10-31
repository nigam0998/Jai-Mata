"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, DollarSign } from "lucide-react"
import type { Payment } from "@/lib/charging-model"

interface AdminTransactionsListProps {
  payments: Payment[]
}

export function AdminTransactionsList({ payments }: AdminTransactionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>All EV charging payments received</CardDescription>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-primary/10 rounded">
                      <DollarSign className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{payment.userName}</p>
                      <p className="text-xs text-muted-foreground">{payment.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {payment.energyUsed} kWh
                    </span>
                    <span>@ ₹{payment.rate}/kWh</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(payment.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">₹{payment.amount}</p>
                  <Badge
                    className={`mt-2 ${
                      payment.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
