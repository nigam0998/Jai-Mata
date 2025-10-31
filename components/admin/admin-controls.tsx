"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Download, RefreshCw, Lock } from "lucide-react"

export default function AdminControls() {
  return (
    <div className="space-y-6">
      {/* System Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">System Controls</CardTitle>
          <CardDescription>Administrative system management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start gap-2 h-auto py-3 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              <div className="text-left">
                <p className="font-medium text-sm">Restart System</p>
                <p className="text-xs text-muted-foreground">Restart all services</p>
              </div>
            </Button>

            <Button variant="outline" className="justify-start gap-2 h-auto py-3 bg-transparent">
              <Download className="w-4 h-4" />
              <div className="text-left">
                <p className="font-medium text-sm">Backup Database</p>
                <p className="text-xs text-muted-foreground">Create system backup</p>
              </div>
            </Button>

            <Button variant="outline" className="justify-start gap-2 h-auto py-3 bg-transparent">
              <Lock className="w-4 h-4" />
              <div className="text-left">
                <p className="font-medium text-sm">Security Audit</p>
                <p className="text-xs text-muted-foreground">Run security checks</p>
              </div>
            </Button>

            <Button variant="outline" className="justify-start gap-2 h-auto py-3 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              <div className="text-left">
                <p className="font-medium text-sm">Clear Cache</p>
                <p className="text-xs text-muted-foreground">Optimize performance</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Configuration</CardTitle>
          <CardDescription>System settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium text-sm text-foreground">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Disable user access temporarily</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium text-sm text-foreground">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Send alerts to admins</p>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium text-sm text-foreground">Auto Backup</p>
                <p className="text-xs text-muted-foreground">Daily automatic backups</p>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions - use with caution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="destructive" className="w-full justify-start gap-2">
            <AlertCircle className="w-4 h-4" />
            Reset All Data
          </Button>
          <p className="text-xs text-muted-foreground">
            This action cannot be undone. All data will be permanently deleted.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
