"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  UserPlus,
  FileCheck,
  Search,
  MessageCircle,
  CreditCard,
  Star,
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Euro,
  Calendar,
  Phone,
  Briefcase,
  Settings,
  Award,
  Bell,
} from "lucide-react"
import Link from "next/link"

export default function GuideReparateurPage() {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Créez votre profil professionnel",
      description: "Inscrivez-vous et complétez votre profil de réparateur",
      details: [
        "Renseignez vos informations personnelles et professionnelles",
        "Ajoutez vos certifications et qualifications",
        "Téléchargez vos documents d'assurance professionnelle",
        "Définissez vos zones d'intervention et catégories de services",
      ],
    },
    {
      icon: FileCheck,
      title: "2. Validation de votre compte",
      description: "Notre équipe vérifie vos qualifications et documents",
      details: [
        "Vérification de votre identité et statut professionnel",
        "Contrôle de vos certifications et diplômes",
        "Validation de votre assurance responsabilité civile professionnelle",
        "Activation de votre compte (sous 24-48h)",
      ],
    },
    {
      icon: Search,
      title: "3. Accédez aux demandes",
      description: "Consultez les demandes de réparation dans votre secteur",
      details: [
        "Parcourez les demandes par catégorie et localisation",
        "Filtrez selon vos critères (distance, budget, urgence)",
        "Consultez les détails, photos et descriptions des problèmes",
        "Recevez des notifications pour les nouvelles demandes",
      ],
    },
    {
      icon: MessageCircle,
      title: "4. Proposez vos services",
      description: "Contactez les clients et envoyez vos devis",
      details: [
        "Rédigez une proposition personnalisée et détaillée",
        "Indiquez vos tarifs, délais et conditions",
        "Posez des questions complémentaires si nécessaire",
        "Mettez en avant votre expertise et vos garanties",
      ],
    },
    {
      icon: Calendar,
      title: "5. Planifiez vos interventions",
      description: "Organisez vos rendez-vous avec les clients",
      details: [
        "Confirmez les détails de l'intervention avec le client",
        "Planifiez la date et l'heure du rendez-vous",
        "Utilisez le calendrier intégré pour gérer votre planning",
        "Envoyez des rappels automatiques aux clients",
      ],
    },
    {
      icon: CreditCard,
      title: "6. Réalisez et facturez",
      description: "Effectuez la réparation et recevez votre paiement",
      details: [
        "Réalisez l'intervention selon les modalités convenues",
        "Marquez la réparation comme terminée dans l'application",
        "Facturez directement via la plateforme",
        "Recevez votre paiement sécurisé sous 48h",
      ],
    },
  ]

  const advantages = [
    {
      icon: Euro,
      title: "Revenus supplémentaires",
      description: "Développez votre activité et augmentez votre chiffre d'affaires",
    },
    {
      icon: Users,
      title: "Nouveaux clients",
      description: "Accédez à une large base de clients qualifiés",
    },
    {
      icon: Shield,
      title: "Paiements sécurisés",
      description: "Garantie de paiement et protection contre les impayés",
    },
    {
      icon: TrendingUp,
      title: "Visibilité accrue",
      description: "Améliorez votre présence en ligne et votre réputation",
    },
    {
      icon: Bell,
      title: "Demandes ciblées",
      description: "Recevez uniquement les demandes correspondant à vos compétences",
    },
    {
      icon: Briefcase,
      title: "Gestion simplifiée",
      description: "Outils de gestion de planning et de facturation intégrés",
    },
  ]

  const pricing = [
    {
      name: "Essai gratuit",
      price: "0€",
      period: "15 jours",
      features: [
        "Accès à toutes les demandes",
        "Contact illimité avec les clients",
        "Profil professionnel complet",
        "Support client standard",
      ],
      badge: "Découverte",
      badgeColor: "bg-blue-500",
    },
    {
      name: "Abonnement Pro",
      price: "29€",
      period: "par mois",
      features: [
        "Tout de l'essai gratuit",
        "Priorité dans les résultats de recherche",
        "Statistiques détaillées",
        "Support prioritaire",
        "Badge professionnel vérifié",
        "Outils de gestion avancés",
      ],
      badge: "Recommandé",
      badgeColor: "bg-green-500",
    },
    {
      name: "Abonnement Premium",
      price: "49€",
      period: "par mois",
      features: [
        "Tout de l'abonnement Pro",
        "Mise en avant de votre profil",
        "Notifications prioritaires",
        "Accès anticipé aux demandes",
        "Outils marketing avancés",
        "Support dédié",
      ],
      badge: "Optimal",
      badgeColor: "bg-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Guide réparateur FixeoPro</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Rejoignez notre réseau de professionnels et développez votre activité de réparation grâce à notre plateforme
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Introduction */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Pourquoi rejoindre FixeoPro ?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center text-lg mb-8">
              FixeoPro est la plateforme de référence qui met en relation les réparateurs qualifiés avec des clients à
              la recherche de services de réparation. Développez votre activité, trouvez de nouveaux clients et
              simplifiez votre gestion administrative.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((advantage, index) => (
                <div key={index} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-3">
                    <advantage.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{advantage.title}</h3>
                  <p className="text-sm text-gray-600">{advantage.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Étapes */}
        <div className="space-y-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Comment ça marche ?</h2>
          {steps.map((step, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-600 p-3 rounded-full">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-green-900">{step.title}</CardTitle>
                    <p className="text-green-700">{step.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-2">
                      <ArrowRight className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tarifs */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Nos formules d'abonnement</CardTitle>
            <p className="text-center text-gray-600">Choisissez la formule qui correspond à vos besoins</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricing.map((plan, index) => (
                <div
                  key={index}
                  className={`relative border rounded-lg p-6 hover:shadow-lg transition-shadow ${
                    index === 1 ? "border-green-500 shadow-md" : ""
                  }`}
                >
                  {plan.badge && (
                    <Badge className={`absolute -top-2 left-4 ${plan.badgeColor} text-white`}>{plan.badge}</Badge>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-green-600 mb-1">{plan.price}</div>
                    <div className="text-gray-500">{plan.period}</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      index === 1 ? "bg-green-600 hover:bg-green-700" : "bg-gray-800 hover:bg-gray-900"
                    }`}
                  >
                    Choisir cette formule
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conseils */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">💡 Conseils pour réussir sur FixeoPro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Star className="h-4 w-4 mr-2 text-green-600" />
                  Créez un profil attractif
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Utilisez une photo professionnelle de qualité</li>
                  <li>• Rédigez une description détaillée de vos services</li>
                  <li>• Mettez en avant vos certifications et expériences</li>
                  <li>• Ajoutez des photos de vos réalisations précédentes</li>
                  <li>• Précisez vos spécialités et domaines d'expertise</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold mb-2 flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                  Communiquez efficacement
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Répondez rapidement aux demandes (idéalement sous 2h)</li>
                  <li>• Soyez précis et détaillé dans vos devis</li>
                  <li>• Posez les bonnes questions pour comprendre le problème</li>
                  <li>• Maintenez un contact régulier avec le client</li>
                  <li>• Utilisez un langage clair et professionnel</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-green-600" />
                  Optimisez vos interventions
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Respectez scrupuleusement les rendez-vous fixés</li>
                  <li>• Préparez votre matériel à l'avance</li>
                  <li>• Prévenez le client en cas de retard</li>
                  <li>• Expliquez clairement les travaux réalisés</li>
                  <li>• Laissez le lieu d'intervention propre</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Award className="h-4 w-4 mr-2 text-green-600" />
                  Développez votre réputation
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Encouragez les clients satisfaits à laisser un avis</li>
                  <li>• Répondez aux avis, même négatifs, avec professionnalisme</li>
                  <li>• Proposez un service après-vente de qualité</li>
                  <li>• Offrez des garanties sur vos interventions</li>
                  <li>• Partagez vos réussites sur votre profil</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">❓ Questions fréquentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Quels documents dois-je fournir pour m'inscrire ?</h4>
                <p className="text-gray-600">
                  Vous devrez fournir une pièce d'identité, un justificatif de statut professionnel (extrait Kbis,
                  attestation URSSAF, etc.), vos qualifications professionnelles et une attestation d'assurance
                  responsabilité civile professionnelle.
                </p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Comment sont calculés les frais de service ?</h4>
                <p className="text-gray-600">
                  FixeoPro ne prélève aucun frais sur les devis. Une commission de 10% est appliquée uniquement sur les
                  interventions réalisées et payées via la plateforme. L'abonnement mensuel vous donne accès à des
                  fonctionnalités premium et une visibilité accrue.
                </p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Puis-je choisir mes zones et catégories d'intervention ?
                </h4>
                <p className="text-gray-600">
                  Oui, vous définissez librement vos zones géographiques d'intervention (par département, ville ou rayon
                  kilométrique) ainsi que les catégories et sous-catégories de services que vous proposez.
                </p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Comment et quand vais-je recevoir mes paiements ?</h4>
                <p className="text-gray-600">
                  Les paiements sont sécurisés et versés directement sur votre compte bancaire sous 48h après la
                  validation de la fin des travaux par le client. Vous pouvez suivre tous vos paiements dans votre
                  espace personnel.
                </p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Que se passe-t-il si un client annule une intervention ?
                </h4>
                <p className="text-gray-600">
                  Notre politique d'annulation protège les réparateurs. Si un client annule moins de 24h avant
                  l'intervention, des frais d'annulation peuvent s'appliquer selon nos conditions générales.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Comment puis-je me démarquer des autres réparateurs ?
                </h4>
                <p className="text-gray-600">
                  Complétez intégralement votre profil, ajoutez des photos de qualité, répondez rapidement aux demandes,
                  proposez des devis détaillés et soignez la qualité de vos interventions pour obtenir d'excellentes
                  évaluations. L'abonnement Pro vous permet également d'être mis en avant dans les résultats de
                  recherche.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Témoignages */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-xl">👨‍🔧 Témoignages de réparateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-3">
                  "Depuis que j'ai rejoint FixeoPro, mon carnet de commandes est plein. La plateforme me permet de
                  trouver facilement des clients dans ma zone et de gérer efficacement mes interventions."
                </p>
                <div className="font-semibold text-gray-900">Thomas D. - Électricien à Nantes</div>
                <div className="text-sm text-gray-500">Membre depuis 18 mois</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-3">
                  "J'apprécie particulièrement la qualité des demandes et le système de paiement sécurisé. Plus besoin
                  de courir après les factures impayées ! L'abonnement Pro est rentabilisé dès la première
                  intervention."
                </p>
                <div className="font-semibold text-gray-900">Lucie M. - Plombière à Bordeaux</div>
                <div className="text-sm text-gray-500">Membre depuis 7 mois</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">Prêt à développer votre activité ?</h3>
              <p className="mb-6 text-green-100">
                Rejoignez notre réseau de réparateurs professionnels et commencez avec notre essai gratuit de 15 jours
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/devenir-reparateur">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Devenir réparateur
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-green-600"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
