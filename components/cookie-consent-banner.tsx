"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CookieConsentService, type CookiePreferences } from "@/lib/cookie-consent"
import { X, Settings, Shield, BarChart3, Target, Wrench } from "lucide-react"

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(CookieConsentService.getDefaultPreferences())

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const hasConsented = CookieConsentService.hasConsented()
    setShowBanner(!hasConsented)

    if (hasConsented) {
      setPreferences(CookieConsentService.getPreferences())
    }
  }, [])

  const handleAcceptAll = () => {
    CookieConsentService.acceptAll()
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    CookieConsentService.rejectAll()
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    CookieConsentService.savePreferences(preferences)
    setShowBanner(false)
  }

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "essential") return // Ne pas permettre de désactiver les cookies essentiels

    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold">Respect de votre vie privée</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowBanner(false)} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Nous utilisons des cookies pour améliorer votre expérience sur Fixeo.Pro, analyser notre trafic et
              personnaliser le contenu. Vous pouvez choisir quels cookies accepter.
            </p>

            {!showDetails ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAcceptAll} className="flex-1">
                  Accepter tous les cookies
                </Button>
                <Button variant="outline" onClick={handleRejectAll} className="flex-1">
                  Refuser les cookies optionnels
                </Button>
                <Button variant="ghost" onClick={() => setShowDetails(true)} className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Personnaliser
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-4">
                  {/* Cookies essentiels */}
                  <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-green-600" />
                        <Label className="font-medium">Cookies essentiels</Label>
                      </div>
                      <p className="text-xs text-gray-600">
                        Nécessaires au fonctionnement du site (connexion, panier, sécurité)
                      </p>
                    </div>
                    <Switch checked={true} disabled className="ml-3" />
                  </div>

                  {/* Cookies analytics */}
                  <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <Label className="font-medium">Cookies d'analyse</Label>
                      </div>
                      <p className="text-xs text-gray-600">Nous aident à comprendre comment vous utilisez notre site</p>
                    </div>
                    <Switch
                      checked={preferences.analytics}
                      onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
                      className="ml-3"
                    />
                  </div>

                  {/* Cookies marketing */}
                  <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-purple-600" />
                        <Label className="font-medium">Cookies marketing</Label>
                      </div>
                      <p className="text-xs text-gray-600">Permettent de vous proposer des publicités pertinentes</p>
                    </div>
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
                      className="ml-3"
                    />
                  </div>

                  {/* Cookies fonctionnels */}
                  <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench className="h-4 w-4 text-orange-600" />
                        <Label className="font-medium">Cookies fonctionnels</Label>
                      </div>
                      <p className="text-xs text-gray-600">Améliorent les fonctionnalités et la personnalisation</p>
                    </div>
                    <Switch
                      checked={preferences.functional}
                      onCheckedChange={(checked) => handlePreferenceChange("functional", checked)}
                      className="ml-3"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button onClick={handleSavePreferences} className="flex-1">
                    Enregistrer mes préférences
                  </Button>
                  <Button variant="outline" onClick={() => setShowDetails(false)} className="flex-1">
                    Retour
                  </Button>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 pt-2 border-t">
              En continuant à utiliser notre site, vous acceptez notre{" "}
              <a href="/confidentialite" className="text-blue-600 hover:underline">
                politique de confidentialité
              </a>{" "}
              et nos{" "}
              <a href="/cookies" className="text-blue-600 hover:underline">
                conditions d'utilisation des cookies
              </a>
              .
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
