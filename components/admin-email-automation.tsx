"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Settings, TestTube, Send, Loader2, Edit, Users, FileText, Bell, Globe } from "lucide-react"
import { emailAutomationService, type EmailSettings, type EmailEvent } from "@/lib/email-automation"
import { useToast } from "@/hooks/use-toast"

export default function AdminEmailAutomation() {
  const [settings, setSettings] = useState<EmailSettings>(emailAutomationService.loadSettings())
  const [events, setEvents] = useState<EmailEvent[]>(emailAutomationService.getAvailableEvents())
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EmailEvent | null>(null)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [testLoading, setTestLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      emailAutomationService.saveSettings(settings)
      toast({
        title: "Configuration sauvegardée",
        description: "Les paramètres d'emails automatiques ont été mis à jour.",
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

  const handleEventToggle = (eventId: string, enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      events: {
        ...prev.events,
        [eventId]: enabled,
      },
    }))
  }

  const handleGlobalSettingChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      globalSettings: {
        ...prev.globalSettings,
        [field]: value,
      },
    }))
  }

  const handleTemplateChange = (field: string, value: string) => {
    if (!selectedEvent) return

    const updatedTemplate = {
      ...selectedEvent.template,
      [field]: value,
    }

    setSelectedEvent((prev) => (prev ? { ...prev, template: updatedTemplate } : null))

    setSettings((prev) => ({
      ...prev,
      templates: {
        ...prev.templates,
        [selectedEvent.id]: updatedTemplate,
      },
    }))
  }

  const handleTestEvent = async (eventId: string) => {
    if (!testEmail) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir une adresse email pour le test.",
        variant: "destructive",
      })
      return
    }

    setTestLoading(eventId)
    try {
      const result = await emailAutomationService.testEvent(eventId, testEmail)
      if (result.success) {
        toast({
          title: "Email de test envoyé",
          description: `L'email de test pour "${events.find((e) => e.id === eventId)?.name}" a été envoyé.`,
        })
      } else {
        toast({
          title: "Échec du test",
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
      setTestLoading(null)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "user":
        return <Users className="h-4 w-4" />
      case "request":
        return <FileText className="h-4 w-4" />
      case "system":
        return <Bell className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "user":
        return "bg-blue-100 text-blue-800"
      case "request":
        return "bg-green-100 text-green-800"
      case "system":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEnabledCount = () => {
    return Object.values(settings.events).filter(Boolean).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Emails Automatiques</h2>
          <p className="text-gray-600">Configuration des emails automatiques pour les événements de la plateforme</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {getEnabledCount()} / {events.length} activés
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">
            <Mail className="h-4 w-4 mr-2" />
            Événements ({events.length})
          </TabsTrigger>
          <TabsTrigger value="global">
            <Globe className="h-4 w-4 mr-2" />
            Paramètres globaux
          </TabsTrigger>
          <TabsTrigger value="test">
            <TestTube className="h-4 w-4 mr-2" />
            Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4">
            {["user", "request", "system"].map((category) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category === "user" && "Utilisateurs"}
                    {category === "request" && "Demandes"}
                    {category === "system" && "Administration"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {events
                      .filter((event) => event.category === category)
                      .map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{event.name}</h4>
                              <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                              {settings.events[event.id] ? (
                                <Badge className="bg-green-100 text-green-800">Activé</Badge>
                              ) : (
                                <Badge variant="outline">Désactivé</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{event.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedEvent(event)
                                setShowTemplateDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Switch
                              checked={settings.events[event.id] || false}
                              onCheckedChange={(checked) => handleEventToggle(event.id, checked)}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="global" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres globaux des emails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromName">Nom expéditeur</Label>
                  <Input
                    id="fromName"
                    value={settings.globalSettings.fromName}
                    onChange={(e) => handleGlobalSettingChange("fromName", e.target.value)}
                    placeholder="FixeoPro"
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail">Email expéditeur</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.globalSettings.fromEmail}
                    onChange={(e) => handleGlobalSettingChange("fromEmail", e.target.value)}
                    placeholder="contact@fixeo.pro"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="replyTo">Email de réponse</Label>
                <Input
                  id="replyTo"
                  type="email"
                  value={settings.globalSettings.replyTo}
                  onChange={(e) => handleGlobalSettingChange("replyTo", e.target.value)}
                  placeholder="contact@fixeo.pro"
                />
              </div>

              <div>
                <Label htmlFor="footerText">Texte de pied de page</Label>
                <Textarea
                  id="footerText"
                  value={settings.globalSettings.footerText}
                  onChange={(e) => handleGlobalSettingChange("footerText", e.target.value)}
                  placeholder="FixeoPro - Plateforme de mise en relation pour réparations"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unsubscribeUrl">URL de désabonnement</Label>
                  <Input
                    id="unsubscribeUrl"
                    value={settings.globalSettings.unsubscribeUrl}
                    onChange={(e) => handleGlobalSettingChange("unsubscribeUrl", e.target.value)}
                    placeholder="{{platformUrl}}/unsubscribe"
                  />
                </div>
                <div>
                  <Label htmlFor="logoUrl">URL du logo</Label>
                  <Input
                    id="logoUrl"
                    value={settings.globalSettings.logoUrl}
                    onChange={(e) => handleGlobalSettingChange("logoUrl", e.target.value)}
                    placeholder="{{platformUrl}}/logo.png"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tester les emails automatiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testEmail">Adresse email de test</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="votre-email@example.com"
                />
              </div>

              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{event.name}</h4>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {settings.events[event.id] ? (
                        <Badge className="bg-green-100 text-green-800">Activé</Badge>
                      ) : (
                        <Badge variant="outline">Désactivé</Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestEvent(event.id)}
                        disabled={testLoading === event.id || !testEmail}
                      >
                        {testLoading === event.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        Tester
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Settings className="h-4 w-4 mr-2" />}
          Sauvegarder la configuration
        </Button>
      </div>

      {/* Dialog pour éditer un template */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Éditer le template : {selectedEvent?.name}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="subject">Sujet de l'email</Label>
                <Input
                  id="subject"
                  value={selectedEvent.template.subject}
                  onChange={(e) => handleTemplateChange("subject", e.target.value)}
                  placeholder="Sujet de l'email..."
                />
              </div>

              <div>
                <Label htmlFor="htmlContent">Contenu HTML</Label>
                <Textarea
                  id="htmlContent"
                  value={selectedEvent.template.htmlContent}
                  onChange={(e) => handleTemplateChange("htmlContent", e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="textContent">Contenu texte (fallback)</Label>
                <Textarea
                  id="textContent"
                  value={selectedEvent.template.textContent}
                  onChange={(e) => handleTemplateChange("textContent", e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label>Variables disponibles</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {selectedEvent.variables.map((variable) => (
                    <div key={variable.key} className="p-2 bg-gray-50 rounded text-sm">
                      <code className="font-mono text-blue-600">{"{{" + variable.key + "}}"}</code>
                      <p className="text-gray-600 text-xs mt-1">{variable.description}</p>
                      <p className="text-gray-500 text-xs">Ex: {variable.example}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={() => {
                    handleSaveSettings()
                    setShowTemplateDialog(false)
                  }}
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
