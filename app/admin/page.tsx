"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Zap, Settings, LogOut } from "lucide-react"
import AdminOverview from "@/components/admin/admin-overview"
import SystemMonitoring from "@/components/admin/system-monitoring"
import AdminControls from "@/components/admin/admin-controls"
import UserManagement from "@/components/admin/user-management"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const adminStats = {
    totalUsers: 4,
    activeMembers: 4,
    totalStations: 4,
    systemHealth: 98,
    uptime: "99.8%",
    lastBackup: "2 hours ago",
    alerts: 1,
    warnings: 3,
  }

  const systemMetrics = {
    cpuUsage: 35,
    memoryUsage: 62,
    storageUsage: 48,
    networkLatency: 12,
    databaseConnections: 8,
    activeUsers: 4,
  }

  const recentActivities = [
    { id: 1, action: "Member Added", user: "Sharma Residence", time: "2 hours ago", type: "success" },
    { id: 2, action: "Station Maintenance", station: "Station D", time: "4 hours ago", type: "warning" },
    { id: 3, action: "Profit Distribution", amount: "₹12,450", time: "1 day ago", type: "success" },
    { id: 4, action: "System Update", version: "v2.1.0", time: "2 days ago", type: "info" },
  ]

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "monitoring", label: "Monitoring", icon: Zap },
    { id: "users", label: "Users", icon: Users },
    { id: "controls", label: "Controls", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-xs md:text-sm text-muted-foreground">System management & monitoring</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1 hidden md:flex bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Desktop Tab Navigation */}
          <div className="hidden md:flex gap-2 border-t border-border pt-4 -mx-4 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Quick Stats - Mobile Optimized */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card>
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-foreground">{adminStats.totalUsers}</div>
              <p className="text-xs text-green-600 mt-1">{adminStats.activeMembers} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Stations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-foreground">{adminStats.totalStations}</div>
              <p className="text-xs text-blue-600 mt-1">All operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-foreground">{adminStats.systemHealth}%</div>
              <p className="text-xs text-green-600 mt-1">Uptime: {adminStats.uptime}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-foreground">{adminStats.alerts}</div>
              <p className="text-xs text-orange-600 mt-1">{adminStats.warnings} warnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && <AdminOverview stats={adminStats} activities={recentActivities} />}
        {activeTab === "monitoring" && <SystemMonitoring metrics={systemMetrics} />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "controls" && <AdminControls />}
      </main>
    </div>
  )
}
