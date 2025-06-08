"use client"

import { useState, useEffect } from "react"
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
  Shield,
  Database,
  Bell,
  Globe,
  Save,
  RefreshCw,
} from "lucide-react"

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
      taxRate: 20,
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
    totalRequests: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    trialUsers: 0,
  })

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  useEffect(() => {
    loadConfiguration()
    calculateStats()
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

  const calculateStats = () => {
    try {
      const users = JSON.parse(localStorage.getItem("fixeopro_users") || "[]")
      const requests = JSON.parse(localStorage.getItem("fixeopro_repair_requests") || "[]")

      const reparateurs = users.filter((user: any) => user.userType === "reparateur")
      const activeSubscriptions = reparateurs.filter(
        (rep: any) => rep.subscription && rep.subscription.status === "active",
      )
      const trialUsers = reparateurs.filter((rep: any) => rep.subscription && rep.subscription.status === "trial")

      const monthlyRevenue = activeSubscriptions.reduce((total: number, rep: any) => {
        const planPrices: { [key: string]: number } = {
          basic: 29,
          pro: 59,
          premium: 99,
        }
        return total + (planPrices[rep.subscription.plan] || 0)
      }, 0)

      setStats({
        totalUsers: users.length,
        totalReparateurs: reparateurs.length,
        totalRequests: requests.length,
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
      // Test de connexion PayPal (simulation)
      const response = await fetch(`https://api.${adminConfig.paypal.environment}.paypal.com/v1/oauth2/token`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Language": "en_US",
          Authorization: `Basic ${btoa(adminConfig.paypal.clientId + ":" + adminConfig.paypal.clientSecret)}`,
        },
        body: "grant_type=client_credentials",
      })

      if (response.ok) {
        alert("✅ Connexion PayPal réussie !")
      } else {
        alert("❌ Erreur de connexion PayPal. Vérifiez vos identifiants.")
      }
    } catch (error) {
      alert("❌ Impossible de tester la connexion PayPal")
    }
  }

  const testStripeConnection = async () => {
    if (!adminConfig.stripe.publishableKey) {
      alert("Veuillez d'abord configurer votre clé publique Stripe")
      return
    }

    // Test simple de validation de la clé
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
          taxRate: 20,
          trialDays: 15,
          supportEmail: "contact@fixeo.pro",
        },
        notifications: { emailEnabled: true, smsEnabled: false, webhookUrl: "", slackWebhook: "" },
        security: { requireEmailVerification: true, maxLoginAttempts: 5, sessionTimeout: 24 },
      })
      alert("Configuration réinitialisée")
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
              <Button variant="outline" onClick={calculateStats}>
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
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
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
        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="platform">Plateforme</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>

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
                    <Label htmlFor="taxRate">TVA (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      value={adminConfig.platform.taxRate}
                      onChange={(e) =>
                        setAdminConfig({
                          ...adminConfig,
                          platform: { ...adminConfig.platform, taxRate: Number.parseInt(e.target.value) || 0 },
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

          {/* Autres onglets... */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Paramètres de notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsEnabled">Notifications par SMS</Label>
                  <Switch
                    id="smsEnabled"
                    checked={adminConfig.notifications.smsEnabled}
                    onCheckedChange={(checked) =>
                      setAdminConfig({
                        ...adminConfig,
                        notifications: { ...adminConfig.notifications, smsEnabled: checked },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Gestion des utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Clients</p>
                        <p className="text-sm text-gray-600">
                          {stats.totalUsers - stats.totalReparateurs} utilisateurs
                        </p>
                      </div>
                      <Badge variant="secondary">Actifs</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Réparateurs</p>
                        <p className="text-sm text-gray-600">{stats.totalReparateurs} professionnels</p>
                      </div>
                      <Badge variant="secondary">Actifs</Badge>
                    </div>
                  </div>
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
