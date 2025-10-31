"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, AlertCircle, TrendingUp, Plug, Power, Plus } from "lucide-react"
import StationGrid from "@/components/stations/station-grid"
import StationDetails from "@/components/stations/station-details"
import StationForm from "@/components/stations/station-form"

export default function StationsPage() {
  const [stations, setStations] = useState([
    {
      id: 1,
      name: "Station A",
      location: "Building A, Ground Floor",
      status: "charging",
      power: 7.2,
      maxPower: 11.0,
      vehicle: "Tesla Model 3",
      vehicleId: "TM3-001",
      timeRemaining: 45,
      totalTime: 120,
      connector: "Type 2",
      chargingStandard: "AC",
      temperature: 32,
      efficiency: 94,
      memberId: 1,
      memberName: "Sharma Residence",
      startTime: "14:30",
      cost: 85,
      energyDelivered: 8.5,
      faultStatus: "normal",
    },
    {
      id: 2,
      name: "Station B",
      location: "Building B, Level 1",
      status: "available",
      power: 0,
      maxPower: 11.0,
      vehicle: null,
      vehicleId: null,
      timeRemaining: 0,
      totalTime: 0,
      connector: "CCS",
      chargingStandard: "DC",
      temperature: 28,
      efficiency: 0,
      memberId: null,
      memberName: null,
      startTime: null,
      cost: 0,
      energyDelivered: 0,
      faultStatus: "normal",
    },
    {
      id: 3,
      name: "Station C",
      location: "Building C, Parking Level 2",
      status: "charging",
      power: 6.8,
      maxPower: 11.0,
      vehicle: "Hyundai Kona",
      vehicleId: "HK-002",
      timeRemaining: 60,
      totalTime: 180,
      connector: "Type 2",
      chargingStandard: "AC",
      temperature: 35,
      efficiency: 91,
      memberId: 3,
      memberName: "Kumar Villa",
      startTime: "13:45",
      cost: 120,
      energyDelivered: 12.3,
      faultStatus: "normal",
    },
    {
      id: 4,
      name: "Station D",
      location: "Building A, Level 3",
      status: "maintenance",
      power: 0,
      maxPower: 11.0,
      vehicle: null,
      vehicleId: null,
      timeRemaining: 0,
      totalTime: 0,
      connector: "Type 2",
      chargingStandard: "AC",
      temperature: 25,
      efficiency: 0,
      memberId: null,
      memberName: null,
      startTime: null,
      cost: 0,
      energyDelivered: 0,
      faultStatus: "maintenance_required",
    },
  ])

  const [view, setView] = useState<"grid" | "details" | "form">("grid")
  const [selectedStation, setSelectedStation] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [filter, setFilter] = useState("all")

  const handleViewDetails = (station) => {
    setSelectedStation(station)
    setView("details")
  }

  const handleEditStation = (station) => {
    setSelectedStation(station)
    setIsEditing(true)
    setView("form")
  }

  const handleUpdateStation = (updatedStation) => {
    setStations(stations.map((s) => (s.id === updatedStation.id ? updatedStation : s)))
    setView("grid")
    setIsEditing(false)
  }

  const handleAddStation = (newStation) => {
    const station = {
      ...newStation,
      id: Math.max(...stations.map((s) => s.id), 0) + 1,
      status: "available",
      power: 0,
      vehicle: null,
      timeRemaining: 0,
      energyDelivered: 0,
      faultStatus: "normal",
    }
    setStations([...stations, station])
    setView("grid")
  }

  const handlePowerControl = (stationId, newPower) => {
    setStations(
      stations.map((s) =>
        s.id === stationId
          ? {
              ...s,
              power: Math.min(newPower, s.maxPower),
            }
          : s,
      ),
    )
  }

  const handleStopCharging = (stationId) => {
    setStations(
      stations.map((s) =>
        s.id === stationId
          ? {
              ...s,
              status: "available",
              power: 0,
              vehicle: null,
              timeRemaining: 0,
              memberName: null,
            }
          : s,
      ),
    )
  }

  const filteredStations =
    filter === "all"
      ? stations
      : stations.filter((s) => {
          if (filter === "charging") return s.status === "charging"
          if (filter === "available") return s.status === "available"
          if (filter === "maintenance") return s.status === "maintenance"
          return true
        })

  const stats = {
    totalStations: stations.length,
    activeCharging: stations.filter((s) => s.status === "charging").length,
    available: stations.filter((s) => s.status === "available").length,
    totalPowerOutput: stations.reduce((sum, s) => sum + s.power, 0),
    totalEnergyDelivered: stations.reduce((sum, s) => sum + s.energyDelivered, 0),
    averageEfficiency:
      stations.filter((s) => s.efficiency > 0).length > 0
        ? (
            stations.filter((s) => s.efficiency > 0).reduce((sum, s) => sum + s.efficiency, 0) /
            stations.filter((s) => s.efficiency > 0).length
          ).toFixed(1)
        : 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Charging Stations</h1>
              <p className="text-sm text-muted-foreground">Real-time monitoring and control</p>
            </div>
          </div>
          {view === "grid" && (
            <Button
              onClick={() => {
                setSelectedStation(null)
                setIsEditing(false)
                setView("form")
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Station
            </Button>
          )}
          {view !== "grid" && (
            <Button onClick={() => setView("grid")} variant="outline">
              Back to Grid
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {view === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Plug className="w-4 h-4 text-primary" />
                  Total Stations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.totalStations}</div>
                <p className="text-xs text-green-600 mt-1">{stats.activeCharging} charging now</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Power className="w-4 h-4 text-accent" />
                  Power Output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.totalPowerOutput.toFixed(1)} kW</div>
                <p className="text-xs text-accent mt-1">{stats.available} stations available</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Energy Delivered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.totalEnergyDelivered.toFixed(1)} kWh</div>
                <p className="text-xs text-blue-600 mt-1">Today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Avg Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.averageEfficiency}%</div>
                <p className="text-xs text-orange-600 mt-1">System performance</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filter Tabs */}
        {view === "grid" && (
          <div className="flex gap-2 mb-6 border-b border-border">
            {["all", "charging", "available", "maintenance"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  filter === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "all" ? "All Stations" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Views */}
        {view === "grid" && (
          <StationGrid
            stations={filteredStations}
            onViewDetails={handleViewDetails}
            onEdit={handleEditStation}
            onPowerControl={handlePowerControl}
            onStopCharging={handleStopCharging}
          />
        )}
        {view === "details" && selectedStation && (
          <StationDetails
            station={selectedStation}
            onEdit={handleEditStation}
            onPowerControl={handlePowerControl}
            onStopCharging={handleStopCharging}
          />
        )}
        {view === "form" && (
          <StationForm
            station={isEditing ? selectedStation : null}
            onSubmit={isEditing ? handleUpdateStation : handleAddStation}
          />
        )}
      </main>
    </div>
  )
}
