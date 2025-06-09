"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Settings, Edit, Eye, EyeOff, Save, RefreshCw, Plus, Trash2, Search, Filter, BarChart3 } from "lucide-react"
import { CategoriesService, type Category, type SubCategory } from "@/lib/categories-service"

export function AdminCategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [settings, setSettings] = useState({ tvaEnabled: true, tvaRate: 20 })
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterCategories()
  }, [categories, searchTerm, showOnlyEnabled])

  const loadData = () => {
    const allCategories = CategoriesService.getCategories()
    const currentSettings = CategoriesService.getSettings()
    setCategories(allCategories)
    setSettings(currentSettings)
  }

  const filterCategories = () => {
    let filtered = categories

    if (showOnlyEnabled) {
      filtered = filtered.filter((cat) => cat.enabled)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.subCategories.some((sub) => sub.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredCategories(filtered)
  }

  const handleToggleCategory = (categoryId: string) => {
    CategoriesService.toggleCategoryStatus(categoryId)
    loadData()
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory({ ...category })
    setIsEditModalOpen(true)
  }

  const handleSaveCategory = () => {
    if (selectedCategory) {
      CategoriesService.updateCategory(selectedCategory.id, selectedCategory)
      loadData()
      setIsEditModalOpen(false)
      setSelectedCategory(null)
    }
  }

  const handleAddSubCategory = () => {
    if (selectedCategory) {
      const newSubCategory: SubCategory = {
        id: `sub_${Date.now()}`,
        name: "Nouvelle sous-catégorie",
        description: "",
      }
      setSelectedCategory({
        ...selectedCategory,
        subCategories: [...selectedCategory.subCategories, newSubCategory],
      })
    }
  }

  const handleRemoveSubCategory = (subCategoryId: string) => {
    if (selectedCategory) {
      setSelectedCategory({
        ...selectedCategory,
        subCategories: selectedCategory.subCategories.filter((sub) => sub.id !== subCategoryId),
      })
    }
  }

  const handleUpdateSubCategory = (subCategoryId: string, updates: Partial<SubCategory>) => {
    if (selectedCategory) {
      setSelectedCategory({
        ...selectedCategory,
        subCategories: selectedCategory.subCategories.map((sub) =>
          sub.id === subCategoryId ? { ...sub, ...updates } : sub,
        ),
      })
    }
  }

  const handleSaveSettings = () => {
    setSaveStatus("saving")
    CategoriesService.saveSettings(settings)
    setTimeout(() => {
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 500)
  }

  const resetToDefaults = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les catégories aux valeurs par défaut ?")) {
      const defaultCategories = CategoriesService.getDefaultCategories()
      CategoriesService.saveCategories(defaultCategories)
      loadData()
    }
  }

  const getStats = () => {
    const total = categories.length
    const enabled = categories.filter((cat) => cat.enabled).length
    const totalSubCategories = categories.reduce((acc, cat) => acc + cat.subCategories.length, 0)
    const enabledSubCategories = categories
      .filter((cat) => cat.enabled)
      .reduce((acc, cat) => acc + cat.subCategories.length, 0)

    return {
      total,
      enabled,
      disabled: total - enabled,
      totalSubCategories,
      enabledSubCategories,
    }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des catégories</h2>
          <p className="text-gray-600">Configurez les catégories et sous-catégories de dépannage</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={handleSaveSettings} disabled={saveStatus === "saving"}>
            <Save className="h-4 w-4 mr-2" />
            {saveStatus === "saving" ? "Sauvegarde..." : saveStatus === "saved" ? "Sauvegardé !" : "Sauvegarder"}
          </Button>
        </div>
      </div>

      {/* Paramètres TVA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Paramètres TVA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Activer la TVA</Label>
                <p className="text-sm text-gray-600">Appliquer la TVA sur tous les services</p>
              </div>
              <Switch
                checked={settings.tvaEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, tvaEnabled: checked })}
              />
            </div>
            <div>
              <Label htmlFor="tva-rate">Taux de TVA (%)</Label>
              <Input
                id="tva-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.tvaRate}
                onChange={(e) => setSettings({ ...settings, tvaRate: Number.parseFloat(e.target.value) || 0 })}
                disabled={!settings.tvaEnabled}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total catégories</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activées</p>
                <p className="text-2xl font-bold text-green-600">{stats.enabled}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Désactivées</p>
                <p className="text-2xl font-bold text-red-600">{stats.disabled}</p>
              </div>
              <EyeOff className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sous-catégories</p>
                <p className="text-2xl font-bold">{stats.totalSubCategories}</p>
              </div>
              <Filter className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actives</p>
                <p className="text-2xl font-bold text-blue-600">{stats.enabledSubCategories}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher une catégorie ou sous-catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={showOnlyEnabled} onCheckedChange={setShowOnlyEnabled} />
              <Label>Afficher seulement les activées</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des catégories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className={`border-2 ${category.enabled ? "border-green-200" : "border-red-200"}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <p className="text-sm text-gray-600 font-normal">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={category.enabled} onCheckedChange={() => handleToggleCategory(category.id)} />
                  <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sous-catégories :</span>
                  <Badge variant="outline">{category.subCategories.length}</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {category.subCategories.slice(0, 6).map((sub) => (
                    <Badge key={sub.id} variant="secondary" className="text-xs">
                      {sub.name}
                    </Badge>
                  ))}
                  {category.subCategories.length > 6 && (
                    <Badge variant="secondary" className="text-xs">
                      +{category.subCategories.length - 6}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal d'édition */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category-name">Nom de la catégorie</Label>
                  <Input
                    id="category-name"
                    value={selectedCategory.name}
                    onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category-icon">Icône (emoji)</Label>
                  <Input
                    id="category-icon"
                    value={selectedCategory.icon}
                    onChange={(e) => setSelectedCategory({ ...selectedCategory, icon: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category-description">Description</Label>
                <Textarea
                  id="category-description"
                  value={selectedCategory.description}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg font-medium">Sous-catégories</Label>
                  <Button size="sm" onClick={handleAddSubCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedCategory.subCategories.map((subCategory) => (
                    <div key={subCategory.id} className="border rounded-lg p-3">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between">
                          <Input
                            placeholder="Nom de la sous-catégorie"
                            value={subCategory.name}
                            onChange={(e) => handleUpdateSubCategory(subCategory.id, { name: e.target.value })}
                            className="flex-1 mr-2"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveSubCategory(subCategory.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Description de la sous-catégorie"
                          value={subCategory.description || ""}
                          onChange={(e) => handleUpdateSubCategory(subCategory.id, { description: e.target.value })}
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSaveCategory}>Sauvegarder</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminCategoriesManagement
