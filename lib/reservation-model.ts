// Reservation data model and types
export interface Reservation {
  id: string
  userId: string
  userName: string
  userEmail: string
  stationId: number
  stationName: string
  requestedDate: string
  requestedTime: string
  durationMinutes: number
  vehicleModel: string
  vehicleRegNumber: string
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled"
  reason?: string
  createdAt: string
  approvedAt?: string
  approvedBy?: string
  notes?: string
}

export interface ReservationRequest {
  stationId: number
  stationName: string
  requestedDate: string
  requestedTime: string
  durationMinutes: number
  vehicleModel: string
  vehicleRegNumber: string
}

// Mock data for demo
export const mockReservations: Reservation[] = [
  {
    id: "RES-001",
    userId: "user-001",
    userName: "Sharma Residence",
    userEmail: "sharma@example.com",
    stationId: 1,
    stationName: "Station A",
    requestedDate: "2025-11-05",
    requestedTime: "14:30",
    durationMinutes: 120,
    vehicleModel: "Tesla Model 3",
    vehicleRegNumber: "TM3-001",
    status: "approved",
    createdAt: "2025-10-31",
    approvedAt: "2025-10-31",
    approvedBy: "admin-001",
    notes: "Approved - sufficient power available",
  },
  {
    id: "RES-002",
    userId: "user-002",
    userName: "Patel House",
    userEmail: "patel@example.com",
    stationId: 2,
    stationName: "Station B",
    requestedDate: "2025-11-06",
    requestedTime: "10:00",
    durationMinutes: 90,
    vehicleModel: "Hyundai Kona",
    vehicleRegNumber: "HK-002",
    status: "pending",
    createdAt: "2025-10-30",
    notes: "Waiting for admin review",
  },
  {
    id: "RES-003",
    userId: "user-003",
    userName: "Kumar Villa",
    userEmail: "kumar@example.com",
    stationId: 3,
    stationName: "Station C",
    requestedDate: "2025-11-05",
    requestedTime: "16:00",
    durationMinutes: 120,
    vehicleModel: "BMW i4",
    vehicleRegNumber: "BMW-001",
    status: "rejected",
    reason: "Station under maintenance during requested time",
    createdAt: "2025-10-29",
    approvedAt: "2025-10-30",
    approvedBy: "admin-001",
  },
]
