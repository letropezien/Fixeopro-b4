"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Phone,
  MapPin,
  Clock,
  Globe,
  Save,
  RotateCcw,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react"
import { SiteSettingsService, type SiteSettings } from "@/lib/site-settings"

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(SiteSettingsService.getDefaultSettings())
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>("")

  useEffect(() => {
    const loadedSettings = SiteSettingsService.getSettings()
    setSettings(loadedSettings)
    setLastSaved(loadedSettings.lastUpdated)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulation
      SiteSettingsService.saveSettings(settings)
      setLastSaved(new Date().toISOString())
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?")) {
      const defaultSettings = SiteSettingsService.resetToDefaults()
      setSettings(defaultSettings)
      setLastSaved(defaultSettings.lastUpdated)
    }
  }

  const updateSetting = (key: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const updateNestedSetting = (parent: keyof SiteSettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] as any), [key]: value },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Paramètres du site</h2>
          <p className="text-gray-600">Configuration des informations affichées sur le site</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Statut */}
      {lastSaved && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">
                Dernière sauvegarde : {new Date(lastSaved).toLocaleString("fr-FR")}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Building2 className="h-4 w-4 mr-2" />
            Général
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="address">
            <MapPin className="h-4 w-4 mr-2" />
            Adresse
          </TabsTrigger>
          <TabsTrigger value="hours">
            <Clock className="h-4 w-4 mr-2" />
            Horaires
          </TabsTrigger>
          <TabsTrigger value="social">
            <Globe className="h-4 w-4 mr-2" />
            Réseaux
          </TabsTrigger>
        </TabsList>

        {/* Onglet Général */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Informations générales</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Nom du site</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting("siteName", e.target.value)}
                    placeholder="FixeoPro"
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">URL du site</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => updateSetting("siteUrl", e.target.value)}
                    placeholder="https://fixeopro.fr"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => updateSetting("description", e.target.value)}
                  placeholder="Description du site..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
                  />
                  <Label>Mode maintenance</Label>
                  {settings.maintenanceMode && <Badge variant="destructive">Actif</Badge>}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.allowRegistrations}
                    onCheckedChange={(checked) => updateSetting("allowRegistrations", checked)}
                  />
                  <Label>Autoriser les inscriptions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.emailVerificationRequired}
                    onCheckedChange={(checked) => updateSetting("emailVerificationRequired", checked)}
                  />
                  <Label>Vérification email obligatoire</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Contact */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Informations de contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contactEmail">Email de contact</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => updateSetting("contactEmail", e.target.value)}
                  placeholder="contact@fixeopro.fr"
                />
                <p className="text-sm text-gray-500 mt-1">Affiché dans la page contact et le footer</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPhone">Téléphone contact</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => updateSetting("contactPhone", e.target.value)}
                    placeholder="01 23 45 67 89"
                  />
                  <p className="text-sm text-gray-500 mt-1">Numéro principal affiché publiquement</p>
                </div>
                <div>
                  <Label htmlFor="supportPhone">Support technique</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) => updateSetting("supportPhone", e.target.value)}
                    placeholder="01 23 45 67 90"
                  />
                  <p className="text-sm text-gray-500 mt-1">Numéro dédié au support technique</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Adresse */}
        <TabsContent value="address">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Adresse du siège social</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => updateSetting("companyName", e.target.value)}
                  placeholder="FixeoPro SAS"
                />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => updateSetting("address", e.target.value)}
                  placeholder="123 Rue de la Réparation"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={settings.city}
                    onChange={(e) => updateSetting("city", e.target.value)}
                    placeholder="Paris"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={settings.postalCode}
                    onChange={(e) => updateSetting("postalCode", e.target.value)}
                    placeholder="75001"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    value={settings.country}
                    onChange={(e) => updateSetting("country", e.target.value)}
                    placeholder="France"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Horaires */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Horaires d'ouverture</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.openingHours).map(([day, hours]) => (
                <div key={day} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <Label className="capitalize">
                    {day === "monday" && "Lundi"}
                    {day === "tuesday" && "Mardi"}
                    {day === "wednesday" && "Mercredi"}
                    {day === "thursday" && "Jeudi"}
                    {day === "friday" && "Vendredi"}
                    {day === "saturday" && "Samedi"}
                    {day === "sunday" && "Dimanche"}
                  </Label>
                  <Input
                    value={hours}
                    onChange={(e) => updateNestedSetting("openingHours", day, e.target.value)}
                    placeholder="8h-20h"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Réseaux sociaux */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Réseaux sociaux</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook" className="flex items-center space-x-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    <span>Facebook</span>
                  </Label>
                  <Input
                    id="facebook"
                    value={settings.socialMedia.facebook || ""}
                    onChange={(e) => updateNestedSetting("socialMedia", "facebook", e.target.value)}
                    placeholder="https://facebook.com/fixeopro"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter" className="flex items-center space-x-2">
                    <Twitter className="h-4 w-4 text-blue-400" />
                    <span>Twitter</span>
                  </Label>
                  <Input
                    id="twitter"
                    value={settings.socialMedia.twitter || ""}
                    onChange={(e) => updateNestedSetting("socialMedia", "twitter", e.target.value)}
                    placeholder="https://twitter.com/fixeopro"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram" className="flex items-center space-x-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    <span>Instagram</span>
                  </Label>
                  <Input
                    id="instagram"
                    value={settings.socialMedia.instagram || ""}
                    onChange={(e) => updateNestedSetting("socialMedia", "instagram", e.target.value)}
                    placeholder="https://instagram.com/fixeopro"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin" className="flex items-center space-x-2">
                    <Linkedin className="h-4 w-4 text-blue-700" />
                    <span>LinkedIn</span>
                  </Label>
                  <Input
                    id="linkedin"
                    value={settings.socialMedia.linkedin || ""}
                    onChange={(e) => updateNestedSetting("socialMedia", "linkedin", e.target.value)}
                    placeholder="https://linkedin.com/company/fixeopro"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
