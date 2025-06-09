"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle, Mail, Clock, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface ContactModalProps {
  request: any
  onContactSent?: () => void
}

export default function ContactModal({ request, onContactSent }: ContactModalProps) {
  const { data: session, canContact, getTrialDaysLeft } = useAuth()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const trialDaysLeft = getTrialDaysLeft()
  const hasAccess = canContact()

  const handleContact = async () => {
    if (!hasAccess) {
      toast({
        title: "Accès limité",
        description:
          "Vous devez avoir un abonnement actif ou être dans votre période d'essai pour contacter les clients.",
        variant: "destructive",
      })
      return
    }

    if (!message.trim()) {
      toast({
        title: "Message requis",
        description: "Veuillez saisir un message avant d'envoyer.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simuler l'envoi du message
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sauvegarder le contact dans localStorage
      const contacts = JSON.parse(localStorage.getItem("fixeopro_contacts") || "[]")
      const newContact = {
        id: Date.now().toString(),
        requestId: request.id,
        repairerId: session?.user?.id,
        clientId: request.clientId,
        message,
        phone,
        createdAt: new Date().toISOString(),
        status: "sent",
      }

      contacts.push(newContact)
      localStorage.setItem("fixeopro_contacts", JSON.stringify(contacts))

      toast({
        title: "Message envoyé !",
        description: "Votre message a été envoyé au client. Il pourra vous contacter directement.",
      })

      setMessage("")
      setPhone("")
      setIsOpen(false)
      onContactSent?.()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!session?.user || session.user.type !== "repairer") {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={hasAccess ? "default" : "outline"} size="sm" disabled={!hasAccess}>
          <MessageCircle className="h-4 w-4 mr-2" />
          {hasAccess ? "Contacter" : "Abonnement requis"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Contacter le client
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informations sur l'accès */}
          {trialDaysLeft > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-700">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Période d'essai : {trialDaysLeft} jour{trialDaysLeft > 1 ? "s" : ""} restant
                  {trialDaysLeft > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}

          {!hasAccess && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Abonnement requis pour contacter les clients</span>
              </div>
            </div>
          )}

          {/* Informations de la demande */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2">{request.title}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span>Client : {request.clientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>
                  {request.city} ({request.postalCode})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>💰</span>
                <span>Budget : {request.budget}</span>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="phone">Votre téléphone (optionnel)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="06 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!hasAccess}
              />
            </div>

            <div>
              <Label htmlFor="message">Votre message *</Label>
              <Textarea
                id="message"
                placeholder="Bonjour, je suis intéressé par votre demande de dépannage. Je peux intervenir rapidement..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                disabled={!hasAccess}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleContact} disabled={!hasAccess || isLoading || !message.trim()} className="flex-1">
              {isLoading ? "Envoi..." : "Envoyer le message"}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
          </div>

          {!hasAccess && (
            <div className="text-center pt-2">
              <Button variant="link" size="sm">
                Voir les abonnements
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
