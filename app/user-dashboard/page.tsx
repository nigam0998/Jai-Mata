"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Sun, Zap, TrendingUp, Home, Clock, CheckCircle, XCircle } from "lucide-react"
import { SolarShareLogo } from "@/components/logo"

export default function UserDashboard() {
  const {
    user,
    logout,
    isLoading,
    getUserReservations,
    requestPayoutFromAdmin,
    getUserNotifications,
    markNotificationAsRead,
  } = useAuth()
  const router = useRouter()
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "user")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      const userNots = getUserNotifications(user.id)
      setNotifications(userNots)
    }
  }, [user, getUserNotifications])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleRequestPayout = () => {
    requestPayoutFromAdmin(user.id, 3390)
    setShowPayoutModal(true)
    setTimeout(() => setShowPayoutModal(false), 3000)
  }

  const handleDismissNotification = (notificationId: string) => {
    markNotificationAsRead(notificationId)
    setNotifications(notifications.filter((n) => n.id !== notificationId))
  }

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const userReservations = getUserReservations(user.id)
  const pendingReservations = userReservations.filter((r) => r.status === "pending")
  const approvedReservations = userReservations.filter((r) => r.status === "approved")
  const rejectedReservations = userReservations.filter((r) => r.status === "rejected")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {notifications.length > 0 && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 bg-green-100 border border-green-300 rounded-lg p-4 mb-2"
              >
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900">{notification.title}</h3>
                  <p className="text-sm text-green-800">{notification.message}</p>
                </div>
                <button
                  onClick={() => handleDismissNotification(notification.id)}
                  className="text-green-600 hover:text-green-900"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <SolarShareLogo className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SolarShare</h1>
              <p className="text-sm text-muted-foreground">User Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome, {user.name}!</h2>
          <p className="text-muted-foreground">Monitor your solar generation and earnings in real-time</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Sun className="w-4 h-4 text-accent" />
                Your Solar Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{user.solarCapacity} kW</div>
              <p className="text-xs text-green-600 mt-1">Installed capacity</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                Today's Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">12.5 kWh</div>
              <p className="text-xs text-blue-600 mt-1">↑ 8% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                This Month Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">₹3,390</div>
              <p className="text-xs text-orange-600 mt-1">27.3% contribution</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Home className="w-4 h-4 text-green-600" />
                Your Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold text-foreground truncate">{user.address}</div>
              <p className="text-xs text-green-600 mt-1">Active member</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{pendingReservations.length}</div>
              <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{approvedReservations.length}</div>
              <p className="text-xs text-green-600 mt-1">Ready to use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{rejectedReservations.length}</div>
              <p className="text-xs text-red-600 mt-1">Not approved</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Sun className="w-4 h-4" />
              View Home
            </Button>
          </Link>
          <Link href="/members">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Home className="w-4 h-4" />
              View All Members
            </Button>
          </Link>
          <Link href="/stations">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Zap className="w-4 h-4" />
              Reserve a Station
            </Button>
          </Link>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Contribution</CardTitle>
              <CardDescription>Energy contribution to the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Solar Generation Share</span>
                  <span className="text-sm font-bold text-primary">27.3%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: "27.3%" }}></div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Your solar panels contribute 27.3% of the total community energy generation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings</CardTitle>
              <CardDescription>Profit distribution breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Community Profit</span>
                <span className="font-bold text-foreground">₹12,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Your Share (27.3%)</span>
                <span className="font-bold text-primary text-lg">₹3,390</span>
              </div>
              <Button onClick={handleRequestPayout} className="w-full bg-primary hover:bg-primary/90 mt-4">
                Request Payout
              </Button>
            </CardContent>
          </Card>
        </div>

        {userReservations.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Reservations</CardTitle>
              <CardDescription>Recent station reservation requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userReservations.slice(0, 3).map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{reservation.stationName}</p>
                      <p className="text-sm text-muted-foreground">
                        {reservation.requestedDate} at {reservation.requestedTime}
                      </p>
                    </div>
                    <div className="text-right">
                      {reservation.status === "pending" && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Pending
                        </span>
                      )}
                      {reservation.status === "approved" && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Approved
                        </span>
                      )}
                      {reservation.status === "rejected" && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
          <Card className="w-96 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                <p className="text-lg font-semibold text-green-800">Payout Request Sent!</p>
                <p className="text-sm text-green-700">Admin will review and send the amount</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
