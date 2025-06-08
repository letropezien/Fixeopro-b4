"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Eye, Lock, ZoomIn, ZoomOut, RefreshCw, User } from "lucide-react"

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

interface GoogleMapsProps {
  markers?: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  showPersonalData?: boolean
  currentUser?: any
  height?: string
  width?: string
  standalone?: boolean
}

// Déclaration globale pour Google Maps
declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function GoogleMaps({
  markers = [],
  onMarkerClick,
  showPersonalData = false,
  currentUser,
  height = "600px",
  width = "100%",
  standalone = false,
}: GoogleMapsProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [map, setMap] = useState<any>(null)
  const [googleMarkers, setGoogleMarkers] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadedMarkers, setLoadedMarkers] = useState<MapMarker[]>(markers)
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    urgency: "",
  })
  const [cities, setCities] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const mapRef = useRef<HTMLDivElement>(null)
  const infoWindowRef = useRef<any>(null)

  // Charger Google Maps API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgaJzuELvs8&libraries=places&callback=initMap`
      script.async = true
      script.defer = true

      window.initMap = () => {
        setIsLoaded(true)
      }

      document.head.appendChild(script)
    } else {
      setIsLoaded(true)
    }
  }, [])

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

  // Initialiser la carte Google Maps
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 46.2276, lng: 2.2137 }, // Centre de la France
        zoom: 6,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        zoomControl: false, // On va créer nos propres contrôles
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      setMap(googleMap)

      // Créer InfoWindow
      infoWindowRef.current = new window.google.maps.InfoWindow()
    }
  }, [isLoaded, map])

  // Mettre à jour les marqueurs sur la carte
  useEffect(() => {
    if (map && window.google) {
      // Supprimer les anciens marqueurs
      googleMarkers.forEach((marker) => marker.setMap(null))

      const newMarkers = filteredMarkers.map((markerData) => {
        const marker = new window.google.maps.Marker({
          position: markerData.coordinates,
          map: map,
          title: `${markerData.title} - ${markerData.city}`,
          icon: {
            path:
              markerData.type === "request"
                ? window.google.maps.SymbolPath.CIRCLE
                : window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            fillColor: markerData.type === "request" ? getUrgencyColor(markerData.urgency || "flexible") : "#2563eb",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: markerData.type === "request" ? 8 : 10,
          },
        })

        marker.addListener("click", () => {
          handleMarkerClick(markerData)

          // Afficher InfoWindow
          const content = createInfoWindowContent(markerData)
          infoWindowRef.current.setContent(content)
          infoWindowRef.current.open(map, marker)
        })

        return marker
      })

      setGoogleMarkers(newMarkers)

      // Ajuster la vue pour inclure tous les marqueurs
      if (newMarkers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds()
        filteredMarkers.forEach((marker) => {
          bounds.extend(marker.coordinates)
        })
        map.fitBounds(bounds)
      }
    }
  }, [map, filteredMarkers])

  // Charger les marqueurs depuis le stockage local
  const loadMarkersFromStorage = () => {
    try {
      const StorageService = require("@/lib/storage").StorageService
      const requests = StorageService.getRepairRequests()
      const users = StorageService.getUsers().filter((u: any) => u.userType === "reparateur")

      const requestMarkers: MapMarker[] = requests.map((req: any) => ({
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

      const reparateurMarkers: MapMarker[] = users.map((user: any) => ({
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

  const createInfoWindowContent = (marker: MapMarker) => {
    const urgencyBadge = marker.urgency
      ? `<span style="background-color: ${getUrgencyColor(marker.urgency)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${marker.urgencyLabel || marker.urgency}</span>`
      : ""

    return `
      <div style="max-width: 300px; padding: 10px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${marker.title}</h3>
        ${urgencyBadge}
        <p style="margin: 8px 0; color: #666; font-size: 14px;">${marker.data.description || "Aucune description"}</p>
        <p style="margin: 4px 0; font-size: 12px;"><strong>Ville:</strong> ${marker.city}</p>
        ${marker.category ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Catégorie:</strong> ${marker.category}</p>` : ""}
        <button onclick="window.location.href='/demande/${marker.data.id}'" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 8px;">
          Voir les détails
        </button>
      </div>
    `
  }

  // Contrôles de zoom
  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1)
    }
  }

  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1)
    }
  }

  const resetView = () => {
    if (map) {
      map.setCenter({ lat: 46.2276, lng: 2.2137 })
      map.setZoom(6)
    }
  }

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de Google Maps...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Carte Google Maps */}
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

          {/* Conteneur Google Maps */}
          <div className="relative w-full rounded-lg border overflow-hidden" style={{ height, width }}>
            <div ref={mapRef} className="w-full h-full" />

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

            {/* Statistiques */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
              <div className="space-y-1 text-xs">
                <div className="font-medium text-gray-700">Statistiques</div>
                <div>
                  Demandes:{" "}
                  <span className="font-medium">{filteredMarkers.filter((m) => m.type === "request").length}</span>
                </div>
                <div>
                  Réparateurs:{" "}
                  <span className="font-medium">{filteredMarkers.filter((m) => m.type === "reparateur").length}</span>
                </div>
              </div>
            </div>
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
                  <Badge
                    style={{ backgroundColor: getUrgencyColor(selectedMarker.urgency || "flexible") }}
                    className="text-white"
                  >
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
