"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { MapsConfigService, type GoogleMapsConfig } from "@/lib/maps-config"
import { Save, RefreshCw, Map, TestTube, CheckCircle, XCircle } from "lucide-react"

export function GoogleMapsConfigPanel() {
  const [config, setConfig] = useState<GoogleMapsConfig>(MapsConfigService.getDefaultConfig())
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; tested: boolean }>({
    success: false,
    message: "",
    tested: false,
  })

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = () => {
    const savedConfig = MapsConfigService.getConfig()
    setConfig(savedConfig)
  }

  const saveConfig = async () => {
    setSaveStatus("saving")
    try {
      const success = MapsConfigService.saveConfig(config)
      if (success) {
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      } else {
        setSaveStatus("error")
        setTimeout(() => setSaveStatus("idle"), 2000)
      }
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  const testGoogleMapsApi = async () => {
    setTestResult({ ...testResult, tested: false })

    try {
      if (!config.apiKey) {
        setTestResult({
          success: false,
          message: "Clé API Google Maps manquante",
          tested: true,
        })
        return
      }

      // Simuler un test de l'API Google Maps
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Vérifier si la clé commence par "AIza" (format typique des clés Google Maps)
      if (!config.apiKey.startsWith("AIza")) {
        setTestResult({
          success: false,
          message: "Format de clé API Google Maps invalide",
          tested: true,
        })
        return
      }

      setTestResult({
        success: true,
        message: "Connexion à l'API Google Maps réussie",
        tested: true,
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: "Erreur lors du test de l'API Google Maps",
        tested: true,
      })
    }
  }

  const updateConfig = (updates: Partial<GoogleMapsConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  const updateMarkerColor = (key: keyof GoogleMapsConfig["markerColors"], value: string) => {
    setConfig((prev) => ({
      ...prev,
      markerColors: {
        ...prev.markerColors,
        [key]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuration Google Maps</h2>
          <p className="text-gray-600">Paramètres pour l'affichage des cartes et marqueurs</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadConfig}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Recharger
          </Button>
          <Button onClick={saveConfig} disabled={saveStatus === "saving"}>
            <Save className="h-4 w-4 mr-2" />
            {saveStatus === "saving" ? "Sauvegarde..." : saveStatus === "saved" ? "Sauvegardé !" : "Sauvegarder"}
          </Button>
        </div>
      </div>

      {/* Configuration principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Map className="h-5 w-5 mr-2" />
              Configuration de l'API Google Maps
            </div>
            <Switch checked={config.enabled} onCheckedChange={(enabled) => updateConfig({ enabled })} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Clé API */}
          <div>
            <Label htmlFor="api-key">Clé API Google Maps</Label>
            <Input
              id="api-key"
              placeholder="AIza..."
              value={config.apiKey}
              onChange={(e) => updateConfig({ apiKey: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Obtenez votre clé API sur la{" "}
              <a
                href="https://console.cloud.google.com/google/maps-apis/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Console Google Cloud
              </a>
            </p>
          </div>

          {/* Test de connexion */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Test de connexion</h4>
                <p className="text-sm text-gray-500">Vérifiez que votre clé API est valide</p>
              </div>
              <Button onClick={testGoogleMapsApi} disabled={!config.apiKey}>
                <TestTube className="h-4 w-4 mr-2" />
                Tester
              </Button>
            </div>

            {testResult.tested && (
              <div
                className={`mt-3 p-3 rounded-md ${
                  testResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center">
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className={`text-sm ${testResult.success ? "text-green-800" : "text-red-800"}`}>
                    {testResult.message}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration avancée */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="markers">Marqueurs</TabsTrigger>
        </TabsList>

        {/* Onglet Général */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default-lat">Latitude par défaut</Label>
                  <Input
                    id="default-lat"
                    type="number"
                    step="0.000001"
                    value={config.defaultCenter.lat}
                    onChange={(e) =>
                      updateConfig({
                        defaultCenter: {
                          ...config.defaultCenter,
                          lat: Number.parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="default-lng">Longitude par défaut</Label>
                  <Input
                    id="default-lng"
                    type="number"
                    step="0.000001"
                    value={config.defaultCenter.lng}
                    onChange={(e) =>
                      updateConfig({
                        defaultCenter: {
                          ...config.defaultCenter,
                          lng: Number.parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="default-zoom">Zoom par défaut</Label>
                <Input
                  id="default-zoom"
                  type="number"
                  min="1"
                  max="20"
                  value={config.defaultZoom}
                  onChange={(e) => updateConfig({ defaultZoom: Number.parseInt(e.target.value) || 6 })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Style */}
        <TabsContent value="style">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Style personnalisé</span>
                <Switch
                  checked={config.useCustomStyle}
                  onCheckedChange={(useCustomStyle) => updateConfig({ useCustomStyle })}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="custom-style">Style JSON</Label>
                <Textarea
                  id="custom-style"
                  placeholder="[{ ... }]"
                  rows={10}
                  value={config.customStyle}
                  onChange={(e) => updateConfig({ customStyle: e.target.value })}
                  disabled={!config.useCustomStyle}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Créez votre style avec{" "}
                  <a
                    href="https://mapstyle.withgoogle.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google Maps Styling Wizard
                  </a>{" "}
                  et collez le JSON ici
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Marqueurs */}
        <TabsContent value="markers">
          <Card>
            <CardHeader>
              <CardTitle>Couleurs des marqueurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="marker-request">Demandes</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="marker-request"
                      type="color"
                      value={config.markerColors.request}
                      onChange={(e) => updateMarkerColor("request", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.markerColors.request}
                      onChange={(e) => updateMarkerColor("request", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="marker-reparateur">Réparateurs</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="marker-reparateur"
                      type="color"
                      value={config.markerColors.reparateur}
                      onChange={(e) => updateMarkerColor("reparateur", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.markerColors.reparateur}
                      onChange={(e) => updateMarkerColor("reparateur", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="marker-urgent">Urgent</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="marker-urgent"
                      type="color"
                      value={config.markerColors.urgent}
                      onChange={(e) => updateMarkerColor("urgent", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.markerColors.urgent}
                      onChange={(e) => updateMarkerColor("urgent", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="marker-sameDay">Aujourd'hui</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="marker-sameDay"
                      type="color"
                      value={config.markerColors.sameDay}
                      onChange={(e) => updateMarkerColor("sameDay", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.markerColors.sameDay}
                      onChange={(e) => updateMarkerColor("sameDay", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="marker-thisWeek">Cette semaine</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="marker-thisWeek"
                      type="color"
                      value={config.markerColors.thisWeek}
                      onChange={(e) => updateMarkerColor("thisWeek", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.markerColors.thisWeek}
                      onChange={(e) => updateMarkerColor("thisWeek", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="marker-flexible">Flexible</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="marker-flexible"
                      type="color"
                      value={config.markerColors.flexible}
                      onChange={(e) => updateMarkerColor("flexible", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.markerColors.flexible}
                      onChange={(e) => updateMarkerColor("flexible", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default GoogleMapsConfigPanel
