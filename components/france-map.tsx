"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, ZoomIn, ZoomOut, RefreshCw, Lock, User, Clock, Euro, Search, Wrench, Navigation } from "lucide-react"

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

interface FranceMapProps {
  markers?: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  currentUser?: any
  height?: string
}

// Coordonnées réelles des principales villes françaises
const FRENCH_CITIES = {
  paris: { lat: 48.8566, lng: 2.3522, name: "Paris" },
  marseille: { lat: 43.2965, lng: 5.3698, name: "Marseille" },
  lyon: { lat: 45.764, lng: 4.8357, name: "Lyon" },
  toulouse: { lat: 43.6047, lng: 1.4442, name: "Toulouse" },
  nice: { lat: 43.7102, lng: 7.262, name: "Nice" },
  nantes: { lat: 47.2184, lng: -1.5536, name: "Nantes" },
  strasbourg: { lat: 48.5734, lng: 7.7521, name: "Strasbourg" },
  montpellier: { lat: 43.611, lng: 3.8767, name: "Montpellier" },
  bordeaux: { lat: 44.8378, lng: -0.5792, name: "Bordeaux" },
  lille: { lat: 50.6292, lng: 3.0573, name: "Lille" },
  rennes: { lat: 48.1173, lng: -1.6778, name: "Rennes" },
  reims: { lat: 49.2583, lng: 4.0317, name: "Reims" },
  toulon: { lat: 43.1242, lng: 5.928, name: "Toulon" },
  grenoble: { lat: 45.1885, lng: 5.7245, name: "Grenoble" },
  dijon: { lat: 47.3215, lng: 5.0415, name: "Dijon" },
  angers: { lat: 47.4784, lng: -0.5632, name: "Angers" },
  villeurbanne: { lat: 45.7797, lng: 4.8951, name: "Villeurbanne" },
  saintetienne: { lat: 45.4397, lng: 4.3872, name: "Saint-Étienne" },
  nancy: { lat: 48.6921, lng: 6.1844, name: "Nancy" },
  roubaix: { lat: 50.6942, lng: 3.1746, name: "Roubaix" },
  tourcoing: { lat: 50.7236, lng: 3.1609, name: "Tourcoing" },
  nimes: { lat: 43.8367, lng: 4.3601, name: "Nîmes" },
  limoges: { lat: 45.8336, lng: 1.2611, name: "Limoges" },
  clermont: { lat: 45.7797, lng: 3.0863, name: "Clermont-Ferrand" },
  tours: { lat: 47.3941, lng: 0.6848, name: "Tours" },
  amiens: { lat: 49.8941, lng: 2.2958, name: "Amiens" },
  metz: { lat: 49.1193, lng: 6.1757, name: "Metz" },
  besancon: { lat: 47.2378, lng: 6.0241, name: "Besançon" },
  brest: { lat: 48.3905, lng: -4.4861, name: "Brest" },
  orleans: { lat: 47.9029, lng: 1.9093, name: "Orléans" },
  rouen: { lat: 49.4431, lng: 1.0993, name: "Rouen" },
  mulhouse: { lat: 47.7508, lng: 7.3359, name: "Mulhouse" },
  caen: { lat: 49.1829, lng: -0.3707, name: "Caen" },
  nancy: { lat: 48.6921, lng: 6.1844, name: "Nancy" },
}

