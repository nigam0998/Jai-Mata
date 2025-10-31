"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SystemMonitoring({ metrics }) {
  const getHealthColor = (value: number) => {
    if (value < 50) return "bg-green-500"
    if (value < 75) return "bg-yellow-500"
    return "bg-red-500"
  }

  const monitoringItems = [
    { label: "CPU Usage", value: metrics.cpuUsage, unit: "%" },
    { label: "Memory Usage", value: metrics.memoryUsage, unit: "%" },
    { label: "Storage Usage", value: metrics.storageUsage, unit: "%" },
    { label: "Network Latency", value: metrics.networkLatency, unit: "ms" },
    { label: "DB Connections", value: metrics.databaseConnections, unit: "" },
    { label: "Active Users", value: metrics.activeUsers, unit: "" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">System Metrics</CardTitle>
          <CardDescription>Real-time system performance monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {monitoringItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-sm font-bold text-foreground">
                    {item.value}
                    {item.unit}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getHealthColor(item.value)}`}
                    style={{ width: `${Math.min(item.value, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Performance Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-900">Memory Usage High</p>
            <p className="text-xs text-yellow-700 mt-1">Memory usage at 62%. Consider optimizing or scaling.</p>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900">All Other Metrics Normal</p>
            <p className="text-xs text-green-700 mt-1">
              CPU, storage, and network performance within acceptable ranges.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
