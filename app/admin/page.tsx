"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Globe,
  Save,
  RefreshCw,
  Search,
  MapPin,
  User,
  Shield,
  Trash2,
  Gift,
} from "lucide-react"
import { StorageService } from "@/lib/storage"
import { PromoCodeService, type PromoCode } from "@/lib/promo-codes"
import PaymentGatewayConfig from "@/components/payment-gateway-config"

interface UserType {
  id: string
  firstName: string
  lastName: string
  email: string
  userType: "client" | "reparateur"
  city?: string
  createdAt: string
  subscription?: {
    status: "active" | "trial" | "inactive"
    plan?: string
    endDate: string
    startDate?: string
  }
  professional?: {
    companyName?: string
  }
}

interface RepairRequest {
  id: string
  title: string
  description: string
  category: string
  city: string
  urgency: "urgent" | "same-day" | "this-week" | "flexible"
  status: "open" | "in_progress" | "completed" | "cancelled"
  createdAt: string
  client: {
    firstName: string
    lastName: string
    initials: string
  }
}

export default function AdminPage() {
  const [adminConfig, setAdminConfig] = useState({
    paypal: {
      clientId: "",
      clientSecret: "",
      environment: "sandbox",
      enabled: false,
    },
    stripe: {
      publishableKey: "",
      secretKey: "",
      webhookSecret: "",
      enabled: false,
    },
    platform: {
      siteName: "Fixeo.pro",
      commission: 5,
      currency: "EUR",
      taxRate: 0,
      trialDays: 15,
      supportEmail: "contact@fixeo.pro",
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      webhookUrl: "",
      slackWebhook: "",
    },
    security: {
      requireEmailVerification: true,
      maxLoginAttempts: 5,
      sessionTimeout: 24,
    },
  })
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [newPromoCode, setNewPromoCode] = useState({
    code: "",
    description: "",
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    validFrom: "",
    validUntil: "",
    maxUses: 100,
    applicablePlans: ["all"] as string[],
  })

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReparateurs: 0,
    totalClients: 0,
    totalRequests: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    trialUsers: 0,
  })

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [users, setUsers] = useState<UserType[]>([])
  const [requests, setRequests] = useState<RepairRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [userTypeFilter, setUserTypeFilter] = useState<"all" | "client" | "reparateur">("all")
  const [requestStatusFilter, setRequestStatusFilter] = useState<
    "all" | "open" | "in_progress" | "completed" | "cancelled"
  >("all")

  useEffect(() => {
    loadConfiguration()
    loadData()
  }, [])

  const loadData = () => {
    try {
      const loadedUsers = StorageService.getUsers() || []
      const loadedRequests = StorageService.getRepairRequests() || []
      const loadedPromoCodes = PromoCodeService.getPromoCodes()

      setUsers(loadedUsers)
      setRequests(loadedRequests)
      setPromoCodes(loadedPromoCodes)

      // Calculer les statistiques
      const clients = loadedUsers.filter((user) => user.userType === "client")
      const reparateurs = loadedUsers.filter((user) => user.userType === "reparateur")
      const activeSubscriptions = reparateurs.filter((rep) => rep.subscription?.status === "active")
      const trialUsers = reparateurs.filter((rep) => rep.subscription?.status === "trial")

      setStats({
        totalUsers: loadedUsers.length,
        totalClients: clients.length,
        totalReparateurs: reparateurs.length,
        totalRequests: loadedRequests.length,
        monthlyRevenue: 0,
        activeSubscriptions: activeSubscriptions.length,
        trialUsers: trialUsers.length,
      })
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    }
  }

  const loadConfiguration = () => {
    try {
      const savedConfig = localStorage.getItem("fixeo_admin_config")
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig)
        setAdminConfig((prevConfig) => ({
          paypal: { ...prevConfig.paypal, ...parsed.paypal },
          stripe: { ...prevConfig.stripe, ...parsed.stripe },
          platform: { ...prevConfig.platform, ...parsed.platform },
          notifications: { ...prevConfig.notifications, ...parsed.notifications },
          security: { ...prevConfig.security, ...parsed.security },
        }))
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la configuration:", error)
    }
  }

  const saveConfiguration = async () => {
    setSaveStatus("saving")
    try {
      localStorage.setItem("fixeo_admin_config", JSON.stringify(adminConfig))
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) {
      try {
        const users = StorageService.getUsers()
        const updatedUsers = users.filter((user) => user.id !== userId)
        localStorage.setItem("fixeopro_users", JSON.stringify(updatedUsers))
        loadData() // Recharger les données
        alert("Utilisateur supprimé avec succès")
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression de l'utilisateur")
      }
    }
  }

  const handleDeleteRequest = (requestId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette demande ? Cette action est irréversible.")) {
      try {
        const requests = StorageService.getRepairRequests()
        const updatedRequests = requests.filter((request) => request.id !== requestId)
        localStorage.setItem("fixeopro_repair_requests", JSON.stringify(updatedRequests))
        loadData() // Recharger les données
        alert("Demande supprimée avec succès")
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression de la demande")
      }
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.professional?.companyName && user.professional.companyName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = userTypeFilter === "all" || user.userType === userTypeFilter

    return matchesSearch && matchesType
  })

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = requestStatusFilter === "all" || request.status === requestStatusFilter

    return matchesSearch && matchesStatus
  })

  const getSubscriptionStatus = (user: UserType) => {
    if (!user.subscription) return "Aucun"

    if (user.subscription.status === "active") {
      return `Actif (${user.subscription.plan})`
    } else if (user.subscription.status === "trial") {
      const subscriptionStart = new Date(user.subscription.startDate || user.createdAt)
      const trialEndDate = new Date(subscriptionStart)
      trialEndDate.setDate(trialEndDate.getDate() + 15)

      const now = new Date()
      if (trialEndDate > now) {
        const daysLeft = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        const endDateFormatted = trialEndDate.toLocaleDateString("fr-FR")
        return `Essai (${daysLeft} jours restants - fin le ${endDateFormatted})`
      } else {
        return "Essai expiré"
      }
    } else {
      return "Inactif"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500">Ouverte</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-500">En cours</Badge>
      case "completed":
        return <Badge className="bg-green-500">Terminée</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Annulée</Badge>
      default:
        return <Badge className="bg-gray-500">Inconnue</Badge>
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return <Badge className="bg-red-500">Urgent</Badge>
      case "same-day":
        return <Badge className="bg-orange-500">Aujourd'hui</Badge>
      case "this-week":
        return <Badge className="bg-yellow-500">Cette semaine</Badge>
      case "flexible":
        return <Badge className="bg-green-500">Flexible</Badge>
      default:
        return <Badge className="bg-gray-500">Non spécifié</Badge>
    }
  }

  const handleCreatePromoCode = () => {
    if (!newPromoCode.code || !newPromoCode.description) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const promoCode: PromoCode = {
      id: `promo_${Date.now()}`,
      ...newPromoCode,
      currentUses: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: "admin",
    }

    const success = PromoCodeService.savePromoCode(promoCode)
    if (success) {
      loadData()
      setNewPromoCode({
        code: "",
        description: "",
        type: "percentage",
        value: 0,
        validFrom: "",
        validUntil: "",
        maxUses: 100,
        applicablePlans: ["all"],
      })
      alert("Code promo créé avec succès")
    } else {
      alert("Erreur lors de la création du code promo")
    }
  }

  const handleDeletePromoCode = (codeId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce code promo ?")) {
      const success = PromoCodeService.deletePromoCode(codeId)
      if (success) {
        loadData()
        alert("Code promo supprimé avec succès")
      } else {
        alert("Erreur lors de la suppression du code promo")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration Fixeo.pro</h1>
              <p className="text-gray-600">Panneau de configuration de la plateforme</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={loadData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button
                onClick={saveConfiguration}
                disabled={saveStatus === "saving"}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveStatus === "saving" ? "Sauvegarde..." : saveStatus === "saved" ? "Sauvegardé !" : "Sauvegarder"}
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Réparateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReparateurs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Demandes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Abonnés</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Essais</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.trialUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenus/mois</p>
                  <p className="text-2xl font-bold text-gray-900">0€</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="requests">Demandes</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="promocodes">Codes Promo</TabsTrigger>
            <TabsTrigger value="platform">Plateforme</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          {/* Onglet Utilisateurs */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Gestion des utilisateurs ({filteredUsers.length})
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="userTypeFilter" className="text-sm">
                        Type:
                      </Label>
                      <select
                        id="userTypeFilter"
                        className="p-1 text-sm border rounded"
                        value={userTypeFilter}
                        onChange={(e) => setUserTypeFilter(e.target.value as any)}
                      >
                        <option value="all">Tous</option>
                        <option value="client">Clients</option>
                        <option value="reparateur">Réparateurs</option>
                      </select>
                    </div>
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 h-8 text-sm"
                      />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left border">Nom</th>
                        <th className="p-2 text-left border">Email</th>
                        <th className="p-2 text-left border">Type</th>
                        <th className="p-2 text-left border">Ville</th>
                        <th className="p-2 text-left border">Abonnement</th>
                        <th className="p-2 text-left border">Inscription</th>
                        <th className="p-2 text-center border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="p-2 border">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                                  {user.firstName[0]}
                                  {user.lastName[0]}
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  {user.professional?.companyName && (
                                    <p className="text-xs text-gray-500">{user.professional.companyName}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-2 border">{user.email}</td>
                            <td className="p-2 border">
                              <Badge className={user.userType === "reparateur" ? "bg-green-500" : "bg-blue-500"}>
                                {user.userType === "reparateur" ? "Réparateur" : "Client"}
                              </Badge>
                            </td>
                            <td className="p-2 border">{user.city || "Non spécifié"}</td>
                            <td className="p-2 border">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                  user.subscription?.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : user.subscription?.status === "trial"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {getSubscriptionStatus(user)}
                              </span>
                            </td>
                            <td className="p-2 border text-sm">
                              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                            </td>
                            <td className="p-2 border text-center">
                              <div className="flex space-x-1 justify-center">
                                <Button variant="ghost" size="sm">
                                  Détails
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="flex items-center"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Supprimer
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-4 text-center text-gray-500">
                            Aucun utilisateur trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Demandes */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Demandes de dépannage ({filteredRequests.length})
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="requestStatusFilter" className="text-sm">
                        Statut:
                      </Label>
                      <select
                        id="requestStatusFilter"
                        className="p-1 text-sm border rounded"
                        value={requestStatusFilter}
                        onChange={(e) => setRequestStatusFilter(e.target.value as any)}
                      >
                        <option value="all">Tous</option>
                        <option value="open">Ouvertes</option>
                        <option value="in_progress">En cours</option>
                        <option value="completed">Terminées</option>
                        <option value="cancelled">Annulées</option>
                      </select>
                    </div>
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 h-8 text-sm"
                      />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left border">Titre</th>
                        <th className="p-2 text-left border">Client</th>
                        <th className="p-2 text-left border">Catégorie</th>
                        <th className="p-2 text-left border">Ville</th>
                        <th className="p-2 text-left border">Urgence</th>
                        <th className="p-2 text-left border">Statut</th>
                        <th className="p-2 text-left border">Date</th>
                        <th className="p-2 text-center border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-gray-50">
                            <td className="p-2 border font-medium">{request.title}</td>
                            <td className="p-2 border">
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2 text-xs">
                                  {request.client.initials}
                                </div>
                                <span>
                                  {request.client.firstName} {request.client.lastName}
                                </span>
                              </div>
                            </td>
                            <td className="p-2 border">
                              <Badge variant="outline">{request.category}</Badge>
                            </td>
                            <td className="p-2 border">
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                                {request.city}
                              </div>
                            </td>
                            <td className="p-2 border">{getUrgencyBadge(request.urgency)}</td>
                            <td className="p-2 border">{getStatusBadge(request.status)}</td>
                            <td className="p-2 border text-sm">
                              {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                            </td>
                            <td className="p-2 border text-center">
                              <div className="flex space-x-1 justify-center">
                                <Button variant="ghost" size="sm">
                                  Détails
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteRequest(request.id)}
                                  className="flex items-center"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Supprimer
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-4 text-center text-gray-500">
                            Aucune demande trouvée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Codes Promo */}
          <TabsContent value="promocodes">
            <div className="space-y-6">
              {/* Création d'un nouveau code promo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="h-5 w-5 mr-2" />
                    Créer un nouveau code promo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="promoCode">Code promo</Label>
                      <Input
                        id="promoCode"
                        placeholder="BIENVENUE20"
                        value={newPromoCode.code}
                        onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value.toUpperCase() })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="promoDescription">Description</Label>
                      <Input
                        id="promoDescription"
                        placeholder="20% de réduction pour les nouveaux clients"
                        value={newPromoCode.description}
                        onChange={(e) => setNewPromoCode({ ...newPromoCode, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="promoType">Type de réduction</Label>
                      <select
                        id="promoType"
                        className="w-full p-2 border rounded"
                        value={newPromoCode.type}
                        onChange={(e) =>
                          setNewPromoCode({ ...newPromoCode, type: e.target.value as "percentage" | "fixed" })
                        }
                      >
                        <option value="percentage">Pourcentage</option>
                        <option value="fixed">Montant fixe</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="promoValue">Valeur ({newPromoCode.type === "percentage" ? "%" : "€"})</Label>
                      <Input
                        id="promoValue"
                        type="number"
                        placeholder={newPromoCode.type === "percentage" ? "20" : "10"}
                        value={newPromoCode.value}
                        onChange={(e) =>
                          setNewPromoCode({ ...newPromoCode, value: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="promoValidFrom">Valide à partir du</Label>
                      <Input
                        id="promoValidFrom"
                        type="date"
                        value={newPromoCode.validFrom}
                        onChange={(e) => setNewPromoCode({ ...newPromoCode, validFrom: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="promoValidUntil">Valide jusqu'au</Label>
                      <Input
                        id="promoValidUntil"
                        type="date"
                        value={newPromoCode.validUntil}
                        onChange={(e) => setNewPromoCode({ ...newPromoCode, validUntil: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="promoMaxUses">Nombre d'utilisations max</Label>
                      <Input
                        id="promoMaxUses"
                        type="number"
                        placeholder="100"
                        value={newPromoCode.maxUses}
                        onChange={(e) =>
                          setNewPromoCode({ ...newPromoCode, maxUses: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="promoPlans">Forfaits applicables</Label>
                      <select
                        id="promoPlans"
                        className="w-full p-2 border rounded"
                        value={newPromoCode.applicablePlans[0]}
                        onChange={(e) => setNewPromoCode({ ...newPromoCode, applicablePlans: [e.target.value] })}
                      >
                        <option value="all">Tous les forfaits</option>
                        <option value="essentiel">Essentiel uniquement</option>
                        <option value="professionnel">Professionnel uniquement</option>
                        <option value="premium">Premium uniquement</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button onClick={handleCreatePromoCode} className="bg-green-600 hover:bg-green-700">
                      <Gift className="h-4 w-4 mr-2" />
                      Créer le code promo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Liste des codes promo existants */}
              <Card>
                <CardHeader>
                  <CardTitle>Codes promo existants ({promoCodes.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 text-left border">Code</th>
                          <th className="p-2 text-left border">Description</th>
                          <th className="p-2 text-left border">Réduction</th>
                          <th className="p-2 text-left border">Validité</th>
                          <th className="p-2 text-left border">Utilisations</th>
                          <th className="p-2 text-left border">Statut</th>
                          <th className="p-2 text-center border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promoCodes.length > 0 ? (
                          promoCodes.map((promo) => (
                            <tr key={promo.id} className="hover:bg-gray-50">
                              <td className="p-2 border font-mono font-bold">{promo.code}</td>
                              <td className="p-2 border">{promo.description}</td>
                              <td className="p-2 border">
                                {promo.type === "percentage" ? `${promo.value}%` : `${promo.value}€`}
                              </td>
                              <td className="p-2 border text-sm">
                                Du {new Date(promo.validFrom).toLocaleDateString("fr-FR")}
                                <br />
                                Au {new Date(promo.validUntil).toLocaleDateString("fr-FR")}
                              </td>
                              <td className="p-2 border">
                                {promo.currentUses} / {promo.maxUses}
                              </td>
                              <td className="p-2 border">
                                <Badge className={promo.isActive ? "bg-green-500" : "bg-red-500"}>
                                  {promo.isActive ? "Actif" : "Inactif"}
                                </Badge>
                              </td>
                              <td className="p-2 border text-center">
                                <Button variant="destructive" size="sm" onClick={() => handleDeletePromoCode(promo.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-4 text-center text-gray-500">
                              Aucun code promo créé
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration des paiements */}
          <TabsContent value="payments">
            <PaymentGatewayConfig />
          </TabsContent>

          {/* Configuration plateforme */}
          <TabsContent value="platform">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Paramètres de la plateforme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="siteName">Nom du site</Label>
                    <Input
                      id="siteName"
                      value={adminConfig.platform.siteName}
                      onChange={(e) =>
                        setAdminConfig({
                          ...adminConfig,
                          platform: { ...adminConfig.platform, siteName: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">Email de support</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={adminConfig.platform.supportEmail}
                      onChange={(e) =>
                        setAdminConfig({
                          ...adminConfig,
                          platform: { ...adminConfig.platform, supportEmail: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sécurité */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Paramètres de sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireEmailVerification">Vérification email obligatoire</Label>
                  <Switch
                    id="requireEmailVerification"
                    checked={adminConfig.security.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      setAdminConfig({
                        ...adminConfig,
                        security: { ...adminConfig.security, requireEmailVerification: checked },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
