import QuantityVerification from "@/components/takeoff/quantity-verification"

export default function VerificationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quantity Verification</h1>
        <p className="text-gray-500 mt-1">Review and verify extracted quantities</p>
      </div>

      <QuantityVerification />
    </div>
  )
}

