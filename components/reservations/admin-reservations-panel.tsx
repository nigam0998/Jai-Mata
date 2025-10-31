"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, AlertCircle, ChevronDown, ChevronUp, Zap, Calendar, User } from "lucide-react"
import { useState } from "react"

interface ReservationItemProps {
  reservation: any
  onApprove: (id: string, notes?: string) => void
  onReject: (id: string, reason: string) => void
}

function ReservationItem({ reservation, onApprove, onReject }: ReservationItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [input, setInput] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-foreground truncate">{reservation.stationName}</h3>
            <Badge variant="outline" className={getStatusColor(reservation.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(reservation.status)}
                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
              </span>
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
            <div>
              <p className="text-muted-foreground">User</p>
              <p className="font-medium">{reservation.userName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date & Time</p>
              <p className="font-medium">
                {reservation.requestedDate} {reservation.requestedTime}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">{reservation.durationMinutes} min</p>
            </div>
            <div>
              <p className="text-muted-foreground">Vehicle</p>
              <p className="font-medium">{reservation.vehicleModel}</p>
            </div>
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="p-1 hover:bg-background rounded-md transition-colors">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1 flex items-center gap-2">
                <User className="w-4 h-4" />
                User Email
              </p>
              <p className="font-medium">{reservation.userEmail}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Vehicle Reg.
              </p>
              <p className="font-medium">{reservation.vehicleRegNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created At
              </p>
              <p className="font-medium">{reservation.createdAt}</p>
            </div>
            {reservation.approvedAt && (
              <div>
                <p className="text-muted-foreground mb-1">Processed At</p>
                <p className="font-medium">{reservation.approvedAt}</p>
              </div>
            )}
          </div>

          {reservation.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Notes</p>
              <p className="text-sm bg-muted p-2 rounded-md">{reservation.notes}</p>
            </div>
          )}

          {reservation.reason && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Rejection Reason</p>
              <p className="text-sm bg-red-50 p-2 rounded-md text-red-800">{reservation.reason}</p>
            </div>
          )}

          {reservation.status === "pending" && !action && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setAction("approve")}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setAction("reject")}>
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          )}

          {action && (
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="block text-sm font-medium">
                {action === "approve" ? "Notes (optional)" : "Rejection Reason *"}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  action === "approve"
                    ? "e.g., Approved - sufficient power available"
                    : "e.g., Station under maintenance during requested time"
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                rows={2}
                required={action === "reject"}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className={
                    action === "approve"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }
                  onClick={() => {
                    if (action === "approve") {
                      onApprove(reservation.id, input)
                    } else if (action === "reject" && input.trim()) {
                      onReject(reservation.id, input)
                    }
                    setAction(null)
                    setInput("")
                  }}
                >
                  {action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setAction(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminReservationsPanel() {
  const {
    reservations,
    approveReservation,
    rejectReservation,
    getPendingReservations,
    stationAllocationRequests,
    approveStationAllocation,
    rejectStationAllocation,
  } = useAuth()

  const pendingReservations = getPendingReservations()
  const pendingAllocations = stationAllocationRequests.filter((r) => r.status === "pending")
  const approvedReservations = reservations.filter((r) => r.status === "approved")
  const approvedAllocations = stationAllocationRequests.filter((r) => r.status === "approved")
  const rejectedReservations = reservations.filter((r) => r.status === "rejected")
  const rejectedAllocations = stationAllocationRequests.filter((r) => r.status === "rejected")

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pendingReservations.length}</div>
            <p className="text-xs text-yellow-600 mt-1">Awaiting action</p>
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
            <p className="text-xs text-green-600 mt-1">Total approved</p>
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
            <p className="text-xs text-red-600 mt-1">Total rejected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Pending Allocations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pendingAllocations.length}</div>
            <p className="text-xs text-blue-600 mt-1">Station requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Station Allocation Requests */}
      {pendingAllocations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Pending Station Allocation Requests
            </CardTitle>
            <CardDescription>{pendingAllocations.length} request(s) awaiting action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingAllocations.map((request) => (
              <AllocationRequestItem
                key={request.id}
                request={request}
                onApprove={approveStationAllocation}
                onReject={rejectStationAllocation}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Approved Allocations */}
      {approvedAllocations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Approved Station Allocations
            </CardTitle>
            <CardDescription>{approvedAllocations.length} allocation(s) approved</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {approvedAllocations.map((request) => (
              <AllocationRequestItem
                key={request.id}
                request={request}
                onApprove={approveStationAllocation}
                onReject={rejectStationAllocation}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Rejected Allocations */}
      {rejectedAllocations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Rejected Station Allocations
            </CardTitle>
            <CardDescription>{rejectedAllocations.length} allocation(s) rejected</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rejectedAllocations.map((request) => (
              <AllocationRequestItem
                key={request.id}
                request={request}
                onApprove={approveStationAllocation}
                onReject={rejectStationAllocation}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Regular Reservations */}
      {pendingReservations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Pending Reservation Requests
            </CardTitle>
            <CardDescription>{pendingReservations.length} request(s) awaiting action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingReservations.map((reservation) => (
              <ReservationItem
                key={reservation.id}
                reservation={reservation}
                onApprove={approveReservation}
                onReject={rejectReservation}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {approvedReservations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Approved Reservations
            </CardTitle>
            <CardDescription>{approvedReservations.length} reservation(s) approved</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {approvedReservations.map((reservation) => (
              <ReservationItem
                key={reservation.id}
                reservation={reservation}
                onApprove={approveReservation}
                onReject={rejectReservation}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {rejectedReservations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Rejected Reservations
            </CardTitle>
            <CardDescription>{rejectedReservations.length} reservation(s) rejected</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rejectedReservations.map((reservation) => (
              <ReservationItem
                key={reservation.id}
                reservation={reservation}
                onApprove={approveReservation}
                onReject={rejectReservation}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {reservations.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No reservation requests yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AllocationRequestItem({ request, onApprove, onReject }: any) {
  const [expanded, setExpanded] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [input, setInput] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-foreground truncate">{request.stationName}</h3>
            <Badge variant="outline" className={getStatusColor(request.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(request.status)}
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
            <div>
              <p className="text-muted-foreground">User</p>
              <p className="font-medium">{request.userName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Vehicle</p>
              <p className="font-medium">{request.vehicleModel}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Reg Number</p>
              <p className="font-medium">{request.vehicleRegNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Requested</p>
              <p className="font-medium">{request.createdAt}</p>
            </div>
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="p-1 hover:bg-background rounded-md transition-colors">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">User Email</p>
              <p className="font-medium">{request.userEmail}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Station ID</p>
              <p className="font-medium">{request.stationId}</p>
            </div>
          </div>

          {request.reason && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Rejection Reason</p>
              <p className="text-sm bg-red-50 p-2 rounded-md text-red-800">{request.reason}</p>
            </div>
          )}

          {request.status === "pending" && !action && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setAction("approve")}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve Allocation
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setAction("reject")}>
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          )}

          {action && (
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="block text-sm font-medium">
                {action === "approve" ? "Notes (optional)" : "Rejection Reason *"}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  action === "approve"
                    ? "e.g., Allocation approved - Station available"
                    : "e.g., Station under maintenance"
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                rows={2}
                required={action === "reject"}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className={
                    action === "approve"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }
                  onClick={() => {
                    if (action === "approve") {
                      onApprove(request.id)
                    } else if (action === "reject" && input.trim()) {
                      onReject(request.id, input)
                    }
                    setAction(null)
                    setInput("")
                  }}
                >
                  {action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setAction(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
