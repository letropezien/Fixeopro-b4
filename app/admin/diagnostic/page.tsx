"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function AdminDiagnosticPage() {
  const [diagnostics, setDiagnostics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const runDiagnostics = async () => {
    setLoading(true)
    const results = []

    // Test 1: Vérifier localStorage
    try {
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      results.push({
        name: "LocalStorage",
        status: "success",
        message: "LocalStorage fonctionne correctement",
      })
    } catch (error) {
      results.push({
        name: "LocalStorage",
        status: "error",
        message: "Erreur LocalStorage: " + error,
      })
    }

    // Test 2: Vérifier les routes
    try {
      const response = await fetch("/admin")
      results.push({
        name: "Route Admin",
        status: response.ok ? "success" : "warning",
        message: `Route admin: ${response.status} ${response.statusText}`,
      })
    } catch (error) {
      results.push({
        name: "Route Admin",
        status: "error",
        message: "Erreur de route: " + error,
      })
    }

    // Test 3: Vérifier les données stockées
    const adminAuth = localStorage.getItem("admin_authenticated")
    const adminPassword = localStorage.getItem("admin_password")
    results.push({
      name: "Authentification Admin",
      status: adminAuth ? "success" : "warning",
      message: `Auth: ${adminAuth || "Non définie"}, Password: ${adminPassword ? "Défini" : "Non défini"}`,
    })

    // Test 4: Vérifier l'URL actuelle
    results.push({
      name: "URL Actuelle",
      status: "info",
      message: `${window.location.origin}${window.location.pathname}`,
    })

    // Test 5: Vérifier les cookies
    const cookies = document.cookie
    results.push({
      name: "Cookies",
      status: cookies ? "success" : "warning",
      message: cookies || "Aucun cookie trouvé",
    })

    setDiagnostics(results)
    setLoading(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-blue-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Diagnostic Administrateur
              <Button onClick={runDiagnostics} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Actualiser
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diagnostics.map((diagnostic, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                  {getStatusIcon(diagnostic.status)}
                  <div className="flex-1">
                    <h3 className="font-medium">{diagnostic.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{diagnostic.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Solutions possibles :</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Vider le cache du navigateur</li>
                <li>• Vérifier la configuration du serveur</li>
                <li>• S'assurer que les routes Next.js sont correctement configurées</li>
                <li>• Vérifier les permissions de fichiers sur le serveur</li>
                <li>• Essayer d'accéder via /administration au lieu de /admin</li>
              </ul>
            </div>

            <div className="mt-4 flex space-x-4">
              <Button onClick={() => (window.location.href = "/admin")}>Aller à /admin</Button>
              <Button onClick={() => (window.location.href = "/administration")} variant="outline">
                Aller à /administration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
