"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Camera, Star, Globe, Facebook, Instagram, Linkedin, Award } from "lucide-react"
import { StorageService } from "@/lib/storage"
import PhotoUpload from "@/components/photo-upload"

export default function ProfilProPage() {
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser())
  const [proProfile, setProProfile] = useState({
    companyName: currentUser?.professional?.companyName || "",
    siret: currentUser?.professional?.siret || "",
    description: currentUser?.professional?.description || "",
    specialties: currentUser?.professional?.specialties || [],
    website: currentUser?.professional?.website || "",
    socialMedia: {
      facebook: "",
      instagram: "",
      linkedin: "",
    },
    address: currentUser?.address || "",
    city: currentUser?.city || "",
    postalCode: currentUser?.postalCode || "",
    phone: currentUser?.phone || "",
    email: currentUser?.email || "",
    photos: [],
    certifications: ["Qualibat", "RGE"],
    experience: currentUser?.professional?.experience || "",
    avatar: currentUser?.avatar || "",
  })

  const stats = {
    totalJobs: 247,
    rating: 4.8,
    responseTime: "2h",
    completionRate: 98,
  }

  const recentReviews = [
    {
      id: 1,
      client: "Marie L.",
      rating: 5,
      comment: "Excellent service, très professionnel et rapide !",
      date: "2024-01-15",
      service: "Réparation lave-linge",
    },
    {
      id: 2,
      client: "Pierre D.",
      rating: 5,
      comment: "Réparation parfaite, je recommande vivement.",
      date: "2024-01-12",
      service: "Dépannage électrique",
    },
  ]

  // Vérifier si l'utilisateur est un réparateur
  useEffect(() => {
    if (currentUser && currentUser.userType !== "reparateur") {
      window.location.href = "/profil"
    }
  }, [currentUser])

  const handleSaveProfile = () => {
    if (!currentUser) return

    // Mettre à jour les informations professionnelles
    const updatedUser = {
      ...currentUser,
      professional: {
        ...currentUser.professional,
        companyName: proProfile.companyName,
        siret: proProfile.siret,
        description: proProfile.description,
        specialties: proProfile.specialties,
        website: proProfile.website,
      },
      address: proProfile.address,
      city: proProfile.city,
      postalCode: proProfile.postalCode,
      phone: proProfile.phone,
      email: proProfile.email,
      avatar: proProfile.avatar,
    }

    StorageService.saveUser(updatedUser)
    StorageService.setCurrentUser(updatedUser)
    setCurrentUser(updatedUser)

    alert("Profil professionnel mis à jour avec succès !")
  }

  const handlePhotoChange = (photoUrl: string) => {
    setProProfile({ ...proProfile, avatar: photoUrl })
  }

  // Vérifier si l'utilisateur est connecté
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à votre profil professionnel.</p>
            <Button asChild className="w-full">
              <a href="/connexion">Se connecter</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Vérifier le statut de l'abonnement
  const subscriptionStatus = currentUser.subscription?.status || "inactive"
  const isInTrial = StorageService.isInTrialPeriod(currentUser)
  const trialEndsAt = currentUser.subscription?.expiresAt
    ? new Date(currentUser.subscription.expiresAt).toLocaleDateString("fr-FR")
    : "N/A"

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil professionnel</h1>
          <p className="text-gray-600">Gérez votre présence professionnelle sur FixeoPro</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalJobs}</div>
              <p className="text-sm text-gray-600">Interventions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center">
                <Star className="h-6 w-6 mr-1" />
                {stats.rating}
              </div>
              <p className="text-sm text-gray-600">Note moyenne</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.responseTime}</div>
              <p className="text-sm text-gray-600">Temps de réponse</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
              <p className="text-sm text-gray-600">Taux de réussite</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Avis clients</TabsTrigger>
            <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-6">
              {/* Photo de profil */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Photo de profil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PhotoUpload currentPhoto={proProfile.avatar} onPhotoChange={handlePhotoChange} size="lg" />
                </CardContent>
              </Card>

              {/* Informations de l'entreprise */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Informations de l'entreprise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Nom de l'entreprise</Label>
                      <Input
                        id="companyName"
                        value={proProfile.companyName}
                        onChange={(e) => setProProfile({ ...proProfile, companyName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="siret">SIRET</Label>
                      <Input
                        id="siret"
                        value={proProfile.siret}
                        onChange={(e) => setProProfile({ ...proProfile, siret: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description de l'activité</Label>
                    <Textarea
                      id="description"
                      value={proProfile.description}
                      onChange={(e) => setProProfile({ ...proProfile, description: e.target.value })}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div>
                    <Label>Spécialités</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {proProfile.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact et localisation */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact et localisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={proProfile.phone}
                        onChange={(e) => setProProfile({ ...proProfile, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email professionnel</Label>
                      <Input
                        id="email"
                        value={proProfile.email}
                        onChange={(e) => setProProfile({ ...proProfile, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={proProfile.address}
                      onChange={(e) => setProProfile({ ...proProfile, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        value={proProfile.city}
                        onChange={(e) => setProProfile({ ...proProfile, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        value={proProfile.postalCode}
                        onChange={(e) => setProProfile({ ...proProfile, postalCode: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Présence en ligne */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Présence en ligne
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      value={proProfile.website}
                      onChange={(e) => setProProfile({ ...proProfile, website: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Réseaux sociaux</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        <Input
                          placeholder="Facebook"
                          value={proProfile.socialMedia.facebook}
                          onChange={(e) =>
                            setProProfile({
                              ...proProfile,
                              socialMedia: { ...proProfile.socialMedia, facebook: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Instagram className="h-4 w-4 text-pink-600" />
                        <Input
                          placeholder="Instagram"
                          value={proProfile.socialMedia.instagram}
                          onChange={(e) =>
                            setProProfile({
                              ...proProfile,
                              socialMedia: { ...proProfile.socialMedia, instagram: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Linkedin className="h-4 w-4 text-blue-700" />
                        <Input
                          placeholder="LinkedIn"
                          value={proProfile.socialMedia.linkedin}
                          onChange={(e) =>
                            setProProfile({
                              ...proProfile,
                              socialMedia: { ...proProfile.socialMedia, linkedin: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                Sauvegarder les modifications
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Portfolio et photos
                </CardTitle>
                <CardDescription>
                  Ajoutez des photos de vos réalisations pour rassurer vos futurs clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ajoutez vos photos</h3>
                  <p className="text-gray-600 mb-4">Glissez-déposez vos images ou cliquez pour les sélectionner</p>
                  <Button variant="outline">Choisir des fichiers</Button>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Conseils pour de bonnes photos :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Prenez des photos avant/après vos interventions</li>
                    <li>• Montrez votre matériel professionnel</li>
                    <li>• Ajoutez des photos de votre équipe au travail</li>
                    <li>• Utilisez un bon éclairage et des images nettes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Avis clients
                </CardTitle>
                <CardDescription>Consultez les retours de vos clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-medium">
                            {review.client[0]}
                          </div>
                          <div>
                            <p className="font-medium">{review.client}</p>
                            <div className="flex items-center">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{review.service}</Badge>
                      </div>
                      <p className="text-gray-700 mb-2">"{review.comment}"</p>
                      <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString("fr-FR")}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Mon abonnement
                </CardTitle>
                <CardDescription>Gérez votre abonnement FixeoPro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={`p-4 rounded-lg ${isInTrial ? "bg-green-50" : "bg-blue-50"}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-blue-900">
                      {isInTrial
                        ? "Période d'essai gratuite"
                        : subscriptionStatus === "active"
                          ? "Abonnement Professionnel"
                          : "Aucun abonnement actif"}
                    </h3>
                    <Badge
                      className={
                        isInTrial ? "bg-green-600" : subscriptionStatus === "active" ? "bg-blue-600" : "bg-red-600"
                      }
                    >
                      {isInTrial ? "Essai gratuit" : subscriptionStatus === "active" ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                  {isInTrial ? (
                    <p className="text-green-800 text-sm mb-3">
                      Votre période d'essai gratuite se termine le {trialEndsAt}
                    </p>
                  ) : subscriptionStatus === "active" ? (
                    <p className="text-blue-800 text-sm mb-3">59€/mois - Renouvelé le 15 de chaque mois</p>
                  ) : (
                    <p className="text-red-800 text-sm mb-3">
                      Vous n'avez pas d'abonnement actif. Souscrivez pour accéder aux coordonnées des clients.
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Demandes consultées ce mois :</p>
                      <p className="text-2xl font-bold text-blue-600">47</p>
                    </div>
                    <div>
                      <p className="font-medium">Réponses envoyées :</p>
                      <p className="text-2xl font-bold text-blue-600">23</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline">Changer d'abonnement</Button>
                  <Button variant="outline">Gérer le paiement</Button>
                  {(isInTrial || subscriptionStatus === "active") && <Button variant="destructive">Résilier</Button>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
