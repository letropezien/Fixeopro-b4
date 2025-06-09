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
  Mail,
  AlertCircle,
} from "lucide-react"
import { SiteSettingsService, type SiteSettings } from "@/lib/site-settings"

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(SiteSettingsService.getDefaultSettings())
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>("")
  const [hasChanges, setHasChanges] = useState(false)

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
      setHasChanges(false)

      // Déclencher un événement pour notifier les autres composants
      window.dispatchEvent(new CustomEvent("siteSettingsUpdated"))
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
      setHasChanges(true)
    }
  }

  const updateSetting = (key: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const updateNestedSetting = (parent: keyof SiteSettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] as any), [key]: value },
    }))
    setHasChanges(true)
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Paramètres du site</h2>
          <p className="text-gray-600">Configuration des informations affichées sur le site et la page contact</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Alertes */}
      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span className="text-orange-800">Vous avez des modifications non sauvegardées</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statut */}
      {lastSaved && !hasChanges && (
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

      <Tabs defaultValue="contact" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="general">
            <Building2 className="h-4 w-4 mr-2" />
            Général
          </TabsTrigger>
        </TabsList>

        {/* Onglet Contact */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Informations de contact</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Ces informations seront affichées sur la page contact et dans le footer
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contactEmail" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email de contact principal</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSetting("contactEmail", e.target.value)}
                    placeholder="contact@fixeopro.fr"
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">Affiché publiquement sur le site</p>
                </div>
                <div>
                  <Label htmlFor="contactPhone" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Téléphone principal</span>
                  </Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => updateSetting("contactPhone", e.target.value)}
                    placeholder="01 23 45 67 89"
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">Numéro principal affiché publiquement</p>
                </div>
              </div>

              <div>
                <Label htmlFor="supportPhone" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Support technique</span>
                </Label>
                <Input
                  id="supportPhone"
                  value={settings.supportPhone}
                  onChange={(e) => updateSetting("supportPhone", e.target.value)}
                  placeholder="01 23 45 67 90"
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">Numéro dédié au support technique pour les réparateurs</p>
              </div>

              {/* Aperçu */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Aperçu sur la page contact :</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>{settings.contactEmail || "contact@fixeopro.fr"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span>{settings.contactPhone || "01 23 45 67 89"}</span>
                  </div>
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
              <p className="text-sm text-gray-600">
                Adresse officielle affichée sur la page contact et dans les mentions légales
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => updateSetting("companyName", e.target.value)}
                  placeholder="FixeoPro SAS"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="address">Adresse complète</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => updateSetting("address", e.target.value)}
                  placeholder="123 Rue de la Réparation"
                  className="mt-2"
                  rows={2}
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
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={settings.postalCode}
                    onChange={(e) => updateSetting("postalCode", e.target.value)}
                    placeholder="75001"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    value={settings.country}
                    onChange={(e) => updateSetting("country", e.target.value)}
                    placeholder="France"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Aperçu */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Aperçu de l'adresse :</h4>
                <div className="text-sm text-gray-700">
                  <p className="font-medium">{settings.companyName || "FixeoPro SAS"}</p>
                  <p>{settings.address || "123 Rue de la Réparation"}</p>
                  <p>
                    {settings.postalCode || "75001"} {settings.city || "Paris"}, {settings.country || "France"}
                  </p>
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
              <p className="text-sm text-gray-600">Horaires affichés sur la page contact et dans le footer</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.openingHours).map(([day, hours]) => (
                <div key={day} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <Label className="capitalize font-medium">
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
                    placeholder="8h-20h ou Fermé"
                  />
                </div>
              ))}

              {/* Aperçu */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Aperçu des horaires :</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(settings.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize font-medium">
                        {day === "monday" && "Lundi"}
                        {day === "tuesday" && "Mardi"}
                        {day === "wednesday" && "Mercredi"}
                        {day === "thursday" && "Jeudi"}
                        {day === "friday" && "Vendredi"}
                        {day === "saturday" && "Samedi"}
                        {day === "sunday" && "Dimanche"}
                      </span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
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
              <p className="text-sm text-gray-600">Liens vers vos réseaux sociaux (affichés dans le footer)</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="mt-2"
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
                    className="mt-2"
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
                    className="mt-2"
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
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">URL du site</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => updateSetting("siteUrl", e.target.value)}
                    placeholder="https://fixeopro.fr"
                    className="mt-2"
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
                  className="mt-2"
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
      </Tabs>
    </div>
  )
}
