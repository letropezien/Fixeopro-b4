"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { updateUserProfile } from "@/lib/actions"
import { Badge } from "@/components/ui/badge"
import { CreditCard } from "lucide-react"
import { StorageService } from "@/lib/storage"

const ProfilePage = () => {
  const { data: session, status } = useSession()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
    }
  }, [session])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    redirect("/login")
  }

  const handleUpdateProfile = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "User ID not found.",
        variant: "destructive",
      })
      return
    }

    const result = await updateUserProfile(session.user.id, { name, email })

    if (result?.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
    }
  }

  const currentUser = session?.user

  // Ajouter après la ligne où currentUser est défini
  const trialDaysRemaining = currentUser ? StorageService.getTrialDaysRemaining(currentUser) : 0
  const trialEndDate = currentUser ? StorageService.getTrialEndDate(currentUser) : ""
  const isInTrial = currentUser ? StorageService.isInTrialPeriod(currentUser) : false

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile information here.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button onClick={handleUpdateProfile}>Update Profile</Button>
          </CardContent>
        </Card>

        {currentUser?.subscription && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Abonnement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentUser.subscription.status === "trial" && isInTrial && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Période d'essai gratuite</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Votre essai gratuit se termine le <strong>{trialEndDate}</strong>
                          <br />
                          <strong>{trialDaysRemaining} jours restants</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentUser.subscription.status === "trial" && !isInTrial && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Période d'essai expirée</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>Votre essai gratuit s'est terminé le {trialEndDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut :</span>
                  <Badge
                    className={
                      currentUser.subscription.status === "active"
                        ? "bg-green-500"
                        : currentUser.subscription.status === "trial" && isInTrial
                          ? "bg-blue-500"
                          : "bg-red-500"
                    }
                  >
                    {currentUser.subscription.status === "active"
                      ? "Actif"
                      : currentUser.subscription.status === "trial" && isInTrial
                        ? "Essai gratuit"
                        : currentUser.subscription.status === "trial"
                          ? "Essai expiré"
                          : "Inactif"}
                  </Badge>
                </div>

                {currentUser.subscription.plan && currentUser.subscription.plan !== "trial" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Formule :</span>
                    <span className="font-medium">{currentUser.subscription.plan}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