export default function FranceMap({ markers = [], onMarkerClick, currentUser, height = "600px" }: FranceMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Demander la géolocalisation de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Géolocalisation non disponible:", error)
        },
      )
    }
  }, [])

  // Convertir les coordonnées GPS en coordonnées SVG (projection Mercator simplifiée)
  const gpsToSvg = (lat: number, lng: number) => {
    // Limites de la France métropolitaine
    const bounds = {
      north: 51.5,
      south: 41.0,
      east: 9.5,
      west: -5.0,
    }

    // Dimensions de la carte SVG
    const mapWidth = 800
    const mapHeight = 600

    // Conversion en coordonnées SVG
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * mapWidth
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * mapHeight

    return {
      x: x * zoom + center.x,
      y: y * zoom + center.y,
    }
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
    setZoom(Math.min(zoom * 1.3, 4))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.3, 0.3))
  }

  const resetView = () => {
    setZoom(1)
    setCenter({ x: 0, y: 0 })
  }

  // Centrer sur la position de l'utilisateur
  const centerOnUser = () => {
    if (userLocation) {
      const userPos = gpsToSvg(userLocation.lat, userLocation.lng)
      setCenter({ x: 400 - userPos.x, y: 300 - userPos.y })
      setZoom(2)
    }
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
            Carte de France - Demandes de dépannage
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom avant">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom arrière">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={resetView} title="Vue d'ensemble">
              <RefreshCw className="h-4 w-4" />
            </Button>
            {userLocation && (
              <Button variant="outline" size="icon" onClick={centerOnUser} title="Ma position">
                <Navigation className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Conteneur de la carte SVG */}
          <div
            className="relative w-full rounded-lg border overflow-hidden bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50"
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
            >
              {/* Définitions pour les dégradés et motifs */}
              <defs>
                <linearGradient id="franceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0f9ff" />
                  <stop offset="50%" stopColor="#e0f2fe" />
                  <stop offset="100%" stopColor="#bae6fd" />
                </linearGradient>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>

              {/* Groupe principal avec transformation */}
              <g transform={`scale(${zoom}) translate(${center.x / zoom}, ${center.y / zoom})`}>
                {/* Grille de fond */}
                <rect width="800" height="600" fill="url(#grid)" />

                {/* Contour réaliste de la France métropolitaine */}
                <path
                  d="M 150 120 
                     L 180 100 L 220 95 L 260 100 L 300 105 L 340 110 L 380 115 L 420 125 L 460 140 L 490 160 L 510 185 L 525 215 L 535 250 L 540 285 L 535 320 L 525 355 L 510 385 L 490 410 L 465 430 L 435 445 L 400 455 L 365 460 L 330 455 L 295 445 L 260 430 L 225 410 L 195 385 L 170 355 L 150 320 L 140 285 L 145 250 L 150 215 L 155 180 Z
                     M 520 460 L 540 470 L 560 485 L 575 505 L 580 525 L 575 545 L 560 560 L 540 570 L 520 575 L 500 570 L 485 560 L 475 545 L 470 525 L 475 505 L 485 485 L 500 470 Z"
                  fill="url(#franceGradient)"
                  stroke="#0ea5e9"
                  strokeWidth="2"
                  opacity="0.9"
                />

                {/* Côtes et frontières */}
                <path
                  d="M 150 120 L 180 100 L 220 95 L 260 100 L 300 105 L 340 110 L 380 115 L 420 125 L 460 140 L 490 160 L 510 185"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3"
                  opacity="0.7"
                />

                {/* Principales villes avec leurs vraies positions */}
                {Object.entries(FRENCH_CITIES).map(([key, city]) => {
                  const position = gpsToSvg(city.lat, city.lng)
                  return (
                    <g key={key}>
                      <circle cx={position.x} cy={position.y} r="3" fill="#374151" stroke="white" strokeWidth="1" />
                      <text
                        x={position.x}
                        y={position.y - 8}
                        textAnchor="middle"
                        className="text-xs font-medium fill-gray-700"
                        style={{ fontSize: "10px" }}
                      >
                        {city.name}
                      </text>
                    </g>
                  )
                })}

                {/* Position de l'utilisateur */}
                {userLocation && (
                  <g>
                    {(() => {
                      const userPos = gpsToSvg(userLocation.lat, userLocation.lng)
                      return (
                        <>
                          <circle
                            cx={userPos.x}
                            cy={userPos.y}
                            r="8"
                            fill="#10b981"
                            stroke="white"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                          <Navigation x={userPos.x - 4} y={userPos.y - 4} width="8" height="8" className="fill-white" />
                        </>
                      )
                    })()}
                  </g>
                )}

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
                          r="10"
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
                          x={position.x - 8}
                          y={position.y - 8}
                          width="16"
                          height="16"
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
                        <text
                          x={position.x}
                          y={position.y + 2}
                          textAnchor="middle"
                          className="text-xs font-bold fill-white pointer-events-none"
                          style={{ fontSize: "8px" }}
                        >
                          !
                        </text>
                      ) : (
                        <text
                          x={position.x}
                          y={position.y + 2}
                          textAnchor="middle"
                          className="text-xs font-bold fill-white pointer-events-none"
                          style={{ fontSize: "8px" }}
                        >
                          R
                        </text>
                      )}
                    </g>
                  )
                })}
              </g>
            </svg>

            {/* Légende */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border">
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-gray-800 mb-3">Légende</div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span>Urgent (2h)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                  <span>Aujourd'hui</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Cette semaine</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span>Flexible</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 mr-2"></div>
                  <span>Réparateurs</span>
                </div>
                {userLocation && (
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-600 rounded-full mr-2 animate-pulse"></div>
                    <span>Votre position</span>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques et contrôles */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border">
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-gray-800">Statistiques</div>
                <div>
                  Demandes:{" "}
                  <span className="font-medium text-red-600">{markers.filter((m) => m.type === "request").length}</span>
                </div>
                <div>
                  Réparateurs:{" "}
                  <span className="font-medium text-blue-600">
                    {markers.filter((m) => m.type === "reparateur").length}
                  </span>
                </div>
                <div>
                  Zoom: <span className="font-medium">{Math.round(zoom * 100)}%</span>
                </div>
                {userLocation && <div className="text-green-600 font-medium">📍 Position détectée</div>}
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border">
              <div className="text-xs text-gray-600 space-y-1">
                <div>🖱️ Glisser pour déplacer</div>
                <div>🔍 Cliquer sur les marqueurs</div>
                <div>⚡ Zoom avec les boutons</div>
                {userLocation && <div>📍 Centrer sur ma position</div>}
              </div>
            </div>

            {/* Message si aucune donnée */}
            {markers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-sm p-8 rounded-lg text-center shadow-lg border">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium text-lg mb-2">Aucune demande trouvée</p>
                  <p className="text-sm text-gray-500">Essayez de modifier vos filtres ou votre zone de recherche</p>
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
