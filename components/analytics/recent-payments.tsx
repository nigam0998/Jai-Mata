"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CreditCard } from "lucide-react"

export default function RecentPayments({ transactions }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <CardTitle>Recent EV Charging Payments</CardTitle>
            <CardDescription>Payments received from EV owners</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>EV Owner</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Energy Used</TableHead>
                <TableHead>Amount (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions && transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{transaction.userName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{transaction.userEmail}</TableCell>
                    <TableCell>{transaction.energyUsed} kWh</TableCell>
                    <TableCell className="font-semibold">₹{transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {transaction.status === "completed" ? "Completed" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{transaction.createdAt}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No payments received yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
