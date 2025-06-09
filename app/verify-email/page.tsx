"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"
import { emailService } from "@/lib/email-service"
import { StorageService } from "@/lib/storage"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")
    const email = searchParams.get("email")

    if (!token || !email) {
      setStatus("error")
      setMessage("Lien de vérification invalide. Paramètres manquants.")
      return
    }

    setUserEmail(email)
    verifyEmail(token, email)
  }, [searchParams])

  const verifyEmail = async (token: string, email: string) => {
    try {
      const result = emailService.verifyEmailToken(token, email)

      if (result.success && result.userId) {
        // Marquer l'email comme vérifié dans le profil utilisateur
        const users = StorageService.getUsers()
        const userIndex = users.findIndex((u) => u.id === result.userId)

        if (userIndex >= 0) {
          users[userIndex].isEmailVerified = true
          users[userIndex].emailVerifiedAt = new Date().toISOString()

          // Sauvegarder les utilisateurs mis à jour
          localStorage.setItem("fixeopro_users", JSON.stringify(users))

          // Mettre à jour l'utilisateur actuel s'il s'agit du même
          const currentUser = StorageService.getCurrentUser()
          if (currentUser && currentUser.id === result.userId) {
            const updatedUser = { ...currentUser, isEmailVerified: true, emailVerifiedAt: new Date().toISOString() }
            StorageService.setCurrentUser(updatedUser)
          }

          setStatus("success")
          setMessage("Votre adresse email a été vérifiée avec succès ! Votre compte est maintenant sécurisé.")
        } else {
          setStatus("error")
          setMessage("Utilisateur introuvable. Veuillez contacter le support.")
        }
      } else {
        setStatus("error")
        setMessage(result.error || "Erreur lors de la vérification de l'email.")
      }
    } catch (error) {
      console.error("Erreur lors de la vérification:", error)
      setStatus("error")
      setMessage("Une erreur technique est survenue. Veuillez réessayer plus tard.")
    }
  }

  const getIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "error":
        return <XCircle className="h-16 w-16 text-red-500" />
    }
  }

  const getTitle = () => {
    switch (status) {
      case "loading":
        return "Vérification en cours..."
      case "success":
        return "Email vérifié !"
      case "error":
        return "Erreur de vérification"
    }
  }

  const getButtonText = () => {
    switch (status) {
      case "success":
        return "Accéder à mon profil"
      case "error":
        return "Retour à l'accueil"
      default:
        return ""
    }
  }

  const getButtonLink = () => {
    switch (status) {
      case "success":
        return "/profil"
      case "error":
        return "/"
      default:
        return "/"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{getIcon()}</div>
          <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>

          {userEmail && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {userEmail}
              </div>
            </div>
          )}

          {status !== "loading" && (
            <div className="space-y-3 pt-4">
              <Button asChild className="w-full">
                <a href={getButtonLink()}>{getButtonText()}</a>
              </Button>

              {status === "error" && (
                <Button asChild variant="outline" className="w-full">
                  <a href="/profil">Renvoyer un email de vérification</a>
                </Button>
              )}
            </div>
          )}

          <div className="text-xs text-gray-500 pt-4 border-t">
            <p>
              Si vous rencontrez des problèmes, contactez notre{" "}
              <a href="/contact" className="text-blue-600 hover:underline">
                support client
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
