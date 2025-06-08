"use client"

import { useState, useEffect } from "react"
import type { PricingPlanConfig } from "@/config/pricing"

export interface Subscription {
  planId: string
  planName: string
  price: number
  startDate: string
  endDate: string
  status: "active" | "trial" | "expired" | "cancelled"
  autoRenew: boolean
  trialDaysRemaining?: number
}

export interface UseSubscriptionReturn {
  subscription: Subscription | null
  isLoading: boolean
  hasActiveSubscription: boolean
  isInTrial: boolean
  canAccessFeature: (feature: string) => boolean
  subscribe: (plan: PricingPlanConfig) => Promise<void>
  cancelSubscription: () => Promise<void>
  renewSubscription: () => Promise<void>
  getTrialDaysRemaining: () => number
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSubscription()
  }, [])

  const loadSubscription = () => {
    try {
      const stored = localStorage.getItem("user_subscription")
      if (stored) {
        const sub = JSON.parse(stored)
        // Vérifier si l'abonnement est encore valide
        const now = new Date()
        const endDate = new Date(sub.endDate)

        if (now > endDate) {
          sub.status = "expired"
        }

        // Calculer les jours d'essai restants
        if (sub.status === "trial") {
          const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          sub.trialDaysRemaining = Math.max(0, daysRemaining)

          if (daysRemaining <= 0) {
            sub.status = "expired"
          }
        }

        setSubscription(sub)
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'abonnement:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSubscription = (sub: Subscription) => {
    try {
      localStorage.setItem("user_subscription", JSON.stringify(sub))
      setSubscription(sub)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'abonnement:", error)
    }
  }

  const subscribe = async (plan: PricingPlanConfig) => {
    const now = new Date()
    const endDate = new Date()

    if (plan.id === "trial") {
      endDate.setDate(now.getDate() + 15) // 15 jours d'essai
    } else {
      endDate.setMonth(now.getMonth() + 1) // 1 mois
    }

    const newSubscription: Subscription = {
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      status: plan.id === "trial" ? "trial" : "active",
      autoRenew: plan.id !== "trial",
      trialDaysRemaining: plan.id === "trial" ? 15 : undefined,
    }

    saveSubscription(newSubscription)
  }

  const cancelSubscription = async () => {
    if (subscription) {
      const updatedSub = { ...subscription, status: "cancelled" as const, autoRenew: false }
      saveSubscription(updatedSub)
    }
  }

  const renewSubscription = async () => {
    if (subscription) {
      const now = new Date()
      const endDate = new Date()
      endDate.setMonth(now.getMonth() + 1)

      const updatedSub = {
        ...subscription,
        status: "active" as const,
        autoRenew: true,
        endDate: endDate.toISOString(),
      }
      saveSubscription(updatedSub)
    }
  }

  const canAccessFeature = (feature: string): boolean => {
    if (!subscription || subscription.status === "expired") {
      return false
    }

    // Pendant l'essai, accès à toutes les fonctionnalités
    if (subscription.status === "trial") {
      return true
    }

    // Logique d'accès selon le plan
    switch (feature) {
      case "contact_access":
        return ["professionnel", "premium"].includes(subscription.planId)
      case "unlimited_requests":
        return subscription.planId === "premium"
      case "priority_support":
        return ["professionnel", "premium"].includes(subscription.planId)
      default:
        return true
    }
  }

  const getTrialDaysRemaining = (): number => {
    if (subscription?.status === "trial" && subscription.endDate) {
      const now = new Date()
      const endDate = new Date(subscription.endDate)
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return Math.max(0, daysRemaining)
    }
    return 0
  }

  return {
    subscription,
    isLoading,
    hasActiveSubscription: subscription?.status === "active" || subscription?.status === "trial",
    isInTrial: subscription?.status === "trial",
    canAccessFeature,
    subscribe,
    cancelSubscription,
    renewSubscription,
    getTrialDaysRemaining,
  }
}
