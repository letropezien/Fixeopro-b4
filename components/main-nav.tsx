"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Accueil
      </Link>
      <Link
        href="/categories"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Services
      </Link>
      <Link
        href="/comment-ca-marche"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Comment ça marche
      </Link>
      <Link href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Contact
      </Link>
    </nav>
  )
}
