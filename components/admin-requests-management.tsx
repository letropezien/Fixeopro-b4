"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Wrench,
  Edit,
  Trash2,
  Eye,
  Search,
  Download,
  MapPin,
  Calendar,
  Euro,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { StorageService, type RepairRequest } from "@/lib/storage"

export function AdminRequestsManagement() {
  const [requests, setRequests] = useState<RepairRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<RepairRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "in_progress" | "completed" | "cancelled">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const categories = [
    "électroménager",
    "plomberie",
    "électricité",
    "informatique",
    "téléphonie",
    "chauffage",
    "climatisation",
    "électronique",
    "autres",
  ]

  useEffect(() => {
    loadRequests()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, filterStatus, filterCategory])

  const loadRequests = () => {
    const allRequests = StorageService.getRepairRequests()
    setRequests(allRequests)
  }

  const filterRequests = () => {
    let filtered = requests

    // Filtrer par statut
    if (filterStatus !== "all") {
      filtered = filtered.filter((request) => request.status === filterStatus)
    }

    // Filtrer par catégorie
    if (filterCategory !== "all") {
      filtered = filtered.filter((request) => request.category === filterCategory)
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      loadRequests()
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

  const getStatusBadge = (status: RepairRequest["status"]) => {
    const statusConfig = {
      open: { label: "Ouverte", className: "bg-blue-500" },
      in_progress: { label: "En cours", className: "bg-orange-500" },
      completed: { label: "Terminée", className: "bg-green-500" },
      cancelled: { label: "Annulée", className: "bg-red-500" },
    }

    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      "same-day": { label: "Aujourd'hui", className: "bg-red-500" },
      urgent: { label: "Urgent", className: "bg-orange-500" },
      "this-week": { label: "Cette semaine", className: "bg-yellow-500" },
      flexible: { label: "Flexible", className: "bg-gray-500" },
    }

    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || {
      label: urgency,
      className: "bg-gray-500",
    }
    return <Badge className={config.className}>{config.label}</Badge>
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
    }
  }

  const stats = getRequestStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des demandes</h2>
          <p className="text-gray-600">Gérez toutes les demandes de dépannage</p>
        </div>
        <Button onClick={exportRequests} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Annulées</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
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
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-40">
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
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Demande</th>
                  <th className="text-left p-3">Client</th>
                  <th className="text-left p-3">Catégorie</th>
                  <th className="text-left p-3">Localisation</th>
                  <th className="text-left p-3">Budget</th>
                  <th className="text-left p-3">Urgence</th>
                  <th className="text-left p-3">Statut</th>
                  <th className="text-left p-3">Réponses</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{request.title}</p>
                        <p className="text-sm text-gray-600 truncate max-w-xs">{request.description}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs">{request.client.initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {request.client.firstName} {request.client.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{request.category}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {request.city} ({request.postalCode})
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center text-sm">
                        <Euro className="h-3 w-3 mr-1" />
                        {request.budget}
                      </div>
                    </td>
                    <td className="p-3">{getUrgencyBadge(request.urgency)}</td>
                    <td className="p-3">
                      <Select
                        value={request.status}
                        onValueChange={(value: RepairRequest["status"]) => updateRequestStatus(request.id, value)}
                      >
                        <SelectTrigger className="w-32">{getStatusBadge(request.status)}</SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Ouverte</SelectItem>
                          <SelectItem value="in_progress">En cours</SelectItem>
                          <SelectItem value="completed">Terminée</SelectItem>
                          <SelectItem value="cancelled">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center text-sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {request.responses?.length || 0}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(request.createdAt)}
                      </div>
                    </td>
                    <td className="p-3">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Titre</Label>
                    <p className="font-medium">{selectedRequest.title}</p>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <p className="font-medium">{selectedRequest.description}</p>
                  </div>
                  <div>
                    <Label>Catégorie</Label>
                    <p className="font-medium">{selectedRequest.category}</p>
                  </div>
                  <div>
                    <Label>Budget</Label>
                    <p className="font-medium">{selectedRequest.budget}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Client</Label>
                    <p className="font-medium">
                      {selectedRequest.client.firstName} {selectedRequest.client.lastName}
                    </p>
                  </div>
                  <div>
                    <Label>Localisation</Label>
                    <p className="font-medium">
                      {selectedRequest.city} ({selectedRequest.postalCode})
                    </p>
                  </div>
                  <div>
                    <Label>Urgence</Label>
                    <p className="font-medium">{selectedRequest.urgencyLabel}</p>
                  </div>
                  <div>
                    <Label>Statut</Label>
                    <p className="font-medium">{getStatusBadge(selectedRequest.status)}</p>
                  </div>
                </div>
              </div>

              {selectedRequest.photos && selectedRequest.photos.length > 0 && (
                <div>
                  <Label>Photos</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {selectedRequest.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.responses && selectedRequest.responses.length > 0 && (
                <div>
                  <Label>Réponses ({selectedRequest.responses.length})</Label>
                  <div className="space-y-3 mt-2">
                    {selectedRequest.responses.map((response) => (
                      <div key={response.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">
                              {response.reparateur.firstName} {response.reparateur.lastName}
                            </p>
                            {response.reparateur.companyName && (
                              <p className="text-sm text-gray-600">{response.reparateur.companyName}</p>
                            )}
                          </div>
                          <div className="text-right">
                            {response.price && <p className="font-medium text-green-600">{response.price}</p>}
                            {response.estimatedTime && (
                              <p className="text-sm text-gray-600">Durée: {response.estimatedTime}</p>
                            )}
                          </div>
                        </div>
                        <p className="text-sm">{response.text}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatDate(response.createdAt)}</p>
                        {response.isSelected && <Badge className="mt-2 bg-green-500">Sélectionnée</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
