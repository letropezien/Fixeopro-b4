"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"

const MesInterventionsPage = () => {
  const [responsePhotos, setResponsePhotos] = useState<string[]>([])

  return (
    <div>
      <h1>Mes Interventions</h1>
      {/* Example usage of the photo upload component */}
      <div>
        <Label>Photos de votre travail (optionnel)</Label>
        <div className="mt-2">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              files.forEach((file) => {
                const reader = new FileReader()
                reader.onload = (event) => {
                  const result = event.target?.result as string
                  setResponsePhotos((prev) => [...prev, result])
                }
                reader.readAsDataURL(file)
              })
            }}
            className="hidden"
            id="response-photos"
          />
          <label
            htmlFor="response-photos"
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors block"
          >
            <Camera className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Cliquez pour ajouter des photos</p>
          </label>

          {responsePhotos.length > 0 && (
            <div className="mt-3">
              <div className="grid grid-cols-3 gap-2">
                {responsePhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-16 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setResponsePhotos((prev) => prev.filter((_, i) => i !== index))}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MesInterventionsPage
