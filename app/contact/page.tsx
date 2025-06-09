"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Headphones,
  Shield,
  Star,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Users,
  Wrench,
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    priority: "",
    message: "",
    userType: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler l'envoi
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsSubmitting(false)
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      category: "",
      priority: "",
      message: "",
      userType: "",
    })
  }

  const contactMethods = [
    {
      icon: Phone,
      title: "Téléphone",
      value: "01 23 45 67 89",
      description: "Lun-Ven: 8h-20h, Sam: 9h-17h",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Mail,
      title: "Email",
      value: "contact@fixeopro.com",
      description: "Réponse sous 2h en moyenne",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: MessageSquare,
      title: "Chat en direct",
      value: "Assistance immédiate",
      description: "Disponible 7j/7 de 8h à 22h",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Headphones,
      title: "Support technique",
      value: "01 23 45 67 90",
      description: "Pour les réparateurs partenaires",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const faqItems = [
    {
      question: "Comment fonctionne Fixeo.pro ?",
      answer:
        "Décrivez votre problème, recevez des devis gratuits de réparateurs qualifiés, choisissez le meilleur et planifiez l'intervention.",
    },
    {
      question: "Les réparateurs sont-ils vérifiés ?",
      answer:
        "Oui, tous nos partenaires sont contrôlés, certifiés et disposent d'une assurance responsabilité civile professionnelle.",
    },
    {
      question: "Y a-t-il des frais cachés ?",
      answer:
        "Non, notre service est 100% gratuit pour les particuliers. Vous ne payez que le réparateur selon le devis accepté.",
    },
    {
      question: "Que faire en cas de problème ?",
      answer:
        "Contactez notre service client immédiatement. Nous médions et garantissons la satisfaction de nos utilisateurs.",
    },
    {
      question: "Comment devenir réparateur partenaire ?",
      answer:
        "Inscrivez-vous en ligne, fournissez vos certifications, passez notre processus de vérification et commencez à recevoir des demandes.",
    },
  ]

  const stats = [
    { number: "< 2h", label: "Temps de réponse moyen", icon: Clock },
    { number: "98%", label: "Taux de satisfaction", icon: Star },
    { number: "24/7", label: "Support disponible", icon: Headphones },
    { number: "15000+", label: "Problèmes résolus", icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Nous sommes là pour <span className="text-blue-600">vous aider</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Une question ? Un problème ? Notre équipe d'experts est disponible pour vous accompagner dans toutes vos
            démarches
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Réponse rapide</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Support expert</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span>Service de qualité</span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Méthodes de contact */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contactez-nous</h2>
            <p className="text-lg text-gray-600">Choisissez le moyen de contact qui vous convient le mieux</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 rounded-full ${method.bgColor} flex items-center justify-center mx-auto mb-4`}
                  >
                    <method.icon className={`h-8 w-8 ${method.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="font-medium text-gray-900 mb-1">{method.value}</p>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                <p className="text-gray-600">Remplissez le formulaire ci-dessous et nous vous répondrons rapidement</p>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Message envoyé avec succès !</h3>
                    <p className="text-gray-600 mb-6">
                      Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
                    </p>
                    <Badge className="bg-green-100 text-green-800">
                      <Clock className="h-4 w-4 mr-1" />
                      Réponse attendue sous 2h
                    </Badge>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Type d'utilisateur */}
                    <div>
                      <Label htmlFor="userType">Je suis *</Label>
                      <Select
                        value={formData.userType}
                        onValueChange={(value) => setFormData({ ...formData, userType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre profil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="particulier">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>Particulier</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="reparateur">
                            <div className="flex items-center space-x-2">
                              <Wrench className="h-4 w-4" />
                              <span>Réparateur</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="entreprise">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4" />
                              <span>Entreprise</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="Votre nom et prénom"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="01 23 45 67 89"
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priorité</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) => setFormData({ ...formData, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Niveau de priorité" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="faible">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span>Faible</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="normale">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span>Normale</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="urgente">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span>Urgente</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Catégorie</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Type de demande" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technique">Support technique</SelectItem>
                            <SelectItem value="compte">Gestion de compte</SelectItem>
                            <SelectItem value="facturation">Facturation</SelectItem>
                            <SelectItem value="partenariat">Devenir partenaire</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subject">Sujet *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          placeholder="Résumé de votre demande"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        placeholder="Décrivez votre demande en détail..."
                      />
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Temps de réponse estimé :</p>
                        <p>• Demandes urgentes : 30 minutes</p>
                        <p>• Demandes normales : 2 heures</p>
                        <p>• Demandes générales : 24 heures</p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Envoi en cours...</span>
                        </div>
                      ) : (
                        "Envoyer le message"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec informations */}
          <div className="space-y-6">
            {/* Informations de contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Nos bureaux</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">Siège social</p>
                  <p className="text-gray-600">
                    123 Rue de la Réparation
                    <br />
                    75001 Paris, France
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Horaires d'ouverture</p>
                  <div className="text-gray-600 text-sm space-y-1">
                    <p>Lundi - Vendredi : 8h - 20h</p>
                    <p>Samedi : 9h - 17h</p>
                    <p>Dimanche : Support en ligne uniquement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5" />
                  <span>Questions fréquentes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <p className="font-medium text-gray-900 text-sm mb-1">{item.question}</p>
                      <p className="text-gray-600 text-sm">{item.answer}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full text-sm">
                    Voir toutes les FAQ
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Support d'urgence */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <span>Support d'urgence</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 text-sm mb-4">
                  Pour les urgences techniques ou les problèmes critiques, contactez-nous immédiatement :
                </p>
                <div className="space-y-2">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler maintenant
                  </Button>
                  <Button variant="outline" className="w-full border-red-600 text-red-600 text-sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat d'urgence
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Section CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Besoin d'aide pour commencer ?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Notre équipe est là pour vous accompagner dans vos premiers pas sur Fixeo.pro
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Users className="h-5 w-5 mr-2" />
              Guide utilisateur
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              <Wrench className="h-5 w-5 mr-2" />
              Guide réparateur
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
