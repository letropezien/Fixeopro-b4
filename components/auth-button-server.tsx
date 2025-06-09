"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { LogIn, LogOut, User, Settings } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AuthButtonServerProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
}

export default function AuthButtonServer({
  className = "",
  variant = "default",
  size = "default",
}: AuthButtonServerProps) {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        Chargement...
      </Button>
    )
  }

  if (!user) {
    return (
      <Link href="/connexion">
        <Button variant={variant} size={size} className={className}>
          <LogIn className="h-4 w-4 mr-2" />
          Se connecter
        </Button>
      </Link>
    )
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case "admin":
        return "Administrateur"
      case "repairer":
        return "Réparateur"
      case "client":
        return "Client"
      default:
        return "Utilisateur"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`relative h-10 w-10 rounded-full ${className}`}>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials(user.name || user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{user.name || "Utilisateur"}</p>
          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          <p className="text-xs leading-none text-muted-foreground">{getUserTypeLabel(user.type)}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profil" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Mon profil</span>
          </Link>
        </DropdownMenuItem>

        {user.type === "repairer" && (
          <DropdownMenuItem asChild>
            <Link href="/profil-pro" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Profil professionnel</span>
            </Link>
          </DropdownMenuItem>
        )}

        {user.type === "client" && (
          <DropdownMenuItem asChild>
            <Link href="/mes-demandes" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Mes demandes</span>
            </Link>
          </DropdownMenuItem>
        )}

        {user.type === "repairer" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/demandes-disponibles" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Demandes disponibles</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/tarifs" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Mon abonnement</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {user.type === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Administration</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Export as default
export { AuthButtonServer }
