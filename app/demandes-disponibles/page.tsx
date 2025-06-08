"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Euro, User, Phone, Mail, Filter } from "lucide-react"

// Données simulées des demandes
const mockRequests = [
  {
    id: 1,
    category: "Électroménager",
    title: "Réparation lave-linge",
    description:
      "Mon lave-linge ne démarre plus depuis ce matin. Le voyant rouge clignote et il fait un bruit étrange quand j'appuie sur le bouton de démarrage.",
    urgency: "urgent",
    urgencyLabel: "Urgent (dans les 2h)",
    budget: "100-200",
    city: "Paris",
    postalCode: "75015",
    createdAt: "2024-01-15T10:30:00Z",
    client: {
      firstName: "Marie",
      lastName: "D.",
      initials: "MD",
    },
    responses: 2,
  },
  {
    id: 2,
    category: "Informatique",
    title: "Dépannage ordinateur portable",
    description:
      "Mon ordinateur portable ne s'allume plus du tout. L'écran reste noir même quand je branche le chargeur. Il y avait des ralentissements avant la panne.",
    urgency: "same-day",
    urgencyLabel: "Aujourd'hui",
    budget: "50-100",
    city: "Lyon",
    postalCode: "69002",
    createdAt: "2024-01-15T09:15:00Z",
    client: {
      firstName: "Pierre",
      lastName: "M.",
      initials: "PM",
    },
    responses: 0,
  },
  {
    id: 3,
    category: "Plomberie",
    title: "Fuite sous évier",
    description:
      "J'ai une fuite d'eau sous mon évier de cuisine. L'eau coule en permanence et j'ai dû couper l'arrivée d'eau. Cela semble venir du raccordement.",
    urgency: "urgent",
    urgencyLabel: "Urgent (dans les 2h)",
    budget: "200-500",
    city: "Marseille",
    postalCode: "13001",
    createdAt: "2024-01-15T08:45:00Z",
    client: {
      firstName: "Sophie",
      lastName: "L.",
      initials: "SL",
    },
    responses: 5,
  },
  {
    id: 4,
    category: "Électricité",
    title: "Panne électrique partielle",
    description:
      "Plusieurs prises de ma cuisine ne fonctionnent plus depuis hier soir. Le disjoncteur ne semble pas avoir sauté. Les autres pièces fonctionnent normalement.",
    urgency: "this-week",
    urgencyLabel: "Cette semaine",
    budget: "100-200",
    city: "Toulouse",
    postalCode: "31000",
    createdAt: "2024-01-14T16:20:00Z",
    client: {
      firstName: "Jean",
      lastName: "R.",
      initials: "JR",
    },
    responses: 1,
  },
  {
    id: 5,
    category: "Chauffage",
    title: "Chaudière en panne",
    description:
      "Ma chaudière gaz ne se déclenche plus. Plus d'eau chaude et pas de chauffage. J'ai vérifié la pression qui semble correcte.",
    urgency: "urgent",
    urgencyLabel: "Urgent (dans les 2h)",
    budget: "200-500",
    city: "Nice",
    postalCode: "06000",
    createdAt: "2024-01-14T14:10:00Z",
    client: {
      firstName: "Anne",
      lastName: "B.",
      initials: "AB",
    },
    responses: 3,
  },
]

export default function DemandesDisponiblesPage() {
  const [requests, setRequests] = useState(mockRequests)
  const [filters, setFilters] = useState({
    category: "",
    urgency: "",
    city: "",
    budget: "",
  })

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

  const handleContactClient = (requestId: number) => {
    // Ici on révélerait les coordonnées complètes du client
    alert("Coordonnées du client révélées ! Vous pouvez maintenant le contacter directement.")
  }

  const filteredRequests = requests.filter((request) => {
    return (
      (!filters.category || request.category.toLowerCase().includes(filters.category.toLowerCase())) &&
      (!filters.urgency || request.urgency === filters.urgency) &&
      (!filters.city || request.city.toLowerCase().includes(filters.city.toLowerCase()))
    )
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demandes de réparation disponibles</h1>
          <p className="text-gray-600">Trouvez des clients près de chez vous et développez votre activité</p>
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
                    <div className="flex items-center text-sm text-gray-600">
                      <Euro className="h-4 w-4 mr-1" />
                      {request.budget}€
                    </div>
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

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleContactClient(request.id)}>
                      <Phone className="h-4 w-4 mr-1" />
                      Contacter
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleContactClient(request.id)}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Répondre
                    </Button>
                  </div>
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
      </div>
    </div>
  )
}
