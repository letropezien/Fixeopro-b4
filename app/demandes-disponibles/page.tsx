"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Euro, User, Phone, Mail, Filter, Lock, MessageSquare } from "lucide-react"
import { StorageService } from "@/lib/storage"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function DemandesDisponiblesPage() {
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser())
  const [requests, setRequests] = useState(StorageService.getRepairRequests())
  const [filters, setFilters] = useState({
    category: "",
    urgency: "",
    city: "",
    budget: "",
  })
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [responseMessage, setResponseMessage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // Recharger les demandes à chaque visite de la page
    setRequests(StorageService.getRepairRequests())
  }, [])

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

  const canContactClients = () => {
    return StorageService.canContactClients(currentUser!)
  }

  const handleContactClient = (requestId: string) => {
    if (!canContactClients()) {
      alert("Vous devez avoir un abonnement actif pour contacter les clients. Veuillez souscrire à un abonnement.")
      window.location.href = "/devenir-reparateur#abonnements"
      return
    }

    // Révéler les coordonnées complètes du client
    const request = requests.find((r) => r.id === requestId)
    if (request) {
      alert(
        `Coordonnées du client révélées !\n\nEmail: ${request.client.email}\nTéléphone: ${request.client.phone}\n\nVous pouvez maintenant le contacter directement.`,
      )
    }
  }

  const handleOpenResponseDialog = (request: any) => {
    if (!canContactClients()) {
      alert("Vous devez avoir un abonnement actif pour répondre aux clients. Veuillez souscrire à un abonnement.")
      window.location.href = "/devenir-reparateur#abonnements"
      return
    }

    setSelectedRequest(request)
    setResponseMessage("")
    setIsDialogOpen(true)
  }

  const handleSendResponse = () => {
    if (!responseMessage.trim()) {
      alert("Veuillez saisir un message")
      return
    }

    // Simuler l'envoi de la réponse
    alert(`Votre réponse a été envoyée à ${selectedRequest.client.firstName} ${selectedRequest.client.lastName}`)

    // Mettre à jour le nombre de réponses
    const updatedRequests = requests.map((r) => {
      if (r.id === selectedRequest.id) {
        return { ...r, responses: r.responses + 1 }
      }
      return r
    })

    // Mettre à jour l'état local et le stockage
    setRequests(updatedRequests)
    updatedRequests.forEach((r) => StorageService.saveRepairRequest(r))

    // Fermer la boîte de dialogue
    setIsDialogOpen(false)
  }

  const filteredRequests = requests.filter((request) => {
    return (
      (!filters.category || request.category.toLowerCase().includes(filters.category.toLowerCase())) &&
      (!filters.urgency || request.urgency === filters.urgency) &&
      (!filters.city || request.city.toLowerCase().includes(filters.city.toLowerCase()))
    )
  })

  // Vérifier si l'utilisateur est un réparateur
  if (!currentUser || currentUser.userType !== "reparateur") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Accès réservé aux réparateurs</h2>
            <p className="text-gray-600 mb-4">
              Cette page est réservée aux professionnels inscrits sur notre plateforme.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <a href="/devenir-reparateur">Devenir réparateur</a>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="/connexion">Se connecter</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Vérifier le statut de l'abonnement
  const isInTrial = StorageService.isInTrialPeriod(currentUser)
  const trialEndsAt = currentUser.subscription?.expiresAt
    ? new Date(currentUser.subscription.expiresAt).toLocaleDateString("fr-FR")
    : "N/A"

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demandes de réparation disponibles</h1>
          <p className="text-gray-600">Trouvez des clients près de chez vous et développez votre activité</p>

          {isInTrial ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <div className="flex items-center">
                <div>
                  <p className="text-green-800 font-medium">Période d'essai gratuite active</p>
                  <p className="text-green-700 text-sm">
                    Vous pouvez contacter les clients jusqu'au {trialEndsAt}. Après cette date, un abonnement sera
                    nécessaire.
                  </p>
                </div>
              </div>
            </div>
          ) : !canContactClients() ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-orange-600 mr-2" />
                <div>
                  <p className="text-orange-800 font-medium">Abonnement requis</p>
                  <p className="text-orange-700 text-sm">
                    Vous devez avoir un abonnement actif pour contacter les clients.{" "}
                    <a href="/devenir-reparateur#abonnements" className="underline">
                      Souscrire maintenant
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-center">
                <div>
                  <p className="text-blue-800 font-medium">Abonnement actif</p>
                  <p className="text-blue-700 text-sm">
                    Vous avez accès à toutes les coordonnées des clients et pouvez répondre à toutes les demandes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filtres */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Catégorie</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="électroménager">Électroménager</SelectItem>
                    <SelectItem value="informatique">Informatique</SelectItem>
                    <SelectItem value="plomberie">Plomberie</SelectItem>
                    <SelectItem value="électricité">Électricité</SelectItem>
                    <SelectItem value="chauffage">Chauffage</SelectItem>
                    <SelectItem value="téléphonie">Téléphonie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Urgence</label>
                <Select value={filters.urgency} onValueChange={(value) => setFilters({ ...filters, urgency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les urgences" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les urgences</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="same-day">Aujourd'hui</SelectItem>
                    <SelectItem value="this-week">Cette semaine</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Ville</label>
                <Input
                  placeholder="Rechercher une ville"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters({ category: "", urgency: "", city: "", budget: "" })}
                  className="w-full"
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredRequests.length}</div>
              <p className="text-sm text-gray-600">Demandes disponibles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredRequests.filter((r) => r.urgency === "urgent").length}
              </div>
              <p className="text-sm text-gray-600">Demandes urgentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredRequests.filter((r) => r.responses === 0).length}
              </div>
              <p className="text-sm text-gray-600">Sans réponse</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(filteredRequests.map((r) => r.city)).size}
              </div>
              <p className="text-sm text-gray-600">Villes couvertes</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des demandes */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
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
                    {request.budget && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Euro className="h-4 w-4 mr-1" />
                        {request.budget}€
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{request.description}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-1" />
                      {request.client.firstName} {request.client.lastName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {request.responses} réponse{request.responses > 1 ? "s" : ""}
                    </div>
                  </div>

                  {canContactClients() && (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleContactClient(request.id)}>
                          <Phone className="h-4 w-4 mr-1" />
                          {request.client.phone}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleContactClient(request.id)}>
                          <Mail className="h-4 w-4 mr-1" />
                          {request.client.email}
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleOpenResponseDialog(request)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Répondre à cette demande
                      </Button>
                    </div>
                  )}

                  {!canContactClients() && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactClient(request.id)}
                        disabled={true}
                      >
                        <Lock className="h-4 w-4 mr-1" />
                        Coordonnées masquées
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleOpenResponseDialog(request)}
                        disabled={true}
                      >
                        <Lock className="h-4 w-4 mr-1" />
                        Abonnement requis
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Aucune demande trouvée</h3>
              <p className="text-gray-600 mb-4">Essayez de modifier vos filtres ou revenez plus tard</p>
              <Button onClick={() => setFilters({ category: "", urgency: "", city: "", budget: "" })}>
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Boîte de dialogue de réponse */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Répondre à la demande</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">{selectedRequest?.title}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedRequest?.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <User className="h-3 w-3 mr-1" />
                  <span>
                    {selectedRequest?.client.firstName} {selectedRequest?.client.lastName}
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="response">Votre réponse</Label>
                <Textarea
                  id="response"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Bonjour, je suis intéressé par votre demande. Je peux intervenir rapidement..."
                  className="min-h-[150px] mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSendResponse} className="bg-blue-600 hover:bg-blue-700">
                Envoyer la réponse
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
