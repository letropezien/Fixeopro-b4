"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Clock,
  Calendar,
  PenToolIcon as Tool,
  Award,
  CheckCircle,
  ArrowLeft,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react"
import { StorageService, type User } from "@/lib/storage"

export default function RepairerProfilePage() {
  const params = useParams()
  const [repairer, setRepairer] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const user = StorageService.getUserById(params.id as string)
      setRepairer(user)
      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            </div>
            <div className="w-full md:w-2/3">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!repairer || repairer.userType !== "reparateur") {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Profil non trouvé</h1>
        <p className="text-gray-600 mb-6">Le réparateur que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    )
  }

  // Générer des statistiques fictives pour la démo
  const stats = {
    completedJobs: Math.floor(Math.random() * 100) + 20,
    responseRate: Math.floor(Math.random() * 20) + 80,
    responseTime: Math.floor(Math.random() * 3) + 1,
    rating: (4 + Math.random()).toFixed(1),
    memberSince: new Date(repairer.createdAt).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
    }),
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à l'accueil
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Colonne de gauche - Profil */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="w-32 h-32 border-4 border-blue-100 mb-4">
                <AvatarImage
                  src={repairer.avatar || `/placeholder.svg?height=128&width=128&query=portrait professionnel`}
                  alt={`${repairer.firstName} ${repairer.lastName}`}
                />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-800">
                  {repairer.professional?.companyName?.[0] || "R"}
                </AvatarFallback>
              </Avatar>

              <h1 className="text-xl font-bold text-gray-900">
                {repairer.professional?.companyName || "Réparateur professionnel"}
              </h1>

              {repairer.professional?.companyName && (
                <p className="text-blue-600 font-medium">{repairer.professional.companyName}</p>
              )}

              <div className="flex items-center justify-center mt-2 text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {repairer.city || "France"}
              </div>

              <div className="flex items-center mt-2 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
                <span className="ml-1 text-gray-900 font-medium">{stats.rating}</span>
              </div>

              <div className="w-full border-t border-gray-100 my-4"></div>

              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    Interventions
                  </span>
                  <span className="font-medium">{stats.completedJobs}</span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-sm flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1 text-blue-500" />
                    Taux de réponse
                  </span>
                  <span className="font-medium">{stats.responseRate}%</span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-sm flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-orange-500" />
                    Temps de réponse
                  </span>
                  <span className="font-medium">{stats.responseTime}h</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                    Membre depuis
                  </span>
                  <span className="font-medium">{stats.memberSince}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                onClick={() => {
                  // Ouvrir une modal de contact ou rediriger
                  window.location.href = `mailto:${repairer.email}?subject=Contact via FixeoPro&body=Bonjour, je souhaite vous contacter concernant vos services de réparation.`
                }}
              >
                <Phone className="mr-2 h-4 w-4" />
                Contacter par email
              </Button>

              {repairer.phone && (
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    window.location.href = `tel:${repairer.phone}`
                  }}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Appeler
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Coordonnées */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {repairer.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{repairer.phone}</span>
                </div>
              )}

              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span>{repairer.email}</span>
              </div>

              {repairer.professional?.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-gray-500" />
                  <a
                    href={repairer.professional.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Site web
                  </a>
                </div>
              )}

              {repairer.address && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    {repairer.address}, {repairer.postalCode} {repairer.city}
                  </span>
                </div>
              )}

              {repairer.professional?.socialMedia && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Réseaux sociaux</h4>
                  <div className="space-y-2">
                    {repairer.professional.socialMedia.facebook && (
                      <div className="flex items-center">
                        <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                        <a
                          href={repairer.professional.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Facebook
                        </a>
                      </div>
                    )}

                    {repairer.professional.socialMedia.instagram && (
                      <div className="flex items-center">
                        <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                        <a
                          href={repairer.professional.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:underline text-sm"
                        >
                          Instagram
                        </a>
                      </div>
                    )}

                    {repairer.professional.socialMedia.linkedin && (
                      <div className="flex items-center">
                        <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                        <a
                          href={repairer.professional.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:underline text-sm"
                        >
                          LinkedIn
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne de droite - Informations */}
        <div className="w-full md:w-2/3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>À propos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {repairer.professional?.description ||
                  `${repairer.firstName} est un réparateur professionnel basé à ${repairer.city || "France"}. 
                 Contactez-le pour obtenir un devis pour vos travaux de réparation.`}
              </p>

              {repairer.professional?.experience && (
                <div className="mt-4">
                  <h3 className="font-medium flex items-center">
                    <Award className="h-5 w-5 mr-2 text-blue-600" />
                    Expérience
                  </h3>
                  <p className="mt-1 text-gray-700">{repairer.professional.experience}</p>
                </div>
              )}

              {repairer.professional?.specialties && repairer.professional.specialties.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium flex items-center mb-2">
                    <Tool className="h-5 w-5 mr-2 text-blue-600" />
                    Spécialités
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {repairer.professional.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {repairer.professional?.siret && (
                <div className="mt-4 text-sm text-gray-500">SIRET : {repairer.professional.siret}</div>
              )}
            </CardContent>
          </Card>

          {/* Photos */}
          {repairer.professional?.companyPhotos && repairer.professional.companyPhotos.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {repairer.professional.companyPhotos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-md overflow-hidden">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Avis */}
          <Card>
            <CardHeader>
              <CardTitle>Avis clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-gray-500">Aucun avis pour le moment.</p>
                <Button variant="outline" className="mt-2">
                  Laisser un avis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
