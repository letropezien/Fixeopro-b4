"use client"

import { useState, useEffect } from "react"
import { LegalContentService } from "@/lib/legal-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function ConditionsPage() {
  const [content, setContent] = useState(LegalContentService.getDefaultContent().conditionsUtilisation)

  useEffect(() => {
    const legalContent = LegalContentService.getContent()
    setContent(legalContent.conditionsUtilisation)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">{content.title}</CardTitle>
            <div className="flex items-center justify-center text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              Dernière mise à jour : {new Date(content.lastUpdated).toLocaleDateString("fr-FR")}
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: content.content
                  .replace(/\n/g, "<br>")
                  .replace(/#{1,6}\s/g, (match) => {
                    const level = match.trim().length
                    return `<h${level} class="text-${4 - level}xl font-bold mt-8 mb-4">`
                  })
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
