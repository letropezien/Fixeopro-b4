"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Wrench, UserPlus } from "lucide-react"

export default function QuickActionWidget() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 shadow-lg border-2 border-blue-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Besoin d'aide ?</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <Link href="/demande-reparation" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
                <Wrench className="mr-2 h-4 w-4" />
                Demander une réparation
              </Button>
            </Link>

            <Link href="/devenir-reparateur" className="block">
              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50 justify-start"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Devenir réparateur
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">Réponse rapide garantie</p>
        </CardContent>
      </Card>
    </div>
  )
}
