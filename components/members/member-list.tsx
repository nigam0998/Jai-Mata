"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Eye, Mail, Phone } from "lucide-react"

export default function MemberList({ members, onViewDetails, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">All Members</h2>
        <div className="text-sm text-muted-foreground">{members.length} total members</div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <div className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {member.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Solar Capacity</p>
                      <p className="font-semibold text-foreground">{member.solarCapacity} kW</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Generated</p>
                      <p className="font-semibold text-primary">{member.solarGenerated} kWh</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contribution</p>
                      <p className="font-semibold text-accent">{member.contribution}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly Profit</p>
                      <p className="font-semibold text-green-600">₹{member.profit.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        member.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {member.status === "active" ? "Active" : "Inactive"}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        member.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {member.role === "admin" ? "Admin" : "Member"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onViewDetails(member)} className="gap-1">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEdit(member)} className="gap-1">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm(`Delete ${member.name}?`)) {
                        onDelete(member.id)
                      }
                    }}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
