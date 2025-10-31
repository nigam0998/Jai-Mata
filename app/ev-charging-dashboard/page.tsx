"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Zap, Clock, DollarSign, MapPin, Car, CheckCircle } from "lucide-react"
import { SolarShareLogo } from "@/components/logo"
import { ChargingSessionForm } from "@/components/charging/charging-session-form"
import { StationAllocationForm } from "@/components/charging/station-allocation-form"

export default function EVChargingDashboard() {
  const { user, logout, isLoading, getSessionsByUser, getUserPayments, getUserNotifications, markNotificationAsRead } =
    useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"request-station" | "start" | "history" | "payments">("request-station")

  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ev-owner")) {
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

  const handleDismissNotification = (notificationId: string) => {
    markNotificationAsRead(notificationId)
    setNotifications(notifications.filter((n) => n.id !== notificationId))
  }

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const userSessions = getSessionsByUser(user.id)
  const userPayments = getUserPayments(user.id)
  const completedPayments = userPayments.filter((p) => p.status === "completed")
  const totalSpent = completedPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalEnergy = completedPayments.reduce((sum, p) => sum + p.energyUsed, 0)

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
              <h1 className="text-2xl font-bold text-foreground">SolarShare EV</h1>
              <p className="text-sm text-muted-foreground">Charging Portal</p>
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
          <p className="text-muted-foreground">Charge your EV with solar energy and pay instantly</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                Total Energy Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalEnergy.toFixed(1)} kWh</div>
              <p className="text-xs text-muted-foreground mt-1">Across all sessions</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">₹{totalSpent}</div>
              <p className="text-xs text-green-600 mt-1">{completedPayments.length} payments</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {userSessions.filter((s) => s.status === "active").length}
              </div>
              <p className="text-xs text-orange-600 mt-1">Currently charging</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto">
          <Button
            variant={activeTab === "request-station" ? "default" : "ghost"}
            onClick={() => setActiveTab("request-station")}
            className={activeTab === "request-station" ? "bg-primary" : "bg-transparent"}
          >
            Request Station
          </Button>
          <Button
            variant={activeTab === "start" ? "default" : "ghost"}
            onClick={() => setActiveTab("start")}
            className={activeTab === "start" ? "bg-primary" : "bg-transparent"}
          >
            Start Charging
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            onClick={() => setActiveTab("history")}
            className={activeTab === "history" ? "bg-primary" : "bg-transparent"}
          >
            Session History
          </Button>
          <Button
            variant={activeTab === "payments" ? "default" : "ghost"}
            onClick={() => setActiveTab("payments")}
            className={activeTab === "payments" ? "bg-primary" : "bg-transparent"}
          >
            Payment History
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "request-station" && (
          <div className="space-y-6">
            <StationAllocationForm userId={user.id} userName={user.name} />
          </div>
        )}

        {activeTab === "start" && (
          <Card>
            <CardHeader>
              <CardTitle>Start a Charging Session</CardTitle>
              <CardDescription>Select a station and enter your vehicle details</CardDescription>
            </CardHeader>
            <CardContent>
              <ChargingSessionForm userId={user.id} userName={user.name} />
            </CardContent>
          </Card>
        )}

        {activeTab === "history" && (
          <Card>
            <CardHeader>
              <CardTitle>Charging Session History</CardTitle>
              <CardDescription>View all your past and current sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {userSessions.length === 0 ? (
                <p className="text-muted-foreground">No charging sessions yet</p>
              ) : (
                <div className="space-y-3">
                  {userSessions.map((session) => (
                    <div key={session.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Car className="w-4 h-4 text-primary" />
                            <p className="font-semibold text-foreground">{session.vehicleModel}</p>
                            <span className="text-xs text-muted-foreground">{session.vehicleRegNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-accent" />
                            <p className="text-sm text-muted-foreground">{session.stationName}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.startTime).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{session.energyUsed} kWh</p>
                          <p className="text-sm text-green-600">₹{session.totalAmount}</p>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                              session.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : session.status === "active"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "payments" && (
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all your payments and transaction details</CardDescription>
            </CardHeader>
            <CardContent>
              {userPayments.length === 0 ? (
                <p className="text-muted-foreground">No payments yet</p>
              ) : (
                <div className="space-y-3">
                  {userPayments.map((payment) => (
                    <div key={payment.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">Payment {payment.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Energy: {payment.energyUsed} kWh @ ₹{payment.rate}/kWh
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">₹{payment.amount}</p>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                              payment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
