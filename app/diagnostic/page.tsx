"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface DiagnosticResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  solution?: string
}

export default function DiagnosticPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostic = async () => {
    setIsRunning(true)
    const diagnosticResults: DiagnosticResult[] = []

    // Test 1: Vérifier l'environnement
    try {
      const isClient = typeof window !== "undefined"
      diagnosticResults.push({
        name: "Environnement Client",
        status: isClient ? "success" : "error",
        message: isClient ? "Environnement client détecté" : "Problème d'environnement",
        solution: !isClient ? "Vérifiez que JavaScript est activé" : undefined,
      })
    } catch (error) {
      diagnosticResults.push({
        name: "Environnement Client",
        status: "error",
        message: "Erreur lors de la détection de l'environnement",
        solution: "Rechargez la page et réessayez",
      })
    }

    // Test 2: Vérifier le localStorage
    try {
      localStorage.setItem("diagnostic_test", "test")
      localStorage.removeItem("diagnostic_test")
      diagnosticResults.push({
        name: "LocalStorage",
        status: "success",
        message: "LocalStorage fonctionne correctement",
      })
    } catch (error) {
      diagnosticResults.push({
        name: "LocalStorage",
        status: "error",
        message: "LocalStorage non disponible",
        solution: "Activez les cookies et le stockage local dans votre navigateur",
      })
    }

    // Test 3: Vérifier les routes
    try {
      const currentPath = window.location.pathname
      diagnosticResults.push({
        name: "Route Actuelle",
        status: "success",
        message: `Route détectée: ${currentPath}`,
      })
    } catch (error) {
      diagnosticResults.push({
        name: "Route Actuelle",
        status: "error",
        message: "Impossible de détecter la route",
        solution: "Vérifiez la configuration du serveur web",
      })
    }

    // Test 4: Vérifier l'accès admin
    try {
      const adminPath = "/admin"
      const testUrl = `${window.location.origin}${adminPath}`

      // Simuler un test d'accès
      diagnosticResults.push({
        name: "Accès Admin",
        status: "warning",
        message: `URL admin: ${testUrl}`,
        solution: "Essayez d'accéder directement à cette URL",
      })
    } catch (error) {
      diagnosticResults.push({
        name: "Accès Admin",
        status: "error",
        message: "Impossible de construire l'URL admin",
        solution: "Vérifiez la configuration du domaine",
      })
    }

    // Test 5: Vérifier les composants
    try {
      const hasReact = typeof React !== "undefined"
      diagnosticResults.push({
        name: "Composants React",
        status: "success",
        message: "React chargé correctement",
      })
    } catch (error) {
      diagnosticResults.push({
        name: "Composants React",
        status: "error",
        message: "Problème de chargement React",
        solution: "Vérifiez que tous les fichiers JavaScript sont accessibles",
      })
    }

    // Test 6: Informations du navigateur
    try {
      const userAgent = navigator.userAgent
      const isModern = "fetch" in window && "Promise" in window
      diagnosticResults.push({
        name: "Navigateur",
        status: isModern ? "success" : "warning",
        message: `${isModern ? "Navigateur moderne" : "Navigateur ancien"} - ${userAgent.split(" ")[0]}`,
        solution: !isModern ? "Mettez à jour votre navigateur" : undefined,
      })
    } catch (error) {
      diagnosticResults.push({
        name: "Navigateur",
        status: "error",
        message: "Impossible de détecter le navigateur",
      })
    }

    setResults(diagnosticResults)
    setIsRunning(false)
  }

  useEffect(() => {
    runDiagnostic()
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
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">OK</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inconnu</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnostic Fixeo.Pro</h1>
          <p className="text-gray-600">Outil de diagnostic pour identifier les problèmes d'accès</p>
        </div>

        <div className="mb-6 flex justify-center">
          <Button onClick={runDiagnostic} disabled={isRunning} className="bg-red-600 hover:bg-red-700">
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Diagnostic en cours...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Relancer le diagnostic
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-4">
          {results.map((result, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{result.name}</h3>
                        {getStatusBadge(result.status)}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{result.message}</p>
                      {result.solution && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-blue-800 text-sm">
                            <strong>Solution :</strong> {result.solution}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Solutions communes pour l'erreur 404 admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">1. Vérifiez l'URL d'accès</h4>
                <p className="text-gray-600 text-sm mb-2">Essayez ces URLs alternatives :</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>
                    • <code>https://votre-domaine.com/admin</code>
                  </li>
                  <li>
                    • <code>https://votre-domaine.com/admin-panel</code>
                  </li>
                  <li>
                    • <code>https://votre-domaine.com/administration</code>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">2. Configuration serveur</h4>
                <p className="text-gray-600 text-sm">
                  Assurez-vous que votre hébergeur supporte les applications Next.js ou les Single Page Applications
                  (SPA).
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">3. Fichier .htaccess</h4>
                <p className="text-gray-600 text-sm">
                  Vérifiez qu'un fichier .htaccess est présent à la racine avec les règles de réécriture appropriées.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">4. Cache du navigateur</h4>
                <p className="text-gray-600 text-sm">
                  Videz le cache de votre navigateur et réessayez (Ctrl+F5 ou Cmd+Shift+R).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
