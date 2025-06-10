"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CookieConsentService, type CookiePreferences } from "@/lib/cookie-consent"
import { Shield, BarChart3, Target, Wrench, Save } from "lucide-react"

export default function CookiesPage() {
  const [preferences, setPreferences] = useState<CookiePreferences>(CookieConsentService.getDefaultPreferences())
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setPreferences(CookieConsentService.getPreferences())
  }, [])

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "essential") return

    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    CookieConsentService.savePreferences(preferences)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Politique des cookies</h1>
          <p className="text-gray-600">
            Cette page vous permet de comprendre et gérer l'utilisation des cookies sur FixeoPro.fr
          </p>
        </div>

        <div className="grid gap-6">
          {/* Qu'est-ce qu'un cookie */}
          <Card>
            <CardHeader>
              <CardTitle>Qu'est-ce qu'un cookie ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. Les
                cookies nous aident à améliorer votre expérience en mémorisant vos préférences et en analysant
                l'utilisation de notre site.
              </p>
            </CardContent>
          </Card>

          {/* Gestion des préférences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Gérer vos préférences de cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cookies essentiels */}
              <div className="flex items-start justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <Label className="font-semibold text-green-800">Cookies essentiels</Label>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Obligatoires</span>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                  </p>
                  <ul className="text-xs text-green-600 space-y-1">
                    <li>• Authentification et sécurité</li>
                    <li>• Fonctionnement du panier</li>
                    <li>• Préférences de langue</li>
                    <li>• Protection contre les attaques</li>
                  </ul>
                </div>
                <Switch checked={true} disabled className="ml-4" />
              </div>

              {/* Cookies analytics */}
              <div className="flex items-start justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <Label className="font-semibold text-blue-800">Cookies d'analyse</Label>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    Ces cookies nous aident à comprendre comment vous utilisez notre site.
                  </p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• Nombre de visiteurs et pages vues</li>
                    <li>• Temps passé sur le site</li>
                    <li>• Parcours de navigation</li>
                    <li>• Performances du site</li>
                  </ul>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
                  className="ml-4"
                />
              </div>

              {/* Cookies marketing */}
              <div className="flex items-start justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <Label className="font-semibold text-purple-800">Cookies marketing</Label>
                  </div>
                  <p className="text-sm text-purple-700 mb-2">
                    Ces cookies permettent de vous proposer des publicités pertinentes.
                  </p>
                  <ul className="text-xs text-purple-600 space-y-1">
                    <li>• Publicités personnalisées</li>
                    <li>• Suivi des conversions</li>
                    <li>• Réseaux sociaux</li>
                    <li>• Remarketing</li>
                  </ul>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
                  className="ml-4"
                />
              </div>

              {/* Cookies fonctionnels */}
              <div className="flex items-start justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="h-5 w-5 text-orange-600" />
                    <Label className="font-semibold text-orange-800">Cookies fonctionnels</Label>
                  </div>
                  <p className="text-sm text-orange-700 mb-2">
                    Ces cookies améliorent les fonctionnalités et la personnalisation.
                  </p>
                  <ul className="text-xs text-orange-600 space-y-1">
                    <li>• Chat en direct</li>
                    <li>• Préférences utilisateur</li>
                    <li>• Contenu personnalisé</li>
                    <li>• Fonctionnalités avancées</li>
                  </ul>
                </div>
                <Switch
                  checked={preferences.functional}
                  onCheckedChange={(checked) => handlePreferenceChange("functional", checked)}
                  className="ml-4"
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {saved ? "Préférences sauvegardées !" : "Sauvegarder mes préférences"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informations légales */}
          <Card>
            <CardHeader>
              <CardTitle>Vos droits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 space-y-2">
                <p>Conformément au RGPD et à la loi française, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification de vos données</li>
                  <li>Droit à l'effacement de vos données</li>
                  <li>Droit à la portabilité de vos données</li>
                  <li>Droit d'opposition au traitement</li>
                  <li>Droit de retirer votre consentement à tout moment</li>
                </ul>
                <p className="pt-2">
                  Pour exercer ces droits, contactez-nous à{" "}
                  <a href="mailto:contact@fixeopro.fr" className="text-blue-600 hover:underline">
                    contact@fixeopro.fr
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
