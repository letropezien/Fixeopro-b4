// Fichier de compatibilité pour simuler l'authentification
// Nous n'utilisons pas next-auth mais notre propre système basé sur localStorage

// Fonction simulée pour la compatibilité avec le code existant
export function getServerSession() {
  // Cette fonction est appelée côté serveur, donc nous retournons null
  // L'authentification réelle est gérée côté client avec StorageService
  return Promise.resolve(null)
}

// Configuration factice pour la compatibilité
export const authOptions = {
  providers: [],
  callbacks: {
    async session() {
      return null
    },
    async jwt() {
      return null
    },
  },
  pages: {
    signIn: "/connexion",
  },
}
