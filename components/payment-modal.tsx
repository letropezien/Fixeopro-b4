"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, Smartphone, CheckCircle, AlertCircle } from "lucide-react"
import { StorageService } from "@/lib/storage"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: {
    id: string
    name: string
    price: string
    features: string[]
  }
  userId: string
}

export default function PaymentModal({ isOpen, onClose, plan, userId }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  const [paypalData, setPaypalData] = useState({
    email: "",
    password: "",
  })

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulation du paiement
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simuler une chance d'échec de 10%
      if (Math.random() < 0.1) {
        throw new Error("Paiement refusé par votre banque")
      }

      // Mettre à jour l'abonnement de l'utilisateur
      const subscriptionData = {
        plan: plan.id,
        status: "active",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
        paymentMethod: paymentMethod,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }

      const updateSuccess = StorageService.updateSubscription(userId, subscriptionData)

      if (updateSuccess) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          window.location.reload() // Recharger pour mettre à jour le profil
        }, 2000)
      } else {
        throw new Error("Erreur lors de la mise à jour de l'abonnement")
      }
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue lors du paiement")
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
            <DialogDescription>Votre abonnement {plan.name} a été activé avec succès.</DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">Vous allez être redirigé vers votre profil...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Finaliser votre abonnement</DialogTitle>
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
              <CardTitle className="text-lg">Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Abonnement {plan.name}</span>
                <span className="font-medium">{plan.price}/mois</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>TVA (20%)</span>
                <span>{(Number.parseFloat(plan.price.replace("€", "")) * 0.2).toFixed(2)}€</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{(Number.parseFloat(plan.price.replace("€", "")) * 1.2).toFixed(2)}€</span>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Inclus dans votre abonnement :</h4>
                <ul className="text-sm space-y-1">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Méthode de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="card" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Carte bancaire
                  </TabsTrigger>
                  <TabsTrigger value="paypal" className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2" />
                    PayPal
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handlePayment} className="mt-4">
                  <TabsContent value="card" className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Nom sur la carte</Label>
                      <Input
                        id="cardName"
                        placeholder="Jean Dupont"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Numéro de carte</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        required
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
                          required
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
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal" className="space-y-4">
                    <div>
                      <Label htmlFor="paypalEmail">Email PayPal</Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        placeholder="votre@email.com"
                        value={paypalData.email}
                        onChange={(e) => setPaypalData({ ...paypalData, email: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="paypalPassword">Mot de passe PayPal</Label>
                      <Input
                        id="paypalPassword"
                        type="password"
                        placeholder="••••••••"
                        value={paypalData.password}
                        onChange={(e) => setPaypalData({ ...paypalData, password: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </TabsContent>

                  <div className="flex space-x-3 mt-6">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1">
                      Annuler
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
                      {loading
                        ? "Traitement..."
                        : `Payer ${(Number.parseFloat(plan.price.replace("€", "")) * 1.2).toFixed(2)}€`}
                    </Button>
                  </div>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="text-xs text-gray-500 text-center mt-4">
          <p>🔒 Paiement sécurisé - Vos données sont protégées</p>
          <p>Vous pouvez annuler votre abonnement à tout moment depuis votre profil</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
