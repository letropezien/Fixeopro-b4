"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Plus, Minus, RotateCcw } from "lucide-react"

interface MapMarker {
  id: string
  type: "request" | "reparateur"
  position: { lat: number; lng: number }
  title: string
  data: any
}

interface SimpleMapProps {
  markers: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  height?: string
}

export default function SimpleMap({ markers, onMarkerClick, height = "600px" }: SimpleMapProps) {
  const [zoom, setZoom] = useState(6)
  const [center, setCenter] = useState({ lat: 46.603354, lng: 1.888334 })

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

  const zoomIn = () => setZoom(Math.min(zoom + 1, 10))
  const zoomOut = () => setZoom(Math.max(zoom - 1, 1))
  const resetView = () => {
    setZoom(6)
    setCenter({ lat: 46.603354, lng: 1.888334 })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Carte des dépannages ({markers.length} marqueurs)
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
        <div style={{ height }} className="relative">
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border">
            <svg viewBox="0 0 800 600" className="w-full h-full">
              {/* Contour de la France */}
              <path
                d="M150,120 L200,100 L250,90 L300,95 L350,100 L400,110 L450,130 L500,150 L540,180 L570,220 L580,260 L570,300 L550,340 L520,380 L480,410 L440,430 L400,440 L360,445 L320,440 L280,430 L240,410 L200,380 L170,340 L150,300 L140,260 L145,220 L150,180 Z"
                fill="#e5f3ff"
                stroke="#3b82f6"
                strokeWidth="2"
              />

              {/* Marqueurs */}
              {markers.map((marker, index) => {
                // Conversion approximative des coordonnées GPS en coordonnées SVG
                const x = ((marker.position.lng + 5) / 10) * 800
                const y = ((51 - marker.position.lat) / 10) * 600

                const adjustedX = Math.max(50, Math.min(750, x))
                const adjustedY = Math.max(50, Math.min(550, y))

                return (
                  <g key={marker.id}>
                    {marker.type === "request" ? (
                      <circle
                        cx={adjustedX}
                        cy={adjustedY}
                        r={8 + zoom}
                        fill={getMarkerColor(marker)}
                        stroke="white"
                        strokeWidth="3"
                        className="cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => onMarkerClick?.(marker)}
                      >
                        <title>{marker.title}</title>
                      </circle>
                    ) : (
                      <rect
                        x={adjustedX - (8 + zoom)}
                        y={adjustedY - (8 + zoom)}
                        width={16 + zoom * 2}
                        height={16 + zoom * 2}
                        fill={getMarkerColor(marker)}
                        stroke="white"
                        strokeWidth="3"
                        className="cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => onMarkerClick?.(marker)}
                      >
                        <title>{marker.title}</title>
                      </rect>
                    )}

                    {/* Texte du marqueur */}
                    <text
                      x={adjustedX}
                      y={adjustedY + 4}
                      textAnchor="middle"
                      className="text-xs font-bold fill-white pointer-events-none"
                      style={{ fontSize: `${8 + zoom}px` }}
                    >
                      {marker.type === "request" ? "!" : "R"}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Informations sur la carte */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
              <p className="text-sm font-medium text-gray-800">Carte interactive simplifiée</p>
              <p className="text-xs text-gray-600">Zoom: {zoom}/10</p>
            </div>

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
        </div>
      </CardContent>
    </Card>
  )
}
