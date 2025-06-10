"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MapPin,
  Clock,
  MessageSquare,
  Eye,
  User,
  Euro,
  Calendar,
  CheckCircle,
  AlertCircle,
  Send,
  Star,
} from "lucide-react"
import { StorageService } from "@/lib/storage"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function MesInterventionsPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [allRequests, setAllRequests] = useState<any[]>([])
  const [availableRequests, setAvailableRequests] = useState<any[]>([])
  const [myResponses, setMyResponses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [responseForm, setResponseForm] = useState({
    text: "",
    price: "",
    estimatedTime: "",
  })
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = StorageService.getCurrentUser()
      setCurrentUser(user)

      if (user && user.userType === "reparateur") {
        // Récupérer toutes les demandes
        const requests = StorageService.getRepairRequests()
        setAllRequests(requests)

        // Filtrer les demandes disponibles (ouvertes et correspondant aux préférences)
        const filtered = StorageService.getFilteredRequestsForRepairer(user)
        setAvailableRequests(filtered)

        // Récupérer les demandes où j'ai déjà répondu
        const myResponseRequests = requests.filter((request) =>
          request.responses?.some((response) => response.reparateurId === user.id),
        )
        setMyResponses(myResponseRequests)
      }
      setIsLoading(false)
    }
  }, [])

  const handleSubmitResponse = async (requestId: string) => {
    if (!currentUser || !responseForm.text.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir au moins le message de réponse",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const success = StorageService.addResponseToRequest(requestId, {
        reparateurId: currentUser.id,
        text: responseForm.text,
        price: responseForm.price,
        estimatedTime: responseForm.estimatedTime,
        reparateur: {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          companyName: currentUser.professional?.companyName,
          avatar: currentUser.avatar,
        },
      })

      if (success) {
        toast({
          title: "Réponse envoyée",
          description: "Votre réponse a été envoyée au client avec succès",
        })

        // Réinitialiser le formulaire
        setResponseForm({ text: "", price: "", estimatedTime: "" })
        setSelectedRequest(null)

        // Recharger les données
        const requests = StorageService.getRepairRequests()
        setAllRequests(requests)
        const filtered = StorageService.getFilteredRequestsForRepairer(currentUser)
        setAvailableRequests(filtered)
        const myResponseRequests = requests.filter((request) =>
          request.responses?.some((response) => response.reparateurId === currentUser.id),
        )
        setMyResponses(myResponseRequests)
      } else {
        throw new Error("Erreur lors de l'envoi de la réponse")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la réponse. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmTakeover = (requestId: string, responseId: string) => {
    const message = "Je confirme la prise en charge de cette intervention."
    const success = StorageService.confirmRepairTakeover(requestId, responseId, message)

    if (success) {
      toast({
        title: "Prise en charge confirmée",
        description: "Vous avez confirmé la prise en charge de cette intervention",
      })

      // Recharger les données
      const requests = StorageService.getRepairRequests()
      const myResponseRequests = requests.filter((request) =>
        request.responses?.some((response) => response.reparateurId === currentUser.id),
      )
      setMyResponses(myResponseRequests)
    }
  }

  const handleStartWork = (requestId: string, responseId: string) => {
    const success = StorageService.startRepairWork(requestId, responseId)

    if (success) {
      toast({
        title: "Travaux commencés",
        description: "Vous avez marqué le début des travaux",
      })

      // Recharger les données
      const requests = StorageService.getRepairRequests()
      const myResponseRequests = requests.filter((request) =>
        request.responses?.some((response) => response.reparateurId === currentUser.id),
      )
      setMyResponses(myResponseRequests)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "confirmed":
        return "bg-purple-100 text-purple-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "accepted":
        return "Accepté"
      case "confirmed":
        return "Confirmé"
      case "in_progress":
        return "En cours"
      case "rejected":
        return "Refusé"
      default:
        return "Inconnu"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "same-day":
        return "bg-orange-100 text-orange-800"
      case "this-week":
        return "bg-yellow-100 text-yellow-800"
      case "flexible":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Il y a moins d'1h"
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!currentUser || currentUser.userType !== "reparateur") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Accès réparateur requis</h2>
            <p className="text-gray-600 mb-4">Cette page est réservée aux réparateurs de la plateforme.</p>
            <Button asChild>
              <Link href="/connexion">Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Interventions</h1>
          <p className="text-gray-600">Gérez vos demandes d'intervention et répondez aux clients</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{availableRequests.length}</div>
              <p className="text-sm text-gray-600">Nouvelles demandes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{myResponses.length}</div>
              <p className="text-sm text-gray-600">Mes réponses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {myResponses.filter((r) => r.status === "in_progress").length}
              </div>
              <p className="text-sm text-gray-600">En cours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {myResponses.filter((r) => r.status === "completed").length}
              </div>
              <p className="text-sm text-gray-600">Terminées</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Demandes disponibles ({availableRequests.length})</TabsTrigger>
            <TabsTrigger value="my-responses">Mes réponses ({myResponses.length})</TabsTrigger>
            <TabsTrigger value="completed">
              Terminées ({myResponses.filter((r) => r.status === "completed").length})
            </TabsTrigger>
          </TabsList>

          {/* Demandes disponibles */}
          <TabsContent value="available" className="space-y-4">
            {availableRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline">{request.category}</Badge>
                        <Badge className={getUrgencyColor(request.urgency)}>{request.urgencyLabel}</Badge>
                        <span className="text-sm text-gray-500">{getTimeAgo(request.createdAt)}</span>
                      </div>
                      <CardTitle className="text-xl">{request.title}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.city} ({request.postalCode})
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Euro className="h-4 w-4 mr-1" />
                        {request.budget}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{request.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {request.client.firstName} {request.client.lastName}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/demande/${request.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </Link>
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Répondre
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Répondre à la demande</DialogTitle>
                            <DialogDescription>Proposez vos services pour : {selectedRequest?.title}</DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="response-text">Message de réponse *</Label>
                              <Textarea
                                id="response-text"
                                placeholder="Décrivez votre proposition, votre expérience, vos disponibilités..."
                                value={responseForm.text}
                                onChange={(e) => setResponseForm({ ...responseForm, text: e.target.value })}
                                rows={4}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="response-price">Prix proposé (€)</Label>
                                <Input
                                  id="response-price"
                                  placeholder="150"
                                  value={responseForm.price}
                                  onChange={(e) => setResponseForm({ ...responseForm, price: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="response-time">Délai estimé</Label>
                                <Input
                                  id="response-time"
                                  placeholder="2 heures"
                                  value={responseForm.estimatedTime}
                                  onChange={(e) => setResponseForm({ ...responseForm, estimatedTime: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                              <DialogTrigger asChild>
                                <Button variant="outline">Annuler</Button>
                              </DialogTrigger>
                              <Button
                                onClick={() => selectedRequest && handleSubmitResponse(selectedRequest.id)}
                                disabled={isSubmitting || !responseForm.text.trim()}
                              >
                                {isSubmitting ? "Envoi..." : "Envoyer la réponse"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {availableRequests.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune demande disponible</h3>
                  <p className="text-gray-600 mb-4">
                    Aucune nouvelle demande ne correspond à vos préférences de notification.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/profil-pro">Modifier mes préférences</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Mes réponses */}
          <TabsContent value="my-responses" className="space-y-4">
            {myResponses.map((request) => {
              const myResponse = request.responses.find((r) => r.reparateurId === currentUser.id)
              if (!myResponse) return null

              return (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="outline">{request.category}</Badge>
                          <Badge className={getStatusColor(myResponse.status)}>
                            {getStatusLabel(myResponse.status)}
                          </Badge>
                          <Badge className={getUrgencyColor(request.urgency)}>{request.urgencyLabel}</Badge>
                        </div>
                        <CardTitle className="text-xl">{request.title}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {request.city} ({request.postalCode})
                        </div>
                        {myResponse.price && (
                          <div className="flex items-center text-sm text-green-600 font-medium">
                            <Euro className="h-4 w-4 mr-1" />
                            {myResponse.price}€
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Ma réponse :</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">{myResponse.text}</p>
                      </div>

                      {/* Actions selon le statut */}
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Répondu le {new Date(myResponse.createdAt).toLocaleDateString("fr-FR")}
                        </div>

                        <div className="flex space-x-2">
                          {myResponse.status === "accepted" && (
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700"
                              onClick={() => handleConfirmTakeover(request.id, myResponse.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirmer la prise en charge
                            </Button>
                          )}

                          {myResponse.status === "confirmed" && (
                            <Button
                              size="sm"
                              className="bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => handleStartWork(request.id, myResponse.id)}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Commencer les travaux
                            </Button>
                          )}

                          <Button asChild size="sm" variant="outline">
                            <Link href={`/demande/${request.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {myResponses.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune réponse envoyée</h3>
                  <p className="text-gray-600">Vous n'avez pas encore répondu à des demandes.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Interventions terminées */}
          <TabsContent value="completed" className="space-y-4">
            {myResponses
              .filter((r) => r.status === "completed")
              .map((request) => {
                const myResponse = request.responses.find((r) => r.reparateurId === currentUser.id)
                const review = request.reviews?.find((r) => r.responseId === myResponse?.id)

                return (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge variant="outline">{request.category}</Badge>
                            <Badge className="bg-green-100 text-green-800">Terminée</Badge>
                            {review && (
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="text-sm font-medium">{review.rating}/5</span>
                              </div>
                            )}
                          </div>
                          <CardTitle className="text-xl">{request.title}</CardTitle>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {request.city} ({request.postalCode})
                          </div>
                          {myResponse?.price && (
                            <div className="flex items-center text-sm text-green-600 font-medium">
                              <Euro className="h-4 w-4 mr-1" />
                              {myResponse.price}€
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {review && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-2">Avis client :</h4>
                            <p className="text-green-800">{review.comment}</p>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            Terminée le{" "}
                            {request.completedAt ? new Date(request.completedAt).toLocaleDateString("fr-FR") : "N/A"}
                          </div>

                          <Button asChild size="sm" variant="outline">
                            <Link href={`/demande/${request.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

            {myResponses.filter((r) => r.status === "completed").length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune intervention terminée</h3>
                  <p className="text-gray-600">Vos interventions terminées apparaîtront ici.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
