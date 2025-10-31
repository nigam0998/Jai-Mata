export interface ChargingSession {
  id: string
  userId: string
  userName: string
  stationId: string
  stationName: string
  vehicleModel: string
  vehicleRegNumber: string
  startTime: string
  endTime?: string
  energyUsed: number // in kWh
  rate: number // per kWh in rupees
  totalAmount: number
  status: "active" | "completed" | "cancelled"
  createdAt: string
}

export interface Payment {
  id: string
  sessionId: string
  userId: string
  userName: string
  userEmail: string
  amount: number
  energyUsed: number
  rate: number
  paymentMethod: "qr" | "upi" | "card"
  qrCode?: string
  status: "pending" | "completed" | "failed"
  completedAt?: string
  createdAt: string
}

export interface PayoutRecord {
  id: string
  userId: string
  userName: string
  totalEnergyShared: number // in kWh
  sharePercentage: number
  payoutAmount: number
  status: "pending" | "completed" | "failed"
  processedAt?: string
  createdAt: string
}

// Mock data for testing
export const mockChargingSessions: ChargingSession[] = [
  {
    id: "CS-001",
    userId: "ev-user-001",
    userName: "John Doe",
    stationId: "STATION-01",
    stationName: "Central Hub Station",
    vehicleModel: "Tesla Model 3",
    vehicleRegNumber: "KA-01-AB-1234",
    startTime: "2025-01-15T09:30:00",
    endTime: "2025-01-15T10:15:00",
    energyUsed: 8.5,
    rate: 12,
    totalAmount: 102,
    status: "completed",
    createdAt: "2025-01-15T09:30:00",
  },
]

export const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    sessionId: "CS-001",
    userId: "ev-user-001",
    userName: "John Doe",
    userEmail: "john@example.com",
    amount: 102,
    energyUsed: 8.5,
    rate: 12,
    paymentMethod: "qr",
    qrCode:
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="white" width="200" height="200"/%3E%3Crect x="10" y="10" width="30" height="30" fill="black"/%3E%3C/svg%3E',
    status: "completed",
    completedAt: "2025-01-15T10:15:00",
    createdAt: "2025-01-15T10:15:00",
  },
]

export interface AdminTransaction {
  paymentId: string
  sessionId: string
  userId: string
  userName: string
  energyUsed: number
  amount: number
  status: "completed" | "pending"
  createdAt: string
  completedAt?: string
}

export interface Payout {
  id: string
  userId: string
  userName: string
  userEmail: string
  userAddress: string
  energyContributed: number
  contributionPercentage: number
  totalAmount: number
  status: "pending" | "processed"
  processedAt?: string
  createdAt: string
}
