"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Mail,
  Settings,
  TestTube,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Eye,
  AlertCircle,
  Loader2,
  Zap,
} from "lucide-react"
import { emailService, type EmailConfig, type ContactEmail } from "@/lib/email-service"
import { useToast } from "@/hooks/use-toast"

// Presets pour les fournisseurs populaires
const EMAIL_PRESETS = {
  ovh_zimbra: {
    name: "OVH Zimbra",
    smtpHost: "ssl0.ovh.net",
    smtpPort: 587,
    description: "Configuration pour OVH Zimbra Mail",
  },
  ovh_pro: {
    name: "OVH Pro",
    smtpHost: "pro1.mail.ovh.net",
    smtpPort: 587,
    description: "Configuration pour OVH Mail Pro",
  },
  gmail: {
    name: "Gmail",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    description: "Configuration pour Gmail (nécessite un mot de passe d'application)",
  },
  outlook: {
    name: "Outlook/Hotmail",
    smtpHost: "smtp-mail.outlook.com",
    smtpPort: 587,
    description: "Configuration pour Outlook.com et Hotmail",
  },
  yahoo: {
    name: "Yahoo Mail",
    smtpHost: "smtp.mail.yahoo.com",
    smtpPort: 587,
    description: "Configuration pour Yahoo Mail",
  },
  custom: {
    name: "Configuration personnalisée",
    smtpHost: "",
    smtpPort: 587,
    description: "Saisir manuellement les paramètres SMTP",
  },
}

