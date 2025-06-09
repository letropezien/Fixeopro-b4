"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Phone,
  AlertTriangle,
  CheckCircle,
  Camera,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Clock,
  Key,
} from "lucide-react"
import { StorageService, type User } from "@/lib/storage"

export function AdminUsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "client" | "reparateur" | "admin" | "unverified">("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [editForm, setEditForm] = useState<Partial<User>>({})
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, filterType])

  const loadUsers = () => {
    const allUsers = StorageService.getUsers()
    setUsers(allUsers)
  }

  const filterUsers = () => {
    let filtered = users

    // Filtrer par type
    if (filterType === "unverified") {
      filtered = filtered.filter((user) => !user.isEmailVerified)
    } else if (filterType !== "all") {
      filtered = filtered.filter((user) => user.userType === filterType)
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.professional?.companyName || "").toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredUsers(filtered)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditForm(user)
    setIsEditModalOpen(true)
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleEditUserPhoto = (user: User) => {
    setSelectedUser(user)
    setIsPhotoModalOpen(true)
  }

  const handleVerifyEmail = (user: User) => {
    const success = StorageService.verifyUserEmail(user.id, "admin")
    if (success) {
      loadUsers()
      alert(`Email vérifié avec succès pour ${user.firstName} ${user.lastName}`)
    } else {
      alert("Erreur lors de la vérification de l'email")
    }
  }

  const saveUser = () => {
    if (selectedUser && editForm) {
      const updatedUser = { ...selectedUser, ...editForm }
      StorageService.saveUser(updatedUser)
      loadUsers()
      setIsEditModalOpen(false)
      setSelectedUser(null)
      setEditForm({})
    }
  }

  const saveUserPhoto = (photoUrl: string) => {
    if (selectedUser) {
      const updatedUser = { ...selectedUser, avatar: photoUrl }
      StorageService.saveUser(updatedUser)
      loadUsers()
      setIsPhotoModalOpen(false)
      setSelectedUser(null)
    }
  }

  const deleteUser = () => {
    if (selectedUser) {
      const allUsers = StorageService.getUsers()
      const updatedUsers = allUsers.filter((u) => u.id !== selectedUser.id)
      localStorage.setItem("fixeopro_users", JSON.stringify(updatedUsers))
      loadUsers()
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
    }
  }

  const exportUsers = () => {
    const dataStr = JSON.stringify(filteredUsers, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `users_export_${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const getUserStatusBadge = (user: User) => {
    if (user.userType === "reparateur" && user.subscription) {
      if (user.subscription.status === "active") {
        return <Badge className="bg-green-500">Abonné</Badge>
      }
      if (user.subscription.status === "trial") {
        const daysRemaining = StorageService.getTrialDaysRemaining(user)
        return <Badge className="bg-blue-500">Essai ({daysRemaining}j)</Badge>
      }
      return <Badge variant="secondary">Inactif</Badge>
    }
    return <Badge variant="outline">{user.userType}</Badge>
  }

  const getEmailVerificationBadge = (user: User) => {
    if (user.isEmailVerified) {
      return (
        <div className="flex items-center space-x-1">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600">Vérifié</span>
          {user.emailVerifiedBy === "admin" && <span className="text-xs text-gray-500">(Admin)</span>}
        </div>
      )
    }
    return (
      <div className="flex items-center space-x-1">
        <Clock className="h-4 w-4 text-orange-500" />
        <span className="text-sm text-orange-600">En attente</span>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const unverifiedCount = users.filter((u) => !u.isEmailVerified).length

  const handleChangePassword = (user: User) => {
    setSelectedUser(user)
    setNewPassword("")
    setConfirmPassword("")
    setIsPasswordModalOpen(true)
  }

  const changePassword = () => {
    if (!selectedUser) return

    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    if (newPassword.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    const success = StorageService.adminChangePassword(selectedUser.id, newPassword)
    if (success) {
      loadUsers()
      setIsPasswordModalOpen(false)
      setSelectedUser(null)
      setNewPassword("")
      setConfirmPassword("")
      alert(`Mot de passe modifié avec succès pour ${selectedUser.firstName} ${selectedUser.lastName}`)
    } else {
      alert("Erreur lors de la modification du mot de passe")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
          <p className="text-gray-600">Gérez tous les comptes utilisateurs de la plateforme</p>
          {unverifiedCount > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-orange-600">
                {unverifiedCount} compte{unverifiedCount > 1 ? "s" : ""} en attente de vérification
              </span>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportUsers} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-firstName">Prénom</Label>
                  <Input id="new-firstName" placeholder="Prénom" />
                </div>
                <div>
                  <Label htmlFor="new-lastName">Nom</Label>
                  <Input id="new-lastName" placeholder="Nom" />
                </div>
                <div>
                  <Label htmlFor="new-email">Email</Label>
                  <Input id="new-email" type="email" placeholder="email@exemple.com" />
                </div>
                <div>
                  <Label htmlFor="new-userType">Type d'utilisateur</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="reparateur">Réparateur</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline">Annuler</Button>
                <Button>Créer l'utilisateur</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total utilisateurs</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clients</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.userType === "client").length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Réparateurs</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.userType === "reparateur").length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Abonnés actifs</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.subscription?.status === "active").length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className={unverifiedCount > 0 ? "border-orange-200 bg-orange-50" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Non vérifiés</p>
                <p className={`text-2xl font-bold ${unverifiedCount > 0 ? "text-orange-600" : ""}`}>
                  {unverifiedCount}
                </p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${unverifiedCount > 0 ? "text-orange-500" : "text-gray-400"}`} />
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
                  placeholder="Rechercher par nom, email ou entreprise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="client">Clients</SelectItem>
                  <SelectItem value="reparateur">Réparateurs</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                  <SelectItem value="unverified">Non vérifiés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Utilisateur</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Contact</th>
                  <th className="text-left p-3">Localisation</th>
                  <th className="text-left p-3">Statut</th>
                  <th className="text-left p-3">Inscription</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative group cursor-pointer"
                          onClick={() => handleEditUserPhoto(user)}
                        >
                          {user.avatar ? (
                            <img
                              src={user.avatar || "/placeholder.svg"}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium">
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          {user.professional?.companyName && (
                            <p className="text-sm text-blue-600">{user.professional.companyName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{getUserStatusBadge(user)}</td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <p className="text-sm">{user.email}</p>
                        {getEmailVerificationBadge(user)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        {user.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      {user.city && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          {user.city} ({user.postalCode})
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      {user.userType === "reparateur" && user.subscription ? (
                        <div className="text-sm">
                          <p>{user.subscription.status === "active" ? "Actif" : "Essai"}</p>
                          {user.subscription.status === "trial" && (
                            <p className="text-orange-600">{StorageService.getTrialDaysRemaining(user)}j restants</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" onClick={() => handleViewUser(user)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        {!user.isEmailVerified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerifyEmail(user)}
                            className="text-green-600 hover:text-green-700"
                            title="Valider l'email"
                          >
                            <UserCheck className="h-3 w-3" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleEditUserPhoto(user)}>
                          <Camera className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleChangePassword(user)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Changer le mot de passe"
                        >
                          <Key className="h-3 w-3" />
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar || "/placeholder.svg"}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium">
                      {selectedUser.firstName[0]}
                      {selectedUser.lastName[0]}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="mt-1">{getEmailVerificationBadge(selectedUser)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type d'utilisateur</Label>
                  <p className="font-medium">{selectedUser.userType}</p>
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <p className="font-medium">{selectedUser.phone || "Non renseigné"}</p>
                </div>
                <div>
                  <Label>Ville</Label>
                  <p className="font-medium">{selectedUser.city || "Non renseigné"}</p>
                </div>
                <div>
                  <Label>Code postal</Label>
                  <p className="font-medium">{selectedUser.postalCode || "Non renseigné"}</p>
                </div>
              </div>

              {selectedUser.userType === "reparateur" && selectedUser.professional && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Informations professionnelles</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Entreprise</Label>
                      <p className="font-medium">{selectedUser.professional.companyName || "Non renseigné"}</p>
                    </div>
                    <div>
                      <Label>SIRET</Label>
                      <p className="font-medium">{selectedUser.professional.siret || "Non renseigné"}</p>
                    </div>
                    <div>
                      <Label>Expérience</Label>
                      <p className="font-medium">{selectedUser.professional.experience}</p>
                    </div>
                    <div>
                      <Label>Spécialités</Label>
                      <p className="font-medium">{selectedUser.professional.specialties.join(", ")}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label>Description</Label>
                    <p className="font-medium">{selectedUser.professional.description}</p>
                  </div>
                </div>
              )}

              {selectedUser.subscription && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Abonnement</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Plan</Label>
                      <p className="font-medium">{selectedUser.subscription.plan}</p>
                    </div>
                    <div>
                      <Label>Statut</Label>
                      <p className="font-medium">{selectedUser.subscription.status}</p>
                    </div>
                    <div>
                      <Label>Date de début</Label>
                      <p className="font-medium">{formatDate(selectedUser.subscription.startDate)}</p>
                    </div>
                    <div>
                      <Label>Date de fin</Label>
                      <p className="font-medium">{formatDate(selectedUser.subscription.endDate)}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedUser.isEmailVerified && selectedUser.emailVerifiedAt && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Vérification email</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Vérifié le</Label>
                      <p className="font-medium">{formatDate(selectedUser.emailVerifiedAt)}</p>
                    </div>
                    <div>
                      <Label>Vérifié par</Label>
                      <p className="font-medium">
                        {selectedUser.emailVerifiedBy === "admin" ? "Administrateur" : "Utilisateur"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal d'édition */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-firstName">Prénom</Label>
                  <Input
                    id="edit-firstName"
                    value={editForm.firstName || ""}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lastName">Nom</Label>
                  <Input
                    id="edit-lastName"
                    value={editForm.lastName || ""}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Téléphone</Label>
                  <Input
                    id="edit-phone"
                    value={editForm.phone || ""}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-city">Ville</Label>
                  <Input
                    id="edit-city"
                    value={editForm.city || ""}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-postalCode">Code postal</Label>
                  <Input
                    id="edit-postalCode"
                    value={editForm.postalCode || ""}
                    onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={saveUser}>Sauvegarder</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de modification de photo */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la photo de profil</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar || "/placeholder.svg"}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-medium">
                      {selectedUser.firstName[0]}
                      {selectedUser.lastName[0]}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nouvelle photo de profil</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        const result = e.target?.result as string
                        saveUserPhoto(result)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPhotoModalOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => saveUserPhoto("")}>Supprimer la photo</Button>
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
          {selectedUser && (
            <div className="space-y-4">
              <p>
                Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
                <strong>
                  {selectedUser.firstName} {selectedUser.lastName}
                </strong>{" "}
                ?
              </p>
              <p className="text-sm text-red-600">Cette action est irréversible.</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={deleteUser}>
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de changement de mot de passe */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Modifier le mot de passe pour{" "}
                  <strong>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </strong>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 caractères"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmer le nouveau mot de passe"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={changePassword} disabled={!newPassword || !confirmPassword}>
                  Modifier le mot de passe
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Export par défaut
export default AdminUsersManagement
