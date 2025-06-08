"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PhotoUpload from "@/components/PhotoUpload"

interface FormData {
  typeAppareil: string
  marque: string
  modele: string
  description: string
  photos: string[]
}

const DemandeReparationPage = () => {
  const [formData, setFormData] = useState<FormData>({
    typeAppareil: "",
    marque: "",
    modele: "",
    description: "",
    photos: [],
  })

  const router = useRouter()

  useEffect(() => {
    // Load data from localStorage on component mount
    const storedData = localStorage.getItem("reparationFormData")
    if (storedData) {
      setFormData(JSON.parse(storedData))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Save data to localStorage
    localStorage.setItem("reparationFormData", JSON.stringify(formData))

    // Basic form validation
    if (!formData.typeAppareil || !formData.marque || !formData.modele || !formData.description) {
      alert("Veuillez remplir tous les champs obligatoires.")
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      alert("Demande de réparation soumise avec succès!")
      router.push("/") // Redirect to home page
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Une erreur est survenue lors de la soumission de la demande.")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Demande de Réparation</h1>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="typeAppareil" className="block text-gray-700 text-sm font-bold mb-2">
            Type d'appareil:
          </label>
          <select
            id="typeAppareil"
            name="typeAppareil"
            value={formData.typeAppareil}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Sélectionner...</option>
            <option value="smartphone">Smartphone</option>
            <option value="tablette">Tablette</option>
            <option value="ordinateur">Ordinateur</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="marque" className="block text-gray-700 text-sm font-bold mb-2">
            Marque:
          </label>
          <input
            type="text"
            id="marque"
            name="marque"
            value={formData.marque}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="modele" className="block text-gray-700 text-sm font-bold mb-2">
            Modèle:
          </label>
          <input
            type="text"
            id="modele"
            name="modele"
            value={formData.modele}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description du problème:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <div>
            <PhotoUpload
              currentPhotos={formData.photos || []}
              onPhotosChange={(photos) => setFormData((prev) => ({ ...prev, photos }))}
              multiple={true}
              maxPhotos={2}
              label="Photos du problème"
              description="Ajoutez jusqu'à 2 photos pour illustrer votre problème (optionnel)"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Soumettre
          </button>
        </div>
      </form>
    </div>
  )
}

export default DemandeReparationPage
