"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Wrench,
  MessageSquare,
  Shield,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Euro,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import CategoryImagesConfig from "@/components/category-images-config"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Vérification de l'authentification admin
  useEffect(() => {
    const adminAuth = localStorage.getItem("admin_authenticated")
    if (adminAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Récupérer le mot de passe stocké ou utiliser le défaut
    const storedPassword = localStorage.getItem("admin_password") || "FixeoAdmin2024!"

    if (password === storedPassword) {
      localStorage.setItem("admin_authenticated", "true")
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Mot de passe incorrect")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    setIsAuthenticated(false)
    router.push("/")
  }

  // Données de démonstration pour l'admin
  const stats = [
    { title: "Utilisateurs actifs", value: "2,847", change: "+12%", icon: Users, color: "text-blue-600" },
    { title: "Réparateurs", value: "1,234", change: "+8%", icon: Wrench, color: "text-green-600" },
    { title: "Demandes ce mois", value: "856", change: "+23%", icon: MessageSquare, color: "text-purple-600" },
    { title: "CA mensuel", value: "45,230€", change: "+15%", icon: Euro, color: "text-orange-600" },
  ]

  const recentRequests = [
    {
      id: "REQ-001",
      client: "Marie Dubois",
      category: "Plomberie",
      status: "En cours",
      amount: "120€",
      date: "2024-01-15",
    },
    {
      id: "REQ-002",
      client: "Pierre Martin",
      category: "Électricité",
      status: "Terminé",
      amount: "85€",
      date: "2024-01-14",
    },
    {
      id: "REQ-003",
      client: "Sophie Laurent",
      category: "Informatique",
      status: "En attente",
      amount: "200€",
      date: "2024-01-14",
    },
  ]

  const recentRepairers = [
    {
      id: "REP-001",
      name: "Jean Dupont",
      specialty: "Plomberie",
      rating: 4.8,
      completedJobs: 156,
      status: "Actif",
    },
    {
      id: "REP-002",
      name: "Marc Leroy",
      specialty: "Électricité",
      rating: 4.9,
      completedJobs: 203,
      status: "Actif",
    },
    {
      id: "REP-003",
      name: "Paul Moreau",
      specialty: "Informatique",
      rating: 4.7,
      completedJobs: 89,
      status: "Inactif",
    },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Accès Administrateur</CardTitle>
            <p className="text-gray-600">Zone réservée aux administrateurs</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Mot de passe administrateur"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Administration Fixeo.pro</h1>
                <p className="text-gray-600">Tableau de bord administrateur</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-red-600 text-red-600">
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Onglets de gestion */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="requests">Demandes</TabsTrigger>
            <TabsTrigger value="repairers">Réparateurs</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Demandes récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Demandes récentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{request.client}</p>
                          <p className="text-sm text-gray-600">{request.category}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              request.status === "Terminé"
                                ? "default"
                                : request.status === "En cours"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {request.status}
                          </Badge>
                          <p className="text-sm font-medium">{request.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Réparateurs actifs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wrench className="h-5 w-5" />
                    <span>Réparateurs récents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRepairers.map((repairer) => (
                      <div key={repairer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{repairer.name}</p>
                          <p className="text-sm text-gray-600">{repairer.specialty}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm">⭐ {repairer.rating}</span>
                          </div>
                          <Badge variant={repairer.status === "Actif" ? "default" : "secondary"}>
                            {repairer.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des demandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Input placeholder="Rechercher une demande..." className="max-w-sm" />
                    <Button>Nouvelle demande</Button>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left">ID</th>
                          <th className="px-4 py-3 text-left">Client</th>
                          <th className="px-4 py-3 text-left">Catégorie</th>
                          <th className="px-4 py-3 text-left">Statut</th>
                          <th className="px-4 py-3 text-left">Montant</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentRequests.map((request) => (
                          <tr key={request.id} className="border-t">
                            <td className="px-4 py-3">{request.id}</td>
                            <td className="px-4 py-3">{request.client}</td>
                            <td className="px-4 py-3">{request.category}</td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={
                                  request.status === "Terminé"
                                    ? "default"
                                    : request.status === "En cours"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {request.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">{request.amount}</td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="repairers">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des réparateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Input placeholder="Rechercher un réparateur..." className="max-w-sm" />
                    <Button>Ajouter réparateur</Button>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left">ID</th>
                          <th className="px-4 py-3 text-left">Nom</th>
                          <th className="px-4 py-3 text-left">Spécialité</th>
                          <th className="px-4 py-3 text-left">Note</th>
                          <th className="px-4 py-3 text-left">Interventions</th>
                          <th className="px-4 py-3 text-left">Statut</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentRepairers.map((repairer) => (
                          <tr key={repairer.id} className="border-t">
                            <td className="px-4 py-3">{repairer.id}</td>
                            <td className="px-4 py-3">{repairer.name}</td>
                            <td className="px-4 py-3">{repairer.specialty}</td>
                            <td className="px-4 py-3">⭐ {repairer.rating}</td>
                            <td className="px-4 py-3">{repairer.completedJobs}</td>
                            <td className="px-4 py-3">
                              <Badge variant={repairer.status === "Actif" ? "default" : "secondary"}>
                                {repairer.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <CategoryImagesConfig />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Analyses de performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Taux de satisfaction</span>
                      <span className="font-bold text-green-600">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Temps de réponse moyen</span>
                      <span className="font-bold">2h 15min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taux de conversion</span>
                      <span className="font-bold text-blue-600">78.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alertes système</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm">3 demandes en attente depuis +24h</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Système de paiement opérationnel</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Changement de mot de passe admin */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Sécurité Administrateur</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.target as HTMLFormElement)
                      const currentPassword = formData.get("currentPassword") as string
                      const newPassword = formData.get("newPassword") as string
                      const confirmPassword = formData.get("confirmPassword") as string

                      // Vérifier le mot de passe actuel
                      const storedPassword = localStorage.getItem("admin_password") || "FixeoAdmin2024!"
                      if (currentPassword !== storedPassword) {
                        alert("Mot de passe actuel incorrect")
                        return
                      }

                      if (newPassword !== confirmPassword) {
                        alert("Les nouveaux mots de passe ne correspondent pas")
                        return
                      }

                      if (newPassword.length < 8) {
                        alert("Le nouveau mot de passe doit contenir au moins 8 caractères")
                        return
                      }

                      // Sauvegarder le nouveau mot de passe
                      localStorage.setItem("admin_password", newPassword)
                      alert("Mot de passe modifié avec succès !")

                      // Réinitialiser le formulaire
                      ;(e.target as HTMLFormElement).reset()
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                      <Input
                        type="password"
                        name="currentPassword"
                        required
                        placeholder="Entrez votre mot de passe actuel"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                      <Input
                        type="password"
                        name="newPassword"
                        required
                        placeholder="Entrez le nouveau mot de passe"
                        minLength={8}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmer le nouveau mot de passe
                      </label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        required
                        placeholder="Confirmez le nouveau mot de passe"
                        minLength={8}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                      Changer le mot de passe
                    </Button>
                  </form>

                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Conseils de sécurité</h4>
                        <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                          <li>• Utilisez au moins 8 caractères</li>
                          <li>• Mélangez majuscules, minuscules et chiffres</li>
                          <li>• Ajoutez des caractères spéciaux (!@#$%)</li>
                          <li>• Ne partagez jamais votre mot de passe</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Configuration générale */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Configuration Système</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Paramètres généraux</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">Maintenance programmée</span>
                            <p className="text-sm text-gray-600">Planifier les maintenances système</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Configurer
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">Notifications email</span>
                            <p className="text-sm text-gray-600">Gérer les alertes automatiques</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Gérer
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">Sauvegarde automatique</span>
                            <p className="text-sm text-gray-600">Planifier les sauvegardes</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Planifier
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">Logs système</span>
                            <p className="text-sm text-gray-600">Consulter l'historique des actions</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Voir les logs
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Informations système</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Version :</span>
                          <span className="font-medium">Fixeo.pro v2.1.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dernière mise à jour :</span>
                          <span className="font-medium">15 janvier 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Statut :</span>
                          <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
