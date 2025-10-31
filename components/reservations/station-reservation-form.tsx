"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle } from "lucide-react"

interface StationReservationFormProps {
  stationId: number
  stationName: string
  onSuccess?: () => void
}

export default function StationReservationForm({ stationId, stationName, onSuccess }: StationReservationFormProps) {
  const { user, createReservation } = useAuth()
  const [formData, setFormData] = useState({
    requestedDate: "",
    requestedTime: "",
    durationMinutes: 120,
    vehicleModel: "",
    vehicleRegNumber: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "durationMinutes" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.requestedDate || !formData.requestedTime || !formData.vehicleModel || !formData.vehicleRegNumber) {
      setError("Please fill in all required fields")
      return
    }

    // Check if date is in the future
    const selectedDate = new Date(formData.requestedDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      setError("Please select a future date")
      return
    }

    try {
      createReservation({
        stationId,
        stationName,
        requestedDate: formData.requestedDate,
        requestedTime: formData.requestedTime,
        durationMinutes: formData.durationMinutes,
        vehicleModel: formData.vehicleModel,
        vehicleRegNumber: formData.vehicleRegNumber,
      })

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          requestedDate: "",
          requestedTime: "",
          durationMinutes: 120,
          vehicleModel: "",
          vehicleRegNumber: "",
        })
        onSuccess?.()
      }, 3000)
    } catch (err) {
      setError("Failed to create reservation. Please try again.")
    }
  }

  if (!user) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">Please log in to make a reservation</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex gap-3 items-start">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Reservation request submitted!</p>
              <p className="text-sm text-green-800 mt-1">
                Your request has been sent to the admin for review. You'll be notified once it's processed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reserve {stationName}</CardTitle>
        <CardDescription>Request to reserve this EV charging station</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Requested Date *</label>
              <Input
                type="date"
                name="requestedDate"
                value={formData.requestedDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Requested Time *</label>
              <Input type="time" name="requestedTime" value={formData.requestedTime} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Duration (minutes) *</label>
              <select
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
                <option value="240">4 hours</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Vehicle Model *</label>
                <Input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  placeholder="e.g., Tesla Model 3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Vehicle Registration # *</label>
                <Input
                  type="text"
                  name="vehicleRegNumber"
                  value={formData.vehicleRegNumber}
                  onChange={handleChange}
                  placeholder="e.g., TM3-001"
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Submit Reservation Request
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
