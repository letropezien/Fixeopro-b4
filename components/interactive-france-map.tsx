"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, ZoomIn, ZoomOut, RefreshCw, Lock, User, Clock, Euro, Search, Wrench } from "lucide-react"

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

interface InteractiveFranceMapProps {
  markers?: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  currentUser?: any
  height?: string
}

export default function InteractiveFranceMap({
  markers = [],
  onMarkerClick,
  currentUser,
  height = "600px",
}: InteractiveFranceMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Convertir les coordonnées GPS en coordonnées SVG
  const gpsToSvg = (lat: number, lng: number) => {
    // Approximation pour la France métropolitaine
    const minLat = 41.0
    const maxLat = 51.5
    const minLng = -5.0
    const maxLng = 9.5

    const x = ((lng - minLng) / (maxLng - minLng)) * 800
    const y = ((maxLat - lat) / (maxLat - minLat)) * 600

    return { x: x + center.x, y: y + center.y }
  }

  const getMarkerColor = (marker: MapMarker) => {
    if (marker.type === "reparateur") return "#2563eb" // blue-600

    switch (marker.urgency) {
      case "urgent":
        return "#ef4444" // red-500
      case "same-day":
        return "#f97316" // orange-500
      case "this-week":
        return "#eab308" // yellow-500
      case "flexible":
        return "#22c55e" // green-500
      default:
        return "#6b7280" // gray-500
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

  // Contrôles de zoom
  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.5))
  }

  const resetView = () => {
    setZoom(1)
    setCenter({ x: 0, y: 0 })
  }

  // Gestion du drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - center.x, y: e.clientY - center.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setCenter({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="space-y-6">
      {/* Carte interactive */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Carte interactive des demandes
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom avant">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom arrière">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={resetView} title="Réinitialiser la vue">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Conteneur de la carte SVG */}
          <div
            className="relative w-full rounded-lg border overflow-hidden bg-gradient-to-br from-blue-50 to-green-50"
            style={{ height }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 600"
              className="cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Fond de carte avec grille */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Contour approximatif de la France */}
              <path
                d="M 150 100 L 200 80 L 280 90 L 350 100 L 400 120 L 450 140 L 480 180 L 500 220 L 520 280 L 510 340 L 480 400 L 440 450 L 380 480 L 320 490 L 260 480 L 200 460 L 160 420 L 140 380 L 130 320 L 140 260 L 150 200 Z"
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeWidth="2"
                opacity="0.8"
              />

              {/* Noms des principales villes */}
              <g className="text-xs fill-gray-600">
                <text x="320" y="150" textAnchor="middle" className="font-medium">
                  Paris
                </text>
                <text x="280" y="320" textAnchor="middle" className="font-medium">
                  Lyon
                </text>
                <text x="380" y="450" textAnchor="middle" className="font-medium">
                  Marseille
                </text>
                <text x="220" y="400" textAnchor="middle" className="font-medium">
                  Toulouse
                </text>
                <text x="180" y="300" textAnchor="middle" className="font-medium">
                  Nantes
                </text>
                <text x="200" y="180" textAnchor="middle" className="font-medium">
                  Lille
                </text>
                <text x="450" y="200" textAnchor="middle" className="font-medium">
                  Strasbourg
                </text>
                <text x="160" y="450" textAnchor="middle" className="font-medium">
                  Bordeaux
                </text>
              </g>

              {/* Marqueurs pour les demandes et réparateurs */}
              {markers.map((marker) => {
                const position = gpsToSvg(marker.coordinates.lat, marker.coordinates.lng)
                const color = getMarkerColor(marker)

                return (
                  <g key={marker.id}>
                    {marker.type === "request" ? (
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r="8"
                        fill={color}
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-pointer hover:scale-125 transition-transform duration-200 drop-shadow-lg"
                        onClick={() => handleMarkerClick(marker)}
                      >
                        <title>{`${marker.title} - ${marker.city}`}</title>
                      </circle>
                    ) : (
                      <rect
                        x={position.x - 6}
                        y={position.y - 6}
                        width="12"
                        height="12"
                        fill={color}
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-pointer hover:scale-125 transition-transform duration-200 drop-shadow-lg"
                        onClick={() => handleMarkerClick(marker)}
                      >
                        <title>{`${marker.title} - ${marker.city}`}</title>
                      </rect>
                    )}

                    {/* Icône dans le marqueur */}
                    {marker.type === "request" ? (
                      <Search
                        x={position.x - 4}
                        y={position.y - 4}
                        width="8"
                        height="8"
                        className="pointer-events-none text-white"
                      />
                    ) : (
                      <Wrench
                        x={position.x - 4}
                        y={position.y - 4}
                        width="8"
                        height="8"
                        className="pointer-events-none text-white"
                      />
                    )}
                  </g>
                )
              })}
            </svg>

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
                  <div className="w-3 h-3 bg-blue-600 rounded-none mr-2"></div>
                  <span>Réparateurs</span>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
              <div className="space-y-1 text-xs">
                <div className="font-medium text-gray-700">Statistiques</div>
                <div>
                  Demandes: <span className="font-medium">{markers.filter((m) => m.type === "request").length}</span>
                </div>
                <div>
                  Réparateurs:{" "}
                  <span className="font-medium">{markers.filter((m) => m.type === "reparateur").length}</span>
                </div>
                <div>
                  Zoom: <span className="font-medium">{Math.round(zoom * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
              <div className="text-xs text-gray-600">
                <div>🖱️ Glisser pour déplacer</div>
                <div>🔍 Cliquer sur les marqueurs</div>
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
                    <Search className="h-5 w-5 mr-2" />
                    Détails de la demande
                  </>
                ) : (
                  <>
                    <Wrench className="h-5 w-5 mr-2" />
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
                  <Badge style={{ backgroundColor: getMarkerColor(selectedMarker) }} className="text-white">
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

                {selectedMarker.data.budget && (
                  <div className="flex items-center">
                    <Euro className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Budget estimé:</span>
                    <span className="ml-2 text-green-600 font-semibold">{selectedMarker.data.budget}</span>
                  </div>
                )}

                {/* Informations de contact masquées/visibles */}
                {!canViewPersonalData() && currentUser?.userType !== "client" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Lock className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-800 font-medium">Informations de contact masquées</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Devenez réparateur avec un abonnement pour accéder aux coordonnées complètes des clients.
                        </p>
                        <Button size="sm" className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white">
                          Devenir réparateur
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
