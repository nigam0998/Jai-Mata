"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import type { PayoutRequest } from "@/lib/auth-context"

interface PayoutRequestsSectionProps {
  requests: PayoutRequest[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export default function PayoutRequestsSection({ requests, onApprove, onReject }: PayoutRequestsSectionProps) {
  const pendingRequests = requests.filter((req) => req.status === "pending")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solar User Payout Requests</CardTitle>
        <CardDescription>Manage payout requests from solar community members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Requested Amount (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests && pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.userName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{request.userEmail}</TableCell>
                    <TableCell className="font-semibold">₹{request.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-yellow-300 bg-yellow-50 text-yellow-800">
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{request.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onApprove(request.id)}
                          className="gap-1 bg-green-50 text-green-700 hover:bg-green-100"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReject(request.id)}
                          className="gap-1 bg-red-50 text-red-700 hover:bg-red-100"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No pending payout requests
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
