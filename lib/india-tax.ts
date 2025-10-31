// GST and tax calculations for India

export const GST_RATE = 0.18 // 18% standard rate for solar/EV services

export function calculateGST(amount: number, rate: number = GST_RATE): number {
  return amount * rate
}

export function calculateTotalWithGST(amount: number, rate: number = GST_RATE): number {
  return amount + calculateGST(amount, rate)
}

export function calculateAmountBeforeGST(totalAmount: number, rate: number = GST_RATE): number {
  return totalAmount / (1 + rate)
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumberINR(amount: number): string {
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

// Validate Indian GST Number (15 characters)
export function isValidGSTNumber(gst: string): boolean {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return gstRegex.test(gst)
}

// Validate Indian Pincode (6 digits)
export function isValidPincode(pincode: string): boolean {
  return /^[0-9]{6}$/.test(pincode)
}

// Validate Indian Phone Number
export function isValidIndianPhone(phone: string): boolean {
  return /^(\+91|0)?[6-9]\d{9}$/.test(phone.replace(/[-\s]/g, ""))
}

// Format Indian phone number
export function formatIndianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 10) {
    return `+91-${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
  }
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+91-${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  return phone
}
