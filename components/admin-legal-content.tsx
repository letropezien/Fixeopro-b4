"use client"

import { useState, useEffect } from "react"
import { LegalContentService, type LegalContent } from "@/lib/legal-content"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, FileText, Shield, Scale, Calendar, ExternalLink } from "lucide-react"

export default function AdminLegalContent() {
  const [legalContent, setLegalContent] = useState<LegalContent>(LegalContentService.getDefaultContent())
  const [activeTab, setActiveTab] = useState("mentions")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const content = LegalContentService.getContent()
    setLegalContent(content)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Mettre à jour les dates de modification
      const updatedContent = {
        ...legalContent,
        mentionsLegales: {
          ...legalContent.mentionsLegales,
          lastUpdated: new Date().toISOString(),
        },
        politiqueConfidentialite: {
          ...legalContent.politiqueConfidentialite,
          lastUpdated: new Date().toISOString(),
        },
        conditionsUtilisation: {
          ...legalContent.conditionsUtilisation,
          lastUpdated: new Date().toISOString(),
        },
      }

      LegalContentService.saveContent(updatedContent)
      setLegalContent(updatedContent)

      // Simuler un délai de sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setIsSaving(false)
    }
  }

  const updateContent = (section: keyof LegalContent, field: string, value: string) => {
    setLegalContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const getCharCount = (text: string) => text.length

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contenus Légaux</h2>
          <p className="text-gray-600">
            Gérez les mentions légales, politique de confidentialité et conditions d'utilisation
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentions Légales</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getCharCount(legalContent.mentionsLegales.content).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">caractères</p>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(legalContent.mentionsLegales.lastUpdated).toLocaleDateString("fr-FR")}
              </Badge>
              <Button variant="ghost" size="sm" asChild>
                <a href="/mentions-legales" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confidentialité</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getCharCount(legalContent.politiqueConfidentialite.content).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">caractères</p>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(legalContent.politiqueConfidentialite.lastUpdated).toLocaleDateString("fr-FR")}
              </Badge>
              <Button variant="ghost" size="sm" asChild>
                <a href="/confidentialite" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conditions d'utilisation</CardTitle>
            <Scale className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getCharCount(legalContent.conditionsUtilisation.content).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">caractères</p>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(legalContent.conditionsUtilisation.lastUpdated).toLocaleDateString("fr-FR")}
              </Badge>
              <Button variant="ghost" size="sm" asChild>
                <a href="/conditions" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Éditeur */}
      <Card>
        <CardHeader>
          <CardTitle>Éditeur de contenu</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mentions">Mentions Légales</TabsTrigger>
              <TabsTrigger value="confidentialite">Confidentialité</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
            </TabsList>

            <TabsContent value="mentions" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mentions-title">Titre</Label>
                <Input
                  id="mentions-title"
                  value={legalContent.mentionsLegales.title}
                  onChange={(e) => updateContent("mentionsLegales", "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mentions-content">Contenu</Label>
                  <span className="text-sm text-gray-500">
                    {getCharCount(legalContent.mentionsLegales.content).toLocaleString()} caractères
                  </span>
                </div>
                <Textarea
                  id="mentions-content"
                  value={legalContent.mentionsLegales.content}
                  onChange={(e) => updateContent("mentionsLegales", "content", e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end">
                <Button variant="outline" asChild>
                  <a href="/mentions-legales" target="_blank" rel="noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    Prévisualiser
                  </a>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="confidentialite" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confidentialite-title">Titre</Label>
                <Input
                  id="confidentialite-title"
                  value={legalContent.politiqueConfidentialite.title}
                  onChange={(e) => updateContent("politiqueConfidentialite", "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="confidentialite-content">Contenu</Label>
                  <span className="text-sm text-gray-500">
                    {getCharCount(legalContent.politiqueConfidentialite.content).toLocaleString()} caractères
                  </span>
                </div>
                <Textarea
                  id="confidentialite-content"
                  value={legalContent.politiqueConfidentialite.content}
                  onChange={(e) => updateContent("politiqueConfidentialite", "content", e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end">
                <Button variant="outline" asChild>
                  <a href="/confidentialite" target="_blank" rel="noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    Prévisualiser
                  </a>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="conditions" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="conditions-title">Titre</Label>
                <Input
                  id="conditions-title"
                  value={legalContent.conditionsUtilisation.title}
                  onChange={(e) => updateContent("conditionsUtilisation", "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="conditions-content">Contenu</Label>
                  <span className="text-sm text-gray-500">
                    {getCharCount(legalContent.conditionsUtilisation.content).toLocaleString()} caractères
                  </span>
                </div>
                <Textarea
                  id="conditions-content"
                  value={legalContent.conditionsUtilisation.content}
                  onChange={(e) => updateContent("conditionsUtilisation", "content", e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end">
                <Button variant="outline" asChild>
                  <a href="/conditions" target="_blank" rel="noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    Prévisualiser
                  </a>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
