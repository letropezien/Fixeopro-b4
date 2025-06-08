"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    userType: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormState({
      ...formState,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validation
    if (!formState.name || !formState.email || !formState.subject || !formState.message) {
      setError("Veuillez remplir tous les champs obligatoires.")
      setIsSubmitting(false)
      return
    }

    // Simuler l'envoi du formulaire
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      // Réinitialiser le formulaire
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
        userType: "",
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une question, une suggestion ou besoin d'aide ? Notre équipe est à votre disposition pour vous répondre dans
            les plus brefs délais.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Formulaire de contact */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Envoyez-nous un message</CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24 heures ouvrées.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Message envoyé avec succès !</h3>
                  <p className="text-gray-600 mb-4">
                    Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)}>Envoyer un autre message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Votre nom"
                        value={formState.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formState.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userType">Vous êtes</Label>
                    <Select value={formState.userType} onValueChange={(value) => handleSelectChange("userType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Un client</SelectItem>
                        <SelectItem value="reparateur">Un réparateur</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Sujet de votre message"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Votre message"
                      rows={6}
                      value={formState.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nos coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">contact@fixeopro.fr</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Téléphone</h3>
                    <p className="text-gray-600">01 23 45 67 89</p>
                    <p className="text-sm text-gray-500">Du lundi au vendredi, 9h-18h</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Adresse</h3>
                    <p className="text-gray-600">
                      123 Avenue de la Réparation
                      <br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horaires d'assistance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span className="font-medium">9h - 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span className="font-medium">10h - 16h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="font-medium">Fermé</span>
                  </div>
                  <div className="pt-2 text-sm text-gray-600">
                    Les demandes envoyées en dehors des heures d'ouverture seront traitées le jour ouvré suivant.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assistance rapide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Consultez notre section FAQ pour trouver rapidement des réponses aux questions les plus fréquentes.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="/comment-ca-marche#faq">Consulter la FAQ</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Carte */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Notre localisation</h2>
          <div className="bg-gray-200 rounded-lg h-80 overflow-hidden">
            {/* Simuler une carte */}
            <div className="h-full w-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium">FixeoPro</p>
                <p className="text-sm text-gray-600">123 Avenue de la Réparation, 75001 Paris</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Quel est le délai de réponse ?</h3>
              <p className="text-gray-600 mb-6">
                Nous nous engageons à répondre à toutes les demandes dans un délai de 24 heures ouvrées. Pour les
                questions urgentes, nous vous recommandons de nous contacter par téléphone.
              </p>

              <h3 className="text-lg font-semibold mb-2">Comment suivre ma demande ?</h3>
              <p className="text-gray-600 mb-6">
                Après l'envoi de votre message, vous recevrez un email de confirmation avec un numéro de référence. Vous
                pourrez utiliser ce numéro pour suivre l'état de votre demande.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Puis-je modifier ma demande après l'envoi ?</h3>
              <p className="text-gray-600 mb-6">
                Oui, vous pouvez nous envoyer un email avec votre numéro de référence pour ajouter des informations ou
                modifier votre demande initiale.
              </p>

              <h3 className="text-lg font-semibold mb-2">Comment devenir partenaire ?</h3>
              <p className="text-gray-600 mb-6">
                Si vous souhaitez devenir partenaire de FixeoPro, veuillez nous contacter via ce formulaire en
                sélectionnant "Partenariat" comme sujet. Notre équipe commerciale vous recontactera rapidement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
