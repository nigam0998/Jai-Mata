"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Reservation, ReservationRequest } from "./reservation-model"
import { mockReservations } from "./reservation-model"
import type { ChargingSession, Payment, PayoutRecord, AdminTransaction, Payout } from "./charging-model"
import { mockChargingSessions, mockPayments } from "./charging-model"

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin" | "ev-owner"
  solarCapacity?: number
  address?: string
}

interface PayoutRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  amount: number
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

// Adding station allocation request interface
interface StationAllocationRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  stationId: string
  stationName: string
  vehicleModel: string
  vehicleRegNumber: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  approvedAt?: string
  reason?: string
}

interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "station-approved" | "payout-approved" | "payment-received"
  read: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  reservations: Reservation[]
  createReservation: (reservation: ReservationRequest) => void
  approveReservation: (id: string, notes?: string) => void
  rejectReservation: (id: string, reason: string) => void
  cancelReservation: (id: string) => void
  getUserReservations: (userId: string) => Reservation[]
  getPendingReservations: () => Reservation[]
  chargingSessions: ChargingSession[]
  payments: Payment[]
  payoutRecords: PayoutRecord[]
  createChargingSession: (session: Omit<ChargingSession, "id" | "createdAt">) => ChargingSession
  completeChargingSession: (sessionId: string, energyUsed: number) => void
  createPayment: (payment: Omit<Payment, "id" | "createdAt">) => Payment
  completePayment: (paymentId: string) => void
  getUserPayments: (userId: string) => Payment[]
  getSessionsByUser: (userId: string) => ChargingSession[]
  getTotalEnergyFromPayments: (userId: string) => number
  createPayoutBatch: (payouts: Omit<PayoutRecord, "id" | "createdAt">[]) => void
  getPayoutRecords: () => PayoutRecord[]
  completePayoutRecord: (payoutId: string) => void
  chargingSessionsOld: ChargingSession[]
  paymentsOld: Payment[]
  payouts: Payout[]
  startChargingSession: (session: Omit<ChargingSession, "id" | "status" | "createdAt">) => void
  completeChargingSessionOld: (sessionId: string, energyUsed: number) => void
  createPaymentForSession: (sessionId: string) => void
  getUserChargingSessions: (userId: string) => ChargingSession[]
  getCompletedSessions: () => ChargingSession[]
  getAdminTransactions: () => AdminTransaction[]
  processPayout: (payoutId: string) => void
  calculatePayouts: () => void
  payoutRequests: PayoutRequest[]
  requestPayoutFromAdmin: (userId: string, amount: number) => void
  getPayoutRequests: () => PayoutRequest[]
  approvePayoutRequest: (id: string) => void
  rejectPayoutRequest: (id: string) => void
  stationAllocationRequests: StationAllocationRequest[]
  createStationAllocationRequest: (request: Omit<StationAllocationRequest, "id" | "createdAt">) => void
  getStationAllocationRequests: () => StationAllocationRequest[]
  approveStationAllocation: (id: string) => void
  rejectStationAllocation: (id: string, reason: string) => void
  getUserAllocatedStations: (userId: string) => StationAllocationRequest[]
  getUserNotifications: (userId: string) => Notification[]
  getUnreadNotificationsCount: (userId: string) => number
  markNotificationAsRead: (notificationId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
  const [chargingSessions, setChargingSessions] = useState<ChargingSession[]>(mockChargingSessions)
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [payoutRecords, setPayoutRecords] = useState<PayoutRecord[]>([])
  const [chargingSessionsOld, setChargingSessionsOld] = useState<ChargingSession[]>(mockChargingSessions)
  const [paymentsOld, setPaymentsOld] = useState<Payment[]>(mockPayments)
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([
    {
      id: "PR-001",
      userId: "user-001",
      userName: "Sharma Residence",
      userEmail: "user@solargrid.com",
      amount: 3390,
      status: "pending",
      createdAt: "2024-01-15",
    },
    {
      id: "PR-002",
      userId: "user-002",
      userName: "Patel House",
      userEmail: "user2@solargrid.com",
      amount: 2850,
      status: "pending",
      createdAt: "2024-01-16",
    },
  ])

  // Adding station allocation requests state
  const [stationAllocationRequests, setStationAllocationRequests] = useState<StationAllocationRequest[]>([])

  const [notifications, setNotifications] = useState<Notification[]>([])

  const demoUsers: Record<string, User> = {
    "admin@solargrid.com": {
      id: "admin-001",
      email: "admin@solargrid.com",
      name: "Admin User",
      role: "admin",
    },
    "user@solargrid.com": {
      id: "user-001",
      email: "user@solargrid.com",
      name: "Sharma Residence",
      role: "user",
      solarCapacity: 12.5,
      address: "123 Solar Street, Bangalore",
    },
    "user2@solargrid.com": {
      id: "user-002",
      email: "user2@solargrid.com",
      name: "Patel House",
      role: "user",
      solarCapacity: 11.2,
      address: "456 Green Avenue, Bangalore",
    },
    "owner@solargrid.com": {
      id: "ev-user-001",
      email: "owner@solargrid.com",
      name: "John Doe",
      role: "ev-owner",
    },
    "evowner@solargrid.com": {
      id: "user-003",
      email: "evowner@solargrid.com",
      name: "EV Owner User",
      role: "ev-owner",
      address: "789 Electric Road, Bangalore",
    },
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const foundUser = demoUsers[email]
    if (foundUser && password === "demo123") {
      setUser(foundUser)
      localStorage.setItem("currentUser", JSON.stringify(foundUser))
      setIsLoading(false)
    } else {
      setIsLoading(false)
      throw new Error("Invalid email or password")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  const createReservation = (reservationRequest: ReservationRequest) => {
    if (!user) return

    const newReservation: Reservation = {
      id: `RES-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      stationId: reservationRequest.stationId,
      stationName: reservationRequest.stationName,
      requestedDate: reservationRequest.requestedDate,
      requestedTime: reservationRequest.requestedTime,
      durationMinutes: reservationRequest.durationMinutes,
      vehicleModel: reservationRequest.vehicleModel,
      vehicleRegNumber: reservationRequest.vehicleRegNumber,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      notes: "Waiting for admin review",
    }

    setReservations([...reservations, newReservation])
  }

  const approveReservation = (id: string, notes?: string) => {
    setReservations(
      reservations.map((res) =>
        res.id === id
          ? {
              ...res,
              status: "approved",
              approvedAt: new Date().toISOString().split("T")[0],
              approvedBy: user?.id || "admin",
              notes: notes || res.notes,
            }
          : res,
      ),
    )
  }

  const rejectReservation = (id: string, reason: string) => {
    setReservations(
      reservations.map((res) =>
        res.id === id
          ? {
              ...res,
              status: "rejected",
              reason,
              approvedAt: new Date().toISOString().split("T")[0],
              approvedBy: user?.id || "admin",
            }
          : res,
      ),
    )
  }

  const cancelReservation = (id: string) => {
    setReservations(
      reservations.map((res) =>
        res.id === id
          ? {
              ...res,
              status: "cancelled",
            }
          : res,
      ),
    )
  }

  const getUserReservations = (userId: string) => {
    return reservations.filter((res) => res.userId === userId)
  }

  const getPendingReservations = () => {
    return reservations.filter((res) => res.status === "pending")
  }

  const createChargingSession = (session: Omit<ChargingSession, "id" | "createdAt">) => {
    const newSession: ChargingSession = {
      ...session,
      id: `CS-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setChargingSessions([...chargingSessions, newSession])
    return newSession
  }

  const completeChargingSession = (sessionId: string, energyUsed: number) => {
    setChargingSessions(
      chargingSessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              endTime: new Date().toISOString(),
              energyUsed,
              totalAmount: energyUsed * session.rate,
              status: "completed" as const,
            }
          : session,
      ),
    )
  }

  const createPayment = (payment: Omit<Payment, "id" | "createdAt">) => {
    const newPayment: Payment = {
      ...payment,
      id: `PAY-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setPayments([...payments, newPayment])
    return newPayment
  }

  const completePayment = (paymentId: string) => {
    setPayments(
      payments.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: "completed" as const,
              completedAt: new Date().toISOString(),
            }
          : p,
      ),
    )
  }

  const getUserPayments = (userId: string) => {
    return payments.filter((p) => p.userId === userId)
  }

  const getSessionsByUser = (userId: string) => {
    return chargingSessions.filter((s) => s.userId === userId)
  }

  const getTotalEnergyFromPayments = (userId: string) => {
    return payments
      .filter((p) => p.userId === userId && p.status === "completed")
      .reduce((total, p) => total + p.energyUsed, 0)
  }

  const createPayoutBatch = (payouts: Omit<PayoutRecord, "id" | "createdAt">[]) => {
    const newPayouts: PayoutRecord[] = payouts.map((payout) => ({
      ...payout,
      id: `PAYOUT-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
    }))
    setPayoutRecords([...payoutRecords, ...newPayouts])
  }

  const getPayoutRecords = () => {
    return payoutRecords
  }

  const completePayoutRecord = (payoutId: string) => {
    setPayoutRecords(
      payoutRecords.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: "completed" as const,
              processedAt: new Date().toISOString(),
            }
          : p,
      ),
    )
  }

  const startChargingSession = (session: Omit<ChargingSession, "id" | "status" | "createdAt">) => {
    const newSession: ChargingSession = {
      ...session,
      id: `CHG-${Date.now()}`,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setChargingSessionsOld([...chargingSessionsOld, newSession])
  }

  const completeChargingSessionOld = (sessionId: string, energyUsed: number) => {
    setChargingSessionsOld(
      chargingSessionsOld.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              endTime: new Date().toLocaleString(),
              energyUsed,
              totalAmount: energyUsed * session.rate,
              status: "completed",
            }
          : session,
      ),
    )
  }

  const createPaymentForSession = (sessionId: string) => {
    const session = chargingSessionsOld.find((s) => s.id === sessionId)
    if (!session || !user) return

    const newPayment: Payment = {
      id: `PAY-${Date.now()}`,
      sessionId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      amount: session.totalAmount,
      energyUsed: session.energyUsed,
      rate: session.rate,
      status: "pending",
      qrCode: generateQRCode(session),
      createdAt: new Date().toISOString().split("T")[0],
    }

    setPaymentsOld([...paymentsOld, newPayment])

    setChargingSessionsOld(
      chargingSessionsOld.map((s) => (s.id === sessionId ? { ...s, status: "paid", paymentId: newPayment.id } : s)),
    )
  }

  const generateQRCode = (session: ChargingSession): string => {
    const qrData = {
      sessionId: session.id,
      amount: session.totalAmount,
      userId: session.userId,
      timestamp: new Date().getTime(),
    }
    const jsonString = JSON.stringify(qrData)
    const encoded = btoa(jsonString)
    return `https://qr.code/payment?data=${encoded}`
  }

  const getCompletedSessions = () => {
    return chargingSessionsOld.filter((s) => s.status === "completed" || s.status === "paid")
  }

  const getAdminTransactions = (): AdminTransaction[] => {
    return paymentsOld.map((payment) => ({
      paymentId: payment.id,
      sessionId: payment.sessionId,
      userId: payment.userId,
      userName: payment.userName,
      energyUsed: payment.energyUsed,
      amount: payment.amount,
      status: payment.status as "completed" | "pending",
      createdAt: payment.createdAt,
      completedAt: payment.completedAt,
    }))
  }

  const calculatePayouts = () => {
    const totalEnergy = chargingSessionsOld.reduce((sum, s) => sum + s.energyUsed, 0)
    const totalRevenue = paymentsOld.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)

    const solarUsers: { id: string; name: string; email: string; address: string; energy: number }[] = [
      {
        id: "user-001",
        name: "Sharma Residence",
        email: "user@solargrid.com",
        address: "123 Solar Street, Bangalore",
        energy: 150,
      },
      {
        id: "user-002",
        name: "Patel House",
        email: "user2@solargrid.com",
        address: "456 Green Avenue, Bangalore",
        energy: 120,
      },
    ]

    const newPayouts = solarUsers.map((solarUser) => {
      const percentage = totalEnergy > 0 ? (solarUser.energy / totalEnergy) * 100 : 0
      const payoutAmount = (percentage / 100) * totalRevenue

      return {
        id: `PAYOUT-${Date.now()}-${solarUser.id}`,
        userId: solarUser.id,
        userName: solarUser.name,
        userEmail: solarUser.email,
        userAddress: solarUser.address,
        energyContributed: solarUser.energy,
        contributionPercentage: percentage,
        totalAmount: payoutAmount,
        status: "pending" as const,
        createdAt: new Date().toISOString().split("T")[0],
      }
    })

    setPayouts(newPayouts)
  }

  const processPayout = (payoutId: string) => {
    setPayouts(
      payouts.map((payout) =>
        payout.id === payoutId
          ? {
              ...payout,
              status: "processed",
              processedAt: new Date().toISOString().split("T")[0],
            }
          : payout,
      ),
    )
  }

  const requestPayoutFromAdmin = (userId: string, amount: number) => {
    const userEmail = Object.keys(demoUsers).find((email) => demoUsers[email].id === userId)
    const userAccount = userEmail ? demoUsers[userEmail] : null

    const newRequest: PayoutRequest = {
      id: `PR-${Date.now()}`,
      userId,
      userName: userAccount?.name || "User",
      userEmail: userAccount?.email || "",
      amount,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setPayoutRequests([...payoutRequests, newRequest])
  }

  const getPayoutRequests = () => {
    return payoutRequests
  }

  const approvePayoutRequest = (id: string) => {
    const request = payoutRequests.find((req) => req.id === id)
    setPayoutRequests(
      payoutRequests.map((req) =>
        req.id === id ? { ...req, status: "approved", approvedAt: new Date().toISOString().split("T")[0] } : req,
      ),
    )

    if (request) {
      const notification: Notification = {
        id: `NOT-${Date.now()}`,
        userId: request.userId,
        title: "Payout Request Approved",
        message: `Your payout request of ₹${request.amount} has been approved and will be transferred to your account.`,
        type: "payout-approved",
        read: false,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setNotifications([...notifications, notification])
    }
  }

  const rejectPayoutRequest = (id: string) => {
    setPayoutRequests(payoutRequests.filter((req) => req.id !== id))
  }

  // Adding station allocation request methods
  const createStationAllocationRequest = (request: Omit<StationAllocationRequest, "id" | "createdAt">) => {
    if (!user) return

    const newRequest: StationAllocationRequest = {
      ...request,
      id: `SAR-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setStationAllocationRequests([...stationAllocationRequests, newRequest])
  }

  const getStationAllocationRequests = () => {
    return stationAllocationRequests
  }

  const approveStationAllocation = (id: string) => {
    const request = stationAllocationRequests.find((req) => req.id === id)
    setStationAllocationRequests(
      stationAllocationRequests.map((req) =>
        req.id === id ? { ...req, status: "approved", approvedAt: new Date().toISOString().split("T")[0] } : req,
      ),
    )

    // Create notification for EV owner
    if (request) {
      const notification: Notification = {
        id: `NOT-${Date.now()}`,
        userId: request.userId,
        title: "Station Allocation Approved",
        message: `Your request for ${request.stationName} has been approved. You can now start charging your ${request.vehicleModel}.`,
        type: "station-approved",
        read: false,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setNotifications([...notifications, notification])
    }
  }

  const rejectStationAllocation = (id: string, reason: string) => {
    setStationAllocationRequests(
      stationAllocationRequests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "rejected",
              reason,
              approvedAt: new Date().toISOString().split("T")[0],
            }
          : req,
      ),
    )
  }

  const getUserAllocatedStations = (userId: string) => {
    return stationAllocationRequests.filter((req) => req.userId === userId && req.status === "approved")
  }

  const getUserNotifications = (userId: string) => {
    return notifications.filter((n) => n.userId === userId)
  }

  const getUnreadNotificationsCount = (userId: string) => {
    return notifications.filter((n) => n.userId === userId && !n.read).length
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        reservations,
        createReservation,
        approveReservation,
        rejectReservation,
        cancelReservation,
        getUserReservations,
        getPendingReservations,
        chargingSessions,
        payments,
        payoutRecords,
        createChargingSession,
        completeChargingSession,
        createPayment,
        completePayment,
        getUserPayments,
        getSessionsByUser,
        getTotalEnergyFromPayments,
        createPayoutBatch,
        getPayoutRecords,
        completePayoutRecord,
        chargingSessionsOld,
        paymentsOld,
        payouts,
        startChargingSession,
        completeChargingSessionOld,
        createPaymentForSession,
        getCompletedSessions,
        getAdminTransactions,
        calculatePayouts,
        processPayout,
        getUserChargingSessions: (userId: string) => chargingSessionsOld.filter((s) => s.userId === userId),
        payoutRequests,
        requestPayoutFromAdmin,
        getPayoutRequests,
        approvePayoutRequest,
        rejectPayoutRequest,
        stationAllocationRequests,
        createStationAllocationRequest,
        getStationAllocationRequests,
        approveStationAllocation,
        rejectStationAllocation,
        getUserAllocatedStations,
        getUserNotifications,
        getUnreadNotificationsCount,
        markNotificationAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
