"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  MessageSquare,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Euro,
  Lock,
  ThumbsUp,
  ThumbsDown,
  Send,
  UserCheck,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function DemandeDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const { toast } = useToast()

  const [request, setRequest] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [responseText, setResponseText] = useState("")
  const [responsePrice, setResponsePrice] = useState("")
  const [responseTime, setResponseTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [selectResponseDialogOpen, setSelectResponseDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null)
  const [clientMessageDialogOpen, setClientMessageDialogOpen] = useState(false)
  const [clientMessage, setClientMessage] = useState("")
  const [selectedReparateurId, setSelectedReparateurId] = useState<string | null>(null)
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false)
  const [reminderMessage, setReminderMessage] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData()
    }, 100)

    return () => clearTimeout(timer)
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (typeof window === "undefined") {
        return
      }

      const { StorageService } = await import("@/services/storage.service")

      StorageService.initDemoData()

      const loadedRequest = StorageService.getRepairRequestById(id)
      const user = StorageService.getCurrentUser()

      if (!loadedRequest) {
        setError("Demande non trouvée")
        return
      }

      setRequest(loadedRequest)
      setCurrentUser(user)

      if (loadedRequest.selectedResponseIds && loadedRequest.selectedResponseIds.length > 0) {
        setSelectedResponseId(loadedRequest.selectedResponseIds[0])
      }
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err)
      setError("Erreur lors du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (err) {
      return "Date non disponible"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-500"
      case "same-day":
        return "bg-orange-500"
      case "this-week":
        return "bg-yellow-500"
      case "flexible":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500 text-white">Ouverte</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-500 text-white">En cours</Badge>
      case "completed":
        return <Badge className="bg-green-500 text-white">Terminée</Badge>
      case "cancelled":
        return <Badge className="bg-red-500 text-white">Annulée</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">Inconnue</Badge>
    }
  }

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "Urgent"
      case "same-day":
        return "Aujourd'hui"
      case "this-week":
        return "Cette semaine"
      case "flexible":
        return "Flexible"
      default:
        return "Non spécifié"
    }
  }

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) return

    try {
      setIsSubmitting(true)

      const { StorageService } = await import("@/services/storage.service")

      const response = {
        id: `response_${Date.now()}`,
        text: responseText,
        price: responsePrice || undefined,
        estimatedTime: responseTime || undefined,
        reparateurId: currentUser?.id || "unknown",
        reparateur: {
          firstName: currentUser?.firstName || "Réparateur",
          lastName: currentUser?.lastName || "",
          companyName: currentUser?.professional?.companyName,
        },
        createdAt: new Date().toISOString(),
        status: "pending", // Nouveau statut: pending, accepted, rejected
      }

      StorageService.addResponseToRequest(id, response)

      setTimeout(() => {
        fetchData()
        setResponseText("")
        setResponsePrice("")
        setResponseTime("")
        setIsSubmitting(false)
        setDialogOpen(false)

        toast({
          title: "Réponse envoyée",
          description: "Votre proposition a été envoyée au client.",
        })
      }, 1000)
    } catch (err) {
      console.error("Erreur lors de l'envoi de la réponse:", err)
      setIsSubmitting(false)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre réponse.",
        variant: "destructive",
      })
    }
  }

  const handleSelectResponse = async () => {
    if (!selectedResponseId) return

    try {
      const { StorageService } = await import("@/services/storage.service")

      const success = StorageService.selectResponse(id, selectedResponseId)
      if (success) {
        fetchData()
        setSelectResponseDialogOpen(false)
        toast({
          title: "Réparateur sélectionné",
          description: "Vous avez sélectionné un réparateur pour cette demande.",
        })
      } else {
        setError("Erreur lors de la sélection du réparateur")
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la sélection du réparateur.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Erreur lors de la sélection du réparateur:", err)
      setError("Erreur lors de la sélection du réparateur")
    }
  }

  const handleSendClientMessage = async () => {
    if (!clientMessage.trim() || !selectedReparateurId) return

    try {
      const { StorageService } = await import("@/services/storage.service")

      const success = StorageService.addClientMessageToResponse(id, selectedReparateurId, clientMessage)
      if (success) {
        fetchData()
        setClientMessageDialogOpen(false)
        setClientMessage("")
        setSelectedReparateurId(null)
        toast({
          title: "Message envoyé",
          description: "Votre message a été envoyé au réparateur.",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi du message.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive",
      })
    }
  }

  const handleSendReminder = async () => {
    if (!reminderMessage.trim() || !selectedReparateurId) return

    try {
      const { StorageService } = await import("@/services/storage.service")

      const success = StorageService.addReminderToResponse(id, selectedReparateurId, reminderMessage)
      if (success) {
        fetchData()
        setReminderDialogOpen(false)
        setReminderMessage("")
        setSelectedReparateurId(null)
        toast({
          title: "Rappel envoyé",
          description: "Votre rappel a été envoyé au réparateur.",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi du rappel.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du rappel:", err)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du rappel.",
        variant: "destructive",
      })
    }
  }

  const handleCancelRequest = async () => {
    try {
      const { StorageService } = await import("@/services/storage.service")

      const success = StorageService.cancelRequest(id, cancelReason)
      if (success) {
        fetchData()
        setCancelDialogOpen(false)
        setCancelReason("")
        toast({
          title: "Demande annulée",
          description: "Votre demande a été annulée avec succès.",
        })
      } else {
        setError("Erreur lors de l'annulation de la demande")
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'annulation de la demande.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Erreur lors de l'annulation de la demande:", err)
      setError("Erreur lors de l'annulation de la demande")
    }
  }

  const handleCompleteRequest = async () => {
    try {
      const { StorageService } = await import("@/services/storage.service")

      const success = StorageService.completeRequest(id)
      if (success) {
        fetchData()
        setCompleteDialogOpen(false)
        toast({
          title: "Demande terminée",
          description: "Votre demande a été marquée comme terminée.",
        })
      } else {
        setError("Erreur lors de la complétion de la demande")
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la complétion de la demande.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Erreur lors de la complétion de la demande:", err)
      setError("Erreur lors de la complétion de la demande")
    }
  }

  const handleAcceptResponse = async (responseId: string) => {
    try {
      const { StorageService } = await import("@/services/storage.service")

      const success = StorageService.updateResponseStatus(id, responseId, "accepted")
      if (success) {
        fetchData()
        toast({
          title: "Proposition acceptée",
          description: "Vous avez accepté la proposition du réparateur.",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'acceptation de la proposition.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Erreur lors de l'acceptation de la proposition:", err)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'acceptation de la proposition.",
        variant: "destructive",
      })
    }
  }

  const handleRejectResponse = async (responseId: string) => {
    try {
      const { StorageService } = await import("@/services/storage.service")

      const success = StorageService.updateResponseStatus(id, responseId, "rejected")
      if (success) {
        fetchData()
        toast({
          title: "Proposition refusée",
          description: "Vous avez refusé la proposition du réparateur.",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du refus de la proposition.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Erreur lors du refus de la proposition:", err)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du refus de la proposition.",
        variant: "destructive",
      })
    }
  }

  const canViewContactInfo = () => {
    try {
      if (!currentUser) return false

      // Les admins peuvent toujours voir
      if (currentUser.userType === "admin") return true

      // Le client propriétaire peut voir ses propres infos
      if (currentUser.userType === "client" && currentUser.id === request?.clientId) return true

      // Les autres clients ne peuvent pas voir
      if (currentUser.userType === "client") return false

      // Pour les réparateurs, vérifier l'abonnement ou la période d'essai
      if (currentUser.userType !== "reparateur") return false

      // Si le réparateur a une réponse acceptée, il peut voir les infos
      if (request?.responses?.some((r) => r.reparateurId === currentUser.id && r.status === "accepted")) {
        return true
      }

      if (currentUser.subscription?.status === "active") return true
      if (currentUser.subscription?.status === "trial") {
        const expiresAt = new Date(currentUser.subscription.endDate)
        return expiresAt > new Date()
      }
      return false
    } catch (err) {
      return false
    }
  }

  const isClientOwner = () => {
    return currentUser && request && currentUser.id === request.clientId
  }

  const isSelectedRepairer = () => {
    return (
      currentUser &&
      request &&
      request.responses?.some((r: any) => r.status === "accepted" && r.reparateurId === currentUser.id)
    )
  }

  const hasAlreadyResponded = () => {
    return (
      currentUser &&
      request &&
      request.responses &&
      request.responses.some((r: any) => r.reparateurId === currentUser.id)
    )
  }

  const canRespond = () => {
    return (
      currentUser &&
      currentUser.userType === "reparateur" &&
      request &&
      request.status === "open" &&
      !hasAlreadyResponded()
    )
  }

  const canCancel = () => {
    return isClientOwner() && request && (request.status === "open" || request.status === "in_progress")
  }

  const canComplete = () => {
    return (isClientOwner() || isSelectedRepairer()) && request && request.status === "in_progress"
  }

  const canSelectRepairer = () => {
    return isClientOwner() && request && request.status === "open" && request.responses && request.responses.length > 0
  }

  const getResponseStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">En attente</Badge>
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepté</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inconnu</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg">Chargement des détails de la demande...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">
              {error === "Demande non trouvée" ? "Demande non trouvée" : "Erreur de chargement"}
            </h1>
            <p className="text-lg mb-6">
              {error === "Demande non trouvée"
                ? "La demande que vous recherchez n'existe pas ou a été supprimée."
                : "Une erreur s'est produite lors du chargement des détails."}
            </p>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/demandes-disponibles">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux demandes
                </Link>
              </Button>
              <Button variant="outline" onClick={fetchData}>
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/demandes-disponibles" className="text-blue-600 hover:underline flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux demandes disponibles
          </Link>
        </div>

        {/* Bannière de statut */}
        {request.status !== "open" && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              request.status === "in_progress"
                ? "bg-yellow-50 border border-yellow-200"
                : request.status === "completed"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {request.status === "in_progress" && (
                <>
                  <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Demande en cours de traitement</h3>
                    <p className="text-sm text-yellow-700">
                      {request.responses?.filter((r: any) => r.status === "accepted").length > 0
                        ? `${request.responses?.filter((r: any) => r.status === "accepted").length} réparateur(s) travaille(nt) actuellement sur cette demande.`
                        : "Un réparateur a été sélectionné et travaille actuellement sur cette demande."}
                    </p>
                  </div>
                </>
              )}
              {request.status === "completed" && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-green-800">Demande terminée</h3>
                    <p className="text-sm text-green-700">
                      Cette demande a été marquée comme terminée le{" "}
                      {formatDate(request.completedAt || request.createdAt)}.
                    </p>
                  </div>
                </>
              )}
              {request.status === "cancelled" && (
                <>
                  <XCircle className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-red-800">Demande annulée</h3>
                    <p className="text-sm text-red-700">
                      Cette demande a été annulée le {formatDate(request.cancelledAt || request.createdAt)}.
                      {request.cancelReason && ` Raison: ${request.cancelReason}`}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Détails de la demande */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl">{request.title || "Demande sans titre"}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getUrgencyColor(request.urgency)} text-white`}>
                    {getUrgencyLabel(request.urgency)}
                  </Badge>
                  {getStatusBadge(request.status || "open")}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{request.description || "Aucune description disponible"}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Date de publication</p>
                      <p>{formatDate(request.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Localisation</p>
                      <p>
                        {request.city || "Ville non spécifiée"} {request.postalCode && `(${request.postalCode})`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Urgence</p>
                      <p>{getUrgencyLabel(request.urgency)}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <span className="font-medium">Client:</span>
                      <p className="text-gray-600">
                        {canViewContactInfo() ? (
                          <>
                            {request.client?.firstName || "Client"} {request.client?.lastName || ""}
                          </>
                        ) : (
                          <span className="flex items-center">
                            <Lock className="h-3 w-3 mr-1" />
                            <span className="text-gray-400">Informations masquées</span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Photos si disponibles */}
                {request.photos && request.photos.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Photos du problème</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {request.photos.map((photo: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-200 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Photo du problème ${index + 1}`}
                            className="w-full h-full object-cover"
                            onClick={() => {
                              window.open(photo, "_blank")
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Carte interactive */}
                <div>
                  <h3 className="font-semibold mb-2">Localisation</h3>
                  <div className="bg-gray-200 rounded-lg h-64 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                      <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="font-medium">{request.city || "Ville non spécifiée"}</p>
                        <p className="text-sm text-gray-600">{request.postalCode || ""}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations de contact */}
                {currentUser && currentUser.userType === "reparateur" && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Informations de contact
                    </h3>

                    {canViewContactInfo() ? (
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-500 mr-2" />
                          <span>{request.client?.phone || "Non renseigné"}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-500 mr-2" />
                          <span>{request.client?.email || "Non renseigné"}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 p-3 rounded-md flex items-start">
                        <Lock className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-yellow-800 font-medium">Informations de contact masquées</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Souscrivez à un abonnement ou profitez de votre période d'essai de 15 jours pour accéder aux
                            coordonnées complètes des clients.
                          </p>
                          <Button asChild size="sm" className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white">
                            <Link href="/tarifs">Voir les abonnements</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  {canCancel() && (
                    <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-red-600 border-red-200">
                          <XCircle className="h-4 w-4 mr-2" />
                          Annuler la demande
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Annuler la demande</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <Label htmlFor="cancelReason">Raison de l'annulation (optionnel)</Label>
                          <Textarea
                            id="cancelReason"
                            placeholder="Expliquez pourquoi vous annulez cette demande..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                          />
                          <Button onClick={handleCancelRequest} className="w-full bg-red-600 hover:bg-red-700">
                            Confirmer l'annulation
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {canComplete() && (
                    <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-green-600 border-green-200">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marquer comme terminée
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Marquer comme terminée</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-sm text-gray-600">
                            Êtes-vous sûr que cette demande de réparation est terminée ?
                          </p>
                          <Button onClick={handleCompleteRequest} className="w-full bg-green-600 hover:bg-green-700">
                            Confirmer la fin des travaux
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div>
                  {canRespond() && (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">Répondre à cette demande</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Répondre à la demande</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="responseText">Votre réponse *</Label>
                            <Textarea
                              id="responseText"
                              placeholder="Décrivez votre approche, votre disponibilité et toute question..."
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="responsePrice">Prix estimé (€)</Label>
                              <Input
                                id="responsePrice"
                                type="number"
                                placeholder="150"
                                value={responsePrice}
                                onChange={(e) => setResponsePrice(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="responseTime">Délai estimé</Label>
                              <Input
                                id="responseTime"
                                placeholder="2-3 jours"
                                value={responseTime}
                                onChange={(e) => setResponseTime(e.target.value)}
                              />
                            </div>
                          </div>
                          <Button
                            onClick={handleSubmitResponse}
                            disabled={isSubmitting || !responseText.trim()}
                            className="w-full"
                          >
                            {isSubmitting ? "Envoi en cours..." : "Envoyer ma réponse"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Réponses */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Réponses ({request.responses?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {request.responses && request.responses.length > 0 ? (
                  <div className="space-y-4">
                    {request.responses.map((response: any) => (
                      <div
                        key={response.id}
                        className={`border rounded-lg p-4 ${
                          response.status === "accepted"
                            ? "border-green-500 bg-green-50"
                            : response.status === "rejected"
                              ? "border-red-200 bg-red-50"
                              : ""
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">
                            {response.reparateur?.companyName ||
                              `${response.reparateur?.firstName || "Réparateur"} ${response.reparateur?.lastName || ""}`}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-gray-500">{formatDate(response.createdAt)}</div>
                            {getResponseStatusBadge(response.status || "pending")}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{response.text}</p>
                        {response.price && (
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Euro className="h-4 w-4 mr-1" />
                            <span>Prix: {response.price}€</span>
                          </div>
                        )}
                        {response.estimatedTime && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Délai: {response.estimatedTime}</span>
                          </div>
                        )}

                        {/* Messages du client */}
                        {response.clientMessages && response.clientMessages.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <h4 className="text-sm font-medium mb-2">Messages du client</h4>
                            <div className="space-y-2">
                              {response.clientMessages.map((msg: any, idx: number) => (
                                <div key={idx} className="bg-blue-50 p-2 rounded-md text-sm">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-blue-800">Client</span>
                                    <span className="text-xs text-gray-500">{formatDate(msg.createdAt)}</span>
                                  </div>
                                  <p className="text-gray-700">{msg.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Rappels */}
                        {response.reminders && response.reminders.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <h4 className="text-sm font-medium mb-2">Rappels envoyés</h4>
                            <div className="space-y-2">
                              {response.reminders.map((reminder: any, idx: number) => (
                                <div key={idx} className="bg-yellow-50 p-2 rounded-md text-sm">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-yellow-800">Rappel</span>
                                    <span className="text-xs text-gray-500">{formatDate(reminder.createdAt)}</span>
                                  </div>
                                  <p className="text-gray-700">{reminder.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions pour le client */}
                        {isClientOwner() && response.status === "pending" && (
                          <div className="mt-3 pt-3 border-t flex justify-between">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200"
                              onClick={() => handleAcceptResponse(response.id)}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Accepter
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200"
                              onClick={() => handleRejectResponse(response.id)}
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              Refuser
                            </Button>
                          </div>
                        )}

                        {/* Actions pour le client - Contacter le réparateur */}
                        {isClientOwner() && response.status === "accepted" && (
                          <div className="mt-3 pt-3 border-t flex justify-between">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedReparateurId(response.reparateurId)
                                setClientMessage("")
                                setClientMessageDialogOpen(true)
                              }}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Envoyer un message
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedReparateurId(response.reparateurId)
                                setReminderMessage("")
                                setReminderDialogOpen(true)
                              }}
                            >
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Envoyer un rappel
                            </Button>
                          </div>
                        )}

                        {/* Statut pour le réparateur */}
                        {currentUser &&
                          currentUser.userType === "reparateur" &&
                          currentUser.id === response.reparateurId && (
                            <div className="mt-3 pt-3 border-t">
                              {response.status === "accepted" ? (
                                <div className="bg-green-50 p-2 rounded-md flex items-center">
                                  <UserCheck className="h-4 w-4 text-green-600 mr-2" />
                                  <span className="text-sm text-green-800">
                                    Votre proposition a été acceptée par le client
                                  </span>
                                </div>
                              ) : response.status === "rejected" ? (
                                <div className="bg-red-50 p-2 rounded-md flex items-center">
                                  <XCircle className="h-4 w-4 text-red-600 mr-2" />
                                  <span className="text-sm text-red-800">
                                    Votre proposition a été refusée par le client
                                  </span>
                                </div>
                              ) : (
                                <div className="bg-blue-50 p-2 rounded-md flex items-center">
                                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                                  <span className="text-sm text-blue-800">En attente de réponse du client</span>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Aucune réponse pour le moment</p>
                    {currentUser && currentUser.userType === "reparateur" && (
                      <p className="text-sm text-gray-500 mt-2">Soyez le premier à répondre à cette demande !</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog pour envoyer un message au réparateur */}
      <Dialog open={clientMessageDialogOpen} onOpenChange={setClientMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer un message au réparateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label htmlFor="clientMessage">Votre message</Label>
            <Textarea
              id="clientMessage"
              placeholder="Écrivez votre message au réparateur..."
              value={clientMessage}
              onChange={(e) => setClientMessage(e.target.value)}
              rows={4}
            />
            <Button
              onClick={handleSendClientMessage}
              disabled={!clientMessage.trim() || !selectedReparateurId}
              className="w-full"
            >
              Envoyer le message
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour envoyer un rappel au réparateur */}
      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer un rappel au réparateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-yellow-50 p-3 rounded-md">
              <p className="text-sm text-yellow-800">
                Utilisez cette fonction si le réparateur ne répond pas ou si vous avez besoin d'une mise à jour sur
                l'avancement des travaux.
              </p>
            </div>
            <Label htmlFor="reminderMessage">Votre message de rappel</Label>
            <Textarea
              id="reminderMessage"
              placeholder="Écrivez votre message de rappel..."
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
              rows={4}
            />
            <Button
              onClick={handleSendReminder}
              disabled={!reminderMessage.trim() || !selectedReparateurId}
              className="w-full"
            >
              Envoyer le rappel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
