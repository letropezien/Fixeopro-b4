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

// Déclaration globale pour Leaflet
declare global {
  interface Window {
    L: any
  }
}

export default function LeafletMap({ markers, onMarkerClick, height = "600px", center }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapMarkers, setMapMarkers] = useState<any[]>([])
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  // Centre par défaut sur la France
  const defaultCenter = center || { lat: 46.603354, lng: 1.888334 }

  const addDebug = (message: string) => {
    console.log(`[LeafletMap] ${message}`)
    setDebugInfo((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    addDebug("Composant monté, début du chargement")
    loadLeaflet()
  }, [])

  useEffect(() => {
    if (map && isLoaded && markers.length > 0) {
      addDebug(`Mise à jour des marqueurs: ${markers.length} marqueurs`)
      updateMarkers()
    }
  }, [markers, map, isLoaded])

  const loadLeaflet = async () => {
    try {
      addDebug("Début du chargement de Leaflet")
      setIsLoading(true)
      setError(null)

      // Vérifier si Leaflet est déjà chargé
      if (window.L) {
        addDebug("Leaflet déjà chargé")
        setIsLoaded(true)
        initializeMap()
        return
      }

      addDebug("Chargement des ressources Leaflet...")

      // Charger Leaflet CSS
      const cssLink = document.createElement("link")
      cssLink.rel = "stylesheet"
      cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      cssLink.onload = () => addDebug("CSS Leaflet chargé")
      cssLink.onerror = () => addDebug("Erreur chargement CSS Leaflet")
      document.head.appendChild(cssLink)

      // Charger Leaflet JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        addDebug("Script Leaflet chargé avec succès")
        setIsLoaded(true)
        setTimeout(() => {
          initializeMap()
        }, 100)
      }
      script.onerror = (e) => {
        addDebug("Erreur lors du chargement du script Leaflet")
        setError("Impossible de charger Leaflet. Utilisation de la carte de secours.")
        setIsLoaded(false)
        setIsLoading(false)
      }
      document.head.appendChild(script)
    } catch (err) {
      console.error("Erreur lors du chargement de Leaflet:", err)
      addDebug(`Erreur: ${err}`)
      setError("Erreur lors du chargement de la carte")
      setIsLoading(false)
    }
  }

  const initializeMap = () => {
    if (!mapRef.current) {
      addDebug("Erreur: mapRef.current est null")
      return
    }

    if (!window.L) {
      addDebug("Erreur: window.L n'est pas disponible")
      return
    }

    try {
      addDebug("Initialisation de la carte...")

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

      addDebug("Instance de carte créée")

      // Ajouter les tuiles OpenStreetMap
      const tileLayer = window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      })

      tileLayer.on("load", () => {
        addDebug("Tuiles chargées avec succès")
        setIsLoading(false)
      })

      tileLayer.on("tileerror", () => {
        addDebug("Erreur lors du chargement des tuiles")
      })

      tileLayer.addTo(mapInstance)

      setMap(mapInstance)
      setError(null)
      addDebug("Carte initialisée avec succès")

      // Forcer la mise à jour de la taille après un court délai
      setTimeout(() => {
        if (mapInstance) {
          mapInstance.invalidateSize()
          addDebug("Taille de la carte mise à jour")
        }
      }, 200)
    } catch (err) {
      console.error("Erreur lors de l'initialisation de la carte:", err)
      addDebug(`Erreur initialisation: ${err}`)
      setError("Erreur lors de l'initialisation de la carte")
      setIsLoading(false)
    }
  }

  const updateMarkers = () => {
    if (!map || !window.L) {
      addDebug("Impossible de mettre à jour les marqueurs: map ou L manquant")
      return
    }

    try {
      addDebug("Suppression des anciens marqueurs...")
      // Supprimer les anciens marqueurs
      mapMarkers.forEach((marker) => {
        if (marker && marker.remove) {
          marker.remove()
        }
      })

      addDebug(`Création de ${markers.length} nouveaux marqueurs...`)
      const newMarkers = markers
        .map((markerData, index) => {
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
              addDebug(`Clic sur marqueur: ${markerData.title}`)
              onMarkerClick?.(markerData)
            })

            return marker
          } catch (err) {
            addDebug(`Erreur création marqueur ${index}: ${err}`)
            return null
          }
        })
        .filter(Boolean)

      setMapMarkers(newMarkers)
      addDebug(`${newMarkers.length} marqueurs créés avec succès`)

      // Ajuster la vue pour inclure tous les marqueurs
      if (newMarkers.length > 0) {
        try {
          const group = new window.L.featureGroup(newMarkers)
          map.fitBounds(group.getBounds().pad(0.1))
          addDebug("Vue ajustée aux marqueurs")
        } catch (err) {
          addDebug(`Erreur ajustement vue: ${err}`)
        }
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour des marqueurs:", err)
      addDebug(`Erreur mise à jour marqueurs: ${err}`)
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
      addDebug("Zoom avant")
    }
  }

  const zoomOut = () => {
    if (map) {
      map.zoomOut()
      addDebug("Zoom arrière")
    }
  }

  const resetView = () => {
    if (map) {
      map.setView([defaultCenter.lat, defaultCenter.lng], 6)
      addDebug("Vue réinitialisée")
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

      {/* Debug info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded text-xs max-w-xs">
        <div className="font-semibold mb-1">Debug:</div>
        {debugInfo.slice(-3).map((info, i) => (
          <div key={i} className="text-gray-600">
            {info}
          </div>
        ))}
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
                <div className="mt-2 text-xs text-gray-500 max-w-xs">
                  {debugInfo.slice(-2).map((info, i) => (
                    <div key={i}>{info}</div>
                  ))}
                </div>
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

          {/* Debug panel en développement */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded text-xs max-w-xs">
              <div className="font-semibold mb-1">Debug Info:</div>
              {debugInfo.slice(-5).map((info, i) => (
                <div key={i}>{info}</div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
