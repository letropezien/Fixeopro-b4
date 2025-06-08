"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CategoryImagesService, type CategoryImage } from "@/lib/category-images"
import { Upload, Trash2, ImageIcon } from "lucide-react"

export default function CategoryImagesConfig() {
  const [categoryImages, setCategoryImages] = useState<CategoryImage[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [uploadingCategory, setUploadingCategory] = useState<string>("")

  useEffect(() => {
    setCategoryImages(CategoryImagesService.getCategoryImages())
  }, [])

  const categories = CategoryImagesService.getCategories()
  const stats = CategoryImagesService.getStats()

  const handleImageUpload = async (categoryId: string, categoryName: string, file: File) => {
    setUploadingCategory(categoryId)

    try {
      // Simuler l'upload - en production, vous uploaderiez vers un service de stockage
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        CategoryImagesService.saveCategoryImage(categoryId, categoryName, imageUrl)
        setCategoryImages(CategoryImagesService.getCategoryImages())
        setUploadingCategory("")
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Erreur lors de l'upload:", error)
      setUploadingCategory("")
    }
  }

  const handleDeleteImage = (categoryId: string) => {
    CategoryImagesService.deleteCategoryImage(categoryId)
    setCategoryImages(CategoryImagesService.getCategoryImages())
  }

  const getCategoryDisplayName = (categoryId: string) => {
    const names: Record<string, string> = {
      plomberie: "Plomberie",
      electricite: "Électricité",
      chauffage: "Chauffage",
      climatisation: "Climatisation",
      serrurerie: "Serrurerie",
      vitrerie: "Vitrerie",
      menuiserie: "Menuiserie",
      peinture: "Peinture",
      carrelage: "Carrelage",
      jardinage: "Jardinage",
      nettoyage: "Nettoyage",
      demenagement: "Déménagement",
      informatique: "Informatique",
      electromenager: "Électroménager",
      automobile: "Automobile",
      autres: "Autres",
    }
    return names[categoryId] || categoryId
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Statistiques des Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalCategories}</div>
              <div className="text-sm text-gray-600">Catégories totales</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.customizedCategories}</div>
              <div className="text-sm text-gray-600">Images personnalisées</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.percentageCustomized}%</div>
              <div className="text-sm text-gray-600">Personnalisation</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestion des images */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Images par Catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((categoryId) => {
              const categoryName = getCategoryDisplayName(categoryId)
              const existingImage = categoryImages.find((img) => img.id === categoryId)
              const isUploading = uploadingCategory === categoryId

              return (
                <Card key={categoryId} className="border-2">
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <h3 className="font-semibold">{categoryName}</h3>

                      {/* Prévisualisation de l'image */}
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {existingImage ? (
                          <img
                            src={existingImage.imageUrl || "/placeholder.svg"}
                            alt={categoryName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-center">
                            <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                            <span className="text-xs">Aucune image</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <Label htmlFor={`upload-${categoryId}`} className="cursor-pointer">
                          <Button variant="outline" size="sm" className="w-full" disabled={isUploading} asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              {isUploading ? "Upload..." : existingImage ? "Changer" : "Ajouter"}
                            </span>
                          </Button>
                        </Label>
                        <Input
                          id={`upload-${categoryId}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleImageUpload(categoryId, categoryName, file)
                            }
                          }}
                        />

                        {existingImage && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => handleDeleteImage(categoryId)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        )}
                      </div>

                      {existingImage && (
                        <div className="text-xs text-gray-500">
                          Ajoutée le {new Date(existingImage.uploadedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
