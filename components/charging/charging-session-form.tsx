"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, AlertCircle } from "lucide-react"

interface ChargingSessionFormProps {
  userId: string
  userName: string
}

export function ChargingSessionForm({ userId, userName }: ChargingSessionFormProps) {
  const { createChargingSession, getUserAllocatedStations } = useAuth()
  const router = useRouter()
  const [allocatedStations, setAllocatedStations] = useState<any[]>([])
  const [hasApprovedStation, setHasApprovedStation] = useState(false)
  const [formData, setFormData] = useState({
    stationName: "Central Hub Station",
    stationId: "STATION-01",
    vehicleModel: "Tesla Model 3",
    vehicleRegNumber: "KA-01-AB-1234",
  })
  const [sessionStarted, setSessionStarted] = useState(false)
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)

  useEffect(() => {
    const stations = getUserAllocatedStations(userId)
    setAllocatedStations(stations)
    setHasApprovedStation(stations.length > 0)
  }, [userId, getUserAllocatedStations])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (sessionActive && currentSession?.status === "active") {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [sessionActive, currentSession])

  const handleStartCharging = (e: React.FormEvent) => {
    e.preventDefault()

    if (!hasApprovedStation) {
      alert("Please request and get approval for a station first")
      return
    }

    const session = createChargingSession({
      userId,
      userName,
      stationId: formData.stationId,
      stationName: formData.stationName,
      vehicleModel: formData.vehicleModel,
      vehicleRegNumber: formData.vehicleRegNumber,
      startTime: new Date().toISOString(),
      energyUsed: 0,
      rate: 12,
      totalAmount: 0,
      status: "active",
    })

    setCurrentSession(session)
    setSessionStarted(true)
    setSessionActive(true)
    setElapsedSeconds(0)
  }

  // For a realistic calculation: assume 7kW charging rate typical for EV chargers
  const handleStopCharging = () => {
    const chargingRateKWperHour = 40 // 40kW fast EV charger power
    const hoursElapsed = elapsedSeconds / 3600
    const energyUsed = Number.parseFloat((chargingRateKWperHour * hoursElapsed).toFixed(3))
    const totalAmount = Number.parseFloat((energyUsed * 12).toFixed(2)) // ₹12 per kWh

    setCurrentSession({
      ...currentSession,
      energyUsed: energyUsed > 0 ? energyUsed : 0.001, // Minimum 0.001 kWh to prevent zero
      totalAmount: totalAmount > 0 ? totalAmount : 0.01, // Minimum ₹0.01
      status: "completed",
      endTime: new Date().toISOString(),
    })
    setSessionActive(false)
  }

  const handleProceedToPayment = () => {
    const paymentData = {
      sessionId: currentSession.id,
      userId: currentSession.userId,
      userName: currentSession.userName,
      vehicleModel: currentSession.vehicleModel,
      stationName: currentSession.stationName,
      energyUsed: currentSession.energyUsed,
      amount: currentSession.totalAmount,
    }
    router.push(`/payment?data=${Buffer.from(JSON.stringify(paymentData)).toString("base64")}`)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  if (!hasApprovedStation) {
    return (
      <div className="text-center py-8 space-y-4">
        <AlertCircle className="w-12 h-12 text-orange-600 mx-auto" />
        <div>
          <p className="font-semibold text-foreground mb-2">Station Allocation Required</p>
          <p className="text-sm text-muted-foreground mb-4">
            You need to request and get approval for a charging station before you can start charging. Please go to the
            "Request Station" tab first.
          </p>
        </div>
      </div>
    )
  }

  if (sessionStarted && currentSession) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-primary">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-xl font-semibold text-foreground">
                <Zap className="w-6 h-6 text-accent animate-pulse" />
                {currentSession.status === "active" ? "Charging in Progress" : "Charging Complete"}
              </div>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-xs text-muted-foreground">Vehicle</p>
                  <p className="font-semibold text-foreground">{currentSession.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Station</p>
                  <p className="font-semibold text-foreground">{currentSession.stationName}</p>
                </div>
              </div>

              {currentSession.status === "active" && (
                <div className="bg-accent/10 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Elapsed Time</p>
                  <p className="text-3xl font-bold text-foreground font-mono">{formatTime(elapsedSeconds)}</p>
                </div>
              )}

              {currentSession.status === "completed" && (
                <div className="bg-accent/10 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Total Duration</p>
                  <p className="text-2xl font-bold text-foreground font-mono">{formatTime(elapsedSeconds)}</p>
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-accent/20">
                    <div>
                      <p className="text-xs text-muted-foreground">Energy Used</p>
                      <p className="text-2xl font-bold text-foreground">{currentSession.energyUsed} kWh</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount Due</p>
                      <p className="text-2xl font-bold text-green-600">₹{currentSession.totalAmount}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          {currentSession.status === "active" && (
            <Button onClick={handleStopCharging} className="flex-1 bg-accent hover:bg-accent/90 h-12">
              Stop Charging
            </Button>
          )}
          {currentSession.status === "completed" && (
            <>
              <Button onClick={handleProceedToPayment} className="flex-1 bg-primary hover:bg-primary/90 h-12">
                Proceed to Payment
              </Button>
              <Button
                onClick={() => {
                  setSessionStarted(false)
                  setElapsedSeconds(0)
                }}
                variant="outline"
                className="flex-1 h-12 bg-transparent"
              >
                Start New Session
              </Button>
            </>
          )}
        </div>

        {currentSession.status === "completed" && (
          <div className="text-center text-xs text-muted-foreground">
            Proceed to payment to complete the transaction
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleStartCharging} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Charging Station</label>
          <Input
            value={formData.stationName}
            onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
            placeholder="Station name"
            className="bg-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Vehicle Model</label>
          <Input
            value={formData.vehicleModel}
            onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
            placeholder="E.g., Tesla Model 3"
            className="bg-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Vehicle Registration</label>
          <Input
            value={formData.vehicleRegNumber}
            onChange={(e) => setFormData({ ...formData, vehicleRegNumber: e.target.value })}
            placeholder="E.g., KA-01-AB-1234"
            className="bg-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Rate (₹/kWh)</label>
          <Input value="12" disabled className="bg-muted" />
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12">
        Start Charging Session
      </Button>
    </form>
  )
}