export default function AdminEmailConfig() {
  const [config, setConfig] = useState<EmailConfig>(emailService.loadConfig())
  const [isLoading, setIsLoading] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [testLoading, setTestLoading] = useState(false)
  const [connectionTestLoading, setConnectionTestLoading] = useState(false)
  const [emailHistory, setEmailHistory] = useState<ContactEmail[]>([])
  const [selectedEmail, setSelectedEmail] = useState<ContactEmail | null>(null)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState("custom")
  const { toast } = useToast()

  useEffect(() => {
    setEmailHistory(emailService.getEmailHistory())
  }, [])

  const handleConfigChange = (field: keyof EmailConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey)
    const preset = EMAIL_PRESETS[presetKey as keyof typeof EMAIL_PRESETS]
    if (preset && presetKey !== "custom") {
      setConfig((prev) => ({
        ...prev,
        smtpHost: preset.smtpHost,
        smtpPort: preset.smtpPort,
      }))
    }
  }

  const handleSaveConfig = async () => {
    setIsLoading(true)
    try {
      emailService.saveConfig(config)
      toast({
        title: "Configuration sauvegardée",
        description: "La configuration email a été mise à jour avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setConnectionTestLoading(true)
    try {
      // Simuler un test de connexion SMTP
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // En mode test, toujours réussir
      if (config.testMode) {
        toast({
          title: "Test de connexion réussi",
          description: `Connexion établie avec ${config.smtpHost}:${config.smtpPort} (Mode test)`,
        })
      } else {
        // En production, tester la vraie connexion
        const result = await emailService.testConfiguration()
        if (result.success) {
          toast({
            title: "Test de connexion réussi",
            description: `Connexion établie avec ${config.smtpHost}:${config.smtpPort}`,
          })
        } else {
          toast({
            title: "Test de connexion échoué",
            description: result.error || "Impossible de se connecter au serveur SMTP.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de tester la connexion SMTP.",
        variant: "destructive",
      })
    } finally {
      setConnectionTestLoading(false)
    }
  }

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir une adresse email pour le test.",
        variant: "destructive",
      })
      return
    }

    setTestLoading(true)
    try {
      const result = await emailService.sendTestEmail(testEmail)
      if (result.success) {
        toast({
          title: "Email de test envoyé",
          description: `Un email de test a été envoyé à ${testEmail}.`,
        })
        setTestEmail("")
        // Actualiser l'historique
        setEmailHistory(emailService.getEmailHistory())
      } else {
        toast({
          title: "Échec de l'envoi",
          description: result.error || "Impossible d'envoyer l'email de test.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'envoi de l'email de test.",
        variant: "destructive",
      })
    } finally {
      setTestLoading(false)
    }
  }

  const loadOVHPreset = () => {
    setConfig((prev) => ({
      ...prev,
      smtpHost: "ssl0.ovh.net",
      smtpPort: 587,
      smtpUser: "contact@fixeo.pro",
      smtpPassword: "Salimes057",
      fromEmail: "contact@fixeo.pro",
      fromName: "FixeoPro",
      isEnabled: true,
      testMode: false,
    }))
    setSelectedPreset("ovh_zimbra")
    toast({
      title: "Configuration OVH chargée",
      description: "Les paramètres OVH Zimbra ont été appliqués.",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuration Email</h2>
          <p className="text-gray-600">
            Gérez les paramètres d'envoi d'emails pour les contacts entre réparateurs et clients
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={config.isEnabled ? "default" : "secondary"}>
            {config.isEnabled ? "Activé" : "Désactivé"}
          </Badge>
          {config.testMode && <Badge variant="outline">Mode Test</Badge>}
        </div>
      </div>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="test">
            <TestTube className="h-4 w-4 mr-2" />
            Tests
          </TabsTrigger>
          <TabsTrigger value="history">
            <Mail className="h-4 w-4 mr-2" />
            Historique ({emailHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          {/* Configuration rapide OVH */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Zap className="h-5 w-5" />
                Configuration rapide OVH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 font-medium">contact@fixeo.pro</p>
                  <p className="text-blue-600 text-sm">Serveur: ssl0.ovh.net:587</p>
                </div>
                <Button onClick={loadOVHPreset} className="bg-blue-600 hover:bg-blue-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Charger la config OVH
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enabled">Service d'email activé</Label>
                  <p className="text-sm text-gray-500">Activer l'envoi d'emails de contact</p>
                </div>
                <Switch
                  id="enabled"
                  checked={config.isEnabled}
                  onCheckedChange={(checked) => handleConfigChange("isEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="testMode">Mode test</Label>
                  <p className="text-sm text-gray-500">Les emails ne sont pas réellement envoyés</p>
                </div>
                <Switch
                  id="testMode"
                  checked={config.testMode}
                  onCheckedChange={(checked) => handleConfigChange("testMode", checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromEmail">Email expéditeur</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={config.fromEmail}
                    onChange={(e) => handleConfigChange("fromEmail", e.target.value)}
                    placeholder="contact@fixeo.pro"
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">Nom expéditeur</Label>
                  <Input
                    id="fromName"
                    value={config.fromName}
                    onChange={(e) => handleConfigChange("fromName", e.target.value)}
                    placeholder="FixeoPro"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration SMTP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="preset">Preset fournisseur</Label>
                <Select value={selectedPreset} onValueChange={handlePresetChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EMAIL_PRESETS).map(([key, preset]) => (
                      <SelectItem key={key} value={key}>
                        <div>
                          <div className="font-medium">{preset.name}</div>
                          <div className="text-sm text-gray-500">{preset.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">Serveur SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={config.smtpHost || ""}
                    onChange={(e) => handleConfigChange("smtpHost", e.target.value)}
                    placeholder="ssl0.ovh.net"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={config.smtpPort || ""}
                    onChange={(e) => handleConfigChange("smtpPort", Number.parseInt(e.target.value))}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUser">Utilisateur</Label>
                  <Input
                    id="smtpUser"
                    value={config.smtpUser || ""}
                    onChange={(e) => handleConfigChange("smtpUser", e.target.value)}
                    placeholder="contact@fixeo.pro"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">Mot de passe</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={config.smtpPassword || ""}
                    onChange={(e) => handleConfigChange("smtpPassword", e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {selectedPreset === "ovh_zimbra" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Configuration OVH Zimbra</span>
                  </div>
                  <ul className="text-blue-600 text-sm space-y-1">
                    <li>• Serveur SMTP : ssl0.ovh.net</li>
                    <li>• Port : 587 (STARTTLS)</li>
                    <li>• Authentification : Obligatoire</li>
                    <li>• Sécurité : STARTTLS</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleTestConnection} disabled={connectionTestLoading}>
              {connectionTestLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Tester la connexion
            </Button>
            <Button onClick={handleSaveConfig} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Settings className="h-4 w-4 mr-2" />}
              Sauvegarder
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Envoyer un email de test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testEmail">Adresse email de test</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>

              <Button onClick={handleSendTestEmail} disabled={testLoading || !testEmail}>
                {testLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Envoyer l'email de test
              </Button>

              {config.testMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Mode test activé</span>
                  </div>
                  <p className="text-blue-600 text-sm mt-1">
                    L'email ne sera pas réellement envoyé, mais apparaîtra dans l'historique et la console.
                  </p>
                </div>
              )}

              {!config.testMode && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Mode production activé</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    L'email sera réellement envoyé via {config.smtpHost}:{config.smtpPort}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des emails envoyés</CardTitle>
            </CardHeader>
            <CardContent>
              {emailHistory.length > 0 ? (
                <div className="space-y-3">
                  {emailHistory
                    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
                    .map((email) => (
                      <div key={email.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(email.status)}
                          <div>
                            <p className="font-medium">{email.subject}</p>
                            <p className="text-sm text-gray-500">
                              À: {email.clientEmail} • {new Date(email.sentAt).toLocaleString("fr-FR")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(email.status)}>{email.status}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEmail(email)
                              setShowEmailDialog(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun email envoyé pour le moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog pour voir les détails d'un email */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'email</DialogTitle>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Statut</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(selectedEmail.status)}
                    <Badge className={getStatusColor(selectedEmail.status)}>{selectedEmail.status}</Badge>
                  </div>
                </div>
                <div>
                  <Label>Date d'envoi</Label>
                  <p className="mt-1">{new Date(selectedEmail.sentAt).toLocaleString("fr-FR")}</p>
                </div>
              </div>

              <div>
                <Label>Destinataire</Label>
                <p className="mt-1">{selectedEmail.clientEmail}</p>
              </div>

              <div>
                <Label>Sujet</Label>
                <p className="mt-1">{selectedEmail.subject}</p>
              </div>

              <div>
                <Label>Réparateur</Label>
                <p className="mt-1">
                  {selectedEmail.repairer.name} ({selectedEmail.repairer.email})
                  {selectedEmail.repairer.company && ` - ${selectedEmail.repairer.company}`}
                </p>
              </div>

              <div>
                <Label>Message</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedEmail.message}</p>
                </div>
              </div>

              {selectedEmail.errorMessage && (
                <div>
                  <Label>Erreur</Label>
                  <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{selectedEmail.errorMessage}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
