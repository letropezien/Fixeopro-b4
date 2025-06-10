"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Eye, Globe, Smartphone, Download } from "lucide-react"

interface AnalyticsData {
  visitors: number
  pageViews: number
  bounceRate: number
  avgSessionDuration: string
  topPages: Array<{ page: string; views: number }>
  trafficSources: Array<{ source: string; visitors: number; percentage: number }>
  countries: Array<{ country: string; visitors: number }>
  devices: Array<{ device: string; percentage: number }>
}

// Données de démonstration
const mockData: AnalyticsData = {
  visitors: 2847,
  pageViews: 8934,
  bounceRate: 34.2,
  avgSessionDuration: "3m 42s",
  topPages: [
    { page: "/", views: 1234 },
    { page: "/categories", views: 892 },
    { page: "/demande-reparation", views: 567 },
    { page: "/liste-reparateurs", views: 445 },
    { page: "/comment-ca-marche", views: 334 },
  ],
  trafficSources: [
    { source: "Google", visitors: 1423, percentage: 50 },
    { source: "Direct", visitors: 854, percentage: 30 },
    { source: "Facebook", visitors: 284, percentage: 10 },
    { source: "Autres", visitors: 286, percentage: 10 },
  ],
  countries: [
    { country: "France", visitors: 2134 },
    { country: "Belgique", visitors: 234 },
    { country: "Suisse", visitors: 189 },
    { country: "Canada", visitors: 156 },
    { country: "Autres", visitors: 134 },
  ],
  devices: [
    { device: "Desktop", percentage: 45 },
    { device: "Mobile", percentage: 42 },
    { device: "Tablette", percentage: 13 },
  ],
}

export function Analytics() {
  const [period, setPeriod] = useState("30d")
  const [data] = useState<AnalyticsData>(mockData)

  const exportData = () => {
    const csvContent = `Page,Vues\n${data.topPages.map((p) => `${p.page},${p.views}`).join("\n")}`
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "analytics-fixeo-pro.csv"
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Statistiques de votre site Fixeo.Pro</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visiteurs uniques</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.visitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pages vues</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8.2% par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de rebond</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.bounceRate}%</div>
            <p className="text-xs text-muted-foreground">-2.1% par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durée moyenne</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avgSessionDuration}</div>
            <p className="text-xs text-muted-foreground">+15s par rapport au mois dernier</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Pages populaires</TabsTrigger>
          <TabsTrigger value="sources">Sources de trafic</TabsTrigger>
          <TabsTrigger value="geo">Géographie</TabsTrigger>
          <TabsTrigger value="devices">Appareils</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pages les plus visitées</CardTitle>
              <CardDescription>Top 5 des pages avec le plus de vues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{page.page}</span>
                    </div>
                    <span className="text-muted-foreground">{page.views.toLocaleString()} vues</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sources de trafic</CardTitle>
              <CardDescription>D'où viennent vos visiteurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.trafficSources.map((source) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">{source.visitors.toLocaleString()}</span>
                      <Badge variant="secondary">{source.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition géographique</CardTitle>
              <CardDescription>Pays de vos visiteurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.countries.map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{country.country}</span>
                    </div>
                    <span className="text-muted-foreground">{country.visitors.toLocaleString()} visiteurs</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Types d'appareils</CardTitle>
              <CardDescription>Comment vos visiteurs accèdent au site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.devices.map((device) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <Badge variant="secondary">{device.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
