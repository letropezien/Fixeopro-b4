"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shell } from "@/components/shell"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Reparateur {
  id: string
  nom: string
  specialite: string
  adresse: string
  telephone: string
  email: string
  description: string
}

const ListeReparateursPage = () => {
  const [reparateurs, setReparateurs] = useState<Reparateur[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Fetch data from your API endpoint here
    const fetchReparateurs = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/reparateurs")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setReparateurs(data)
      } catch (error) {
        console.error("Failed to fetch reparateurs:", error)
        // Handle error appropriately (e.g., display an error message)
        setReparateurs([]) // Ensure reparateurs is an empty array in case of error
      }
    }

    fetchReparateurs()
  }, [])

  const filteredReparateurs = reparateurs.filter(
    (reparateur) =>
      reparateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reparateur.specialite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reparateur.adresse.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Shell>
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight">Liste des Réparateurs</h1>
          <p className="text-muted-foreground">Trouvez un réparateur près de chez vous.</p>
        </div>

        <div className="grid gap-4">
          <div className="relative">
            <Label htmlFor="search">Rechercher</Label>
            <Input
              type="search"
              id="search"
              placeholder="Nom, spécialité, adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReparateurs.map((reparateur) => (
            <Card key={reparateur.id}>
              <CardHeader>
                <CardTitle>{reparateur.nom}</CardTitle>
                <CardDescription>{reparateur.specialite}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Adresse: {reparateur.adresse}</p>
                <p>Téléphone: {reparateur.telephone}</p>
                <p>Email: {reparateur.email}</p>
                <p>{reparateur.description}</p>
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/profil-pro/${reparateur.id}`}>Voir le profil complet</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  )
}

export default ListeReparateursPage
