"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MessageSquare, User, Wrench } from "lucide-react"

interface Request {
  id: string
  title: string
  category: string
  location: string
  status: "pending" | "in_progress" | "completed"
  createdAt: string
  budget?: string
}

interface Repairer {
  id: string
  name: string
  specialties: string[]
  location: string
  rating: number
  isActive: boolean
}

interface OverviewProps {
  stats: {
    totalUsers: number
    totalRepairers: number
    totalRequests: number
    monthlyRevenue: number
  }
}

export function Overview({ stats }: OverviewProps) {
  // Données simulées pour les demandes récentes
  const recentRequests: Request[] = [
    {
      id: "1",
      title: "Réparation iPhone écran cassé",
      category: "Téléphonie",
      location: "Paris 15e",
      status: "pending",
      createdAt: "2024-01-15",
      budget: "80-120€",
    },
    {
      id: "2",
      title: "Dépannage lave-linge",
      category: "Électroménager",
      location: "Lyon 3e",
      status: "in_progress",
      createdAt: "2024-01-14",
      budget: "50-100€",
    },
    {
      id: "3",
      title: "Réparation ordinateur portable",
      category: "Informatique",
      location: "Marseille 2e",
      status: "completed",
      createdAt: "2024-01-13",
      budget: "100-200€",
    },
  ]

  // Données simulées pour les réparateurs actifs
  const activeRepairers: Repairer[] = [
    {
      id: "1",
      name: "Jean Dupont",
      specialties: ["Téléphonie", "Informatique"],
      location: "Paris",
      rating: 4.8,
      isActive: true,
    },
    {
      id: "2",
      name: "Marie Martin",
      specialties: ["Électroménager"],
      location: "Lyon",
      rating: 4.9,
      isActive: true,
    },
    {
      id: "3",
      name: "Pierre Durand",
      specialties: ["Automobile", "Mécanique"],
      location: "Marseille",
      rating: 4.7,
      isActive: true,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">En attente</Badge>
      case "in_progress":
        return <Badge variant="default">En cours</Badge>
      case "completed":
        return <Badge variant="outline">Terminée</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réparateurs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRepairers}</div>
            <p className="text-xs text-muted-foreground">+8% par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">+23% par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CA Mensuel</CardTitle>
            <span className="text-lg">€</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyRevenue}€</div>
            <p className="text-xs text-muted-foreground">+15% par rapport au mois dernier</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Demandes récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes récentes</CardTitle>
            <CardDescription>Les dernières demandes de réparation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{request.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.category} • {request.location}
                    </p>
                    {request.budget && <p className="text-xs text-muted-foreground">Budget: {request.budget}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(request.status)}
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Réparateurs actifs */}
        <Card>
          <CardHeader>
            <CardTitle>Réparateurs actifs</CardTitle>
            <CardDescription>Les réparateurs connectés récemment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRepairers.map((repairer) => (
                <div key={repairer.id} className="flex items-center justify-between space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{repairer.name}</p>
                    <p className="text-sm text-muted-foreground">{repairer.specialties.join(", ")}</p>
                    <p className="text-xs text-muted-foreground">
                      {repairer.location} • ⭐ {repairer.rating}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-green-600">
                      En ligne
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
