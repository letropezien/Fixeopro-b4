"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, ImageIcon, Camera, AlertCircle } from "lucide-react"

interface PhotoUploadProps {
  currentPhotos: string[]
  onPhotosChange: (photos: string[]) => void
  maxPhotos?: number
  label?: string
  description?: string
  multiple?: boolean
}

export default function PhotoUpload({
  currentPhotos = [],
  onPhotosChange,
  maxPhotos = 2,
  label = "Photos",
  description = "Ajoutez jusqu'à 2 photos pour illustrer votre problème",
  multiple = true,
}: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    setUploadError(null)
    const newPhotos: string[] = []

    // Vérifier le nombre total de photos
    const totalPhotos = currentPhotos.length + files.length
    if (totalPhotos > maxPhotos) {
      setUploadError(
        `Vous ne pouvez ajouter que ${maxPhotos} photos maximum. ${currentPhotos.length} photo(s) déjà ajoutée(s).`,
      )
      return
    }

    Array.from(files).forEach((file) => {
      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        setUploadError("Seules les images sont autorisées")
        return
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Les images ne doivent pas dépasser 5MB")
        return
      }

      // Créer une URL pour l'aperçu
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newPhotos.push(e.target.result as string)
          if (newPhotos.length === files.length) {
            onPhotosChange([...currentPhotos, ...newPhotos])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = currentPhotos.filter((_, i) => i !== index)
    onPhotosChange(updatedPhotos)
    setUploadError(null)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const canAddMore = currentPhotos.length < maxPhotos

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
      </div>

      {/* Zone d'upload */}
      {canAddMore && (
        <Card
          className={`border-2 border-dashed transition-all duration-200 cursor-pointer ${
            isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {isDragging ? (
                  <Upload className="h-6 w-6 text-blue-500" />
                ) : (
                  <Camera className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isDragging ? "Déposez vos images ici" : "Ajoutez vos photos"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">Glissez-déposez vos images ou cliquez pour sélectionner</p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>JPG, PNG, WebP</span>
                <span>•</span>
                <span>Max 5MB par image</span>
                <span>•</span>
                <span>
                  {currentPhotos.length}/{maxPhotos} photos
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple && canAddMore}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Erreur d'upload */}
      {uploadError && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
          <span className="text-sm text-red-700">{uploadError}</span>
        </div>
      )}

      {/* Aperçu des photos */}
      {currentPhotos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Photos ajoutées ({currentPhotos.length}/{maxPhotos})
            </h4>
            {!canAddMore && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Limite atteinte
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentPhotos.map((photo, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        removePhoto(index)
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge className="bg-white bg-opacity-90 text-gray-700">Photo {index + 1}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bouton d'ajout supplémentaire */}
      {canAddMore && currentPhotos.length > 0 && (
        <Button variant="outline" onClick={openFileDialog} className="w-full border-dashed">
          <ImageIcon className="h-4 w-4 mr-2" />
          Ajouter une photo ({currentPhotos.length}/{maxPhotos})
        </Button>
      )}
    </div>
  )
}
