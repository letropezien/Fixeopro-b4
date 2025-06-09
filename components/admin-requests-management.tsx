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
  MessageSquare,
  Euro,
} from "lucide-react"
import { StorageService, type RepairRequest } from "@/lib/storage"

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
    // Recharger les demandes toutes les 5 secondes pour voir les nouvelles
    const interval = setInterval(loadRequests, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, statusFilter, urgencyFilter])

  const loadRequests = () => {
    // Utiliser le StorageService pour récupérer les vraies demandes
    const allRequests = StorageService.getRepairRequests()

    // Trier par date de création (plus récente en premier)
    const sortedRequests = allRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setRequests(sortedRequests)
  }

  const filterRequests = () => {
    let filtered = requests

    // Filtrer par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    // Filtrer par urgence
    if (urgencyFilter !== "all") {
      // Mapper les urgences du système existant
      const urgencyMap: { [key: string]: string } = {
        high: "urgent",
        medium: "this-week",
        low: "flexible",
      }

      const mappedUrgency = urgencyMap[urgencyFilter]
      if (mappedUrgency) {
        filtered = filtered.filter((request) => request.urgency === mappedUrgency)
      }
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.city.toLowerCase().includes(searchTerm.toLowerCase()),
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
    const request = StorageService.getRepairRequestById(requestId)
    if (request) {
      request.status = newStatus
      if (newStatus === "completed") {
        request.completedAt = new Date().toISOString()
      } else if (newStatus === "cancelled") {
        request.cancelledAt = new Date().toISOString()
      }
      StorageService.saveRepairRequest(request)
      loadRequests() // Recharger les demandes
    }
  }

  const deleteRequest = () => {
    if (selectedRequest) {
      const allRequests = StorageService.getRepairRequests()
      const updatedRequests = allRequests.filter((r) => r.id !== selectedRequest.id)
      localStorage.setItem("fixeopro_repair_requests", JSON.stringify(updatedRequests))
      loadRequests()
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
      case "same-day":
        return <Badge className="bg-red-500">Aujourd'hui</Badge>
      case "urgent":
        return <Badge className="bg-red-500">Urgent</Badge>
      case "this-week":
        return <Badge className="bg-orange-500">Cette semaine</Badge>
      case "flexible":
        return <Badge className="bg-green-500">Flexible</Badge>
      default:
        return <Badge variant="outline">{urgency}</Badge>
    }
  }

  const getStatusBadge = (status: RepairRequest["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500">Ouverte</Badge>
      case "in_progress":
        return <Badge className="bg-orange-500">En cours</Badge>
      case "completed":
        return <Badge className="bg-green-500">Terminée</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Annulée</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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
      open: requests.filter((r) => r.status === "open").length,
      inProgress: requests.filter((r) => r.status === "in_progress").length,
      completed: requests.filter((r) => r.status === "completed").length,
      cancelled: requests.filter((r) => r.status === "cancelled").length,
      urgent: requests.filter((r) => r.urgency === "urgent" || r.urgency === "same-day").length,
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
          <Button onClick={loadRequests} variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={exportRequests} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                <p className="text-sm text-gray-600">Ouvertes</p>
                <p className="text-2xl font-bold">{stats.open}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
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
              <Clock className="h-8 w-8 text-orange-500" />
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
                  <SelectItem value="open">Ouvertes</SelectItem>
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
                  <SelectItem value="medium">Cette semaine</SelectItem>
                  <SelectItem value="low">Flexible</SelectItem>
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
                            {request.client.firstName} {request.client.lastName}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {request.city} ({request.postalCode})
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(request.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {request.responses?.length || 0} réponses
                          </div>
                        </div>
                      </div>

                      {/* Badges et actions */}
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <div className="flex space-x-2">
                          {getStatusBadge(request.status)}
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
                          <span className="text-gray-500">• {request.urgencyLabel}</span>
                          <span className="text-green-600 flex items-center">
                            <Euro className="h-3 w-3 mr-1" />
                            {request.budget}
                          </span>
                        </div>
                        {request.selectedResponseId && <div className="text-blue-600">Réponse sélectionnée</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {requests.length === 0 ? (
                  <div>
                    <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune demande de réparation pour le moment.</p>
                    <p className="text-sm mt-2">Les nouvelles demandes apparaîtront ici automatiquement.</p>
                  </div>
                ) : (
                  "Aucune demande trouvée avec les filtres actuels."
                )}
              </div>
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
                    {getStatusBadge(selectedRequest.status)}
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
                      <span className="font-medium">
                        {selectedRequest.client.firstName} {selectedRequest.client.lastName}
                      </span>
                    </div>
                    {selectedRequest.client.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{selectedRequest.client.email}</span>
                      </div>
                    )}
                    {selectedRequest.client.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{selectedRequest.client.phone}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Localisation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Localisation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedRequest.address && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{selectedRequest.address}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">{selectedRequest.city}</span>
                      <span className="ml-2 text-gray-500">({selectedRequest.postalCode})</span>
                    </div>
                    {selectedRequest.department && (
                      <div>
                        <span className="text-sm text-gray-600">Département: {selectedRequest.department}</span>
                      </div>
                    )}
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
                    <div>
                      <span className="font-medium">Urgence:</span>
                      <span className="ml-2">{selectedRequest.urgencyLabel}</span>
                    </div>
                    <div>
                      <span className="font-medium">Budget:</span>
                      <span className="ml-2 text-green-600">{selectedRequest.budget}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Réponses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Réponses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="font-medium">{selectedRequest.responses?.length || 0} réponses</span>
                    </div>
                    {selectedRequest.selectedResponseId && (
                      <div className="mt-2">
                        <Badge className="bg-green-500">Réponse sélectionnée</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
                <div className="text-sm text-gray-500">Créée le {formatDate(selectedRequest.createdAt)}</div>
                <div className="flex space-x-2">
                  <Select
                    value={selectedRequest.status}
                    onValueChange={(value) => updateRequestStatus(selectedRequest.id, value as RepairRequest["status"])}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Ouverte</SelectItem>
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
