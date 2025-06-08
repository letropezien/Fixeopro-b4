export default function CommentCaMarchePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">Comment ça marche ?</h1>

      <div className="max-w-4xl mx-auto">
        {/* Section pour les clients */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-green-600">Pour les clients</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Décrivez votre besoin</h3>
              <p className="text-gray-600">
                Remplissez notre formulaire simple en décrivant votre problème et en ajoutant des photos si nécessaire.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Recevez des propositions</h3>
              <p className="text-gray-600">
                Des réparateurs qualifiés dans votre région vous contactent avec leurs devis et disponibilités.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choisissez votre réparateur</h3>
              <p className="text-gray-600">
                Comparez les offres, consultez les avis et choisissez le professionnel qui vous convient le mieux.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Avantages pour les clients</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Service 100% gratuit pour les particuliers</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Réparateurs vérifiés et qualifiés</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Économisez du temps et de l'argent en comparant les offres</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Suivi de votre demande en temps réel</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section pour les réparateurs */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-blue-600">Pour les réparateurs</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Inscrivez-vous</h3>
              <p className="text-gray-600">
                Créez votre profil professionnel en précisant vos spécialités et votre zone d'intervention.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Accédez aux demandes</h3>
              <p className="text-gray-600">
                Consultez les demandes de réparation dans votre zone et correspondant à vos compétences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Développez votre activité</h3>
              <p className="text-gray-600">
                Répondez aux demandes, obtenez de nouveaux clients et développez votre réputation.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Avantages pour les réparateurs</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>15 jours d'essai gratuit pour tous les nouveaux inscrits</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Accès à des clients qualifiés et des demandes vérifiées</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Gestion simplifiée de vos interventions et de votre planning</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Visibilité accrue et développement de votre clientèle</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Combien coûte le service pour les clients ?</h3>
              <p className="text-gray-600">
                Le service est entièrement gratuit pour les clients. Vous ne payez que le prix convenu avec le
                réparateur que vous choisissez.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Comment sont sélectionnés les réparateurs ?</h3>
              <p className="text-gray-600">
                Tous les réparateurs sont vérifiés avant de pouvoir proposer leurs services. Nous contrôlons leurs
                qualifications, leur expérience et leurs avis clients.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Quels types de réparations sont couverts ?</h3>
              <p className="text-gray-600">
                Notre plateforme couvre un large éventail de domaines : électroménager, informatique, plomberie,
                électricité, chauffage, serrurerie, multimédia, téléphonie et climatisation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">
                Comment fonctionne la période d'essai pour les réparateurs ?
              </h3>
              <p className="text-gray-600">
                Tous les nouveaux réparateurs bénéficient de 15 jours d'essai gratuit avec accès à toutes les
                fonctionnalités de la formule choisie. Aucun prélèvement n'est effectué pendant cette période.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
