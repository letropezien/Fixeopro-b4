"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, PenToolIcon as Tool } from "lucide-react"
import { StorageService, type User } from "@/lib/storage"

export function RandomRepairers() {
  const [repairers, setRepairers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer tous les réparateurs
    const allUsers = StorageService.getUsers()
    const allRepairers = allUsers.filter((user) => user.userType === "reparateur")

    // Mélanger les réparateurs et en prendre 10 maximum
    const shuffled = [...allRepairers].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 10)

    setRepairers(selected)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (repairers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun réparateur disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {repairers.map((repairer) => (
        <Link href={`/profil-pro/${repairer.id}`} key={repairer.id}>
          <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <Avatar className="w-16 h-16 mb-3 border-2 border-blue-100 group-hover:border-blue-300 transition-all">
                <AvatarImage
                  src={repairer.avatar || `/placeholder.svg?height=64&width=64&query=portrait professionnel`}
                  alt={`${repairer.firstName} ${repairer.lastName}`}
                />
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  {repairer.firstName?.[0]}
                  {repairer.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {repairer.firstName} {repairer.lastName}
              </h3>

              <div className="flex items-center justify-center mt-1 text-sm text-gray-600">
                <MapPin className="h-3 w-3 mr-1" />
                {repairer.city || "France"}
              </div>

              {repairer.professional?.specialties && repairer.professional.specialties.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  <Badge variant="outline" className="text-xs py-0">
                    <Tool className="h-2.5 w-2.5 mr-1" />
                    {repairer.professional.specialties[0]}
                  </Badge>
                </div>
              )}

              <div className="mt-2 flex items-center text-yellow-500 text-xs">
                <Star className="h-3 w-3 fill-current" />
                <Star className="h-3 w-3 fill-current" />
                <Star className="h-3 w-3 fill-current" />
                <Star className="h-3 w-3 fill-current" />
                <Star className="h-3 w-3 fill-current" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
