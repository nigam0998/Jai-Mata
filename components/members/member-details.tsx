"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Mail, Phone, MapPin, Calendar, Zap, TrendingUp } from "lucide-react"

export default function MemberDetails({ member, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{member.name}</CardTitle>
              <CardDescription>Member ID: {member.id}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onEdit(member)} className="gap-1">
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (confirm(`Delete ${member.name}?`)) {
                    onDelete()
                  }
                }}
                className="gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-foreground">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold text-foreground">{member.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-semibold text-foreground">{member.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Join Date</p>
                <p className="font-semibold text-foreground">{member.joinDate}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full font-medium mt-1 ${
                    member.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {member.role === "admin" ? "Admin" : "Member"}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full font-medium mt-1 ${
                    member.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {member.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Solar Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Installed Capacity</p>
              <p className="text-2xl font-bold text-foreground">{member.solarCapacity} kW</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Energy Generated</p>
              <p className="text-2xl font-bold text-primary">{member.solarGenerated} kWh</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">EV Charges Provided</p>
              <p className="text-2xl font-bold text-accent">{member.evCharges}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Community Contribution</p>
              <p className="text-2xl font-bold text-foreground">{member.contribution}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Profit Share</p>
              <p className="text-2xl font-bold text-green-600">₹{member.profit.toLocaleString("en-IN")}</p>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">Cumulative Earnings</p>
              <p className="text-lg font-semibold text-foreground">₹{(member.profit * 3).toLocaleString("en-IN")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
