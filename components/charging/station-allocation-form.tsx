"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Plus, MapPin } from "lucide-react"

interface StationAllocationFormProps {
  userId: string
  userName: string
}

interface Station {
  id: string
  name: string
  location: { lat: number; lng: number }
  address: string
  distance: number
}

export function StationAllocationForm({ userId, userName }: StationAllocationFormProps) {
  const { createStationAllocationRequest } = useAuth()
  const [formOpen, setFormOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [formData, setFormData] = useState({
    stationName: "",
    stationId: "",
    vehicleModel: "",
    vehicleRegNumber: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const allStations: Station[] = [
    {
      id: "STATION-01",
      name: "Central Hub Station",
      location: { lat: 12.9716, lng: 77.5946 },
      address: "MG Road, Bangalore",
      distance: 0,
    },
    {
      id: "STATION-02",
      name: "Downtown Charging Hub",
      location: { lat: 12.9352, lng: 77.6245 },
      address: "Indiranagar, Bangalore",
      distance: 0,
    },
    {
      id: "STATION-03",
      name: "Airport Express Station",
      location: { lat: 13.1939, lng: 77.707 },
      address: "Bangalore Airport Road",
      distance: 0,
    },
    {
      id: "STATION-04",
      name: "Mall Parking Charging Zone",
      location: { lat: 12.9549, lng: 77.6245 },
      address: "Koramangala, Bangalore",
      distance: 0,
    },
  ]

  useEffect(() => {
    if (formOpen) {
      fetchUserLocation()
    }
  }, [formOpen])

  const fetchUserLocation = () => {
    setLoadingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLoadingLocation(false)
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Location permission denied. You can still view all stations.")
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError("Location information is unavailable. Showing all stations.")
        } else if (error.code === error.TIMEOUT) {
          setLocationError("Location request timed out. Showing all stations.")
        } else {
          setLocationError("Unable to fetch location. Showing all stations.")
        }
        console.log("[v0] Location error:", error.message)
        setLoadingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getNearbyStations = (): Station[] => {
    if (!userLocation) return allStations

    return allStations
      .map((station) => ({
        ...station,
        distance: calculateDistance(userLocation.lat, userLocation.lng, station.location.lat, station.location.lng),
      }))
      .sort((a, b) => a.distance - b.distance)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.stationName || !formData.vehicleModel || !formData.vehicleRegNumber) {
      alert("Please fill in all fields")
      return
    }

    createStationAllocationRequest({
      userId,
      userName,
      userEmail: "owner@solargrid.com",
      stationId: formData.stationId,
      stationName: formData.stationName,
      vehicleModel: formData.vehicleModel,
      vehicleRegNumber: formData.vehicleRegNumber,
      status: "pending",
    })

    setSubmitted(true)
    setFormData({ stationName: "", stationId: "", vehicleModel: "", vehicleRegNumber: "" })
    setTimeout(() => setSubmitted(false), 3000)
    setFormOpen(false)
  }

  const nearbyStations = getNearbyStations()

  if (formOpen) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Request Station Allocation</CardTitle>
          <CardDescription>Find nearby charging stations and request allocation for your vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            {loadingLocation ? (
              <div className="flex items-center gap-2 text-blue-800">
                <div className="w-4 h-4 rounded-full border-2 border-blue-800 border-t-transparent animate-spin"></div>
                <p className="text-sm">Fetching your location...</p>
              </div>
            ) : locationError ? (
              <div className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">{locationError}</p>
              </div>
            ) : userLocation ? (
              <div className="flex items-center gap-2 text-green-800">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">Location detected. Showing nearby stations sorted by distance.</p>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Select Charging Station</label>
              <select
                value={formData.stationId}
                onChange={(e) => {
                  const station = nearbyStations.find((s) => s.id === e.target.value)
                  setFormData({
                    ...formData,
                    stationId: e.target.value,
                    stationName: station?.name || "",
                  })
                }}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm"
                required
              >
                <option value="">Choose a station...</option>
                {nearbyStations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                    {userLocation && ` (${station.distance.toFixed(1)} km away)`}
                  </option>
                ))}
              </select>
            </div>

            {formData.stationId && (
              <div className="p-3 bg-secondary/30 rounded-lg text-sm">
                {nearbyStations
                  .filter((s) => s.id === formData.stationId)
                  .map((station) => (
                    <div key={station.id} className="space-y-1">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{station.address}</p>
                          {userLocation && (
                            <p className="text-xs text-muted-foreground">
                              {station.distance.toFixed(1)} km from your location
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Vehicle Model</label>
                <Input
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  placeholder="E.g., Tesla Model 3"
                  className="bg-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Vehicle Registration</label>
                <Input
                  value={formData.vehicleRegNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleRegNumber: e.target.value })}
                  placeholder="E.g., KA-01-AB-1234"
                  className="bg-input"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                Submit Request
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800">Request Submitted Successfully</p>
            <p className="text-sm text-green-700">Admin will review your request shortly</p>
          </div>
        </div>
      )}
      <Button onClick={() => setFormOpen(true)} className="w-full bg-accent hover:bg-accent/90" variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Request Station Allocation
      </Button>
    </div>
  )
}
