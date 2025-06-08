"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { PricingPlan } from "@/components/pricing-plan"
import { useToast } from "@/components/ui/use-toast"
import { pricingPlans } from "@/config/pricing"
import { useSubscription } from "@/hooks/use-subscription"
import { Icons } from "@/components/icons"
import PaymentModalEnhanced from "@/components/payment-modal-enhanced"

const Page = () => {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const { subscription, isSubscribed, isSubscriptionLoading } = useSubscription()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    if (session?.user) {
      setCurrentUser(session.user)
    }
  }, [session])

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    redirect("/sign-in")
  }

  const handleCheckout = (plan) => {
    setSelectedPlan(plan)
    setShowPaymentModal(true)
  }

  return (
    <div className="container max-w-5xl py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <PricingPlan
            key={plan.id}
            plan={plan}
            isSubscribed={isSubscribed}
            handleCheckout={handleCheckout}
            isLoading={isSubscriptionLoading}
          />
        ))}
      </div>
      {showPaymentModal && selectedPlan && currentUser && (
        <PaymentModalEnhanced
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          plan={selectedPlan}
          userId={currentUser.id}
          onSuccess={() => {
            setShowPaymentModal(false)
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}

export default Page
