"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Edit2, Power, AlertTriangle, Zap, Thermometer, TrendingUp } from "lucide-react"
import StationReservationForm from "@/components/reservations/station-reservation-form"

export default function StationDetails({ station, onEdit, onPowerControl, onStopCharging }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{station.name}</CardTitle>
              <CardDescription>{station.location}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onEdit(station)} className="gap-1">
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              {station.status === "charging" && (
                <Button size="sm" variant="destructive" onClick={() => onStopCharging(station.id)} className="gap-1">
                  <Power className="w-4 h-4" />
                  Stop Charging
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Fault Alert */}
          {station.faultStatus !== "normal" && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Maintenance Required</p>
                <p className="text-sm text-red-700">This station requires immediate attention</p>
              </div>
            </div>
          )}

          {/* Status Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="font-semibold text-foreground capitalize">{station.status}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Connector Type</p>
              <p className="font-semibold text-foreground">{station.connector}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Charging Standard</p>
              <p className="font-semibold text-foreground">{station.chargingStandard}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max Power</p>
              <p className="font-semibold text-foreground">{station.maxPower.toFixed(1)} kW</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {station.status !== "maintenance" && station.faultStatus === "normal" && (
        <StationReservationForm stationId={station.id} stationName={station.name} />
      )}

      {/* Charging Session Details */}
      {station.status === "charging" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Active Charging Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vehicle Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vehicle</p>
                <p className="text-lg font-semibold text-foreground">{station.vehicle}</p>
                <p className="text-sm text-muted-foreground">{station.vehicleId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Member</p>
                <p className="text-lg font-semibold text-foreground">{station.memberName}</p>
                <p className="text-sm text-muted-foreground">ID: {station.memberId}</p>
              </div>
            </div>

            {/* Power Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">Power Output</p>
                <p className="text-2xl font-bold text-primary">{station.power.toFixed(1)} kW</p>
              </div>
              <Slider
                value={[station.power]}
                onValueChange={(value) => onPowerControl(station.id, value[0])}
                min={0}
                max={station.maxPower}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Adjust power between 0 - {station.maxPower.toFixed(1)} kW</p>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Charging Progress</p>
                <p className="text-sm font-semibold text-accent">
                  {(((station.totalTime - station.timeRemaining) / station.totalTime) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${((station.totalTime - station.timeRemaining) / station.totalTime) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Started: {station.startTime}</span>
                <span>{station.timeRemaining}m remaining</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
              <div className="text-center">
                <Thermometer className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="text-lg font-bold text-foreground">{station.temperature}°C</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Efficiency</p>
                <p className="text-lg font-bold text-foreground">{station.efficiency}%</p>
              </div>
              <div className="text-center">
                <Zap className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Energy</p>
                <p className="text-lg font-bold text-foreground">{station.energyDelivered.toFixed(1)} kWh</p>
              </div>
            </div>

            {/* Cost */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-1">Estimated Cost</p>
              <p className="text-2xl font-bold text-accent">₹{station.cost.toLocaleString("en-IN")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Station Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Station Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Connector Type</p>
              <p className="font-semibold text-foreground">{station.connector}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Charging Standard</p>
              <p className="font-semibold text-foreground">{station.chargingStandard}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Maximum Power</p>
              <p className="font-semibold text-foreground">{station.maxPower.toFixed(1)} kW</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Station ID</p>
              <p className="font-semibold text-foreground">{station.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
