"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, X } from "lucide-react"

interface PhotoUploadProps {
  currentPhoto?: string
  onPhotoChange: (photoUrl: string) => void
  size?: "sm" | "md" | "lg"
}

export default function PhotoUpload({ currentPhoto, onPhotoChange, size = "md" }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentPhoto)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image")
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Le fichier est trop volumineux. Taille maximum : 5MB")
      return
    }

    setIsUploading(true)

    // Créer une URL de prévisualisation
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreviewUrl(result)
      onPhotoChange(result)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setPreviewUrl("")
    onPhotoChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
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
            onClick={handleRemovePhoto}
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
