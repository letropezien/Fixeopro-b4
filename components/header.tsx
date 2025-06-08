"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Wrench, User, Settings, LogOut, Bell } from "lucide-react"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Simuler un utilisateur connecté
  const [userType, setUserType] = useState<"client" | "reparateur" | null>("reparateur") // Simuler un réparateur connecté

  const categories = [
    "Électroménager",
    "Informatique",
    "Plomberie",
    "Électricité",
    "Chauffage",
    "Serrurerie",
    "Multimédia",
    "Climatisation",
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-600">FixeoPro</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium hover:text-blue-600 transition-colors">
              Catégories
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {categories.map((category) => (
                <DropdownMenuItem key={category} asChild>
                  <Link href={`/categories/${category.toLowerCase()}`}>{category}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/comment-ca-marche" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Comment ça marche
          </Link>
          <Link href="/tarifs" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Tarifs
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {!isLoggedIn ? (
            <>
              <Link href="/demande-reparation">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Demande de dépannage
                </Button>
              </Link>
              <Link href="/devenir-reparateur">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Devenir réparateur
                </Button>
              </Link>
              <Link href="/connexion">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* Boutons pour utilisateurs connectés */}
              <Link href="/demande-reparation">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  Nouvelle demande
                </Button>
              </Link>

              {userType === "reparateur" && (
                <Link href="/demandes-disponibles">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    Voir les demandes
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profil" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  {userType === "reparateur" && (
                    <DropdownMenuItem asChild>
                      <Link href="/profil-pro" className="flex items-center">
                        <Wrench className="mr-2 h-4 w-4" />
                        Profil professionnel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/parametres" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <h3 className="font-semibold text-lg">Catégories</h3>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/categories/${category.toLowerCase()}`}
                    className="text-sm hover:text-blue-600 transition-colors pl-4"
                  >
                    {category}
                  </Link>
                ))}

                <div className="border-t pt-4 space-y-3">
                  <Link href="/comment-ca-marche" className="block text-sm hover:text-blue-600">
                    Comment ça marche
                  </Link>
                  <Link href="/tarifs" className="block text-sm hover:text-blue-600">
                    Tarifs
                  </Link>
                  <Link href="/contact" className="block text-sm hover:text-blue-600">
                    Contact
                  </Link>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <Link href="/demande-reparation">
                    <Button variant="outline" className="w-full">
                      Demande de dépannage
                    </Button>
                  </Link>
                  <Link href="/devenir-reparateur">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Devenir réparateur</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
