"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Plus, Minus, RotateCcw, Loader2 } from "lucide-react"

interface MapMarker {
  id: string
  type: "request" | "reparateur"
  position: { lat: number; lng: number }
  title: string
  data: any
}

interface GoogleMapProps {
  markers: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  height?: string
  center?: { lat: number; lng: number }
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function GoogleMap({ markers, onMarkerClick, height = "600px", center }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapMarkers, setMapMarkers] = useState<any[]>([])

  // Centre par défaut sur la France
  const defaultCenter = center || { lat: 46.603354, lng: 1.888334 }

  useEffect(() => {
    loadGoogleMaps()
  }, [])

  useEffect(() => {
    if (map && isLoaded) {
      updateMarkers()
    }
  }, [markers, map, isLoaded])

  const loadGoogleMaps = () => {
    // Vérifier si Google Maps est déjà chargé
    if (window.google && window.google.maps) {
      initializeMap()
      return
    }

    // Charger Google Maps avec une clé publique de démonstration
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgkKSFRG-iI&libraries=places&callback=initMap`
    script.async = true
    script.defer = true

    window.initMap = () => {
      setIsLoaded(true)
      initializeMap()
    }

    script.onerror = () => {
      setError("Impossible de charger Google Maps. Utilisation de la carte de secours.")
      setIsLoaded(false)
    }

    document.head.appendChild(script)
  }

  const initializeMap = () => {
    if (!mapRef.current) return

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 6,
        center: defaultCenter,
        mapTypeId: "roadmap",
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      setMap(mapInstance)
      setError(null)
    } catch (err) {
      console.error("Erreur lors de l'initialisation de la carte:", err)
      setError("Erreur lors de l'initialisation de Google Maps")
    }
  }

  const updateMarkers = () => {
    if (!map || !window.google) return

    // Supprimer les anciens marqueurs
    mapMarkers.forEach((marker) => marker.setMap(null))

    const newMarkers = markers.map((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: map,
        title: markerData.title,
        icon: {
          path:
            markerData.type === "request"
              ? window.google.maps.SymbolPath.CIRCLE
              : window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          fillColor: getMarkerColor(markerData),
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: markerData.type === "request" ? 8 : 10,
        },
      })

      marker.addListener("click", () => {
        onMarkerClick?.(markerData)
      })

      return marker
    })

    setMapMarkers(newMarkers)

    // Ajuster la vue pour inclure tous les marqueurs
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      newMarkers.forEach((marker) => bounds.extend(marker.getPosition()))
      map.fitBounds(bounds)
    }
  }

  const getMarkerColor = (marker: MapMarker) => {
    if (marker.type === "reparateur") return "#3b82f6" // blue

    switch (marker.data.urgency) {
      case "urgent":
        return "#ef4444" // red
      case "same-day":
        return "#f97316" // orange
      case "this-week":
        return "#eab308" // yellow
      case "flexible":
        return "#22c55e" // green
      default:
        return "#6b7280" // gray
    }
  }

  const zoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1)
    }
  }

  const zoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1)
    }
  }

  const resetView = () => {
    if (map) {
      map.setCenter(defaultCenter)
      map.setZoom(6)
    }
  }

  // Carte de secours en SVG si Google Maps ne fonctionne pas
  const FallbackMap = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border">
      <svg viewBox="0 0 800 600" className="w-full h-full">
        {/* Contour simplifié de la France */}
        <path
          d="M150,120 L200,100 L250,90 L300,95 L350,100 L400,110 L450,130 L500,150 L540,180 L570,220 L580,260 L570,300 L550,340 L520,380 L480,410 L440,430 L400,440 L360,445 L320,440 L280,430 L240,410 L200,380 L170,340 L150,300 L140,260 L145,220 L150,180 Z"
          fill="#e5f3ff"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Marqueurs simulés */}
        {markers.map((marker, index) => {
          // Conversion approximative des coordonnées GPS en coordonnées SVG
          const x = ((marker.position.lng + 5) / 10) * 800
          const y = ((51 - marker.position.lat) / 10) * 600

          return (
            <g key={marker.id}>
              <circle
                cx={Math.max(50, Math.min(750, x))}
                cy={Math.max(50, Math.min(550, y))}
                r="8"
                fill={getMarkerColor(marker)}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:scale-110 transition-transform"
                onClick={() => onMarkerClick?.(marker)}
              />
            </g>
          )
        })}
      </svg>

      <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3">
        <p className="text-yellow-800 text-sm font-medium">⚠️ Carte de secours</p>
        <p className="text-yellow-700 text-xs">Google Maps non disponible</p>
      </div>
    </div>
  )

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Carte des dépannages
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height }}>
            <FallbackMap />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Carte des dépannages {isLoaded ? "(Google Maps)" : "(Chargement...)"}
          </div>
          {isLoaded && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="relative">
          <div ref={mapRef} className="w-full h-full rounded-lg" />

          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-gray-600">Chargement de Google Maps...</p>
              </div>
            </div>
          )}

          {/* Légende */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-gray-800 mb-2">Légende</div>
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
        </div>
      </CardContent>
    </Card>
  )
}
