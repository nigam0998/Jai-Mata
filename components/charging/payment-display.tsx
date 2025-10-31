"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Download, Check } from "lucide-react"

interface PaymentDisplayProps {
  sessionId: string
  amount: number
  energyUsed: number
  userId: string
  userName: string
  userEmail: string
  onPaymentComplete?: () => void
}

export function PaymentDisplay({
  sessionId,
  amount,
  energyUsed,
  userId,
  userName,
  userEmail,
  onPaymentComplete,
}: PaymentDisplayProps) {
  const { createPayment, completePayment } = useAuth()
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [copied, setCopied] = useState(false)

  // Generate QR code
  const generateQRCode = () => {
    const qrData = `UPI://pay?pa=solarshare@upi&pn=SolarShare&am=${amount}&tn=EV%20Charging%20Payment&tr=${sessionId}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`
  }

  const handleInitiatePayment = () => {
    const payment = createPayment({
      sessionId,
      userId,
      userName,
      userEmail,
      amount,
      energyUsed,
      rate: Math.round(amount / energyUsed),
      paymentMethod: "qr",
      qrCode: generateQRCode(),
      status: "pending",
    })
    setPaymentId(payment.id)
  }

  const handleMarkAsComplete = () => {
    if (paymentId) {
      completePayment(paymentId)
      setPaymentCompleted(true)
      onPaymentComplete?.()
    }
  }

  const copyUPI = () => {
    const upiString = `UPI://pay?pa=solarshare@upi&pn=SolarShare&am=${amount}&tn=EV%20Charging%20Payment&tr=${sessionId}`
    navigator.clipboard.writeText(upiString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!paymentId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Review and proceed with payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 py-4 bg-muted rounded-lg p-4">
            <div>
              <p className="text-xs text-muted-foreground">Energy Used</p>
              <p className="text-2xl font-bold text-foreground">{energyUsed} kWh</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rate</p>
              <p className="text-2xl font-bold text-foreground">₹{Math.round(amount / energyUsed)}/kWh</p>
            </div>
          </div>

          <div className="border-t border-b border-border py-4">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-foreground">Total Amount Due</p>
              <p className="text-3xl font-bold text-green-600">₹{amount}</p>
            </div>
          </div>

          <Button onClick={handleInitiatePayment} className="w-full bg-primary hover:bg-primary/90 h-12">
            Proceed to Payment
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{paymentCompleted ? "Payment Completed" : "Scan to Pay"}</CardTitle>
        <CardDescription>
          {paymentCompleted ? "Your transaction has been processed" : "Use any UPI app to scan and pay"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!paymentCompleted && (
          <>
            <div className="flex justify-center">
              <img
                src={generateQRCode() || "/placeholder.svg"}
                alt="Payment QR Code"
                className="border-4 border-border rounded-lg p-2 bg-white"
                width={300}
                height={300}
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Payment ID</p>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono font-semibold text-foreground break-all">{paymentId}</p>
                <Button size="sm" variant="outline" onClick={copyUPI} className="bg-transparent">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 bg-muted rounded-lg p-4">
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold text-foreground">₹{amount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Session ID</p>
                <p className="text-sm font-mono text-foreground">{sessionId}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-semibold">Payment Steps:</p>
              <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                <li>Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                <li>Scan the QR code above</li>
                <li>Verify the amount (₹{amount})</li>
                <li>Complete the payment</li>
                <li>Click "Confirm Payment" below when done</li>
              </ol>
            </div>

            <Button onClick={handleMarkAsComplete} className="w-full bg-green-600 hover:bg-green-700 h-12">
              <Check className="w-4 h-4 mr-2" />
              Confirm Payment
            </Button>
          </>
        )}

        {paymentCompleted && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-green-100 dark:bg-green-950 rounded-full">
                <Check className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Transaction ID</p>
              <p className="font-mono font-semibold text-foreground">{paymentId}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 bg-muted rounded-lg p-4">
              <div>
                <p className="text-xs text-muted-foreground">Amount Paid</p>
                <p className="text-xl font-bold text-green-600">₹{amount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Energy</p>
                <p className="text-xl font-bold text-foreground">{energyUsed} kWh</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Your payment has been successfully processed. Thank you for using SolarShare!
            </p>

            <Button className="w-full bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
