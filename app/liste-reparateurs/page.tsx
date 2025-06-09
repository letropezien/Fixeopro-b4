"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, PenToolIcon as Tool, Search, Filter } from "lucide-react"
import { StorageService, type User } from "@/lib/storage"
import { CategoriesService } from "@/lib/categories-service"

export default function RepairerListPage() {
  const [repairers, setRepairers] = useState<User[]>([])
  const [filteredRepairers, setFilteredRepairers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [cityFilter, setCityFilter] = useState("")

  const categories = CategoriesService.getEnabledCategories()

  useEffect(() => {
    // Récupérer tous les réparateurs
    const allUsers = StorageService.getUsers()
    const allRepairers = allUsers.filter((user) => user.userType === "reparateur")

    setRepairers(allRepairers)
    setFilteredRepairers(allRepairers)
    setLoading(false)
  }, [])

  useEffect(() => {
    // Filtrer les réparateurs selon les critères
    let filtered = [...repairers]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.firstName.toLowerCase().includes(term) ||
          r.lastName.toLowerCase().includes(term) ||
          (r.professional?.companyName && r.professional.companyName.toLowerCase().includes(term)) ||
          (r.city && r.city.toLowerCase().includes(term)),
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter((r) =>
        r.professional?.specialties?.some((s) => s.toLowerCase().includes(categoryFilter.toLowerCase())),
      )
    }

    if (cityFilter) {
      filtered = filtered.filter((r) => r.city && r.city.toLowerCase() === cityFilter.toLowerCase())
    }

    setFilteredRepairers(filtered)
  }, [searchTerm, categoryFilter, cityFilter, repairers])

  // Extraire les villes uniques pour le filtre
  const cities = [...new Set(repairers.map((r) => r.city).filter(Boolean))]

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Nos réparateurs professionnels</h1>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Nos réparateurs professionnels</h1>
      <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
        Trouvez le réparateur idéal pour votre projet parmi notre réseau de professionnels qualifiés et vérifiés
      </p>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="text-sm font-medium text-gray-700 mb-1 block">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                placeholder="Nom, entreprise, ville..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1 block">
              Catégorie
            </label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="city" className="text-sm font-medium text-gray-700 mb-1 block">
              Ville
            </label>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger id="city">
                <SelectValue placeholder="Toutes les villes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Résultats */}
      {filteredRepairers.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun réparateur trouvé</h3>
          <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
          <Button
            onClick={() => {
              setSearchTerm("")
              setCategoryFilter("")
              setCityFilter("")
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">{filteredRepairers.length} réparateurs trouvés</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRepairers.map((repairer) => (
              <Link href={`/profil-pro/${repairer.id}`} key={repairer.id}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="w-24 h-24 mb-4 border-2 border-blue-100 group-hover:border-blue-300 transition-all">
                        <AvatarImage
                          src={repairer.avatar || `/placeholder.svg?height=96&width=96&query=portrait professionnel`}
                          alt={`${repairer.firstName} ${repairer.lastName}`}
                        />
                        <AvatarFallback className="text-xl bg-blue-100 text-blue-800">
                          {repairer.firstName?.[0]}
                          {repairer.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {repairer.firstName} {repairer.lastName}
                      </h3>

                      {repairer.professional?.companyName && (
                        <p className="text-blue-600 font-medium">{repairer.professional.companyName}</p>
                      )}

                      <div className="flex items-center justify-center mt-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {repairer.city || "France"}
                      </div>

                      <div className="flex items-center mt-2 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                        <span className="ml-1 text-gray-700 text-sm">{(4 + Math.random()).toFixed(1)}</span>
                      </div>

                      {repairer.professional?.specialties && repairer.professional.specialties.length > 0 && (
                        <div className="mt-3 flex flex-wrap justify-center gap-1">
                          {repairer.professional.specialties.slice(0, 2).map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs py-0">
                              <Tool className="h-2.5 w-2.5 mr-1" />
                              {specialty}
                            </Badge>
                          ))}
                          {repairer.professional.specialties.length > 2 && (
                            <Badge variant="outline" className="text-xs py-0">
                              +{repairer.professional.specialties.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      <Button className="w-full mt-4 group-hover:bg-green-600 transition-colors">Voir le profil</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
