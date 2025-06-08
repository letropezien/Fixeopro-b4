import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, Search, MessageSquare, Star, Shield } from "lucide-react"
import Link from "next/link"

export default function CommentCaMarchePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            FixeoPro simplifie la mise en relation entre particuliers et professionnels de la réparation
          </p>
        </div>

        {/* Pour les clients */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Pour les particuliers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <CardTitle>1. Décrivez votre problème</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Remplissez notre formulaire simple en décrivant votre panne ou votre besoin de réparation.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Catégorie de réparation</li>
                  <li>• Description détaillée</li>
                  <li>• Niveau d'urgence</li>
                  <li>• Localisation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <CardTitle>2. Recevez des propositions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Les réparateurs qualifiés de votre région vous contactent avec leurs propositions.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Réponses rapides</li>
                  <li>• Devis personnalisés</li>
                  <li>• Professionnels vérifiés</li>
                  <li>• Avis clients disponibles</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤝</span>
                </div>
                <CardTitle>3. Choisissez votre réparateur</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Comparez les propositions et choisissez le professionnel qui vous convient le mieux.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Comparaison facile</li>
                  <li>• Prix transparents</li>
                  <li>• Disponibilités claires</li>
                  <li>• Contact direct</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/demande-reparation">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Créer ma demande gratuitement
              </Button>
            </Link>
          </div>
        </section>

        {/* Pour les professionnels */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-green-600">Pour les professionnels</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>1. Inscrivez-vous</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Créez votre profil professionnel et bénéficiez de 15 jours d'essai gratuit.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Inscription rapide</li>
                  <li>• Profil personnalisable</li>
                  <li>• 15 jours gratuits</li>
                  <li>• Vérification des qualifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>2. Trouvez des clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Consultez les demandes de réparation dans votre zone d'intervention.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Demandes géolocalisées</li>
                  <li>• Filtres par spécialité</li>
                  <li>• Notifications en temps réel</li>
                  <li>• Accès aux coordonnées</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>3. Répondez aux demandes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Contactez directement les clients et proposez vos services.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Contact direct</li>
                  <li>• Propositions personnalisées</li>
                  <li>• Suivi des demandes</li>
                  <li>• Gestion des avis</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/devenir-reparateur">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Rejoindre le réseau
              </Button>
            </Link>
          </div>
        </section>

        {/* Avantages */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Pourquoi choisir FixeoPro ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <Shield className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold mb-2">Sécurité garantie</h3>
                <p className="text-sm text-gray-600">
                  Tous nos professionnels sont vérifiés et leurs qualifications validées.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Star className="h-8 w-8 text-yellow-600 mb-3" />
                <h3 className="font-semibold mb-2">Qualité assurée</h3>
                <p className="text-sm text-gray-600">
                  Système d'avis clients pour garantir la qualité des interventions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Service gratuit</h3>
                <p className="text-sm text-gray-600">Aucun frais pour les particuliers, service entièrement gratuit.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Le service est-il vraiment gratuit pour les particuliers ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Oui, FixeoPro est entièrement gratuit pour les particuliers. Vous ne payez que le réparateur pour son
                  intervention.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment sont sélectionnés les réparateurs ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nous vérifions les qualifications, l'expérience et les assurances de chaque professionnel avant de
                  l'accepter sur la plateforme.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Que se passe-t-il si je ne suis pas satisfait ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Notre équipe support est là pour vous aider à résoudre tout problème. Vous pouvez également laisser un
                  avis pour aider les autres utilisateurs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Combien de temps pour recevoir des réponses ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  En moyenne, vous recevez les premières réponses dans les 2 heures suivant votre demande, parfois plus
                  rapidement pour les urgences.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
