"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Home } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Accès refusé</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <p className="text-sm text-gray-500">
            Seuls les administrateurs peuvent accéder au panneau d'administration.
          </p>
          <div className="space-y-2">
            <Button onClick={() => router.push("/")} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
            <Button variant="outline" onClick={() => router.push("/connexion")} className="w-full">
              Se connecter en tant qu'admin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
