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
  Star,
  Camera,
  Play,
  Pause,
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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null)
  const [clientMessageDialogOpen, setClientMessageDialogOpen] = useState(false)
  const [clientMessage, setClientMessage] = useState("")
  const [selectedReparateurId, setSelectedReparateurId] = useState<string | null>(null)
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false)
  const [reminderMessage, setReminderMessage] = useState("")
  const [confirmMessage, setConfirmMessage] = useState("")
  const [reparateurMessageDialogOpen, setReparateurMessageDialogOpen] = useState(false)
  const [reparateurMessage, setReparateurMessage] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([])

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
        status: "pending",
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

  const handleConfirmTakeover = async () => {
    if (!selectedResponseId) return

    try {
      const { StorageService } = await import("@/services/storage.service")

      const success = StorageService.confirmRepairTakeover(id, selectedResponseId, confirmMessage)
      if (success) {
        fetchData()
        setConfirmDialogOpen(false)
        setConfirmMessage("")
        toast({
          title: "Prise en charge confirmée",
          description: "Vous avez confirmé la prise en charge de cette demande.",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la confirmation.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Erreur lors de la confirmation:", err)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la confirmation.",
        variant: "destructive",
      })
    }
  }

  const handleStartWork = async (responseId: string) => {
    try {
      const { StorageService } = await import("@/services/storage.service")

      const success = StorageService.startRepairWork(id, responseId)
      if (success) {
        fetchData()
        toast({
          title: "Travaux commencés",
          description: "Vous avez marqué le début des travaux.",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du démarrage des travaux.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Erreur lors du démarrage des travaux:", err)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du démarrage des travaux.",
        variant: "destructive",
      })
    }
  }

  const handleSendReparateurMessage = async () => {
    if (!reparateurMessage.trim() || !selectedResponseId) return

    try {
      const { StorageService } = await import("@/services/storage.service")

      const success = StorageService.addReparateurMessage(id, selectedResponseId, reparateurMessage)
      if (success) {
        fetchData()
        setReparateurMessageDialogOpen(false)
        setReparateurMessage("")
        toast({
          title: "Message envoyé",
          description: "Votre message a été envoyé au client.",
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

  const handleSubmitReview = async () => {
    if (!reviewComment.trim() || !selectedResponseId) return

    try {
      const { StorageService } = await import("@/services/storage.service")

      const success = StorageService.completeRequestWithReview(id, {
        responseId: selectedResponseId,
        rating: reviewRating,
        comment: reviewComment,
        photos: reviewPhotos,
      })

      if (success) {
        fetchData()
        setReviewDialogOpen(false)
        setReviewComment("")
        setReviewRating(5)
        setReviewPhotos([])
        toast({
          title: "Demande terminée",
          description: "Votre avis a été enregistré et la demande est maintenant terminée.",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la finalisation.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Erreur lors de la finalisation:", err)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la finalisation.",
        variant: "destructive",
      })
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
          description:
            "Vous avez accepté la proposition du réparateur. Il doit maintenant confirmer sa prise en charge.",
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

      // Si le réparateur a une réponse acceptée ou confirmée, il peut voir les infos
      if (
        request?.responses?.some(
          (r) =>
            r.reparateurId === currentUser.id &&
            (r.status === "accepted" || r.status === "confirmed" || r.status === "in_progress"),
        )
      ) {
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
      request.responses?.some(
        (r: any) => (r.status === "confirmed" || r.status === "in_progress") && r.reparateurId === currentUser.id,
      )
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
    return (
      isClientOwner() &&
      request &&
      request.status === "in_progress" &&
      request.responses?.some((r: any) => r.status === "confirmed" || r.status === "in_progress")
    )
  }

  const canConfirmTakeover = () => {
    return (
      currentUser &&
      currentUser.userType === "reparateur" &&
      request &&
      request.responses?.some((r: any) => r.reparateurId === currentUser.id && r.status === "accepted")
    )
  }

  const getResponseStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">En attente</Badge>
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepté</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>
      case "confirmed":
        return <Badge className="bg-purple-100 text-purple-800">Confirmé</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inconnu</Badge>
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive ? () => setReviewRating(star) : undefined}
          />
        ))}
      </div>
    )
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
                      {request.responses?.filter((r: any) => r.status === "confirmed" || r.status === "in_progress")
                        .length > 0
                        ? `${request.responses?.filter((r: any) => r.status === "confirmed" || r.status === "in_progress").length} réparateur(s) travaille(nt) actuellement sur cette demande.`
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

                {/* Avis clients */}
                {request.reviews && request.reviews.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Avis du client</h3>
                    <div className="space-y-4">
                      {request.reviews.map((review: any) => (
                        <div key={review.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-600">{review.rating}/5 étoiles</span>
                            </div>
                            <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Réparateur :</span>{" "}
                            {review.reparateur.companyName ||
                              `${review.reparateur.firstName} ${review.reparateur.lastName}`}
                          </div>
                          {review.photos && review.photos.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-2">Photos du travail terminé</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {review.photos.map((photo: string, index: number) => (
                                  <div
                                    key={index}
                                    className="aspect-square bg-gray-200 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                  >
                                    <img
                                      src={photo || "/placeholder.svg"}
                                      alt={`Photo du travail ${index + 1}`}
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
                        </div>
                      ))}
                    </div>
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
                    <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-green-600 border-green-200">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Terminer et noter
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Terminer la demande et laisser un avis</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          <div>
                            <Label>Sélectionnez le réparateur à noter</Label>
                            <div className="mt-2 space-y-2">
                              {request.responses
                                ?.filter((r: any) => r.status === "confirmed" || r.status === "in_progress")
                                .map((response: any) => (
                                  <div
                                    key={response.id}
                                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                      selectedResponseId === response.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200"
                                    }`}
                                    onClick={() => setSelectedResponseId(response.id)}
                                  >
                                    <div className="font-medium">
                                      {response.reparateur?.companyName ||
                                        `${response.reparateur?.firstName || "Réparateur"} ${response.reparateur?.lastName || ""}`}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {selectedResponseId && (
                            <>
                              <div>
                                <Label>Note (sur 5 étoiles)</Label>
                                <div className="mt-2">{renderStars(reviewRating, true)}</div>
                              </div>

                              <div>
                                <Label htmlFor="reviewComment">Votre avis</Label>
                                <Textarea
                                  id="reviewComment"
                                  placeholder="Décrivez votre expérience avec ce réparateur..."
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                  rows={4}
                                />
                              </div>

                              <div>
                                <Label>Photos du travail terminé (optionnel)</Label>
                                <div className="mt-2">
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                      const files = Array.from(e.target.files || [])
                                      files.forEach((file) => {
                                        const reader = new FileReader()
                                        reader.onload = (event) => {
                                          const result = event.target?.result as string
                                          setReviewPhotos((prev) => [...prev, result])
                                        }
                                        reader.readAsDataURL(file)
                                      })
                                    }}
                                    className="hidden"
                                    id="review-photos"
                                  />
                                  <label
                                    htmlFor="review-photos"
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors block"
                                  >
                                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Cliquez pour sélectionner des photos</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Ajoutez des photos du travail terminé pour aider les futurs clients
                                    </p>
                                  </label>

                                  {reviewPhotos.length > 0 && (
                                    <div className="mt-4">
                                      <p className="text-sm font-medium mb-2">Photos sélectionnées :</p>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {reviewPhotos.map((photo, index) => (
                                          <div key={index} className="relative">
                                            <img
                                              src={photo || "/placeholder.svg"}
                                              alt={`Photo ${index + 1}`}
                                              className="w-full h-20 object-cover rounded-md"
                                            />
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setReviewPhotos((prev) => prev.filter((_, i) => i !== index))
                                              }
                                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                            >
                                              ×
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <Button
                                onClick={handleSubmitReview}
                                disabled={!reviewComment.trim()}
                                className="w-full bg-green-600 hover:bg-green-700"
                              >
                                Terminer et publier l'avis
                              </Button>
                            </>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="flex space-x-2">
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

                  {canConfirmTakeover() && (
                    <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Confirmer la prise en charge
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmer la prise en charge</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-sm text-blue-800">
                              En confirmant, vous vous engagez à effectuer cette réparation selon les conditions
                              convenues.
                            </p>
                          </div>
                          <div>
                            <Label htmlFor="confirmMessage">Message de confirmation (optionnel)</Label>
                            <Textarea
                              id="confirmMessage"
                              placeholder="Confirmez votre disponibilité et les détails pratiques..."
                              value={confirmMessage}
                              onChange={(e) => setConfirmMessage(e.target.value)}
                              rows={3}
                            />
                          </div>
                          <Button onClick={handleConfirmTakeover} className="w-full bg-purple-600 hover:bg-purple-700">
                            Confirmer la prise en charge
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
                          response.status === "confirmed" || response.status === "in_progress"
                            ? "border-purple-500 bg-purple-50"
                            : response.status === "accepted"
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

                        {/* Messages du réparateur */}
                        {response.reparateurMessages && response.reparateurMessages.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <h4 className="text-sm font-medium mb-2">Messages du réparateur</h4>
                            <div className="space-y-2">
                              {response.reparateurMessages.map((msg: any, idx: number) => (
                                <div key={idx} className="bg-purple-50 p-2 rounded-md text-sm">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-purple-800">Réparateur</span>
                                    <span className="text-xs text-gray-500">{formatDate(msg.createdAt)}</span>
                                  </div>
                                  <p className="text-gray-700">{msg.text}</p>
                                </div>
                              ))}
                            </div>
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
                        {isClientOwner() &&
                          (response.status === "accepted" ||
                            response.status === "confirmed" ||
                            response.status === "in_progress") && (
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

                        {/* Actions pour le réparateur */}
                        {currentUser &&
                          currentUser.userType === "reparateur" &&
                          currentUser.id === response.reparateurId && (
                            <div className="mt-3 pt-3 border-t">
                              {response.status === "accepted" ? (
                                <div className="bg-green-50 p-2 rounded-md flex items-center justify-between">
                                  <div className="flex items-center">
                                    <UserCheck className="h-4 w-4 text-green-600 mr-2" />
                                    <span className="text-sm text-green-800">
                                      Votre proposition a été acceptée. Confirmez votre prise en charge.
                                    </span>
                                  </div>
                                </div>
                              ) : response.status === "confirmed" ? (
                                <div className="space-y-2">
                                  <div className="bg-purple-50 p-2 rounded-md flex items-center justify-between">
                                    <div className="flex items-center">
                                      <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                      <span className="text-sm text-purple-800">Prise en charge confirmée</span>
                                    </div>
                                    {response.status === "confirmed" && (
                                      <Button
                                        size="sm"
                                        onClick={() => handleStartWork(response.id)}
                                        className="bg-yellow-600 hover:bg-yellow-700"
                                      >
                                        <Play className="h-4 w-4 mr-1" />
                                        Commencer les travaux
                                      </Button>
                                    )}
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedResponseId(response.id)
                                      setReparateurMessage("")
                                      setReparateurMessageDialogOpen(true)
                                    }}
                                  >
                                    <Send className="h-4 w-4 mr-1" />
                                    Envoyer un message au client
                                  </Button>
                                </div>
                              ) : response.status === "in_progress" ? (
                                <div className="space-y-2">
                                  <div className="bg-yellow-50 p-2 rounded-md flex items-center">
                                    <Pause className="h-4 w-4 text-yellow-600 mr-2" />
                                    <span className="text-sm text-yellow-800">Travaux en cours</span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedResponseId(response.id)
                                      setReparateurMessage("")
                                      setReparateurMessageDialogOpen(true)
                                    }}
                                  >
                                    <Send className="h-4 w-4 mr-1" />
                                    Envoyer un message au client
                                  </Button>
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

      {/* Dialog pour envoyer un message du réparateur au client */}
      <Dialog open={reparateurMessageDialogOpen} onOpenChange={setReparateurMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer un message au client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label htmlFor="reparateurMessage">Votre message</Label>
            <Textarea
              id="reparateurMessage"
              placeholder="Écrivez votre message au client..."
              value={reparateurMessage}
              onChange={(e) => setReparateurMessage(e.target.value)}
              rows={4}
            />
            <Button
              onClick={handleSendReparateurMessage}
              disabled={!reparateurMessage.trim() || !selectedResponseId}
              className="w-full"
            >
              Envoyer le message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
