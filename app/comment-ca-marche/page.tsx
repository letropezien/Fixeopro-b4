import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  Search,
  MessageSquare,
  Wrench,
  Star,
  Shield,
  Clock,
  Euro,
  CheckCircle,
  Users,
  MapPin,
  Phone,
  Award,
  TrendingUp,
} from "lucide-react"

export default function CommentCaMarchePage() {
  const clientSteps = [
    {
      number: "1",
      icon: Search,
      title: "Décrivez votre problème",
      description:
        "Remplissez notre formulaire détaillé en décrivant votre panne, ajoutez des photos et précisez vos contraintes.",
      details: [
        "Description précise du problème",
        "Photos pour illustrer",
        "Localisation et disponibilités",
        "Budget souhaité",
      ],
    },
    {
      number: "2",
      icon: MessageSquare,
      title: "Recevez des devis gratuits",
      description:
        "Les réparateurs qualifiés de votre région vous contactent rapidement avec leurs propositions personnalisées.",
      details: [
        "Devis détaillés et transparents",
        "Réparateurs vérifiés",
        "Délais d'intervention",
        "Garanties proposées",
      ],
    },
    {
      number: "3",
      icon: Wrench,
      title: "Choisissez votre réparateur",
      description:
        "Comparez les profils, tarifs, avis clients et disponibilités pour sélectionner le professionnel idéal.",
      details: ["Profils détaillés", "Avis clients vérifiés", "Tarifs transparents", "Disponibilités en temps réel"],
    },
    {
      number: "4",
      icon: Star,
      title: "Intervention et suivi",
      description: "Le réparateur intervient selon les modalités convenues et vous pouvez évaluer la prestation.",
      details: [
        "Intervention professionnelle",
        "Suivi en temps réel",
        "Garantie sur les réparations",
        "Évaluation de la prestation",
      ],
    },
  ]

  const reparateurSteps = [
    {
      number: "1",
      icon: Users,
      title: "Inscrivez-vous gratuitement",
      description: "Créez votre profil professionnel en quelques minutes et bénéficiez de 15 jours d'essai gratuit.",
      details: [
        "Inscription rapide",
        "Vérification des qualifications",
        "15 jours d'essai gratuit",
        "Formation à la plateforme",
      ],
    },
    {
      number: "2",
      icon: MapPin,
      title: "Définissez votre zone",
      description: "Configurez vos spécialités, votre zone d'intervention et vos disponibilités selon vos préférences.",
      details: [
        "Zone d'intervention personnalisée",
        "Spécialités techniques",
        "Planning flexible",
        "Tarifs personnalisés",
      ],
    },
    {
      number: "3",
      icon: Phone,
      title: "Répondez aux demandes",
      description: "Consultez les demandes correspondant à vos compétences et envoyez vos devis personnalisés.",
      details: ["Demandes qualifiées", "Devis en ligne", "Contact direct client", "Négociation facilitée"],
    },
    {
      number: "4",
      icon: TrendingUp,
      title: "Développez votre activité",
      description: "Réalisez vos interventions, collectez des avis positifs et développez votre clientèle.",
      details: ["Interventions régulières", "Avis clients", "Fidélisation", "Croissance du chiffre d'affaires"],
    },
  ]

  const advantages = [
    {
      icon: Shield,
      title: "Sécurité garantie",
      description:
        "Tous nos réparateurs sont vérifiés et assurés. Paiements sécurisés et garanties sur les interventions.",
      color: "text-blue-600",
    },
    {
      icon: Clock,
      title: "Rapidité d'intervention",
      description: "Trouvez un réparateur en quelques minutes. Interventions possibles le jour même pour les urgences.",
      color: "text-green-600",
    },
    {
      icon: Euro,
      title: "Tarifs transparents",
      description:
        "Comparez les devis gratuitement. Aucun frais caché, tarifs négociés directement avec le réparateur.",
      color: "text-purple-600",
    },
    {
      icon: Award,
      title: "Qualité certifiée",
      description:
        "Réparateurs qualifiés et expérimentés. Système d'évaluation et de notation pour garantir la qualité.",
      color: "text-orange-600",
    },
  ]

  const stats = [
    { number: "15 000+", label: "Réparations réalisées", icon: Wrench },
    { number: "2 500+", label: "Réparateurs actifs", icon: Users },
    { number: "4.8/5", label: "Note moyenne", icon: Star },
    { number: "2h", label: "Temps de réponse moyen", icon: Clock },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Comment fonctionne <span className="text-blue-600">Fixeo.pro</span> ?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            La plateforme qui connecte particuliers et professionnels pour tous vos besoins de dépannage et réparation
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/demande-reparation">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Faire ma demande
              </Button>
            </Link>
            <Link href="/devenir-reparateur">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                Devenir réparateur
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
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

      {/* Pour les clients */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pour les particuliers</h2>
            <p className="text-xl text-gray-600">Trouvez le bon réparateur en 4 étapes simples</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              {clientSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-3">{step.description}</p>
                    <ul className="space-y-1">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Avantages clients</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Service 100% gratuit</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Réparateurs vérifiés</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Devis gratuits et sans engagement</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Intervention rapide</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Garantie sur les réparations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pour les réparateurs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pour les réparateurs</h2>
            <p className="text-xl text-gray-600">Développez votre activité avec notre plateforme</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Avantages réparateurs</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">15 jours d'essai gratuit</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Clients qualifiés et vérifiés</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Gestion simplifiée des interventions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Paiement sécurisé</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Support technique dédié</span>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              {reparateurSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-3">{step.description}</p>
                    <ul className="space-y-1">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pourquoi choisir Fixeo.pro ?</h2>
            <p className="text-xl text-gray-600">Les garanties qui font la différence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4`}>
                    <advantage.icon className={`h-8 w-8 ${advantage.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{advantage.title}</h3>
                  <p className="text-gray-600">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Prêt à commencer ?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers d'utilisateurs qui font confiance à Fixeo.pro
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/demande-reparation">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Je cherche un réparateur
              </Button>
            </Link>
            <Link href="/devenir-reparateur">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600"
              >
                Je suis réparateur
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
