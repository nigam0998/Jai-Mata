"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { INDIAN_STATES, getCitiesByState } from "@/lib/india-regions"
import { Settings, MapPin, DollarSign } from "lucide-react"

export default function SettingsPage() {
  const [selectedState, setSelectedState] = useState("KA")
  const [selectedCity, setSelectedCity] = useState("Bangalore")
  const [gstNumber, setGstNumber] = useState("")
  const [pincode, setPincode] = useState("")
  const [language, setLanguage] = useState("en")

  const currentState = INDIAN_STATES.find((s) => s.code === selectedState)
  const cities = getCitiesByState(selectedState)

  const handleSaveSettings = () => {
    console.log({
      state: selectedState,
      city: selectedCity,
      gstNumber,
      pincode,
      language,
    })
    alert("Settings saved successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Settings className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Regional configuration and preferences</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Regional Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Regional Settings
            </CardTitle>
            <CardDescription>Configure your location and regional preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">State/Union Territory *</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value)
                    setSelectedCity(getCitiesByState(e.target.value)[0] || "")
                  }}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  {INDIAN_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">City/District *</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Pincode *</label>
                <Input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.slice(0, 6))}
                  placeholder="e.g., 560001"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground mt-1">6-digit postal code</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="ml">മലയാളം (Malayalam)</option>
                </select>
              </div>
            </div>

            {currentState && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Regional Info:</strong> {currentState.name} • Timezone: {currentState.timezone} • GST Rate:{" "}
                  {currentState.gstRate}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tax & Compliance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent" />
              Tax & Compliance
            </CardTitle>
            <CardDescription>GST and regulatory information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">GST Number (Optional)</label>
              <Input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                placeholder="e.g., 18AABCT1234H1Z0"
                maxLength={15}
              />
              <p className="text-xs text-muted-foreground mt-1">15-character GST Identification Number</p>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                <strong>GST Rate:</strong> 18% standard rate applies to solar and EV charging services in India
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Applicable Regulations:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Net Metering Policy (varies by state)</li>
                <li>MNRE Solar Subsidy Schemes</li>
                <li>State Electricity Regulatory Commission (SERC) guidelines</li>
                <li>EV Charging Infrastructure Standards</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90">
            Save Settings
          </Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </main>
    </div>
  )
}
