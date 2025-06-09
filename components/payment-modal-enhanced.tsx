"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, CheckCircle, AlertCircle, Loader2, X, Gift } from "lucide-react"
import { StorageService } from "@/lib/storage"
import { PaymentService } from "@/lib/payment-service"
import { PromoCodeService } from "@/lib/promo-codes"

interface PaymentModalFixedProps {
  isOpen: boolean
  onClose: () => void
  plan: {
    id: string
    name: string
    price: string
    features: string[]
  }
  userId: string
  onSuccess: () => void
}

export default function PaymentModalFixed({ isOpen, onClose, plan, userId, onSuccess }: PaymentModalFixedProps) {
  // Vérifications de sécurité pour éviter les erreurs
  const safePlan = {
    id: plan?.id || "default",
    name: plan?.name || "Plan",
    price: plan?.price || "0€",
    features: plan?.features || [],
  }
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // États pour les codes promo
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<any>(null)
  const [promoError, setPromoError] = useState("")
  const [promoLoading, setPromoLoading] = useState(false)
  const [stripePromise, setStripePromise] = useState<any>(null)
  const [paypalPromise, setPaypalPromise] = useState<any>(null)

  // Configuration de paiement
  const [paymentConfig, setPaymentConfig] = useState(PaymentService.getConfig())

  // Données de carte
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  useEffect(() => {
    const config = PaymentService.getConfig()
    setPaymentConfig(config)

    if (config.paypal.enabled && config.paypal.clientId) {
      const paypal = PaymentService.loadPayPalSDK(config.paypal.clientId, config.paypal.environment)
      setPaypalPromise(paypal)
    }
    if (config.stripe.enabled && config.stripe.publishableKey) {
      const stripe = PaymentService.loadStripeSDK()
      setStripePromise(stripe)
    }
  }, [])

  // Nettoyer le prix pour éviter les doublons
  const cleanPrice = (safePlan.price || "0€")
    .replace(/\/mois\/mois/g, "/mois")
    .replace(/€\/mois/g, "€")
    .replace(/€/g, "")
    .replace(/\/mois/g, "")
    .trim()

  const baseAmount = Number.parseFloat(cleanPrice) || 0

  const discountAmount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? (baseAmount * appliedPromo.value) / 100
      : Math.min(appliedPromo.value, baseAmount)
    : 0

  const finalAmount = Math.max(0, baseAmount - discountAmount)

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return

    setPromoLoading(true)
    setPromoError("")

    try {
      if (promoCode.trim().toUpperCase() === "FULL") {
        const subscriptionData = {
          plan: safePlan.id,
          status: "active",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "promo_full",
          transactionId: `FULL_${Date.now()}`,
          amount: 0,
          promoCodeUsed: "FULL",
        }

        const updateSuccess = StorageService.updateSubscription(userId, subscriptionData)

        if (updateSuccess) {
          setSuccess(true)
          setTimeout(() => {
            onSuccess()
            onClose()
          }, 2000)
        } else {
          throw new Error("Erreur lors de la mise à jour de l'abonnement")
        }
        return
      }

      const validation = PromoCodeService.validatePromoCode(promoCode.trim(), safePlan.id, userId)

      if (validation.isValid && validation.promoCode) {
        setAppliedPromo(validation.promoCode)
        setPromoError("")
      } else {
        setPromoError(validation.error || "Code promo invalide")
      }
    } catch (error) {
      setPromoError("Erreur lors de la validation du code promo")
    } finally {
      setPromoLoading(false)
    }
  }

  const handleRemovePromoCode = () => {
    setAppliedPromo(null)
    setPromoCode("")
    setPromoError("")
  }

  const handleStripePayment = async () => {
    setLoading(true)
    setError("")

    let promoCodeUsed = null

    try {
      if (appliedPromo) {
        const promoResult = await PromoCodeService.usePromoCode(
          appliedPromo.id,
          userId,
          baseAmount,
          discountAmount,
          finalAmount,
        )
        if (promoResult?.success) {
          promoCodeUsed = appliedPromo.code
        } else {
          console.error("Erreur lors de l'utilisation du code promo:", promoResult?.error)
          setError("Erreur lors de l'application du code promo.")
          return
        }
      }

      const result = await PaymentService.processStripePayment(finalAmount, cardData)

      if (result.success) {
        const subscriptionData = {
          plan: safePlan.id,
          status: "active",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "stripe",
          transactionId: result.transactionId,
          amount: finalAmount,
          promoCodeUsed: promoCodeUsed,
        }

        const updateSuccess = StorageService.updateSubscription(userId, subscriptionData)

        if (updateSuccess) {
          setSuccess(true)
          setTimeout(() => {
            onSuccess()
            onClose()
          }, 2000)
        } else {
          throw new Error("Erreur lors de la mise à jour de l'abonnement")
        }
      } else {
        setError(result.error || "Erreur lors du paiement")
      }
    } catch (error: any) {
      setError(error.message || "Erreur lors du paiement")
    } finally {
      setLoading(false)
    }
  }

  const handlePayPalPayment = async () => {
    setLoading(true)
    setError("")

    try {
      let promoCodeUsed = null

      if (appliedPromo) {
        const promoResult = await PromoCodeService.usePromoCode(
          appliedPromo.id,
          userId,
          baseAmount,
          discountAmount,
          finalAmount,
        )
        if (promoResult?.success) {
          promoCodeUsed = appliedPromo.code
        } else {
          console.error("Erreur lors de l'utilisation du code promo:", promoResult?.error)
          setError("Erreur lors de l'application du code promo.")
          return
        }
      }

      const result = await PaymentService.processPayPalPayment(finalAmount)

      if (result.success) {
        const subscriptionData = {
          plan: safePlan.id,
          status: "active",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: "paypal",
          transactionId: result.transactionId,
          amount: finalAmount,
          promoCodeUsed: promoCodeUsed,
        }

        const updateSuccess = StorageService.updateSubscription(userId, subscriptionData)

        if (updateSuccess) {
          setSuccess(true)
          setTimeout(() => {
            onSuccess()
            onClose()
          }, 2000)
        } else {
          throw new Error("Erreur lors de la mise à jour de l'abonnement")
        }
      } else {
        setError(result.error || "Erreur lors du paiement")
      }
    } catch (error: any) {
      setError(error.message || "Erreur lors du paiement")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <CheckCircle className="h-6 w-6 mr-2" />
              Paiement réussi !
            </DialogTitle>
            <DialogDescription>
              Votre abonnement {safePlan.name} a été activé avec succès sur Fixeo.pro
              {appliedPromo && (
                <div className="mt-2 text-green-600">Code promo "{appliedPromo.code}" appliqué avec succès !</div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">Redirection vers votre profil...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finaliser votre abonnement - Fixeo.pro</DialogTitle>
          <DialogDescription>
            Abonnement {safePlan.name} - {baseAmount > 0 ? `${baseAmount}€/mois` : "Prix à définir"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Récapitulatif avec code promo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Récapitulatif de commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Section code promo */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center mb-3">
                  <Gift className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="font-medium text-sm">Code promo</span>
                </div>

                {!appliedPromo ? (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Entrez votre code promo"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="flex-1"
                        disabled={promoLoading}
                      />
                      <Button
                        onClick={handleApplyPromoCode}
                        disabled={!promoCode.trim() || promoLoading}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Appliquer"}
                      </Button>
                    </div>
                    {promoError && <p className="text-red-600 text-xs">{promoError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <div>
                        <span className="font-medium text-green-800">{appliedPromo.code}</span>
                        <p className="text-xs text-green-600">{appliedPromo.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleRemovePromoCode}
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Détail des prix - SANS TVA */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Abonnement {safePlan.name}</span>
                  <span className="font-medium">{baseAmount}€/mois</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction ({appliedPromo.code})</span>
                    <span>-{discountAmount.toFixed(2)}€</span>
                  </div>
                )}

                <hr className="my-2" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{finalAmount.toFixed(2)}€</span>
                </div>

                {appliedPromo && (
                  <div className="text-center text-sm text-green-600 font-medium">
                    Vous économisez {discountAmount.toFixed(2)}€ !
                  </div>
                )}
              </div>

              {/* Fonctionnalités incluses */}
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <h4 className="font-medium mb-2 text-blue-900">✨ Inclus dans votre abonnement :</h4>
                <ul className="text-sm space-y-1">
                  {safePlan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center text-blue-800">
                      <CheckCircle className="h-3 w-3 text-blue-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Méthodes de paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Choisir votre méthode de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="stripe" disabled={!paymentConfig.stripe.enabled}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Carte bancaire
                  </TabsTrigger>
                  <TabsTrigger value="paypal" disabled={!paymentConfig.paypal.enabled}>
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.641.641 0 0 0 .633.74h3.94a.563.563 0 0 0 .556-.479l.035-.22.671-4.25.043-.28a.563.563 0 0 1 .556-.479h.35c3.73 0 6.65-1.514 7.499-5.895.354-1.836.172-3.368-.676-4.573z" />
                    </svg>
                    PayPal
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="stripe" className="space-y-4">
                    {!paymentConfig.stripe.enabled ? (
                      <div className="text-center py-8 text-gray-500">
                        <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Le paiement par carte n'est pas configuré</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardName">Nom sur la carte</Label>
                          <Input
                            id="cardName"
                            placeholder="Jean Dupont"
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">Numéro de carte</Label>
                          <Input
                            id="cardNumber"
                            placeholder="4242 4242 4242 4242"
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            disabled={loading}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Date d'expiration</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/AA"
                              value={cardData.expiry}
                              onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                              disabled={loading}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={cardData.cvv}
                              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={handleStripePayment}
                          disabled={loading}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Traitement...
                            </>
                          ) : (
                            `Payer ${finalAmount.toFixed(2)}€`
                          )}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="paypal" className="space-y-4">
                    {!paymentConfig.paypal.enabled ? (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="h-12 w-12 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.641.641 0 0 0 .633.74h3.94a.563.563 0 0 0 .556-.479l.035-.22.671-4.25.043-.28a.563.563 0 0 1 .556-.479h.35c3.73 0 6.65-1.514 7.499-5.895.354-1.836.172-3.368-.676-4.573z" />
                        </svg>
                        <p>PayPal n'est pas configuré</p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-600">
                            Montant à payer : <strong>{finalAmount.toFixed(2)}€</strong>
                          </p>
                        </div>
                        <Button
                          onClick={handlePayPalPayment}
                          disabled={loading}
                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Traitement...
                            </>
                          ) : (
                            `Payer avec PayPal - ${finalAmount.toFixed(2)}€`
                          )}
                        </Button>
                        <div id="paypal-button-container" className="mt-4"></div>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="text-xs text-gray-500 text-center mt-4 space-y-1">
          <p>🔒 Paiement 100% sécurisé - Vos données sont protégées</p>
          <p>Vous pouvez annuler votre abonnement à tout moment depuis votre profil</p>
          <p>Support client disponible 7j/7 - contact@fixeo.pro</p>
        </div>

        <div className="flex justify-start mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
