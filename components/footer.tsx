const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto text-center">
        <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Mon Entreprise. Tous droits réservés.</p>
        <div className="mt-2 space-x-4">
          <a href="/terms" className="hover:text-blue-600 transition-colors">
            Conditions d'utilisation
          </a>
          <a href="/privacy" className="hover:text-blue-600 transition-colors">
            Politique de confidentialité
          </a>
          <a href="/cookies" className="hover:text-blue-600 transition-colors">
            Gestion des cookies
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
