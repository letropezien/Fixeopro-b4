"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, ImageIcon, Camera, AlertCircle } from "lucide-react"

interface PhotoUploadProps {
  currentPhotos?: string[]
  onPhotosChange?: (photos: string[]) => void
  onPhotoChange?: (photo: string) => void
  onImageUploaded?: (imageUrl: string) => void
  currentPhoto?: string
  maxPhotos?: number
  label?: string
  description?: string
  multiple?: boolean
  buttonText?: string
  size?: "sm" | "md" | "lg"
}

export default function PhotoUpload({
  currentPhotos = [],
  currentPhoto,
  onPhotosChange,
  onPhotoChange,
  onImageUploaded,
  maxPhotos = 999, // Nombre illimité de photos (pratiquement)
  label = "Photos",
  description = "Ajoutez des photos pour illustrer votre problème",
  multiple = true,
  buttonText = "Ajouter une photo",
  size = "md",
}: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Utiliser currentPhoto si fourni, sinon utiliser le premier élément de currentPhotos
  const photos = currentPhoto ? [currentPhoto] : currentPhotos || []

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    setUploadError(null)

    // Pour un seul fichier (mode photo unique)
    if (!multiple && files.length > 0) {
      const file = files[0]

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
          const imageUrl = e.target.result as string
          if (onPhotoChange) onPhotoChange(imageUrl)
          if (onImageUploaded) onImageUploaded(imageUrl)
        }
      }
      reader.readAsDataURL(file)
      return
    }

    // Pour plusieurs fichiers
    if (multiple) {
      const newPhotos: string[] = []

      // Vérifier le nombre total de photos
      const totalPhotos = photos.length + files.length
      if (totalPhotos > maxPhotos) {
        setUploadError(
          `Vous ne pouvez ajouter que ${maxPhotos} photos maximum. ${photos.length} photo(s) déjà ajoutée(s).`,
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
            if (newPhotos.length === files.length && onPhotosChange) {
              onPhotosChange([...photos, ...newPhotos])
            }
          }
        }
        reader.readAsDataURL(file)
      })
    }
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
    if (multiple && onPhotosChange) {
      const updatedPhotos = photos.filter((_, i) => i !== index)
      onPhotosChange(updatedPhotos)
    } else if (!multiple && onPhotoChange) {
      onPhotoChange("")
    }
    setUploadError(null)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const canAddMore = photos.length < maxPhotos

  // Déterminer la taille de l'avatar en fonction de la prop size
  const getAvatarSize = () => {
    switch (size) {
      case "sm":
        return "w-16 h-16"
      case "lg":
        return "w-32 h-32"
      default:
        return "w-24 h-24"
    }
  }

  // Mode photo unique (avatar)
  if (!multiple && (onPhotoChange || onImageUploaded)) {
    return (
      <div className="space-y-4">
        {/* Aperçu de la photo */}
        <div className="flex flex-col items-center">
          <div
            className={`${getAvatarSize()} rounded-full overflow-hidden bg-gray-100 mb-2 relative group`}
            style={{
              backgroundImage: photos[0] ? `url(${photos[0]})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!photos[0] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="h-1/2 w-1/2 text-gray-400" />
              </div>
            )}
            {photos[0] && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                <Button
                  variant="destructive"
                  size="icon"
                  className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(0)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Button variant="outline" size="sm" onClick={openFileDialog} className="mt-2">
            {buttonText || (photos[0] ? "Changer la photo" : "Ajouter une photo")}
          </Button>
        </div>

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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
      </div>
    )
  }

  // Mode multiple photos
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
                  {photos.length}/{maxPhotos} photos
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
      {photos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Photos ajoutées ({photos.length}/{maxPhotos})
            </h4>
            {!canAddMore && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Limite atteinte
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {photos.map((photo, index) => (
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
      {canAddMore && photos.length > 0 && (
        <Button variant="outline" onClick={openFileDialog} className="w-full border-dashed">
          <ImageIcon className="h-4 w-4 mr-2" />
          Ajouter une photo ({photos.length}/{maxPhotos})
        </Button>
      )}
    </div>
  )
}

// Ajout de l'icône User qui était manquante
import { User } from "lucide-react"

// Export nommé pour compatibilité avec les imports existants
export { PhotoUpload }
