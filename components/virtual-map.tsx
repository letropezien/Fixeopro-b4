"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, User, Eye, Lock } from "lucide-react"

interface MapMarker {
  id: string
  type: "request" | "reparateur"
  title: string
  city: string
  category?: string
  urgency?: string
  urgencyLabel?: string
  coordinates: { lat: number; lng: number }
  data: any
}

interface VirtualMapProps {
  markers: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  showPersonalData?: boolean
  currentUser?: any
}

export default function VirtualMap({ markers, onMarkerClick, showPersonalData = false, currentUser }: VirtualMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 46.2276, lng: 2.2137 }) // Centre de la France

  // Calculer les limites de la carte basées sur les marqueurs
  useEffect(() => {
    if (markers.length > 0) {
      const lats = markers.map((m) => m.coordinates.lat)
      const lngs = markers.map((m) => m.coordinates.lng)

      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2

      setMapCenter({ lat: centerLat, lng: centerLng })
    }
  }, [markers])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-500"
      case "same-day":
        return "bg-orange-500"
      case "this-week":
        return "bg-yellow-500"
      case "flexible":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const normalizeCoordinate = (coord: number, min: number, max: number) => {
    return ((coord - min) / (max - min)) * 100
  }

  // Calculer les positions relatives des marqueurs
  const getMarkerPosition = (marker: MapMarker) => {
    const allLats = markers.map((m) => m.coordinates.lat)
    const allLngs = markers.map((m) => m.coordinates.lng)

    const minLat = Math.min(...allLats) - 0.5
    const maxLat = Math.max(...allLats) + 0.5
    const minLng = Math.min(...allLngs) - 0.5
    const maxLng = Math.max(...allLngs) + 0.5

    const x = normalizeCoordinate(marker.coordinates.lng, minLng, maxLng)
    const y = 100 - normalizeCoordinate(marker.coordinates.lat, minLat, maxLat) // Inverser Y pour l'affichage

    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`,
    }
  }

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker)
    onMarkerClick?.(marker)
  }

  const canViewPersonalData = () => {
    if (!currentUser) return false
    if (currentUser.userType !== "reparateur") return false

    // Vérifier si le réparateur a un abonnement actif ou est en période d'essai
    if (currentUser.subscription?.status === "active") return true
    if (currentUser.subscription?.status === "trial") {
      const expiresAt = new Date(currentUser.subscription.endDate)
      return expiresAt > new Date()
    }

    return false
  }

  const maskPersonalData = (text: string) => {
    if (canViewPersonalData()) return text
    return text.replace(/[a-zA-ZÀ-ÿ]/g, "*")
  }

  return (
    <div className="space-y-6">
      {/* Carte virtuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Carte des demandes de dépannage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border overflow-hidden">
            {/* Grille de fond pour simuler une carte */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Noms de villes en arrière-plan */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 text-xs text-gray-400 font-medium">Lille</div>
              <div className="absolute top-8 right-8 text-xs text-gray-400 font-medium">Strasbourg</div>
              <div className="absolute top-1/4 left-1/4 text-xs text-gray-400 font-medium">Paris</div>
              <div className="absolute top-1/3 right-1/3 text-xs text-gray-400 font-medium">Lyon</div>
              <div className="absolute bottom-1/4 left-1/3 text-xs text-gray-400 font-medium">Toulouse</div>
              <div className="absolute bottom-8 right-4 text-xs text-gray-400 font-medium">Nice</div>
              <div className="absolute bottom-4 left-8 text-xs text-gray-400 font-medium">Bordeaux</div>
              <div className="absolute top-1/2 left-8 text-xs text-gray-400 font-medium">Nantes</div>
              <div className="absolute bottom-1/3 right-1/4 text-xs text-gray-400 font-medium">Marseille</div>
            </div>

            {/* Marqueurs */}
            {markers.map((marker) => {
              const position = getMarkerPosition(marker)

              return (
                <div
                  key={marker.id}
                  className={`absolute w-6 h-6 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-all duration-200 shadow-lg border-2 border-white flex items-center justify-center ${
                    marker.type === "request" ? getUrgencyColor(marker.urgency || "flexible") : "bg-blue-600"
                  } ${selectedMarker?.id === marker.id ? "ring-4 ring-yellow-300" : ""}`}
                  style={position}
                  onClick={() => handleMarkerClick(marker)}
                  title={`${marker.type === "request" ? "Demande" : "Réparateur"}: ${marker.title} - ${marker.city}`}
                >
                  {marker.type === "request" ? (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                  )}
                </div>
              )
            })}

            {/* Légende */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
              <div className="space-y-2 text-xs">
                <div className="font-medium text-gray-700 mb-2">Légende</div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Urgent</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span>Aujourd'hui</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Cette semaine</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Flexible</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-sm mr-2"></div>
                  <span>Réparateurs</span>
                </div>
              </div>
            </div>

            {/* Message si aucune donnée */}
            {markers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Aucune demande trouvée</p>
                  <p className="text-sm text-gray-500">Essayez de modifier vos filtres</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Détails du marqueur sélectionné */}
      {selectedMarker && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                {selectedMarker.type === "request" ? (
                  <>
                    <MapPin className="h-5 w-5 mr-2" />
                    Détails de la demande
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5 mr-2" />
                    Profil du réparateur
                  </>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMarker(null)}>
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMarker.type === "request" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{selectedMarker.title}</h3>
                  <Badge className={`${getUrgencyColor(selectedMarker.urgency || "flexible")} text-white`}>
                    {selectedMarker.urgencyLabel || "Non spécifié"}
                  </Badge>
                </div>

                <p className="text-gray-600">{selectedMarker.data.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <span className="font-medium">Localisation:</span>
                      <p className="text-gray-600">
                        {selectedMarker.city} {selectedMarker.data.postalCode && `(${selectedMarker.data.postalCode})`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <span className="font-medium">Client:</span>
                      <p className="text-gray-600">
                        {canViewPersonalData() ? (
                          <>
                            {selectedMarker.data.client?.firstName || "Client"}{" "}
                            {selectedMarker.data.client?.lastName || ""}
                          </>
                        ) : (
                          <span className="flex items-center">
                            <Lock className="h-3 w-3 mr-1" />
                            {maskPersonalData("Jean Dupont")}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Catégorie:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedMarker.category}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <span className="font-medium">Créée le:</span>
                      <p className="text-gray-600">
                        {new Date(selectedMarker.data.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations de contact masquées/visibles */}
                {!canViewPersonalData() && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Lock className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-800 font-medium">Informations de contact masquées</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Souscrivez à un abonnement pour accéder aux coordonnées complètes des clients.
                        </p>
                        <Button size="sm" className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white">
                          Voir les abonnements
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      if (selectedMarker.data.id) {
                        window.location.href = `/demande/${selectedMarker.data.id}`
                      }
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir les détails complets
                  </Button>
                  {canViewPersonalData() && (
                    <Button variant="outline" className="flex-1">
                      Contacter le client
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center font-medium">
                    {canViewPersonalData() ? (
                      <>
                        {selectedMarker.data.firstName?.[0] || ""}
                        {selectedMarker.data.lastName?.[0] || ""}
                      </>
                    ) : (
                      "**"
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {canViewPersonalData() ? (
                        <>
                          {selectedMarker.data.firstName || ""} {selectedMarker.data.lastName || ""}
                        </>
                      ) : (
                        <span className="flex items-center">
                          <Lock className="h-4 w-4 mr-2" />
                          {maskPersonalData("Thomas Martin")}
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600">
                      {selectedMarker.data.professional?.companyName || "Réparateur indépendant"}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600">
                  {selectedMarker.data.professional?.description || "Aucune description disponible"}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <span className="font-medium">Localisation:</span>
                      <p className="text-gray-600">{selectedMarker.data.city || "Non spécifié"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <span className="font-medium">Expérience:</span>
                      <p className="text-gray-600">{selectedMarker.data.professional?.experience || "Non spécifié"}</p>
                    </div>
                  </div>
                </div>

                {selectedMarker.data.professional?.specialties && (
                  <div>
                    <span className="font-medium text-sm">Spécialités:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedMarker.data.professional.specialties.map((specialty: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  {canViewPersonalData() ? (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">Contacter ce réparateur</Button>
                  ) : (
                    <Button disabled className="flex-1">
                      <Lock className="h-4 w-4 mr-2" />
                      Abonnement requis
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1">
                    Voir le profil complet
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
