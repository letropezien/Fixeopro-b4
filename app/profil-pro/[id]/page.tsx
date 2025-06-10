"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StorageService } from "@/lib/storage"
import { Star, MapPin, Phone, Mail, Globe, Facebook, Instagram, Linkedin, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilPublicReparateur() {
  const params = useParams()
  const id = params.id as string
  const [reparateur, setReparateur] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    const loadReparateur = () => {
      const user = StorageService.getUserById(id)
      if (user && user.userType === "reparateur") {
        setReparateur(user)

        // Récupérer tous les avis pour ce réparateur
        const allRequests = StorageService.getRepairRequests()
        const reparateurReviews: any[] = []

        allRequests.forEach((request) => {
          if (request.reviews) {
            request.reviews.forEach((review) => {
              if (review.reparateurId === id) {
                reparateurReviews.push({
                  ...review,
                  requestTitle: request.title,
                  requestCategory: request.category,
                })
              }
            })
          }
        })

        setReviews(reparateurReviews)

        // Calculer la note moyenne
        if (reparateurReviews.length > 0) {
          const total = reparateurReviews.reduce((sum, review) => sum + review.rating, 0)
          setAverageRating(total / reparateurReviews.length)
        }
      }
      setLoading(false)
    }

    loadReparateur()
  }, [id])

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg">Chargement du profil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!reparateur) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Réparateur non trouvé</h1>
            <p className="text-gray-600 mb-6">Le profil que vous recherchez n'existe pas.</p>
            <Button asChild>
              <Link href="/liste-reparateurs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la liste
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/liste-reparateurs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Link>
          </Button>
        </div>

        {/* En-tête du profil */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32">
                <AvatarImage src={reparateur.avatar || "/placeholder.svg"} alt={reparateur.firstName} />
                <AvatarFallback className="text-2xl">
                  {reparateur.professional?.companyName?.[0] ||
                    `${reparateur.firstName?.[0]}${reparateur.lastName?.[0]}`}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  {reparateur.professional?.companyName || `${reparateur.firstName} ${reparateur.lastName}`}
                </h1>

                {/* Supprimer cette section qui affichait le nom personnel même avec une entreprise */}
                {/* {reparateur.professional?.companyName && (
                  <p className="text-xl text-gray-600 mb-2">
                    {reparateur.firstName} {reparateur.lastName}
                  </p>
                )} */}

                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    {reparateur.city} {reparateur.postalCode && `(${reparateur.postalCode})`}
                  </span>
                </div>

                {reviews.length > 0 && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    {renderStars(Math.round(averageRating))}
                    <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-600">({reviews.length} avis)</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {reparateur.professional?.specialties?.map((specialty: string) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {reparateur.professional?.description && (
              <Card>
                <CardHeader>
                  <CardTitle>À propos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{reparateur.professional.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Photos de l'entreprise */}
            {reparateur.professional?.companyPhotos?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos de l'entreprise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {reparateur.professional.companyPhotos.map((photo: string, index: number) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(photo, "_blank")}
                      >
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

            {/* Avis clients */}
            <Card>
              <CardHeader>
                <CardTitle>Avis clients ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {renderStars(review.rating)}
                            <span className="font-medium">{review.rating}/5</span>
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                        </div>

                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Intervention :</span> {review.requestTitle}
                          <span className="mx-2">•</span>
                          <span className="capitalize">{review.requestCategory}</span>
                        </div>

                        {review.photos && review.photos.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-2">Photos du travail réalisé :</p>
                            <div className="grid grid-cols-3 gap-2">
                              {review.photos.map((photo: string, index: number) => (
                                <div
                                  key={index}
                                  className="aspect-square bg-gray-200 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(photo, "_blank")}
                                >
                                  <img
                                    src={photo || "/placeholder.svg"}
                                    alt={`Travail réalisé ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun avis pour le moment</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Les avis apparaîtront ici après les premières interventions
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations de contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reparateur.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{reparateur.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{reparateur.email}</span>
                </div>

                {reparateur.professional?.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a
                      href={reparateur.professional.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Site web
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Réseaux sociaux */}
            {(reparateur.professional?.socialMedia?.facebook ||
              reparateur.professional?.socialMedia?.instagram ||
              reparateur.professional?.socialMedia?.linkedin) && (
              <Card>
                <CardHeader>
                  <CardTitle>Réseaux sociaux</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reparateur.professional.socialMedia.facebook && (
                    <a
                      href={reparateur.professional.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-blue-600 hover:underline"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </a>
                  )}

                  {reparateur.professional.socialMedia.instagram && (
                    <a
                      href={reparateur.professional.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-pink-600 hover:underline"
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </a>
                  )}

                  {reparateur.professional.socialMedia.linkedin && (
                    <a
                      href={reparateur.professional.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-blue-700 hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Informations professionnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reparateur.professional?.experience && (
                  <div>
                    <span className="font-medium">Expérience :</span>
                    <p className="text-gray-600">{reparateur.professional.experience}</p>
                  </div>
                )}

                {reparateur.professional?.siret && (
                  <div>
                    <span className="font-medium">SIRET :</span>
                    <p className="text-gray-600">{reparateur.professional.siret}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
