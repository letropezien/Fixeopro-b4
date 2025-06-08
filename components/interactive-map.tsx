"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Eye, Lock, ZoomIn, ZoomOut, RefreshCw, UserIcon as IconUser } from "lucide-react"
import { StorageService, User as StorageUser } from "@/lib/storage"

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

interface InteractiveMapProps {
  markers?: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  showPersonalData?: boolean
  currentUser?: any
  height?: string
  width?: string
  standalone?: boolean
}

// Coordonnées des principales villes françaises
const CITIES_COORDINATES = {
  paris: { lat: 48.8566, lng: 2.3522, name: "Paris" },
  lyon: { lat: 45.764, lng: 4.8357, name: "Lyon" },
  marseille: { lat: 43.2965, lng: 5.3698, name: "Marseille" },
  toulouse: { lat: 43.6047, lng: 1.4442, name: "Toulouse" },
  nice: { lat: 43.7102, lng: 7.262, name: "Nice" },
  nantes: { lat: 47.2184, lng: -1.5536, name: "Nantes" },
  strasbourg: { lat: 48.5734, lng: 7.7521, name: "Strasbourg" },
  montpellier: { lat: 43.611, lng: 3.8767, name: "Montpellier" },
  bordeaux: { lat: 44.8378, lng: -0.5792, name: "Bordeaux" },
  lille: { lat: 50.6292, lng: 3.0573, name: "Lille" },
  rennes: { lat: 48.1173, lng: -1.6778, name: "Rennes" },
  reims: { lat: 49.2583, lng: 4.0317, name: "Reims" },
  toulon: { lat: 43.1242, lng: 5.9279, name: "Toulon" },
  grenoble: { lat: 45.1885, lng: 5.7245, name: "Grenoble" },
  dijon: { lat: 47.322, lng: 5.0415, name: "Dijon" },
}

// Contours simplifiés de la France pour le fond de carte
const FRANCE_OUTLINE =
  "M38,80 L42,40 L80,20 L140,10 L190,20 L230,60 L240,100 L220,140 L240,180 L220,220 L180,230 L140,210 L100,220 L60,200 L40,160 L20,120 L38,80z"

