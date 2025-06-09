"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CategoryImagesService, type CategoryImage } from "@/lib/category-images"
import { Upload, Trash2, ImageIcon, Save, RefreshCw } from "lucide-react"

export function CategoryImagesConfig() {
  const [categoryImages, setCategoryImages] = useState<CategoryImage[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [uploadingCategory, setUploadingCategory] = useState<string>("")
  const [editingTexts, setEditingTexts] = useState<Record<string, { description: string; seoText: string }>>({})

  useEffect(() => {
    setCategoryImages(CategoryImagesService.getCategoryImages())
    // Charger les textes sauvegardés
    const savedTexts = localStorage.getItem("category_texts")
    if (savedTexts) {
      setEditingTexts(JSON.parse(savedTexts))
    }
  }, [])

  const categories = [
    {
      id: "electromenager",
      name: "Électroménager",
      defaultDesc: "Réparation rapide de tous vos appareils électroménagers",
      defaultSeo:
        "Nos experts réparent lave-linge, lave-vaisselle, réfrigérateurs et fours avec garantie. Intervention rapide et pièces d'origine.",
    },
    {
      id: "informatique",
      name: "Informatique",
      defaultDesc: "Dépannage PC, Mac et récupération de données",
      defaultSeo:
        "Techniciens certifiés pour dépannage informatique, installation logiciels, nettoyage virus et optimisation performances.",
    },
    {
      id: "plomberie",
      name: "Plomberie",
      defaultDesc: "Intervention urgente pour fuites et débouchages",
      defaultSeo:
        "Plombiers qualifiés disponibles 24h/24 pour fuites, débouchages, installations sanitaires et chauffe-eau.",
    },
    {
      id: "electricite",
      name: "Électricité",
      defaultDesc: "Installation électrique et dépannage sécurisé",
      defaultSeo:
        "Électriciens certifiés pour pannes électriques, installations, tableaux électriques et mise aux normes de sécurité.",
    },
    {
      id: "chauffage",
      name: "Chauffage",
      defaultDesc: "Entretien et réparation de systèmes de chauffage",
      defaultSeo:
        "Techniciens spécialisés en chaudières, radiateurs, pompes à chaleur et systèmes de climatisation pour votre confort.",
    },
    {
      id: "serrurerie",
      name: "Serrurerie",
      defaultDesc: "Ouverture de porte et sécurisation rapide",
      defaultSeo:
        "Serruriers professionnels pour ouverture de porte, changement serrures, blindage et installation systèmes sécurité.",
    },
    {
      id: "multimedia",
      name: "Multimédia",
      defaultDesc: "Installation et réparation équipements audiovisuels",
      defaultSeo:
        "Techniciens audiovisuels pour réparation TV, installation home cinéma, consoles de jeux et systèmes audio.",
    },
    {
      id: "telephonie",
      name: "Téléphonie",
      defaultDesc: "Réparation smartphone et tablette express",
      defaultSeo:
        "Réparateurs mobiles spécialisés écrans cassés, batteries, pannes logicielles avec pièces d'origine et garantie.",
    },
    {
      id: "climatisation",
      name: "Climatisation",
      defaultDesc: "Installation et maintenance climatisation",
      defaultSeo:
        "Frigoristes certifiés pour installation, entretien et dépannage climatisation résidentielle et professionnelle.",
    },
  ]

  const stats = CategoryImagesService.getStats()

  const handleImageUpload = async (categoryId: string, categoryName: string, file: File) => {
    setUploadingCategory(categoryId)

    try {
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

  const handleTextChange = (categoryId: string, field: "description" | "seoText", value: string) => {
    setEditingTexts((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value,
      },
    }))
  }

  const saveTexts = () => {
    localStorage.setItem("category_texts", JSON.stringify(editingTexts))
    alert("Textes sauvegardés avec succès !")
  }

  const resetTexts = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les textes ?")) {
      localStorage.removeItem("category_texts")
      setEditingTexts({})
      alert("Textes réinitialisés !")
    }
  }

  const generateImage = (categoryId: string, categoryName: string) => {
    // Simuler la génération d'une image
    const imageUrl = `/placeholder.svg?height=200&width=300&query=réparation ${categoryName.toLowerCase()} professionnel&bg=gradient`
    CategoryImagesService.saveCategoryImage(categoryId, categoryName, imageUrl)
    setCategoryImages(CategoryImagesService.getCategoryImages())
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Gestion des Catégories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center mb-6">
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
            <div>
              <div className="text-2xl font-bold text-orange-600">{Object.keys(editingTexts).length}</div>
              <div className="text-sm text-gray-600">Textes modifiés</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={saveTexts} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder tous les textes
            </Button>
            <Button onClick={resetTexts} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réinitialiser les textes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gestion des catégories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category) => {
          const existingImage = categoryImages.find((img) => img.id === category.id)
          const isUploading = uploadingCategory === category.id
          const currentTexts = editingTexts[category.id] || {
            description: category.defaultDesc,
            seoText: category.defaultSeo,
          }

          return (
            <Card key={category.id} className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => generateImage(category.id, category.name)}>
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Générer
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Prévisualisation de l'image */}
                <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {existingImage ? (
                    <img
                      src={existingImage.imageUrl || `/placeholder.svg?height=160&width=300&text=${category.name}`}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                      <span className="text-xs">Aucune image personnalisée</span>
                    </div>
                  )}
                </div>

                {/* Upload d'image */}
                <div className="flex gap-2">
                  <Label htmlFor={`upload-${category.id}`} className="cursor-pointer flex-1">
                    <Button variant="outline" size="sm" className="w-full" disabled={isUploading} asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploading ? "Upload..." : existingImage ? "Changer" : "Ajouter"}
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id={`upload-${category.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageUpload(category.id, category.name, file)
                      }
                    }}
                  />

                  {existingImage && (
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(category.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Édition des textes */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Description courte</Label>
                    <Input
                      value={currentTexts.description}
                      onChange={(e) => handleTextChange(category.id, "description", e.target.value)}
                      placeholder="Description courte pour l'affichage"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Texte SEO</Label>
                    <Textarea
                      value={currentTexts.seoText}
                      onChange={(e) => handleTextChange(category.id, "seoText", e.target.value)}
                      placeholder="Texte optimisé pour le référencement"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                {existingImage && (
                  <div className="text-xs text-gray-500 text-center">
                    Image ajoutée le {new Date(existingImage.uploadedAt).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryImagesConfig
