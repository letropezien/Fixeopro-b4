"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MapPin,
  User,
  Search,
  Phone,
  Filter,
  AlertCircle,
  ArrowLeft,
  ImageIcon,
  MessageSquare,
  Euro,
} from "lucide-react"
import { StorageService } from "@/lib/storage"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [requests, setRequests] = useState<any[]>([])
  const [filteredRequests, setFilteredRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [contactMessage, setContactMessage] = useState("")
  const [contactError, setContactError] = useState("")
  const [contactSuccess, setContactSuccess] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const category = decodeURIComponent(params.category)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const allRequests = StorageService.getRepairRequests()
        const categoryRequests = allRequests.filter(
          (request) => request.category.toLowerCase() === category.toLowerCase(),
        )
        setRequests(categoryRequests)
        setFilteredRequests(categoryRequests)
      } catch (error) {
        console.error("Erreur lors du chargement des demandes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // Actualiser les données toutes les 30 secondes
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [category])

  useEffect(() => {
    // Appliquer les filtres
    let result = [...requests]

    // Filtre de recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(
        (request) =>
          request.title.toLowerCase().includes(search) ||
          request.description.toLowerCase().includes(search) ||
          request.city.toLowerCase().includes(search) ||
          (request.client.firstName + " " + request.client.lastName).toLowerCase().includes(search),
      )
    }

    // Filtre de statut
    if (statusFilter !== "all") {
      result = result.filter((request) => request.status === statusFilter)
    }

    // Filtre d'urgence
    if (urgencyFilter !== "all") {
      result = result.filter((request) => request.urgency === urgencyFilter)
    }

    // Tri par date (plus récent en premier)
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredRequests(result)
  }, [requests, searchTerm, statusFilter, urgencyFilter])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Ouverte"
      case "in_progress":
        return "En cours"
      case "completed":
        return "Terminée"
      case "cancelled":
        return "Annulée"
      default:
        return "Inconnue"
    }
  }

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

      if (diffInHours < 1) return "Il y a moins d'1h"
      if (diffInHours < 24) return `Il y a ${diffInHours}h`
      const diffInDays = Math.floor(diffInHours / 24)
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`
    } catch (err) {
      return "Date inconnue"
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      électroménager: "🔌",
      informatique: "💻",
      plomberie: "🔧",
      électricité: "⚡",
      chauffage: "🔥",
      serrurerie: "🔑",
      multimédia: "📱",
      téléphonie: "📞",
      climatisation: "❄️",
    }
    return icons[category.toLowerCase()] || "🔧"
  }

  const handleContactRequest = (request: any) => {
    setSelectedRequest(request)
    setContactMessage("")
    setContactError("")
    setContactSuccess(false)
    setContactDialogOpen(true)
  }

  const handleSendContact = async () => {
    if (!contactMessage.trim()) {
      setContactError("Veuillez saisir un message")
      return
    }

    if (!user || user.userType !== "reparateur") {
      setContactError("Vous devez être connecté en tant que réparateur pour contacter un client")
      return
    }

    setIsSending(true)
    setContactError("")

    try {
      // Simuler l'envoi d'un message
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // En production, ici on enverrait réellement le message
      console.log("Message envoyé:", {
        from: user,
        to: selectedRequest.client,
        requestId: selectedRequest.id,
        message: contactMessage,
      })

      setContactSuccess(true)
      setTimeout(() => {
        setContactDialogOpen(false)
      }, 2000)
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      setContactError("Une erreur s'est produite lors de l'envoi du message")
    } finally {
      setIsSending(false)
    }
  }

  const canContactClient = () => {
    if (!user) return false
    if (user.userType !== "reparateur") return false

    // Vérifier si l'abonnement est actif
    if (user.subscription?.status === "active") return true

    // Vérifier si la période d'essai de 15 jours est encore valide
    if (user.subscription?.status === "trial") {
      const trialEndDate = new Date(user.subscription.endDate)
      return trialEndDate > new Date()
    }

    return false
  }

  const getTrialDaysRemaining = () => {
    if (!user || !user.subscription || user.subscription.status !== "trial") return 0

    const trialEndDate = new Date(user.subscription.endDate)
    const now = new Date()
    const diffTime = trialEndDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg">Chargement des demandes de réparation...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{getCategoryIcon(category)}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">Réparations {category}</h1>
          <p className="text-gray-600">
            {filteredRequests.length} demande{filteredRequests.length > 1 ? "s" : ""} en cours dans cette catégorie
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Link href="/demande-reparation">
              <Button className="bg-blue-600 hover:bg-blue-700">Créer une demande</Button>
            </Link>
          </div>

          <div className="relative w-full sm:w-auto">
            <Input
              placeholder="Rechercher une demande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filtres */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h3 className="font-medium mb-3">Filtres</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Statut</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="open">Ouvertes</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminées</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Urgence</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                >
                  <option value="all">Toutes les urgences</option>
                  <option value="urgent">Urgent</option>
                  <option value="same-day">Aujourd'hui</option>
                  <option value="this-week">Cette semaine</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50">
            <CardContent className="p-4 flex flex-col items-center">
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <p className="text-2xl font-bold">{requests.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent className="p-4 flex flex-col items-center">
              <p className="text-sm text-green-600 font-medium">Ouvertes</p>
              <p className="text-2xl font-bold">{requests.filter((r) => r.status === "open").length}</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50">
            <CardContent className="p-4 flex flex-col items-center">
              <p className="text-sm text-yellow-600 font-medium">En cours</p>
              <p className="text-2xl font-bold">{requests.filter((r) => r.status === "in_progress").length}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50">
            <CardContent className="p-4 flex flex-col items-center">
              <p className="text-sm text-red-600 font-medium">Urgentes</p>
              <p className="text-2xl font-bold">{requests.filter((r) => r.urgency === "urgent").length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des demandes */}
        {filteredRequests.length > 0 ? (
          <div className="space-y-6">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid md:grid-cols-4 gap-0">
                  {/* Image de la demande */}
                  <div className="md:col-span-1 bg-gray-100 h-full min-h-[200px] relative">
                    {request.photos && request.photos.length > 0 ? (
                      <>
                        <img
                          src={request.photos[0] || "/placeholder.svg"}
                          alt={request.title}
                          className="w-full h-full object-cover"
                        />
                        {request.photos.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md flex items-center">
                            <ImageIcon className="h-3 w-3 mr-1" />+{request.photos.length - 1}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl">{getCategoryIcon(request.category)}</div>
                      </div>
                    )}
                  </div>

                  {/* Contenu de la demande */}
                  <div className="md:col-span-3 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getStatusColor(request.status)}>{getStatusLabel(request.status)}</Badge>
                          <Badge className={getUrgencyColor(request.urgency)}>{request.urgencyLabel}</Badge>
                          <span className="text-sm text-gray-500">{getTimeAgo(request.createdAt)}</span>
                        </div>
                        <h3 className="text-xl font-semibold">{request.title}</h3>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {request.city} ({request.postalCode})
                        </div>
                        {request.budget && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Euro className="h-4 w-4 mr-1" />
                            Budget: {request.budget}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">{request.description}</p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-1" />
                          {request.client.firstName} {request.client.lastName}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {request.responses?.length || 0} réponse{(request.responses?.length || 0) > 1 ? "s" : ""}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {user && user.userType === "reparateur" && request.status === "open" && (
                          <Button variant="outline" size="sm" onClick={() => handleContactRequest(request)}>
                            <Phone className="h-4 w-4 mr-1" />
                            Contacter
                          </Button>
                        )}
                        <Link href={`/demande/${request.id}`}>
                          <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Search className="h-4 w-4 mr-1" />
                            Voir détails
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">{getCategoryIcon(category)}</div>
              <h3 className="text-lg font-semibold mb-2">Aucune demande trouvée</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all" || urgencyFilter !== "all"
                  ? "Aucune demande ne correspond à vos critères de recherche"
                  : `Soyez le premier à publier une demande dans la catégorie ${category}`}
              </p>
              <Link href="/demande-reparation">
                <Button className="bg-blue-600 hover:bg-blue-700">Créer une demande</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Informations sur la catégorie */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>À propos des réparations {category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Types de pannes courantes :</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {category.toLowerCase() === "électroménager" && (
                    <>
                      <li>• Lave-linge qui ne démarre pas</li>
                      <li>• Réfrigérateur qui ne refroidit plus</li>
                      <li>• Four qui ne chauffe pas</li>
                      <li>• Lave-vaisselle qui fuit</li>
                    </>
                  )}
                  {category.toLowerCase() === "informatique" && (
                    <>
                      <li>• Ordinateur qui ne démarre pas</li>
                      <li>• Écran cassé</li>
                      <li>• Problème de virus</li>
                      <li>• Récupération de données</li>
                    </>
                  )}
                  {category.toLowerCase() === "plomberie" && (
                    <>
                      <li>• Fuite d'eau</li>
                      <li>• Canalisation bouchée</li>
                      <li>• Robinet qui goutte</li>
                      <li>• Chauffe-eau en panne</li>
                    </>
                  )}
                  {category.toLowerCase() === "téléphonie" && (
                    <>
                      <li>• Écran de smartphone cassé</li>
                      <li>• Problème de batterie</li>
                      <li>• Téléphone qui ne charge plus</li>
                      <li>• Problème de réseau</li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Conseils avant l'intervention :</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Décrivez précisément le problème</li>
                  <li>• Notez les circonstances de la panne</li>
                  <li>• Préparez les documents de garantie</li>
                  <li>• Libérez l'accès à l'appareil</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de contact */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contacter le client</DialogTitle>
          </DialogHeader>

          {contactSuccess ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Message envoyé avec succès</h3>
              <p className="mt-2 text-sm text-gray-500">Le client recevra votre message et pourra vous contacter.</p>
            </div>
          ) : (
            <>
              {selectedRequest && (
                <div className="mb-4">
                  <h3 className="font-medium">Demande: {selectedRequest.title}</h3>
                  <p className="text-sm text-gray-500">
                    Client: {selectedRequest.client.firstName} {selectedRequest.client.lastName}
                  </p>
                </div>
              )}

              {canContactClient() ? (
                <>
                  <div className="space-y-4">
                    {user?.subscription?.status === "trial" && (
                      <div className="bg-blue-50 p-3 rounded-md text-sm">
                        <p className="font-medium text-blue-800">
                          Période d'essai: {getTrialDaysRemaining()} jour(s) restant(s)
                        </p>
                        <p className="text-blue-700">
                          Vous bénéficiez d'un accès complet pendant votre période d'essai.
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Votre message</label>
                      <textarea
                        className="w-full p-3 border rounded-md min-h-[120px]"
                        placeholder="Présentez-vous et décrivez comment vous pouvez aider..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                      />
                    </div>

                    {contactError && <div className="text-red-500 text-sm">{contactError}</div>}

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleSendContact} disabled={isSending || !contactMessage.trim()}>
                        {isSending ? "Envoi en cours..." : "Envoyer"}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900 text-center">Accès limité</h3>
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    Pour contacter les clients, vous devez avoir un abonnement actif ou être en période d'essai.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <Link href="/tarifs">
                      <Button>Voir les abonnements</Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Icône de validation pour le message de succès
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}
