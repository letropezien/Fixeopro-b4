"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { StorageService } from "@/lib/storage"

// Types pour PayPal
declare global {
  interface Window {
    paypal?: any
  }
}

interface PaymentIntegrationProps {
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

export default function PaymentIntegration({ isOpen, onClose, plan, userId, onSuccess }: PaymentIntegrationProps) {
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [stripeLoaded, setStripeLoaded] = useState(false)

  // Configuration depuis l'admin
  const [config, setConfig] = useState({
    paypal: { clientId: "", environment: "sandbox" },
    stripe: { publishableKey: "" },
    platform: { taxRate: 20 },
  })

  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  useEffect(() => {
    // Charger la configuration admin
    const adminConfig = localStorage.getItem("fixeo_admin_config")
    if (adminConfig) {
      const parsedConfig = JSON.parse(adminConfig)
      setConfig(parsedConfig)

      // Charger PayPal SDK
      if (parsedConfig.paypal.clientId) {
        loadPayPalSDK(parsedConfig.paypal.clientId, parsedConfig.paypal.environment)
      }

      // Charger Stripe SDK
      if (parsedConfig.stripe.publishableKey) {
        loadStripeSDK()
      }
    }
  }, [])

  const loadPayPalSDK = (clientId: string, environment: string) => {
    if (window.paypal) {
      setPaypalLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=capture`
    script.onload = () => setPaypalLoaded(true)
    script.onerror = () => setError("Erreur lors du chargement de PayPal")
    document.body.appendChild(script)
  }

  const loadStripeSDK = () => {
    if (window.Stripe) {
      setStripeLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://js.stripe.com/v3/"
    script.onload = () => setStripeLoaded(true)
    script.onerror = () => setError("Erreur lors du chargement de Stripe")
    document.body.appendChild(script)
  }

  const calculateTotal = () => {
    const basePrice = Number.parseFloat(plan.price.replace("€", ""))
    const tax = (basePrice * config.platform.taxRate) / 100
    return (basePrice + tax).toFixed(2)
  }

  const handleStripePayment = async () => {
    setLoading(true)
    setError("")

    try {
      // Validation des champs
      if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name) {
        throw new Error("Veuillez remplir tous les champs")
      }

      // Simulation du paiement Stripe
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simuler une réponse de Stripe
      const paymentIntent = {
        id: `pi_${Date.now()}`,
        status: "succeeded",
        amount: Math.round(Number.parseFloat(calculateTotal()) * 100),
        currency: "eur",
      }

      // Mettre à jour l'abonnement
      const subscriptionData = {
        plan: plan.id,
        status: "active",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: "stripe",
        transactionId: paymentIntent.id,
        amount: Number.parseFloat(calculateTotal()),
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
    } catch (error: any) {
      setError(error.message || "Erreur lors du paiement")
    } finally {
      setLoading(false)
    }
  }

  const handlePayPalPayment = () => {
    if (!window.paypal || !paypalLoaded) {
      setError("PayPal n'est pas encore chargé")
      return
    }

    const total = calculateTotal()

    window.paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total,
                  currency_code: "EUR",
                },
                description: `Abonnement ${plan.name} - Fixeo.pro`,
              },
            ],
          })
        },
        onApprove: async (data: any, actions: any) => {
          setLoading(true)
          try {
            const order = await actions.order.capture()

            // Mettre à jour l'abonnement
            const subscriptionData = {
              plan: plan.id,
              status: "active",
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              paymentMethod: "paypal",
              transactionId: order.id,
              amount: Number.parseFloat(total),
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
          } catch (error: any) {
            setError(error.message || "Erreur lors du paiement PayPal")
          } finally {
            setLoading(false)
          }
        },
        onError: (err: any) => {
          setError("Erreur PayPal: " + err.message)
        },
      })
      .render("#paypal-button-container")
  }

  useEffect(() => {
    if (paypalLoaded && paymentMethod === "paypal" && isOpen) {
      // Nettoyer le conteneur PayPal
      const container = document.getElementById("paypal-button-container")
      if (container) {
        container.innerHTML = ""
        handlePayPalPayment()
      }
    }
  }, [paypalLoaded, paymentMethod, isOpen])

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <CheckCircle className="h-6 w-6 mr-2" />
              Paiement réussi !
            </DialogTitle>
            <DialogDescription>Votre abonnement {plan.name} a été activé avec succès sur Fixeo.pro</DialogDescription>
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
            Abonnement {plan.name} - {plan.price}/mois
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Récapitulatif */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Récapitulatif de commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Abonnement {plan.name}</span>
                <span className="font-medium">{plan.price}/mois</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>TVA ({config.platform.taxRate}%)</span>
                <span>
                  {((Number.parseFloat(plan.price.replace("€", "")) * config.platform.taxRate) / 100).toFixed(2)}€
                </span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{calculateTotal()}€</span>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <h4 className="font-medium mb-2 text-blue-900">✨ Inclus dans votre abonnement :</h4>
                <ul className="text-sm space-y-1">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center text-blue-800">
                      <CheckCircle className="h-3 w-3 text-blue-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-md">
                <p className="text-sm text-green-800">
                  🎉 <strong>15 jours d'essai gratuit</strong> - Aucun engagement
                </p>
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
                  <TabsTrigger value="stripe" disabled={!config.stripe.publishableKey}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Carte bancaire
                  </TabsTrigger>
                  <TabsTrigger value="paypal" disabled={!config.paypal.clientId}>
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.641.641 0 0 0 .633.74h3.94a.563.563 0 0 0 .556-.479l.035-.22.671-4.25.043-.28a.563.563 0 0 1 .556-.479h.35c3.73 0 6.65-1.514 7.499-5.895.354-1.836.172-3.368-.676-4.573z" />
                    </svg>
                    PayPal
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="stripe" className="space-y-4">
                    {!config.stripe.publishableKey ? (
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
                            `Payer ${calculateTotal()}€`
                          )}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="paypal" className="space-y-4">
                    {!config.paypal.clientId ? (
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
                            Cliquez sur le bouton PayPal ci-dessous pour finaliser votre paiement
                          </p>
                        </div>
                        <div id="paypal-button-container" className="min-h-[50px]">
                          {!paypalLoaded && (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="h-6 w-6 animate-spin mr-2" />
                              <span>Chargement de PayPal...</span>
                            </div>
                          )}
                        </div>
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
