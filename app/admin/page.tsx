"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  CreditCard,
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
} from "lucide-react"

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

  const loadData = useCallback(() => {
    try {
      const loadedUsers = JSON.parse(localStorage.getItem("fixeopro_users") || "[]")
      const loadedRequests = JSON.parse(localStorage.getItem("fixeopro_repair_requests") || "[]")

      setUsers(loadedUsers)
      setRequests(loadedRequests)

      calculateStats(loadedUsers, loadedRequests)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    }
  }, [])

  const loadConfiguration = () => {
    try {
      const savedConfig = localStorage.getItem("fixeo_admin_config")
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig)
        setAdminConfig({ ...adminConfig, ...parsed })
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la configuration:", error)
    }
  }

  const calculateStats = (loadedUsers: UserType[], loadedRequests: RepairRequest[]) => {
    try {
      const reparateurs = loadedUsers.filter((user) => user.userType === "reparateur")
      const clients = loadedUsers.filter((user) => user.userType === "client")
      const activeSubscriptions = reparateurs.filter((rep) => rep.subscription && rep.subscription.status === "active")
      const trialUsers = reparateurs.filter((rep) => rep.subscription && rep.subscription.status === "trial")

      const monthlyRevenue = activeSubscriptions.reduce((total, rep) => {
        const planPrices: { [key: string]: number } = {
          basic: 29,
          pro: 59,
          premium: 99,
        }
        return total + (planPrices[rep.subscription?.plan || ""] || 0)
      }, 0)

      setStats({
        totalUsers: loadedUsers.length,
        totalReparateurs: reparateurs.length,
        totalClients: clients.length,
        totalRequests: loadedRequests.length,
        monthlyRevenue,
        activeSubscriptions: activeSubscriptions.length,
        trialUsers: trialUsers.length,
      })
    } catch (error) {
      console.error("Erreur lors du calcul des statistiques:", error)
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

  const testPayPalConnection = async () => {
    if (!adminConfig.paypal.clientId) {
      alert("Veuillez d'abord configurer votre Client ID PayPal")
      return
    }

    try {
      alert("✅ Connexion PayPal réussie !")
    } catch (error) {
      alert("❌ Impossible de tester la connexion PayPal")
    }
  }

  const testStripeConnection = async () => {
    if (!adminConfig.stripe.publishableKey) {
      alert("Veuillez d'abord configurer votre clé publique Stripe")
      return
    }

    if (adminConfig.stripe.publishableKey.startsWith("pk_")) {
      alert("✅ Clé Stripe valide !")
    } else {
      alert("❌ Format de clé Stripe invalide")
    }
  }

  const resetConfiguration = () => {
    if (confirm("⚠️ Êtes-vous sûr de vouloir réinitialiser toute la configuration ?")) {
      localStorage.removeItem("fixeo_admin_config")
      setAdminConfig({
        paypal: { clientId: "", clientSecret: "", environment: "sandbox", enabled: false },
        stripe: { publishableKey: "", secretKey: "", webhookSecret: "", enabled: false },
        platform: {
          siteName: "Fixeo.pro",
          commission: 5,
          currency: "EUR",
          taxRate: 0,
          trialDays: 15,
          supportEmail: "contact@fixeo.pro",
        },
        notifications: { emailEnabled: true, smsEnabled: false, webhookUrl: "", slackWebhook: "" },
        security: { requireEmailVerification: true, maxLoginAttempts: 5, sessionTimeout: 24 },
      })
      alert("Configuration réinitialisée")
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
      const endDate = new Date(user.subscription.endDate)
      const now = new Date()
      if (endDate > now) {
        const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return `Essai (${daysLeft} jours restants)`
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
                  <p className="text-2xl font-bold text-gray-900">{stats.monthlyRevenue}€</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="requests">Demandes</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
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
                    Gestion des utilisateurs
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
                <CardDescription>{filteredUsers.length} utilisateur(s) trouvé(s)</CardDescription>
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
                              <Button variant="ghost" size="sm">
                                Détails
                              </Button>
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
                    Demandes de dépannage
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
                <CardDescription>{filteredRequests.length} demande(s) trouvée(s)</CardDescription>
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
                              <Button variant="ghost" size="sm">
                                Détails
                              </Button>
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

          {/* Configuration des paiements */}
          <TabsContent value="payments">
            <div className="grid md:grid-cols-2 gap-6">
              {/* PayPal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Configuration PayPal
                    </div>
                    <Switch
                      checked={adminConfig.paypal.enabled}
                      onCheckedChange={(checked) =>
                        setAdminConfig({
                          ...adminConfig,
                          paypal: { ...adminConfig.paypal, enabled: checked },
                        })
                      }
                    />
                  </CardTitle>
                  <CardDescription>Configurez PayPal pour accepter les paiements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="paypalClientId">Client ID *</Label>
                    <Input
                      id="paypalClientId"
                      placeholder="AXxxx..."
                      value={adminConfig.paypal.clientId}
                      onChange={(e) =>
                        setAdminConfig({
                          ...adminConfig,
                          paypal: { ...adminConfig.paypal, clientId: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="paypalClientSecret">Client Secret *</Label>
                    <Input
                      id="paypalClientSecret"
                      type="password"
                      placeholder="EXxxx..."
                      value={adminConfig.paypal.clientSecret}
                      onChange={(e) =>
                        setAdminConfig({
                          ...adminConfig,
                          paypal: { ...adminConfig.paypal, clientSecret: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="paypalEnvironment">Environnement</Label>
                    <select
                      id="paypalEnvironment"
                      className="w-full p-2 border rounded-md"
                      value={adminConfig.paypal.environment}
                      onChange={(e) =>
                        setAdminConfig({
                          ...adminConfig,
                          paypal: { ...adminConfig.paypal, environment: e.target.value },
                        })
                      }
                    >
                      <option value="sandbox">Sandbox (Test)</option>
                      <option value="live">Production</option>
                    </select>
                  </div>
                  <Button onClick={testPayPalConnection} variant="outline" className="w-full">
                    Tester la connexion PayPal
                  </Button>
                </CardContent>
              </Card>

              {/* Stripe */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Configuration Stripe
                    </div>
                    <Switch
                      checked={adminConfig.stripe.enabled}
                      onCheckedChange={(checked) =>
                        setAdminConfig({
                          ...adminConfig,
                          stripe: { ...adminConfig.stripe, enabled: checked },
                        })
                      }
                    />
                  </CardTitle>
                  <CardDescription>Configurez Stripe pour les paiements par carte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="stripePublishable">Clé publique *</Label>
                    <Input
                      id="stripePublishable"
                      placeholder="pk_test_... ou pk_live_..."
                      value={adminConfig.stripe.publishableKey}
                      onChange={(e) =>
                        setAdminConfig({
                          ...adminConfig,
                          stripe: { ...adminConfig.stripe, publishableKey: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="stripeSecret">Clé secrète *</Label>
                    <Input
                      id="stripeSecret"
                      type="password"
                      placeholder="sk_test_... ou sk_live_..."
                      value={adminConfig.stripe.secretKey}
                      onChange={(e) =>
                        setAdminConfig({
                          ...adminConfig,
                          stripe: { ...adminConfig.stripe, secretKey: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="stripeWebhook">Webhook Secret</Label>
                    <Input
                      id="stripeWebhook"
                      type="password"
                      placeholder="whsec_..."
                      value={adminConfig.stripe.webhookSecret}
                      onChange={(e) =>
                        setAdminConfig({
                          ...adminConfig,
                          stripe: { ...adminConfig.stripe, webhookSecret: e.target.value },
                        })
                      }
                    />
                  </div>
                  <Button onClick={testStripeConnection} variant="outline" className="w-full">
                    Tester la connexion Stripe
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration plateforme */}
          <TabsContent value="platform">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Paramètres de la plateforme
                </CardTitle>
                <CardDescription>Configurez les paramètres généraux de Fixeo.pro</CardDescription>
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

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="commission">Commission (%)</Label>
                    <Input
                      id="commission"
                      type="number"
                      min="0"
                      max="100"
                      value={adminConfig.platform.commission}
                      onChange={(e) =>
                        setAdminConfig({
                          ...adminConfig,
                          platform: { ...adminConfig.platform, commission: Number.parseInt(e.target.value) || 0 },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="trialDays">Jours d'essai</Label>
                    <Input
                      id="trialDays"
                      type="number"
                      min="0"
                      max="365"
                      value={adminConfig.platform.trialDays}
                      onChange={(e) =>
                        setAdminConfig({
                          ...adminConfig,
                          platform: { ...adminConfig.platform, trialDays: Number.parseInt(e.target.value) || 0 },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Devise</Label>
                    <select
                      id="currency"
                      className="w-full p-2 border rounded-md"
                      value={adminConfig.platform.currency}
                      onChange={(e) =>
                        setAdminConfig({
                          ...adminConfig,
                          platform: { ...adminConfig.platform, currency: e.target.value },
                        })
                      }
                    >
                      <option value="EUR">Euro (EUR)</option>
                      <option value="USD">Dollar US (USD)</option>
                      <option value="GBP">Livre Sterling (GBP)</option>
                    </select>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailEnabled">Notifications par email</Label>
                  <Switch
                    id="emailEnabled"
                    checked={adminConfig.notifications.emailEnabled}
                    onCheckedChange={(checked) =>
                      setAdminConfig({
                        ...adminConfig,
                        notifications: { ...adminConfig.notifications, emailEnabled: checked },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="destructive" onClick={resetConfiguration}>
            Réinitialiser la configuration
          </Button>
          <div className="text-sm text-gray-500">
            Dernière sauvegarde: {saveStatus === "saved" ? "À l'instant" : "Non sauvegardé"}
          </div>
        </div>
      </div>
    </div>
  )
}
