"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Edit2, Eye, Power, AlertTriangle } from "lucide-react"

export default function StationGrid({ stations, onViewDetails, onEdit, onPowerControl, onStopCharging }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "charging":
        return "border-blue-500 border-2"
      case "available":
        return "border-green-500 border-2"
      case "maintenance":
        return "border-red-500 border-2"
      default:
        return ""
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "charging":
        return "bg-blue-100 text-blue-800"
      case "available":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stations.map((station) => (
        <Card key={station.id} className={`hover:shadow-lg transition-shadow ${getStatusColor(station.status)}`}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{station.name}</h3>
                  <p className="text-xs text-muted-foreground">{station.location}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(station.status)}`}>
                  {station.status === "charging"
                    ? "Charging"
                    : station.status === "available"
                      ? "Available"
                      : "Maintenance"}
                </span>
              </div>

              {/* Fault Alert */}
              {station.faultStatus !== "normal" && (
                <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-700">Maintenance required</span>
                </div>
              )}

              {/* Charging Info */}
              {station.status === "charging" && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Vehicle</p>
                    <p className="font-semibold text-foreground">{station.vehicle}</p>
                    <p className="text-xs text-muted-foreground">{station.vehicleId}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Power</p>
                      <p className="text-lg font-bold text-primary">{station.power.toFixed(1)} kW</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time Left</p>
                      <p className="text-lg font-bold text-accent">{station.timeRemaining}m</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Power Control</p>
                    <Slider
                      value={[station.power]}
                      onValueChange={(value) => onPowerControl(station.id, value[0])}
                      min={0}
                      max={station.maxPower}
                      step={0.1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">0 - {station.maxPower.toFixed(1)} kW</p>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${((station.totalTime - station.timeRemaining) / station.totalTime) * 100}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Temp</p>
                      <p className="font-semibold text-foreground">{station.temperature}°C</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Efficiency</p>
                      <p className="font-semibold text-foreground">{station.efficiency}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Energy</p>
                      <p className="font-semibold text-foreground">{station.energyDelivered.toFixed(1)} kWh</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Available State */}
              {station.status === "available" && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-3">Ready for next vehicle</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {station.connector} • {station.chargingStandard}
                    </p>
                  </div>
                </div>
              )}

              {/* Maintenance State */}
              {station.status === "maintenance" && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="text-center py-4">
                    <p className="text-red-600 font-semibold mb-2">Under Maintenance</p>
                    <p className="text-xs text-muted-foreground">Scheduled maintenance in progress</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button size="sm" variant="outline" onClick={() => onViewDetails(station)} className="flex-1 gap-1">
                  <Eye className="w-4 h-4" />
                  Details
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEdit(station)} className="flex-1 gap-1">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                {station.status === "charging" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onStopCharging(station.id)}
                    className="flex-1 gap-1"
                  >
                    <Power className="w-4 h-4" />
                    Stop
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
