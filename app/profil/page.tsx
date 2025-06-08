"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Shield, Calendar } from "lucide-react"
import { StorageService } from "@/lib/storage"
import PhotoUpload from "@/components/photo-upload"

export default function ProfilPage() {
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser())
  const [userProfile, setUserProfile] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    city: currentUser?.city || "",
    postalCode: currentUser?.postalCode || "",
    bio: "",
    avatar: currentUser?.avatar || "",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })

  const [userRequests, setUserRequests] = useState(
    currentUser ? StorageService.getRepairRequestsByClient(currentUser.id) : [],
  )

  useEffect(() => {
    if (currentUser) {
      setUserRequests(StorageService.getRepairRequestsByClient(currentUser.id))
    }
  }, [currentUser])

  const handleSaveProfile = () => {
    if (!currentUser) return

    const updatedUser = {
      ...currentUser,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      phone: userProfile.phone,
      address: userProfile.address,
      city: userProfile.city,
      postalCode: userProfile.postalCode,
      avatar: userProfile.avatar,
    }

    StorageService.saveUser(updatedUser)
    StorageService.setCurrentUser(updatedUser)
    setCurrentUser(updatedUser)

    alert("Profil mis à jour avec succès !")
  }

  const handlePhotoChange = (photoUrl: string) => {
    setUserProfile({ ...userProfile, avatar: photoUrl })
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à votre profil.</p>
            <Button asChild className="w-full">
              <a href="/connexion">Se connecter</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="requests">Mes demandes</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-6">
              {/* Photo de profil */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Photo de profil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PhotoUpload currentPhoto={userProfile.avatar} onPhotoChange={handlePhotoChange} size="lg" />
                </CardContent>
              </Card>

              {/* Informations personnelles */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Ces informations sont utilisées pour vous identifier lors des interventions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={userProfile.firstName}
                        onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={userProfile.lastName}
                        onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={userProfile.address}
                      onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        value={userProfile.city}
                        onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        value={userProfile.postalCode}
                        onChange={(e) => setUserProfile({ ...userProfile, postalCode: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Parlez-nous de vous..."
                      value={userProfile.bio}
                      onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                    Sauvegarder les modifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mes demandes de réparation</CardTitle>
                  <CardDescription>Suivez l'état de vos demandes et évaluez les réparateurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userRequests.length > 0 ? (
                      userRequests.map((request) => (
                        <div key={request.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{request.title}</h3>
                            <Badge variant={request.status === "completed" ? "default" : "secondary"}>
                              {request.status === "open"
                                ? "En attente"
                                : request.status === "in_progress"
                                  ? "En cours"
                                  : request.status === "completed"
                                    ? "Terminé"
                                    : "Annulé"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                          <div className="flex items-center text-sm text-gray-600 space-x-4">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                            </span>
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {request.responses} réponse{request.responses > 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <Button variant="outline" size="sm">
                              Voir les détails
                            </Button>
                            {request.status === "completed" && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Laisser un avis
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Vous n'avez pas encore de demandes de réparation</p>
                        <Button asChild>
                          <a href="/demande-reparation">Créer une demande</a>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Préférences de notification
                </CardTitle>
                <CardDescription>Choisissez comment vous souhaitez être informé</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications par email</h4>
                    <p className="text-sm text-gray-600">Recevez les mises à jour par email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications SMS</h4>
                    <p className="text-sm text-gray-600">Recevez les alertes urgentes par SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications push</h4>
                    <p className="text-sm text-gray-600">Recevez les notifications dans votre navigateur</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                    className="h-4 w-4"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Sauvegarder les préférences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Sécurité du compte
                  </CardTitle>
                  <CardDescription>Gérez la sécurité de votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Mot de passe</h4>
                      <p className="text-sm text-gray-600">Dernière modification il y a 3 mois</p>
                    </div>
                    <Button variant="outline">Modifier</Button>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email de vérification</h4>
                      <p className="text-sm text-gray-600">
                        {currentUser.isEmailVerified ? "Email vérifié ✓" : "Email non vérifié"}
                      </p>
                    </div>
                    {!currentUser.isEmailVerified && <Button variant="outline">Renvoyer l'email</Button>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Zone de danger</CardTitle>
                  <CardDescription>Actions irréversibles sur votre compte</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center p-4 border border-red-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-600">Supprimer le compte</h4>
                      <p className="text-sm text-gray-600">Cette action est irréversible</p>
                    </div>
                    <Button variant="destructive">Supprimer</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
