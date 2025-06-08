import { getServerSession } from "next-auth"

// Configuration de base pour next-auth
export const authOptions = {
  providers: [
    // Nous utilisons une implémentation personnalisée basée sur localStorage
    // mais nous gardons la structure compatible avec next-auth
  ],
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
  },
  pages: {
    signIn: "/connexion",
  },
}

// Fonction pour obtenir la session côté serveur (simulée)
export function getSession() {
  return getServerSession(authOptions)
}