export default function InteractiveMap({
  markers = [],
  onMarkerClick,
  showPersonalData = false,
  currentUser,
  height = "600px",
  width = "100%",
  standalone = false,
}: InteractiveMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 46.2276, lng: 2.2137 }) // Centre de la France
  const [zoom, setZoom] = useState(1)
  const [viewBox, setViewBox] = useState("0 0 260 240")
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [loadedMarkers, setLoadedMarkers] = useState<MapMarker[]>(markers)
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    urgency: "",
  })
  const [cities, setCities] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const svgRef = useRef<SVGSVGElement>(null)

  // Charger les marqueurs si non fournis
  useEffect(() => {
    if (markers.length === 0 && standalone) {
      loadMarkersFromStorage()
    } else {
      setLoadedMarkers(markers)
    }
  }, [markers, standalone])

  // Extraire les villes et catégories pour les filtres
  useEffect(() => {
    if (loadedMarkers.length > 0) {
      const uniqueCities = Array.from(new Set(loadedMarkers.map((m) => m.city)))
      const uniqueCategories = Array.from(
        new Set(loadedMarkers.filter((m) => m.category).map((m) => m.category as string)),
      )
      setCities(uniqueCities)
      setCategories(uniqueCategories)
    }
  }, [loadedMarkers])

  // Charger les marqueurs depuis le stockage local
  const loadMarkersFromStorage = () => {
    try {
      const requests = StorageService.getRepairRequests()
      const users = StorageService.getUsers().filter((u) => u.userType === "reparateur")

      const requestMarkers: MapMarker[] = requests.map((req) => ({
        id: req.id,
        type: "request",
        title: req.title,
        city: req.city,
        category: req.category,
        urgency: req.urgency,
        urgencyLabel: req.urgencyLabel,
        coordinates: req.coordinates || StorageService.generateCoordinatesForCity(req.city),
        data: req,
      }))

      const reparateurMarkers: MapMarker[] = users.map((user) => ({
        id: user.id,
        type: "reparateur",
        title: `${user.firstName} ${user.lastName}`,
        city: user.city || "Non spécifié",
        coordinates: StorageService.generateCoordinatesForCity(user.city || "Paris"),
        data: user,
      }))

      setLoadedMarkers([...requestMarkers, ...reparateurMarkers])
    } catch (error) {
      console.error("Erreur lors du chargement des marqueurs:", error)
    }
  }

  // Filtrer les marqueurs
  const filteredMarkers = loadedMarkers.filter((marker) => {
    return (
      (filters.city === "" || marker.city.toLowerCase().includes(filters.city.toLowerCase())) &&
      (filters.category === "" ||
        (marker.category && marker.category.toLowerCase().includes(filters.category.toLowerCase()))) &&
      (filters.urgency === "" || marker.urgency === filters.urgency)
    )
  })

  // Gérer le zoom
  const handleZoomIn = () => {
    if (zoom < 4) {
      setZoom((prev) => prev + 0.5)
      updateViewBox(zoom + 0.5)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 0.5) {
      setZoom((prev) => prev - 0.5)
      updateViewBox(zoom - 0.5)
    }
  }

  const updateViewBox = (newZoom: number) => {
    const width = 260
    const height = 240
    const scaleFactor = 1 / newZoom

    const newWidth = width * scaleFactor
    const newHeight = height * scaleFactor

    const centerX = 130 + dragOffset.x
    const centerY = 120 + dragOffset.y

    const x = centerX - newWidth / 2
    const y = centerY - newHeight / 2

    setViewBox(`${x} ${y} ${newWidth} ${newHeight}`)
  }

  // Gérer le déplacement de la carte
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 0) {
      // Clic gauche uniquement
      setIsDragging(true)
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging && svgRef.current) {
      const dx = (e.clientX - dragStart.x) / zoom
      const dy = (e.clientY - dragStart.y) / zoom

      const newOffset = {
        x: dragOffset.x - dx,
        y: dragOffset.y - dy,
      }

      setDragOffset(newOffset)
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      })

      updateViewBox(zoom)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Réinitialiser la vue
  const resetView = () => {
    setZoom(1)
    setDragOffset({ x: 0, y: 0 })
    setViewBox("0 0 260 240")
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
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
    if (showPersonalData) return true
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
      {/* Carte interactive */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Carte des demandes de dépannage
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
          {/* Filtres */}
          {standalone && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="cityFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <select
                  id="cityFilter"
                  className="w-full p-2 border rounded-md"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                >
                  <option value="">Toutes les villes</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  id="categoryFilter"
                  className="w-full p-2 border rounded-md"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="urgencyFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Urgence
                </label>
                <select
                  id="urgencyFilter"
                  className="w-full p-2 border rounded-md"
                  value={filters.urgency}
                  onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                >
                  <option value="">Toutes les urgences</option>
                  <option value="urgent">Urgent</option>
                  <option value="same-day">Aujourd'hui</option>
                  <option value="this-week">Cette semaine</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          )}

          {/* Carte SVG */}
          <div className="relative w-full rounded-lg border overflow-hidden bg-blue-50" style={{ height, width }}>
            <svg
              ref={svgRef}
              viewBox={viewBox}
              className={`w-full h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {/* Contour de la France */}
              <path
                d={FRANCE_OUTLINE}
                fill="#e5e7eb"
                stroke="#d1d5db"
                strokeWidth="2"
                className="transition-colors duration-200"
              />

              {/* Noms des principales villes */}
              {Object.values(CITIES_COORDINATES).map((city) => (
                <text
                  key={city.name}
                  x={city.lng * 3 + 130}
                  y={240 - (city.lat * 3 + 30)}
                  fontSize="6"
                  fill="#94a3b8"
                  textAnchor="middle"
                >
                  {city.name}
                </text>
              ))}

              {/* Marqueurs */}
              {filteredMarkers.map((marker) => {
                // Convertir les coordonnées GPS en coordonnées SVG
                const x = marker.coordinates.lng * 3 + 130
                const y = 240 - (marker.coordinates.lat * 3 + 30)

                return (
                  <g
                    key={marker.id}
                    transform={`translate(${x}, ${y})`}
                    onClick={() => handleMarkerClick(marker)}
                    className="cursor-pointer hover:scale-125 transition-transform duration-200"
                  >
                    {marker.type === "request" ? (
                      // Marqueur de demande (cercle)
                      <circle
                        r="4"
                        fill={getUrgencyColor(marker.urgency || "flexible")}
                        stroke="white"
                        strokeWidth="1"
                        className={selectedMarker?.id === marker.id ? "stroke-2 stroke-yellow-400" : ""}
                      />
                    ) : (
                      // Marqueur de réparateur (carré)
                      <rect
                        x="-3"
                        y="-3"
                        width="6"
                        height="6"
                        fill="#2563eb" // blue-600
                        stroke="white"
                        strokeWidth="1"
                        className={selectedMarker?.id === marker.id ? "stroke-2 stroke-yellow-400" : ""}
                      />
                    )}

                    {/* Tooltip au survol */}
                    <title>
                      {marker.title} - {marker.city}
                    </title>
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
                  <div className="w-3 h-3 bg-blue-600 rounded-sm mr-2"></div>
                  <span>Réparateurs</span>
                </div>
              </div>
            </div>

            {/* Message si aucune donnée */}
            {filteredMarkers.length === 0 && (
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
                    <IconUser className="h-5 w-5 mr-2" />
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
                  <Badge className={`bg-[${getUrgencyColor(selectedMarker.urgency || "flexible")}] text-white`}>
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
                    <StorageUser className="h-4 w-4 mr-2 text-gray-400" />
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
