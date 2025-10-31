"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Trash2, Edit2 } from "lucide-react"

export default function UserManagement() {
  const users = [
    {
      id: 1,
      name: "Sharma Residence",
      email: "sharma@example.com",
      role: "admin",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Patel House",
      email: "patel@example.com",
      role: "member",
      status: "active",
      joinDate: "2024-02-10",
    },
    {
      id: 3,
      name: "Kumar Villa",
      email: "kumar@example.com",
      role: "member",
      status: "active",
      joinDate: "2024-01-20",
    },
    {
      id: 4,
      name: "Singh Bungalow",
      email: "singh@example.com",
      role: "member",
      status: "inactive",
      joinDate: "2024-03-05",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">User Management</CardTitle>
          <CardDescription>Manage community members and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-semibold text-foreground">Name</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground hidden md:table-cell">Email</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground">Role</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-2 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground md:hidden">{user.email}</p>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{user.email}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {user.role === "admin" && <Shield className="w-3 h-3" />}
                        {user.role === "admin" ? "Admin" : "Member"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
