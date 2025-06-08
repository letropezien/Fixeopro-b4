"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, CreditCard, Users, FileText, DollarSign, TrendingUp } from "lucide-react"

export default function AdminPage() {
  const [adminConfig, setAdminConfig] = useState({
    paypal: {
      clientId: "",
      clientSecret: "",
      environment: "sandbox", // sandbox ou production
    },
    stripe: {
      publishableKey: "",
      secretKey: "",
      webhookSecret: "",
    },
    platform: {
      commission: 5, // Pourcentage de commission
      currency: "EUR",
      taxRate: 20, // TVA en pourcentage
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      webhookUrl: "",
    },
  })

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReparateurs: 0,
    totalRequests: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
  })

  useEffect(() => {
    // Charger la configuration depuis le localStorage
    const savedConfig = localStorage.getItem("admin_config")
    if (savedConfig) {
      setAdminConfig(JSON.parse(savedConfig))
    }

    // Calculer les statistiques
    calculateStats()
  }, [])

  const calculateStats = () => {
    try {
      const users = JSON.parse(localStorage.getItem("fixeopro_users") || "[]")
      const requests = JSON.parse(localStorage.getItem("fixeopro_repair_requests") || "[]")

      const reparateurs = users.filter((user: any) => user.userType === "reparateur")
      const activeSubscriptions = reparateurs.filter(
        (rep: any) => rep.subscription && (rep.subscription.status === "active" || rep.subscription.status === "trial"),
      )

      // Calculer le revenu mensuel estimé
      const monthlyRevenue = activeSubscriptions.reduce((total: number, rep: any) => {
        if (rep.subscription.status === "active") {
          const planPrices: { [key: string]: number } = {
            basic: 29,
            pro: 59,
            premium: 99,
          }
          return total + (planPrices[rep.subscription.plan] || 0)
        }
        return total
      }, 0)

      setStats({
        totalUsers: users.length,
        totalReparateurs: reparateurs.length,
        totalRequests: requests.length,
        monthlyRevenue,
        activeSubscriptions: activeSubscriptions.length,
      })
    } catch (error) {
      console.error("Erreur lors du calcul des statistiques:", error)
    }
  }

  const saveConfig = () => {
    localStorage.setItem("admin_config", JSON.stringify(adminConfig))
    alert("Configuration sauvegardée avec succès !")
  }

  const resetConfig = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser la configuration ?")) {
      localStorage.removeItem("admin_config")
      setAdminConfig({
        paypal: { clientId: "", clientSecret: "", environment: "sandbox" },
        stripe: { publishableKey: "", secretKey: "", webhookSecret: "" },
        platform: { commission: 5, currency: "EUR", taxRate: 20 },
        notifications: { emailEnabled: true, smsEnabled: false, webhookUrl: "" },
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration FixeoPro</h1>
          <p className="text-gray-600">Gérez la configuration de la plateforme et les paramètres de paiement</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Utilisateurs totaux</p>
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
                  <p className="text-sm font-medium text-gray-600">Abonnements actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenu mensuel</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.monthlyRevenue}€</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration */}
        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="platform">Plateforme</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Configuration PayPal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Configuration PayPal
                  </CardTitle>
                  <CardDescription>Configurez vos identifiants PayPal pour accepter les paiements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="paypalClientId">Client ID</Label>
                    <Input
                      id="paypalClientId"
                      placeholder="Votre PayPal Client ID"
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
                    <Label htmlFor="paypalClientSecret">Client Secret</Label>
                    <Input
                      id="paypalClientSecret"
                      type="password"
                      placeholder="Votre PayPal Client Secret"
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
                      <option value="production">Production</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Configuration Stripe */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Configuration Stripe
                  </CardTitle>
                  <CardDescription>Configurez vos clés Stripe pour les paiements par carte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="stripePublishable">Clé publique</Label>
                    <Input
                      id="stripePublishable"
                      placeholder="pk_test_..."
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
                    <Label htmlFor="stripeSecret">Clé secrète</Label>
                    <Input
                      id="stripeSecret"
                      type="password"
                      placeholder="sk_test_..."
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="platform">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de la plateforme</CardTitle>
                <CardDescription>Configurez les paramètres généraux de FixeoPro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
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
                  <div>
                    <Label htmlFor="taxRate">Taux de TVA (%)</Label>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de notifications</CardTitle>
                <CardDescription>Configurez les notifications et webhooks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emailEnabled"
                    checked={adminConfig.notifications.emailEnabled}
                    onChange={(e) =>
                      setAdminConfig({
                        ...adminConfig,
                        notifications: { ...adminConfig.notifications, emailEnabled: e.target.checked },
                      })
                    }
                  />
                  <Label htmlFor="emailEnabled">Activer les notifications par email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="smsEnabled"
                    checked={adminConfig.notifications.smsEnabled}
                    onChange={(e) =>
                      setAdminConfig({
                        ...adminConfig,
                        notifications: { ...adminConfig.notifications, smsEnabled: e.target.checked },
                      })
                    }
                  />
                  <Label htmlFor="smsEnabled">Activer les notifications par SMS</Label>
                </div>
                <div>
                  <Label htmlFor="webhookUrl">URL de webhook</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://votre-site.com/webhook"
                    value={adminConfig.notifications.webhookUrl}
                    onChange={(e) =>
                      setAdminConfig({
                        ...adminConfig,
                        notifications: { ...adminConfig.notifications, webhookUrl: e.target.value },
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
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>Visualisez et gérez les utilisateurs de la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Utilisateurs récents</h3>
                    <Button variant="outline" onClick={calculateStats}>
                      Actualiser
                    </Button>
                  </div>
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
        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline" onClick={resetConfig}>
            Réinitialiser
          </Button>
          <Button onClick={saveConfig} className="bg-blue-600 hover:bg-blue-700">
            Sauvegarder la configuration
          </Button>
        </div>
      </div>
    </div>
  )
}
