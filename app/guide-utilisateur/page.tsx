"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Search,
  MapPin,
  MessageCircle,
  CreditCard,
  Star,
  CheckCircle,
  Clock,
  Shield,
  Phone,
  ArrowRight,
  Users,
  Camera,
  FileText,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"

export default function GuideUtilisateurPage() {
  const steps = [
    {
      icon: Search,
      title: "1. Décrivez votre problème",
      description: "Sélectionnez la catégorie de réparation et décrivez précisément votre problème",
      details: [
        "Choisissez parmi nos nombreuses catégories (électroménager, informatique, plomberie...)",
        "Décrivez votre problème en détail",
        "Ajoutez des photos si possible",
        "Indiquez votre budget approximatif",
      ],
    },
    {
      icon: MapPin,
      title: "2. Localisez votre demande",
      description: "Indiquez votre adresse pour trouver des réparateurs près de chez vous",
      details: [
        "Saisissez votre adresse complète",
        "Ou utilisez la géolocalisation automatique",
        "Définissez un rayon de recherche",
        "Consultez la carte des réparateurs disponibles",
      ],
    },
    {
      icon: Users,
      title: "3. Recevez des devis",
      description: "Les réparateurs qualifiés vous contactent avec leurs propositions",
      details: [
        "Recevez plusieurs devis gratuits",
        "Comparez les prix et les délais",
        "Consultez les avis et notes des réparateurs",
        "Vérifiez leurs certifications et assurances",
      ],
    },
    {
      icon: MessageCircle,
      title: "4. Choisissez votre réparateur",
      description: "Échangez avec les professionnels et sélectionnez le meilleur",
      details: [
        "Posez toutes vos questions",
        "Négociez les détails de l'intervention",
        "Vérifiez la disponibilité",
        "Confirmez le rendez-vous",
      ],
    },
    {
      icon: CheckCircle,
      title: "5. Intervention et paiement",
      description: "Le réparateur intervient et vous payez en toute sécurité",
      details: [
        "Le réparateur se déplace chez vous",
        "Intervention selon les modalités convenues",
        "Paiement sécurisé via la plateforme",
        "Garantie sur les réparations effectuées",
      ],
    },
    {
      icon: Star,
      title: "6. Évaluez le service",
      description: "Laissez un avis pour aider la communauté",
      details: [
        "Notez la qualité du service",
        "Rédigez un commentaire détaillé",
        "Aidez les autres utilisateurs",
        "Contribuez à l'amélioration de la plateforme",
      ],
    },
  ]

  const advantages = [
    {
      icon: Shield,
      title: "Sécurité garantie",
      description: "Tous nos réparateurs sont vérifiés et assurés",
    },
    {
      icon: Clock,
      title: "Intervention rapide",
      description: "Trouvez un réparateur disponible rapidement",
    },
    {
      icon: CreditCard,
      title: "Paiement sécurisé",
      description: "Payez en toute sécurité via notre plateforme",
    },
    {
      icon: Star,
      title: "Qualité certifiée",
      description: "Réparateurs notés et évalués par la communauté",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Guide utilisateur</h1>
          <p className="text-xl text-blue-100">
            Découvrez comment utiliser FixeoPro pour trouver le réparateur parfait
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Comment ça marche ?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center text-lg">
              FixeoPro vous met en relation avec des réparateurs qualifiés près de chez vous. Suivez ces étapes simples
              pour résoudre tous vos problèmes de réparation.
            </p>
          </CardContent>
        </Card>

        {/* Étapes */}
        <div className="space-y-8 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-blue-900">{step.title}</CardTitle>
                    <p className="text-blue-700">{step.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-2">
                      <ArrowRight className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Avantages */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Pourquoi choisir FixeoPro ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <advantage.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{advantage.title}</h3>
                    <p className="text-gray-600">{advantage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conseils */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">💡 Conseils pour une demande réussie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  Description détaillée
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Décrivez précisément le problème</li>
                  <li>• Mentionnez la marque et le modèle</li>
                  <li>• Indiquez quand le problème a commencé</li>
                  <li>• Précisez ce qui a été tenté</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Camera className="h-4 w-4 mr-2 text-blue-600" />
                  Photos utiles
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Vue d'ensemble de l'objet</li>
                  <li>• Gros plan sur le problème</li>
                  <li>• Plaque signalétique si visible</li>
                  <li>• Photos de qualité et bien éclairées</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ rapide */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">❓ Questions fréquentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Les devis sont-ils gratuits ?</h4>
                <p className="text-gray-600">Oui, recevoir des devis via FixeoPro est entièrement gratuit.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Comment sont vérifiés les réparateurs ?</h4>
                <p className="text-gray-600">
                  Nous vérifions leurs qualifications, assurances et collectons les avis clients.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Que faire si je ne suis pas satisfait ?</h4>
                <p className="text-gray-600">
                  Contactez notre service client, nous vous aiderons à résoudre le problème.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">Prêt à commencer ?</h3>
              <p className="mb-6 text-blue-100">
                Décrivez votre problème et recevez des devis gratuits en quelques minutes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demande-reparation">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Créer ma demande
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aide supplémentaire */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold">Besoin d'aide supplémentaire ?</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Notre équipe de support est disponible pour répondre à toutes vos questions
          </p>
          <Link href="/contact">
            <Button variant="outline">Contacter le support</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
