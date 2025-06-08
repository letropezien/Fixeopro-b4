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

interface LeafletMapProps {
  markers: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  height?: string
  center?: { lat: number; lng: number }
}

export default function LeafletMap({ markers, onMarkerClick, height = "600px", center }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapMarkers, setMapMarkers] = useState<any[]>([])

  // Centre par défaut sur la France
  const defaultCenter = center || { lat: 46.603354, lng: 1.888334 }

  useEffect(() => {
    // Vérifier que nous sommes côté client
    if (typeof window !== "undefined") {
      loadLeaflet()
    }
  }, [])

  useEffect(() => {
    if (map && isLoaded && markers.length > 0) {
      updateMarkers()
    }
  }, [markers, map, isLoaded])

  const loadLeaflet = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Vérifier si Leaflet est déjà chargé
      if (window.L) {
        setIsLoaded(true)
        initializeMap()
        return
      }

      // Charger Leaflet CSS
      const cssLink = document.createElement("link")
      cssLink.rel = "stylesheet"
      cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(cssLink)

      // Charger Leaflet JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        setIsLoaded(true)
        setTimeout(() => {
          initializeMap()
        }, 100)
      }
      script.onerror = () => {
        setError("Impossible de charger Leaflet. Utilisation de la carte de secours.")
        setIsLoaded(false)
        setIsLoading(false)
      }
      document.head.appendChild(script)
    } catch (err) {
      console.error("Erreur lors du chargement de Leaflet:", err)
      setError("Erreur lors du chargement de la carte")
      setIsLoading(false)
    }
  }

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return

    try {
      // Nettoyer la carte existante si elle existe
      if (map) {
        map.remove()
      }

      const mapInstance = window.L.map(mapRef.current, {
        center: [defaultCenter.lat, defaultCenter.lng],
        zoom: 6,
        zoomControl: false,
        preferCanvas: true,
      })

      // Ajouter les tuiles OpenStreetMap
      const tileLayer = window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      })

      tileLayer.on("load", () => {
        setIsLoading(false)
      })

      tileLayer.addTo(mapInstance)

      setMap(mapInstance)
      setError(null)

      // Forcer la mise à jour de la taille après un court délai
      setTimeout(() => {
        if (mapInstance) {
          mapInstance.invalidateSize()
        }
      }, 200)
    } catch (err) {
      console.error("Erreur lors de l'initialisation de la carte:", err)
      setError("Erreur lors de l'initialisation de la carte")
      setIsLoading(false)
    }
  }

  const updateMarkers = () => {
    if (!map || !window.L) return

    try {
      // Supprimer les anciens marqueurs
      mapMarkers.forEach((marker) => {
        if (marker && marker.remove) {
          marker.remove()
        }
      })

      const newMarkers = markers
        .map((markerData) => {
          try {
            const color = getMarkerColor(markerData)

            // Créer une icône personnalisée
            const icon = window.L.divIcon({
              className: "custom-marker",
              html: `<div style="
              width: 24px; 
              height: 24px; 
              background-color: ${color}; 
              border: 3px solid white; 
              border-radius: ${markerData.type === "request" ? "50%" : "20%"};
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
              cursor: pointer;
            ">${markerData.type === "request" ? "!" : "R"}</div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })

            const marker = window.L.marker([markerData.position.lat, markerData.position.lng], {
              icon: icon,
              title: markerData.title,
            }).addTo(map)

            marker.on("click", () => {
              onMarkerClick?.(markerData)
            })

            return marker
          } catch (err) {
            console.error("Erreur création marqueur:", err)
            return null
          }
        })
        .filter(Boolean)

      setMapMarkers(newMarkers)

      // Ajuster la vue pour inclure tous les marqueurs
      if (newMarkers.length > 0) {
        try {
          const group = new window.L.featureGroup(newMarkers)
          map.fitBounds(group.getBounds().pad(0.1))
        } catch (err) {
          console.error("Erreur ajustement vue:", err)
        }
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour des marqueurs:", err)
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
      map.zoomIn()
    }
  }

  const zoomOut = () => {
    if (map) {
      map.zoomOut()
    }
  }

  const resetView = () => {
    if (map) {
      map.setView([defaultCenter.lat, defaultCenter.lng], 6)
    }
  }

  // Carte de secours en SVG si Leaflet ne fonctionne pas
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
        {markers.slice(0, 10).map((marker, index) => {
          // Conversion approximative des coordonnées GPS en coordonnées SVG
          const x = ((marker.position.lng + 5) / 10) * 800
          const y = ((51 - marker.position.lat) / 10) * 600

          return (
            <g key={marker.id}>
              {marker.type === "request" ? (
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
              ) : (
                <rect
                  x={Math.max(42, Math.min(742, x - 8))}
                  y={Math.max(42, Math.min(542, y - 8))}
                  width="16"
                  height="16"
                  fill={getMarkerColor(marker)}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => onMarkerClick?.(marker)}
                />
              )}
            </g>
          )
        })}
      </svg>

      <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3">
        <p className="text-yellow-800 text-sm font-medium">⚠️ Carte de secours</p>
        <p className="text-yellow-700 text-xs">Carte interactive non disponible</p>
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
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Recharger
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
            Carte des dépannages
            {isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
            {isLoaded && !isLoading && " (OpenStreetMap)"}
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

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm rounded-lg">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-gray-600">Chargement de la carte...</p>
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

// Déclaration globale pour Leaflet
declare global {
  interface Window {
    L: any
  }
}
