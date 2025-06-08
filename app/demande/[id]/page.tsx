"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, User, Phone, Mail, MessageSquare, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DemandeDetailsPage() {
  const params = useParams()
  const id = params.id as string

  const [request, setRequest] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [responseText, setResponseText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Délai pour éviter les erreurs d'hydratation
    const timer = setTimeout(() => {
      fetchData()
    }, 100)

    return () => clearTimeout(timer)
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Vérifier que nous sommes côté client
      if (typeof window === "undefined") {
        return
      }

      // Import dynamique pour éviter les erreurs côté serveur
      const { StorageService } = await import("@/lib/storage")

      // Initialiser les données si nécessaire
      StorageService.initDemoData()

      // Récupérer la demande et l'utilisateur actuel
      const loadedRequest = StorageService.getRepairRequestById(id)
      const user = StorageService.getCurrentUser()

      if (!loadedRequest) {
        setError("Demande non trouvée")
        return
      }

      setRequest(loadedRequest)
      setCurrentUser(user)
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

      const { StorageService } = await import("@/lib/storage")

      // Créer la réponse
      const response = {
        id: `response_${Date.now()}`,
        text: responseText,
        reparateurId: currentUser?.id || "unknown",
        reparateur: {
          firstName: currentUser?.firstName || "Réparateur",
          lastName: currentUser?.lastName || "",
          companyName: currentUser?.professional?.companyName,
        },
        createdAt: new Date().toISOString(),
      }

      // Ajouter la réponse à la demande
      StorageService.addResponseToRequest(id, response)

      // Mettre à jour l'état local
      setTimeout(() => {
        fetchData()
        setResponseText("")
        setIsSubmitting(false)
        setDialogOpen(false)
      }, 1000)
    } catch (err) {
      console.error("Erreur lors de l'envoi de la réponse:", err)
      setIsSubmitting(false)
    }
  }

  const canViewContactInfo = () => {
    try {
      if (!currentUser || currentUser.userType !== "reparateur") return false

      // Vérifier si l'utilisateur a un abonnement actif ou est en période d'essai
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Détails de la demande */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl">{request.title || "Demande sans titre"}</CardTitle>
                <Badge className={`${getUrgencyColor(request.urgency)} text-white`}>
                  {getUrgencyLabel(request.urgency)}
                </Badge>
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

                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Client</p>
                      <p>
                        {request.client?.firstName || "Client"} {request.client?.lastName || ""}
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
                              // Ouvrir l'image en grand (optionnel)
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
                    {/* Simuler une carte */}
                    <div className="h-full w-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                      <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="font-medium">{request.city || "Ville non spécifiée"}</p>
                        <p className="text-sm text-gray-600">{request.postalCode || ""}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations de contact (visibles uniquement pour les réparateurs avec abonnement) */}
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
                          <span>{request.client?.phone || "06 12 34 56 78"}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-500 mr-2" />
                          <span>{request.client?.email || "client@example.com"}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 p-3 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-yellow-800">
                            Les coordonnées du client sont visibles uniquement avec un abonnement actif ou pendant la
                            période d'essai.
                          </p>
                          <Button asChild variant="link" className="p-0 h-auto text-yellow-800 underline">
                            <Link href="/tarifs">Voir les abonnements</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bouton de réponse (pour les réparateurs) */}
                {currentUser && currentUser.userType === "reparateur" && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">Répondre à cette demande</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Répondre à la demande</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-sm text-gray-500">
                          Votre message sera envoyé au client. Précisez votre disponibilité, tarif estimatif et toute
                          question complémentaire.
                        </p>
                        <Textarea
                          placeholder="Votre réponse..."
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          rows={6}
                        />
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
              </CardContent>
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
                      <div key={response.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">
                            {response.reparateur?.companyName ||
                              `${response.reparateur?.firstName || "Réparateur"} ${response.reparateur?.lastName || ""}`}
                          </div>
                          <div className="text-xs text-gray-500">{formatDate(response.createdAt)}</div>
                        </div>
                        <p className="text-gray-700">{response.text}</p>
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
    </div>
  )
}
