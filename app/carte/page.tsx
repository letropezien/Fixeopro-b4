"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StorageService } from "@/lib/storage"

export default function CartePage() {
  const [mapData, setMapData] = useState({
    demandes: [] as any[],
    reparateurs: [] as any[],
  })
  const [filtres, setFiltres] = useState({
    categorie: "toutes",
    statut: "tous",
    type: "tous",
  })
  const [activeTab, setActiveTab] = useState("demandes")
  const [selectedMarker, setSelectedMarker] = useState<any>(null)

  // Catégories disponibles
  const categories = [
    "Électroménager",
    "Informatique",
    "Plomberie",
    "Électricité",
    "Chauffage",
    "Serrurerie",
    "Multimédia",
    "Téléphonie",
    "Climatisation",
  ]

  // Simuler le chargement des données
  useEffect(() => {
    // Récupérer les demandes
    const demandes = StorageService.getAllRepairRequests().map((demande) => ({
      ...demande,
      // Simuler des coordonnées GPS en France
      coordinates: {
        lat: 46.2276 + (Math.random() - 0.5) * 5,
        lng: 2.2137 + (Math.random() - 0.5) * 5,
      },
    }))

    // Récupérer les réparateurs
    const reparateurs = StorageService.getAllUsers()
      .filter((user) => user.userType === "reparateur")
      .map((reparateur) => ({
        ...reparateur,
        // Simuler des coordonnées GPS en France
        coordinates: {
          lat: 46.2276 + (Math.random() - 0.5) * 5,
          lng: 2.2137 + (Math.random() - 0.5) * 5,
        },
      }))

    setMapData({ demandes, reparateurs })
  }, [])

  // Filtrer les données selon les critères
  const filteredData = () => {
    if (activeTab === "demandes") {
      return mapData.demandes.filter((demande) => {
        // Filtre par catégorie
        if (filtres.categorie !== "toutes" && demande.category !== filtres.categorie) {
          return false
        }
        // Filtre par statut
        if (filtres.statut !== "tous" && demande.status !== filtres.statut) {
          return false
        }
        return true
      })
    } else {
      return mapData.reparateurs.filter((reparateur) => {
        // Filtre par spécialité (catégorie)
        if (
          filtres.categorie !== "toutes" &&
          (!reparateur.professional?.specialties || !reparateur.professional.specialties.includes(filtres.categorie))
        ) {
          return false
        }
        // Filtre par type d'abonnement
        if (filtres.type !== "tous" && reparateur.subscription?.plan !== filtres.type) {
          return false
        }
        return true
      })
    }
  }

  // Simuler le rendu d'une carte
  const renderMap = () => {
    const data = filteredData()
    return (
      <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        {/* Simuler une carte */}
        <div className="absolute inset-0 bg-blue-50">
          {/* Grille pour simuler une carte */}
          <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
            {Array.from({ length: 100 }).map((_, index) => (
              <div
                key={index}
                className="border border-blue-100 flex items-center justify-center text-xs text-blue-200"
              ></div>
            ))}
          </div>

          {/* Marqueurs */}
          {data.map((item, index) => {
            // Calculer la position relative dans la grille
            const x = Math.floor(((item.coordinates.lng + 5) / 10) * 100) % 100
            const y = Math.floor(((item.coordinates.lat - 43) / 5) * 100) % 100

            return (
              <div
                key={index}
                className={`absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer ${
                  activeTab === "demandes" ? "bg-red-500" : "bg-blue-500"
                } ${selectedMarker?.id === item.id ? "ring-4 ring-yellow-300" : ""}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                onClick={() => setSelectedMarker(item)}
              >
                <span className="text-white text-xs font-bold">{activeTab === "demandes" ? "D" : "R"}</span>
              </div>
            )
          })}
        </div>

        {/* Légende */}
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded-md shadow-md">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">Demandes</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm">Réparateurs</span>
          </div>
        </div>

        {/* Informations sur le marqueur sélectionné */}
        {selectedMarker && (
          <div className="absolute top-4 left-4 bg-white p-4 rounded-md shadow-md max-w-xs">
            <h3 className="font-bold mb-2">
              {activeTab === "demandes"
                ? `Demande: ${selectedMarker.title}`
                : `${selectedMarker.firstName} ${selectedMarker.lastName}`}
            </h3>
            {activeTab === "demandes" ? (
              <>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Catégorie:</span> {selectedMarker.category}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Statut:</span> {selectedMarker.status}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Localisation:</span> {selectedMarker.city}
                </p>
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => (window.location.href = `/demande/${selectedMarker.id}`)}
                >
                  Voir les détails
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Spécialités:</span>{" "}
                  {selectedMarker.professional?.specialties?.join(", ") || "Non spécifié"}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Ville:</span> {selectedMarker.city}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Abonnement:</span> {selectedMarker.subscription?.plan || "Aucun"}
                </p>
              </>
            )}
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => setSelectedMarker(null)}>
              Fermer
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Carte interactive</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtres */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Select value={filtres.categorie} onValueChange={(value) => setFiltres({ ...filtres, categorie: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes les catégories</SelectItem>
                  {categories.map((categorie) => (
                    <SelectItem key={categorie} value={categorie}>
                      {categorie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activeTab === "demandes" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={filtres.statut} onValueChange={(value) => setFiltres({ ...filtres, statut: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="accepted">Acceptée</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">Type d'abonnement</label>
                <Select value={filtres.type} onValueChange={(value) => setFiltres({ ...filtres, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les types</SelectItem>
                    <SelectItem value="basic">Essentiel</SelectItem>
                    <SelectItem value="pro">Professionnel</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="trial">Essai gratuit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              className="w-full"
              variant="outline"
              onClick={() =>
                setFiltres({
                  categorie: "toutes",
                  statut: "tous",
                  type: "tous",
                })
              }
            >
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>

        {/* Carte */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="demandes">Demandes de réparation</TabsTrigger>
              <TabsTrigger value="reparateurs">Réparateurs</TabsTrigger>
            </TabsList>
            <TabsContent value="demandes" className="mt-0">
              {renderMap()}
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Affichage de {filteredData().length} demandes sur {mapData.demandes.length} au total
                </p>
              </div>
            </TabsContent>
            <TabsContent value="reparateurs" className="mt-0">
              {renderMap()}
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Affichage de {filteredData().length} réparateurs sur {mapData.reparateurs.length} au total
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
