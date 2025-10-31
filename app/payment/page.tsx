"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { SolarShareLogo } from "@/components/logo"
import Image from "next/image"

interface PaymentData {
  sessionId: string
  userId: string
  userName: string
  vehicleModel: string
  stationName: string
  energyUsed: number
  amount: number
}

export default function PaymentPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed" | "expired">("pending")
  const [showQR, setShowQR] = useState(true)
  const [qrTimeRemaining, setQrTimeRemaining] = useState(120) // 2 minutes in seconds
  const initRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ev-owner")) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    if (initRef.current) return

    const dataParam = searchParams.get("data")
    if (dataParam) {
      try {
        const decoded = JSON.parse(atob(dataParam))
        setPaymentData(decoded)
        initRef.current = true
      } catch (error) {
        console.error("Failed to decode payment data:", error)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (showQR && paymentStatus === "pending") {
      timerRef.current = setInterval(() => {
        setQrTimeRemaining((prev) => {
          if (prev <= 1) {
            setShowQR(false)
            setPaymentStatus("expired")
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [showQR, paymentStatus])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const simulatePaymentComplete = () => {
    setShowQR(false)
    setPaymentStatus("completed")
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, "0")}`
  }

  if (isLoading || !paymentData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <SolarShareLogo className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SolarShare Payment</h1>
              <p className="text-sm text-muted-foreground">Secure UPI Payment</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Charging Details */}
          <Card>
            <CardHeader>
              <CardTitle>Charging Details</CardTitle>
              <CardDescription>Session information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Vehicle</span>
                  <span className="font-semibold text-foreground">{paymentData.vehicleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Station</span>
                  <span className="font-semibold text-foreground">{paymentData.stationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User</span>
                  <span className="font-semibold text-foreground">{paymentData.userName}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Energy Used</span>
                    <span className="font-semibold text-foreground">{paymentData.energyUsed} kWh</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rate</span>
                  <span className="font-semibold text-foreground">₹12/kWh</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: QR Code or Success or Expired */}
          {paymentStatus === "pending" ? (
            <Card>
              <CardHeader>
                <CardTitle>Scan & Pay</CardTitle>
                <CardDescription>Use any UPI app to scan and pay</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {showQR && (
                  <>
                    <div
                      className={`text-center p-3 rounded-lg flex items-center justify-center gap-2 ${
                        qrTimeRemaining <= 30 ? "bg-red-50 border border-red-200" : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <Clock className={`w-4 h-4 ${qrTimeRemaining <= 30 ? "text-red-600" : "text-blue-600"}`} />
                      <p
                        className={`text-sm font-semibold ${qrTimeRemaining <= 30 ? "text-red-800" : "text-blue-800"}`}
                      >
                        QR expires in: {formatTime(qrTimeRemaining)}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SamsungPay_QR-65CxxKdvG766tPEkeXjkcD1C4eNe3o.png"
                        alt="Payment QR Code"
                        width={200}
                        height={200}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-2">Total Amount</p>
                        <p className="text-4xl font-bold text-green-600">₹{paymentData.amount}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        Open any UPI app (Google Pay, Paytm, PhonePe, Samsung Pay) and scan the QR code to pay.
                      </p>
                    </div>
                    <Button onClick={simulatePaymentComplete} className="w-full bg-primary hover:bg-primary/90 h-12">
                      <Clock className="w-4 h-4 mr-2" />
                      Payment Completed
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : paymentStatus === "expired" ? (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <CardTitle className="text-red-800">QR Code Expired</CardTitle>
                </div>
                <CardDescription>Your payment QR code has expired</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-red-700">
                  The QR code is only valid for 2 minutes. Please go back and restart the charging session to get a new
                  payment code.
                </p>
                <Button
                  onClick={() => router.push("/ev-charging-dashboard")}
                  className="w-full bg-primary hover:bg-primary/90 h-12"
                >
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <CardTitle className="text-green-800">Payment Successful</CardTitle>
                </div>
                <CardDescription>Transaction completed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment ID</span>
                    <span className="font-mono text-sm font-semibold">{paymentData.sessionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount Paid</span>
                    <span className="font-semibold text-green-600 text-lg">₹{paymentData.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Completed
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/ev-charging-dashboard")}
                  className="w-full bg-primary hover:bg-primary/90 h-12 mt-4"
                >
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
