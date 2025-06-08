"use client"

import Link from "next/link"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, ZoomIn, ZoomOut, RefreshCw, Lock, User, Clock, Euro } from "lucide-react"

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

interface GoogleMapsComponentProps {
  markers?: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  currentUser?: any
  height?: string
}

// Déclaration globale pour Google Maps
declare global {
  interface Window {
    google: any
    initGoogleMaps: () => void
  }
}

export default function GoogleMapsComponent({
  markers = [],
  onMarkerClick,
  currentUser,
  height = "600px",
}: GoogleMapsComponentProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [map, setMap] = useState<any>(null)
  const [googleMarkers, setGoogleMarkers] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const infoWindowRef = useRef<any>(null)

  // Charger Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsLoaded(true)
        return
      }

      // Créer le script Google Maps
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgaJzuELvs8&libraries=places`
      script.async = true
      script.defer = true

      script.onload = () => {
        setIsLoaded(true)
      }

      script.onerror = () => {
        setError("Erreur lors du chargement de Google Maps")
      }

      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [])

  // Initialiser la carte Google Maps
  useEffect(() => {
    if (isLoaded && mapRef.current && !map && window.google) {
      try {
        const googleMap = new window.google.maps.Map(mapRef.current, {
          center: { lat: 46.2276, lng: 2.2137 }, // Centre de la France
          zoom: 6,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        })

        setMap(googleMap)

        // Créer InfoWindow
        infoWindowRef.current = new window.google.maps.InfoWindow({
          maxWidth: 300,
        })
      } catch (err) {
        setError("Erreur lors de l'initialisation de la carte")
        console.error("Erreur Google Maps:", err)
      }
    }
  }, [isLoaded, map])

  // Mettre à jour les marqueurs sur la carte
  useEffect(() => {
    if (map && window.google && markers.length > 0) {
      // Supprimer les anciens marqueurs
      googleMarkers.forEach((marker) => marker.setMap(null))

      const newMarkers = markers.map((markerData) => {
        const marker = new window.google.maps.Marker({
          position: markerData.coordinates,
          map: map,
          title: `${markerData.title} - ${markerData.city}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: getMarkerColor(markerData),
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: markerData.type === "request" ? 8 : 10,
          },
        })

        marker.addListener("click", () => {
          handleMarkerClick(markerData)
          showInfoWindow(markerData, marker)
        })

        return marker
      })

      setGoogleMarkers(newMarkers)

      // Ajuster la vue pour inclure tous les marqueurs
      if (newMarkers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds()
        markers.forEach((marker) => {
          bounds.extend(marker.coordinates)
        })
        map.fitBounds(bounds)
      }
    }
  }, [map, markers])

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

  const showInfoWindow = (marker: MapMarker, googleMarker: any) => {
    if (!infoWindowRef.current) return

    const canViewDetails = canViewPersonalData()
    const content = `
      <div style="padding: 10px; max-width: 280px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${marker.title}</h3>
        ${
          marker.urgency
            ? `<span style="background-color: ${getMarkerColor(marker)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; display: inline-block; margin-bottom: 8px;">${marker.urgencyLabel || marker.urgency}</span>`
            : ""
        }
        <p style="margin: 8px 0; color: #666; font-size: 14px;">${marker.data.description || "Aucune description"}</p>
        <p style="margin: 4px 0; font-size: 12px;"><strong>Ville:</strong> ${marker.city}</p>
        ${marker.category ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Catégorie:</strong> ${marker.category}</p>` : ""}
        ${
          marker.type === "request" && !canViewDetails
            ? `<p style="margin: 8px 0; padding: 8px; background: #fef3c7; border-radius: 4px; font-size: 12px; color: #92400e;">
                 <strong>🔒 Informations limitées</strong><br>
                 Devenez réparateur pour voir les détails complets
               </p>`
            : ""
        }
        <button onclick="window.location.href='/demande/${marker.data.id}'" 
                style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 8px; font-size: 12px;">
          Voir les détails
        </button>
      </div>
    `

    infoWindowRef.current.setContent(content)
    infoWindowRef.current.open(map, googleMarker)
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

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-red-600">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </CardContent>
      </Card>
    )
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
          {/* Conteneur Google Maps */}
          <div className="relative w-full rounded-lg border overflow-hidden" style={{ height }}>
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
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
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
                          <Link href="/devenir-reparateur">Devenir réparateur</Link>
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
