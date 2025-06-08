"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, X, Plus } from "lucide-react"

interface PhotoUploadProps {
  currentPhoto?: string
  currentPhotos?: string[]
  onPhotoChange?: (photoUrl: string) => void
  onPhotosChange?: (photos: string[]) => void
  size?: "sm" | "md" | "lg"
  multiple?: boolean
  maxPhotos?: number
  label?: string
  description?: string
}

function PhotoUpload({
  currentPhoto,
  currentPhotos = [],
  onPhotoChange,
  onPhotosChange,
  size = "md",
  multiple = false,
  maxPhotos = 1,
  label,
  description,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentPhoto)
  const [previewPhotos, setPreviewPhotos] = useState<string[]>(currentPhotos)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)

    if (multiple) {
      // Gestion de plusieurs fichiers
      const newPhotos: string[] = []
      let processedFiles = 0

      // Vérifier le nombre maximum de photos
      const remainingSlots = maxPhotos - previewPhotos.length
      const filesToProcess = Math.min(files.length, remainingSlots)

      if (filesToProcess === 0) {
        alert(`Vous avez déjà atteint le maximum de ${maxPhotos} photos`)
        setIsUploading(false)
        return
      }

      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i]

        // Vérifier le type de fichier
        if (!file.type.startsWith("image/")) {
          alert(`Le fichier ${file.name} n'est pas une image`)
          continue
        }

        // Vérifier la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`Le fichier ${file.name} est trop volumineux. Taille maximum : 5MB`)
          continue
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          newPhotos.push(result)
          processedFiles++

          if (processedFiles === filesToProcess) {
            const updatedPhotos = [...previewPhotos, ...newPhotos]
            setPreviewPhotos(updatedPhotos)
            onPhotosChange?.(updatedPhotos)
            setIsUploading(false)
          }
        }
        reader.readAsDataURL(file)
      }
    } else {
      // Gestion d'un seul fichier
      const file = files[0]

      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner un fichier image")
        setIsUploading(false)
        return
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Le fichier est trop volumineux. Taille maximum : 5MB")
        setIsUploading(false)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewUrl(result)
        onPhotoChange?.(result)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = (index?: number) => {
    if (multiple && typeof index === "number") {
      const updatedPhotos = previewPhotos.filter((_, i) => i !== index)
      setPreviewPhotos(updatedPhotos)
      onPhotosChange?.(updatedPhotos)
    } else {
      setPreviewUrl("")
      onPhotoChange?.("")
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  if (multiple) {
    return (
      <div className="space-y-4">
        {label && <h3 className="text-lg font-semibold">{label}</h3>}
        {description && <p className="text-sm text-gray-600">{description}</p>}

        {/* Galerie de photos */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previewPhotos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={photo || "/placeholder.svg"}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => handleRemovePhoto(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Bouton d'ajout */}
          {previewPhotos.length < maxPhotos && (
            <button
              onClick={triggerFileSelect}
              disabled={isUploading}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center text-gray-500 hover:text-gray-600 transition-colors"
              type="button"
            >
              {isUploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
              ) : (
                <>
                  <Plus className="h-6 w-6 mb-1" />
                  <span className="text-xs">Ajouter</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {previewPhotos.length}/{maxPhotos} photos
          </span>
          <span>JPG, PNG ou GIF. Max 5MB par photo</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={previewUrl || "/placeholder.svg"} alt="Photo de profil" />
          <AvatarFallback>
            <Camera className="h-6 w-6 text-gray-400" />
          </AvatarFallback>
        </Avatar>

        {previewUrl && (
          <button
            onClick={() => handleRemovePhoto()}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            type="button"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <Button type="button" variant="outline" size="sm" onClick={triggerFileSelect} disabled={isUploading}>
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Chargement..." : previewUrl ? "Changer la photo" : "Ajouter une photo"}
        </Button>

        <p className="text-xs text-gray-500">JPG, PNG ou GIF. Max 5MB</p>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  )
}

// Export nommé requis
export { PhotoUpload }

// Export par défaut
export default PhotoUpload
