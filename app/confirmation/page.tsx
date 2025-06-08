import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Mail, Phone } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Demande enregistrée avec succès !</h1>
          <p className="text-lg text-gray-600">
            Votre demande de réparation a été transmise à nos réparateurs partenaires
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Prochaines étapes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Analyse de votre demande</h4>
                  <p className="text-sm text-gray-600">
                    Nous analysons votre problème et identifions les experts adaptés
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Mise en relation</h4>
                  <p className="text-sm text-gray-600">Les réparateurs intéressés vous contactent directement</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Intervention</h4>
                  <p className="text-sm text-gray-600">Choisissez votre réparateur et planifiez l'intervention</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Email de confirmation envoyé</h4>
                <p className="text-sm text-green-800">
                  Vous recevrez un email de confirmation avec le détail de votre demande
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Réponses attendues</h4>
                <p className="text-sm text-blue-800">Vous devriez recevoir les premières réponses dans les 2 heures</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-yellow-900 mb-2">📱 Restez disponible</h3>
          <p className="text-yellow-800 text-sm mb-4">
            Les réparateurs vous contacteront par téléphone ou email. Assurez-vous d'être disponible pour répondre
            rapidement.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>Téléphone activé</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>Email vérifié</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profil">
              <Button variant="outline" size="lg">
                Voir mes demandes
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Retour à l'accueil
              </Button>
            </Link>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              Besoin d'aide ?{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contactez notre support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
