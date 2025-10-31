"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus, Shield, Mail, TrendingUp } from "lucide-react"
import MemberForm from "@/components/members/member-form"
import MemberList from "@/components/members/member-list"
import MemberDetails from "@/components/members/member-details"

export default function MembersPage() {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Sharma Residence",
      email: "sharma@example.com",
      phone: "+91-9876543210",
      address: "123 Solar Lane, Bangalore",
      joinDate: "2024-01-15",
      role: "admin",
      status: "active",
      solarCapacity: 5.5,
      solarGenerated: 12.5,
      contribution: 27.3,
      profit: 3390,
      evCharges: 8,
    },
    {
      id: 2,
      name: "Patel House",
      email: "patel@example.com",
      phone: "+91-9876543211",
      address: "456 Green Street, Bangalore",
      joinDate: "2024-02-10",
      role: "member",
      status: "active",
      solarCapacity: 5.0,
      solarGenerated: 11.2,
      contribution: 24.5,
      profit: 3045,
      evCharges: 6,
    },
    {
      id: 3,
      name: "Kumar Villa",
      email: "kumar@example.com",
      phone: "+91-9876543212",
      address: "789 Energy Avenue, Bangalore",
      joinDate: "2024-01-20",
      role: "member",
      status: "active",
      solarCapacity: 6.0,
      solarGenerated: 13.1,
      contribution: 28.6,
      profit: 3555,
      evCharges: 10,
    },
    {
      id: 4,
      name: "Singh Bungalow",
      email: "singh@example.com",
      phone: "+91-9876543213",
      address: "321 Power Road, Bangalore",
      joinDate: "2024-03-05",
      role: "member",
      status: "inactive",
      solarCapacity: 4.5,
      solarGenerated: 9.0,
      contribution: 19.6,
      profit: 2460,
      evCharges: 3,
    },
  ])

  const [view, setView] = useState<"list" | "form" | "details">("list")
  const [selectedMember, setSelectedMember] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleAddMember = (newMember) => {
    const member = {
      ...newMember,
      id: Math.max(...members.map((m) => m.id), 0) + 1,
      joinDate: new Date().toISOString().split("T")[0],
      solarGenerated: 0,
      contribution: 0,
      profit: 0,
      evCharges: 0,
    }
    setMembers([...members, member])
    setView("list")
  }

  const handleEditMember = (updatedMember) => {
    setMembers(members.map((m) => (m.id === updatedMember.id ? updatedMember : m)))
    setView("list")
    setIsEditing(false)
  }

  const handleDeleteMember = (id) => {
    setMembers(members.filter((m) => m.id !== id))
    setView("list")
  }

  const handleViewDetails = (member) => {
    setSelectedMember(member)
    setView("details")
  }

  const handleEditClick = (member) => {
    setSelectedMember(member)
    setIsEditing(true)
    setView("form")
  }

  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter((m) => m.status === "active").length,
    totalCapacity: members.reduce((sum, m) => sum + m.solarCapacity, 0),
    totalGenerated: members.reduce((sum, m) => sum + m.solarGenerated, 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Member Management</h1>
              <p className="text-sm text-muted-foreground">Manage community members and permissions</p>
            </div>
          </div>
          {view === "list" && (
            <Button
              onClick={() => {
                setSelectedMember(null)
                setIsEditing(false)
                setView("form")
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          )}
          {view !== "list" && (
            <Button onClick={() => setView("list")} variant="outline">
              Back to List
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {view === "list" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Total Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.totalMembers}</div>
                <p className="text-xs text-green-600 mt-1">{stats.activeMembers} active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  Total Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.totalCapacity.toFixed(1)} kW</div>
                <p className="text-xs text-accent mt-1">{stats.totalGenerated.toFixed(1)} kWh generated</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  Admin Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {members.filter((m) => m.role === "admin").length}
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  {members.filter((m) => m.role === "member").length} regular members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-500" />
                  Pending Invites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">0</div>
                <p className="text-xs text-orange-600 mt-1">All members confirmed</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Views */}
        {view === "list" && (
          <MemberList
            members={members}
            onViewDetails={handleViewDetails}
            onEdit={handleEditClick}
            onDelete={handleDeleteMember}
          />
        )}
        {view === "form" && (
          <MemberForm
            member={isEditing ? selectedMember : null}
            onSubmit={isEditing ? handleEditMember : handleAddMember}
          />
        )}
        {view === "details" && selectedMember && (
          <MemberDetails
            member={selectedMember}
            onEdit={handleEditClick}
            onDelete={() => {
              handleDeleteMember(selectedMember.id)
              setView("list")
            }}
          />
        )}
      </main>
    </div>
  )
}
