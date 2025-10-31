"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function StationForm({ station, onSubmit }) {
  const [formData, setFormData] = useState(
    station || {
      name: "",
      location: "",
      connector: "Type 2",
      chargingStandard: "AC",
      maxPower: 11.0,
    },
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxPower" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{station ? "Edit Station" : "Add New Station"}</CardTitle>
        <CardDescription>{station ? "Update station configuration" : "Add a new EV charging station"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Station Name *</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Station A"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location *</label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Building A, Ground Floor"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Connector Type *</label>
              <select
                name="connector"
                value={formData.connector}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="Type 2">Type 2</option>
                <option value="CCS">CCS</option>
                <option value="CHAdeMO">CHAdeMO</option>
                <option value="AC">AC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Charging Standard *</label>
              <select
                name="chargingStandard"
                value={formData.chargingStandard}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="AC">AC</option>
                <option value="DC">DC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Max Power (kW) *</label>
              <Input
                type="number"
                name="maxPower"
                value={formData.maxPower}
                onChange={handleChange}
                placeholder="11.0"
                step="0.1"
                min="0"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {station ? "Update Station" : "Add Station"}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
