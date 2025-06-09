"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Wrench,
} from "lucide-react"
import { RequestStatusBadge } from "@/components/request-status-badge"

interface RepairRequest {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  urgency: "low" | "medium" | "high"
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled"
  photos: string[]
  location: {
    address: string
    city: string
    postalCode: string
    coordinates?: { lat: number; lng: number }
  }
  client: {
    id: string
    name: string
    email: string
    phone: string
  }
  assignedRepairer?: {
    id: string
    name: string
    email: string
    phone: string
  }
  budget?: {
    min: number
    max: number
  }
  createdAt: string
  updatedAt: string
  scheduledDate?: string
  completedAt?: string
}

export function AdminRequestsManagement() {
  const [requests, setRequests] = useState<RepairRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<RepairRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    loadRequests()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, statusFilter, urgencyFilter])

  const loadRequests = () => {
    // Charger les demandes depuis le localStorage
    const savedRequests = localStorage.getItem("fixeopro_requests")
    if (savedRequests) {
      const parsedRequests = JSON.parse(savedRequests)
      // Trier par date de création (plus récente en premier)
      const sortedRequests = parsedRequests.sort(
        (a: RepairRequest, b: RepairRequest) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      setRequests(sortedRequests)
    } else {
      // Créer des données d'exemple si aucune demande n'existe
      const exampleRequests: RepairRequest[] = [
        {
          id: "req-001",
          title: "Réparation lave-linge",
          description:
            "Mon lave-linge ne démarre plus, il fait un bruit étrange quand j'appuie sur le bouton de démarrage.",
          category: "Électroménager",
          subcategory: "Lave-linge",
          urgency: "high",
          status: "pending",
          photos: ["/placeholder.svg?height=200&width=300"],
          location: {
            address: "123 Rue de la République",
            city: "Paris",
            postalCode: "75001",
          },
          client: {
            id: "client-001",
            name: "Marie Dupont",
            email: "marie.dupont@email.com",
            phone: "06 12 34 56 78",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          budget: { min: 50, max: 150 },
        },
        {
          id: "req-002",
          title: "Fuite robinet cuisine",
          description: "Le robinet de ma cuisine fuit constamment, même quand il est fermé.",
          category: "Plomberie",
          subcategory: "Robinetterie",
          urgency: "medium",
          status: "assigned",
          photos: ["/placeholder.svg?height=200&width=300"],
          location: {
            address: "45 Avenue des Champs",
            city: "Lyon",
            postalCode: "69001",
          },
          client: {
            id: "client-002",
            name: "Pierre Martin",
            email: "pierre.martin@email.com",
            phone: "06 98 76 54 32",
          },
          assignedRepairer: {
            id: "repairer-001",
            name: "Jean Plombier",
            email: "jean.plombier@email.com",
            phone: "06 11 22 33 44",
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Hier
          updatedAt: new Date().toISOString(),
          budget: { min: 80, max: 200 },
        },
      ]
      localStorage.setItem("fixeopro_requests", JSON.stringify(exampleRequests))
      setRequests(exampleRequests)
    }
  }

  const filterRequests = () => {
    let filtered = requests

    // Filtrer par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    // Filtrer par urgence
    if (urgencyFilter !== "all") {
      filtered = filtered.filter((request) => request.urgency === urgencyFilter)
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.location.city.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredRequests(filtered)
  }

  const handleViewRequest = (request: RepairRequest) => {
    setSelectedRequest(request)
    setIsViewModalOpen(true)
  }

  const handleEditRequest = (request: RepairRequest) => {
    setSelectedRequest(request)
    setIsEditModalOpen(true)
  }

  const handleDeleteRequest = (request: RepairRequest) => {
    setSelectedRequest(request)
    setIsDeleteModalOpen(true)
  }

  const updateRequestStatus = (requestId: string, newStatus: RepairRequest["status"]) => {
    const updatedRequests = requests.map((request) =>
      request.id === requestId ? { ...request, status: newStatus, updatedAt: new Date().toISOString() } : request,
    )
    setRequests(updatedRequests)
    localStorage.setItem("fixeopro_requests", JSON.stringify(updatedRequests))
  }

  const deleteRequest = () => {
    if (selectedRequest) {
      const updatedRequests = requests.filter((r) => r.id !== selectedRequest.id)
      setRequests(updatedRequests)
      localStorage.setItem("fixeopro_requests", JSON.stringify(updatedRequests))
      setIsDeleteModalOpen(false)
      setSelectedRequest(null)
    }
  }

  const exportRequests = () => {
    const dataStr = JSON.stringify(filteredRequests, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `requests_export_${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <Badge className="bg-red-500">Urgent</Badge>
      case "medium":
        return <Badge className="bg-orange-500">Moyen</Badge>
      case "low":
        return <Badge className="bg-green-500">Faible</Badge>
      default:
        return <Badge variant="outline">{urgency}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRequestStats = () => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      assigned: requests.filter((r) => r.status === "assigned").length,
      inProgress: requests.filter((r) => r.status === "in_progress").length,
      completed: requests.filter((r) => r.status === "completed").length,
      urgent: requests.filter((r) => r.urgency === "high").length,
    }
  }

  const stats = getRequestStats()

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des demandes</h2>
          <p className="text-gray-600">Gérez toutes les demandes de réparation de la plateforme</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportRequests} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assignées</p>
                <p className="text-2xl font-bold">{stats.assigned}</p>
              </div>
              <User className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminées</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgentes</p>
                <p className="text-2xl font-bold">{stats.urgent}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre, description, client ou ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="assigned">Assignées</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes urgences</SelectItem>
                  <SelectItem value="high">Urgent</SelectItem>
                  <SelectItem value="medium">Moyen</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes de réparation ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  {/* Photo d'illustration */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {request.photos && request.photos.length > 0 ? (
                      <img
                        src={request.photos[0] || "/placeholder.svg"}
                        alt={request.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Wrench className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Contenu principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{request.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{request.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {request.client.name}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {request.location.city}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(request.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Badges et actions */}
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <div className="flex space-x-2">
                          <RequestStatusBadge status={request.status} />
                          {getUrgencyBadge(request.urgency)}
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => handleViewRequest(request)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditRequest(request)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteRequest(request)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">{request.category}</span>
                          {request.subcategory && <span className="text-gray-500">• {request.subcategory}</span>}
                          {request.budget && (
                            <span className="text-green-600">
                              {request.budget.min}€ - {request.budget.max}€
                            </span>
                          )}
                        </div>
                        {request.assignedRepairer && (
                          <div className="text-blue-600">Assigné à {request.assignedRepairer.name}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">Aucune demande trouvée avec les filtres actuels.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de visualisation */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* En-tête avec photo et titre */}
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {selectedRequest.photos && selectedRequest.photos.length > 0 ? (
                    <img
                      src={selectedRequest.photos[0] || "/placeholder.svg"}
                      alt={selectedRequest.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Wrench className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{selectedRequest.title}</h2>
                  <p className="text-gray-600 mt-2">{selectedRequest.description}</p>
                  <div className="flex space-x-2 mt-3">
                    <RequestStatusBadge status={selectedRequest.status} />
                    {getUrgencyBadge(selectedRequest.urgency)}
                  </div>
                </div>
              </div>

              {/* Informations détaillées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations client */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Client</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">{selectedRequest.client.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{selectedRequest.client.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{selectedRequest.client.phone}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Localisation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Localisation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{selectedRequest.location.address}</span>
                    </div>
                    <div>
                      <span className="font-medium">{selectedRequest.location.city}</span>
                      <span className="ml-2 text-gray-500">({selectedRequest.location.postalCode})</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Détails techniques */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Détails</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="font-medium">Catégorie:</span>
                      <span className="ml-2">{selectedRequest.category}</span>
                    </div>
                    {selectedRequest.subcategory && (
                      <div>
                        <span className="font-medium">Sous-catégorie:</span>
                        <span className="ml-2">{selectedRequest.subcategory}</span>
                      </div>
                    )}
                    {selectedRequest.budget && (
                      <div>
                        <span className="font-medium">Budget:</span>
                        <span className="ml-2 text-green-600">
                          {selectedRequest.budget.min}€ - {selectedRequest.budget.max}€
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Réparateur assigné */}
                {selectedRequest.assignedRepairer && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Réparateur assigné</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span className="font-medium">{selectedRequest.assignedRepairer.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{selectedRequest.assignedRepairer.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{selectedRequest.assignedRepairer.phone}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Photos supplémentaires */}
              {selectedRequest.photos && selectedRequest.photos.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Photos supplémentaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedRequest.photos.slice(1).map((photo, index) => (
                        <div key={index} className="w-full h-24 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Photo ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions rapides */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Créée le {formatDate(selectedRequest.createdAt)}
                  {selectedRequest.updatedAt !== selectedRequest.createdAt && (
                    <span> • Modifiée le {formatDate(selectedRequest.updatedAt)}</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Select
                    value={selectedRequest.status}
                    onValueChange={(value) => updateRequestStatus(selectedRequest.id, value as RepairRequest["status"])}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="assigned">Assignée</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                      <SelectItem value="completed">Terminée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de suppression */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <p>
                Êtes-vous sûr de vouloir supprimer la demande <strong>"{selectedRequest.title}"</strong> ?
              </p>
              <p className="text-sm text-red-600">Cette action est irréversible.</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={deleteRequest}>
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminRequestsManagement
