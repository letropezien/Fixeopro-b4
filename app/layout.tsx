import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FixeoPro.fr - Trouvez rapidement un expert pour vos réparations",
  description:
    "Plateforme de référence pour trouver un professionnel de la réparation près de chez vous. Réparateurs certifiés, intervention rapide, devis gratuit.",
  keywords: "réparation, dépannage, réparateur, électroménager, plomberie, électricité, informatique",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
