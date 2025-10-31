"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

export default function AdminOverview({ stats, activities }) {
  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">System Status</CardTitle>
          <CardDescription>Real-time system health overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">All Systems Operational</p>
                <p className="text-xs text-green-700">Last checked: 2 minutes ago</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900">Database Connected</p>
                <p className="text-xs text-blue-700">8 active connections</p>
              </div>
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-orange-900">1 Alert Pending</p>
                <p className="text-xs text-orange-700">Station D maintenance</p>
              </div>
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-900">Last Backup</p>
                <p className="text-xs text-purple-700">{stats.lastBackup}</p>
              </div>
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Recent Activities</CardTitle>
          <CardDescription>Latest system events and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === "success"
                      ? "bg-green-500"
                      : activity.type === "warning"
                        ? "bg-orange-500"
                        : "bg-blue-500"
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user || activity.station || activity.amount || activity.version}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
