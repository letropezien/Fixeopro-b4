"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Shield } from "lucide-react"
import Link from "next/link"
import { StorageService } from "@/lib/storage"

export default function AuthButtonServer() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier si nous sommes dans un environnement navigateur
    if (typeof window !== "undefined") {
      const user = StorageService.getCurrentUser()
      setCurrentUser(user)
      setIsLoading(false)
    }
  }, [])

  const handleLogout = () => {
    StorageService.logout()
    setCurrentUser(null)
    window.location.href = "/"
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <span className="animate-pulse">Chargement...</span>
      </Button>
    )
  }

  if (!currentUser) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/connexion">Se connecter</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/inscription">S'inscrire</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt="Profile" />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {currentUser?.firstName?.[0]}
              {currentUser?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="px-2 py-1.5 text-sm font-medium">
          {currentUser?.firstName} {currentUser?.lastName}
          <div className="text-xs text-gray-500 capitalize">
            {currentUser?.userType === "reparateur" ? "Réparateur" : "Client"}
          </div>
        </div>
        <DropdownMenuItem asChild>
          <Link href={currentUser?.userType === "reparateur" ? "/profil-pro" : "/profil"} className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Mon profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/parametres" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Link>
        </DropdownMenuItem>
        {currentUser?.userType === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center text-red-600">
              <Shield className="mr-2 h-4 w-4" />
              Administration
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
