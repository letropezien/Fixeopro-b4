"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Globe, Shield, Bell, Database, Mail } from "lucide-react"

interface PlatformSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  contactEmail: string
  supportPhone: string
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailVerificationRequired: boolean
  maxRequestsPerUser: number
  maxRepairersPerRequest: number
  defaultTrialDays: number
  commissionRate: number
  autoApproveRepairers: boolean
  enableGeolocation: boolean
  enableNotifications: boolean
  enableSMS: boolean
  maxFileSize: number
  allowedFileTypes: string
  backupFrequency: string
  logRetentionDays: number
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<PlatformSettings>({
    siteName: "FixeoPro",
    siteDescription: "Plateforme de mise en relation pour services de dépannage",
    siteUrl: "https://fixeopro.com",
    contactEmail: "contact@fixeopro.com",
    supportPhone: "+33 1 23 45 67 89",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxRequestsPerUser: 10,
    maxRepairersPerRequest: 5,
    defaultTrialDays: 15,
    commissionRate: 5,
    autoApproveRepairers: false,
    enableGeolocation: true,
    enableNotifications: true,
    enableSMS: false,
    maxFileSize: 5,
    allowedFileTypes: "jpg,jpeg,png,pdf",
    backupFrequency: "daily",
    logRetentionDays: 30,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simuler la sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLastSaved(new Date())
      console.log("Paramètres sauvegardés:", settings)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?")) {
      setSettings({
        siteName: "FixeoPro",
        siteDescription: "Plateforme de mise en relation pour services de dépannage",
        siteUrl: "https://fixeopro.com",
        contactEmail: "contact@fixeopro.com",
        supportPhone: "+33 1 23 45 67 89",
        maintenanceMode: false,
        registrationEnabled: true,
        emailVerificationRequired: true,
        maxRequestsPerUser: 10,
        maxRepairersPerRequest: 5,
        defaultTrialDays: 15,
        commissionRate: 5,
        autoApproveRepairers: false,
        enableGeolocation: true,
        enableNotifications: true,
        enableSMS: false,
        maxFileSize: 5,
        allowedFileTypes: "jpg,jpeg,png,pdf",
        backupFrequency: "daily",
        logRetentionDays: 30,
      })
    }
  }

  const updateSetting = (key: keyof PlatformSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Paramètres de la plateforme
          </h2>
          <p className="text-muted-foreground">Configuration générale de FixeoPro</p>
        </div>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <Badge variant="outline" className="text-green-600">
              Sauvegardé à {lastSaved.toLocaleTimeString()}
            </Badge>
          )}
          <Button onClick={handleReset} variant="outline">
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            Fonctionnalités
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            Fichiers
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            Système
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Configuration de base de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nom du site</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">URL du site</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => updateSetting("siteUrl", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting("siteDescription", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de contact</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSetting("contactEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Téléphone support</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) => updateSetting("supportPhone", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
                />
                <Label htmlFor="maintenanceMode">Mode maintenance</Label>
                {settings.maintenanceMode && <Badge variant="destructive">Site en maintenance</Badge>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>Paramètres d'inscription et de validation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="registrationEnabled"
                  checked={settings.registrationEnabled}
                  onCheckedChange={(checked) => updateSetting("registrationEnabled", checked)}
                />
                <Label htmlFor="registrationEnabled">Autoriser les inscriptions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="emailVerificationRequired"
                  checked={settings.emailVerificationRequired}
                  onCheckedChange={(checked) => updateSetting("emailVerificationRequired", checked)}
                />
                <Label htmlFor="emailVerificationRequired">Vérification email obligatoire</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoApproveRepairers"
                  checked={settings.autoApproveRepairers}
                  onCheckedChange={(checked) => updateSetting("autoApproveRepairers", checked)}
                />
                <Label htmlFor="autoApproveRepairers">Approbation automatique des réparateurs</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxRequestsPerUser">Demandes max par utilisateur</Label>
                  <Input
                    id="maxRequestsPerUser"
                    type="number"
                    value={settings.maxRequestsPerUser}
                    onChange={(e) => updateSetting("maxRequestsPerUser", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultTrialDays">Période d'essai (jours)</Label>
                  <Input
                    id="defaultTrialDays"
                    type="number"
                    value={settings.defaultTrialDays}
                    onChange={(e) => updateSetting("defaultTrialDays", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres business</CardTitle>
              <CardDescription>Configuration des règles métier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxRepairersPerRequest">Réparateurs max par demande</Label>
                  <Input
                    id="maxRepairersPerRequest"
                    type="number"
                    value={settings.maxRepairersPerRequest}
                    onChange={(e) => updateSetting("maxRepairersPerRequest", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Taux de commission (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    step="0.1"
                    value={settings.commissionRate}
                    onChange={(e) => updateSetting("commissionRate", Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités</CardTitle>
              <CardDescription>Activation/désactivation des fonctionnalités</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableGeolocation"
                  checked={settings.enableGeolocation}
                  onCheckedChange={(checked) => updateSetting("enableGeolocation", checked)}
                />
                <Label htmlFor="enableGeolocation">Géolocalisation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableNotifications"
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => updateSetting("enableNotifications", checked)}
                />
                <Label htmlFor="enableNotifications">Notifications push</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableSMS"
                  checked={settings.enableSMS}
                  onCheckedChange={(checked) => updateSetting("enableSMS", checked)}
                />
                <Label htmlFor="enableSMS">Notifications SMS</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des fichiers</CardTitle>
              <CardDescription>Configuration des uploads et stockage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Taille max fichier (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => updateSetting("maxFileSize", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowedFileTypes">Types autorisés</Label>
                  <Input
                    id="allowedFileTypes"
                    value={settings.allowedFileTypes}
                    onChange={(e) => updateSetting("allowedFileTypes", e.target.value)}
                    placeholder="jpg,png,pdf"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres système</CardTitle>
              <CardDescription>Configuration technique et maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Fréquence de sauvegarde</Label>
                  <select
                    id="backupFrequency"
                    value={settings.backupFrequency}
                    onChange={(e) => updateSetting("backupFrequency", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="hourly">Toutes les heures</option>
                    <option value="daily">Quotidienne</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuelle</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logRetentionDays">Rétention logs (jours)</Label>
                  <Input
                    id="logRetentionDays"
                    type="number"
                    value={settings.logRetentionDays}
                    onChange={(e) => updateSetting("logRetentionDays", Number.parseInt(e.target.value))}
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
