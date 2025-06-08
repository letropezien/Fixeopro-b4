"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export interface PricingPlanProps {
  name: string
  price: number
  originalPrice?: number
  period: string
  description: string
  features: string[]
  popular?: boolean
  onSelect: () => void
  loading?: boolean
}

export function PricingPlan({
  name,
  price,
  originalPrice,
  period,
  description,
  features,
  popular = false,
  onSelect,
  loading = false,
}: PricingPlanProps) {
  return (
    <Card className={`relative ${popular ? "border-blue-500 shadow-lg" : ""}`}>
      {popular && <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">Populaire</Badge>}

      <CardHeader className="text-center">
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>

        <div className="mt-4">
          <div className="flex items-center justify-center gap-2">
            {originalPrice && originalPrice > price && (
              <span className="text-lg text-gray-400 line-through">{originalPrice}€</span>
            )}
            <span className="text-3xl font-bold">{price}€</span>
          </div>
          <span className="text-sm text-gray-600">/{period}</span>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={onSelect} disabled={loading} variant={popular ? "default" : "outline"}>
          {loading ? "Chargement..." : "Choisir ce plan"}
        </Button>
      </CardFooter>
    </Card>
  )
}
