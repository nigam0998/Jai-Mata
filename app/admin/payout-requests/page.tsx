"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, CheckCircle, XCircle } from "lucide-react"
import { SolarShareLogo } from "@/components/logo"

interface PayoutRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  amount: number
  status: "pending" | "approved" | "rejected"
  createdAt: string
  approvedAt?: string
}

export default function AdminPayoutRequestsPage() {
  const { user, logout, isLoading, getPayoutRequests, approvePayoutRequest, rejectPayoutRequest } = useAuth()
  const router = useRouter()
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    setPayoutRequests(getPayoutRequests())
  }, [getPayoutRequests])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleApprovePayoutRequest = (id: string) => {
    approvePayoutRequest(id)
    setPayoutRequests(getPayoutRequests())
  }

  const handleRejectPayoutRequest = (id: string) => {
    rejectPayoutRequest(id)
    setPayoutRequests(getPayoutRequests())
  }

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const pendingRequests = payoutRequests.filter((r) => r.status === "pending")
  const approvedRequests = payoutRequests.filter((r) => r.status === "approved")
  const totalPendingAmount = pendingRequests.reduce((sum, r) => sum + r.amount, 0)

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
              <p className="text-sm text-muted-foreground">Payout Requests</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Payout Requests Management</h2>
          <p className="text-muted-foreground">Review and approve/reject solar user payout requests</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">₹{totalPendingAmount}</div>
              <p className="text-xs text-muted-foreground mt-1">To be distributed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{approvedRequests.length}</div>
              <p className="text-xs text-green-600 mt-1">Processed</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pending Payout Requests</CardTitle>
            <CardDescription>Review and take action on pending requests</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending requests</p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{request.userName}</p>
                        <p className="text-sm text-muted-foreground">{request.userEmail}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Request ID: {request.id} • {request.createdAt}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">₹{request.amount}</p>
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full mt-2">
                          Pending
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-border">
                      <Button
                        onClick={() => handleApprovePayoutRequest(request.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve & Send
                      </Button>
                      <Button
                        onClick={() => handleRejectPayoutRequest(request.id)}
                        variant="outline"
                        className="flex-1 bg-transparent border-red-200 text-red-600 hover:bg-red-50 gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approved Requests */}
        {approvedRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Approved Requests</CardTitle>
              <CardDescription>Recently approved and processed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {approvedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{request.userName}</p>
                      <p className="text-sm text-muted-foreground">{request.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{request.amount}</p>
                      <p className="text-xs text-green-700">Approved on {request.approvedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
