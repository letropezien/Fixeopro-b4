"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Wrench, User, Settings, LogOut, Bell } from "lucide-react"
import { StorageService } from "@/lib/storage"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<"client" | "reparateur" | null>(null)
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser())
  const router = useRouter()

  useEffect(() => {
    // Vérifier l'état de connexion à chaque rendu
    const user = StorageService.getCurrentUser()
    setCurrentUser(user)
    setIsLoggedIn(!!user)
    if (user) {
      setUserType(user.userType)
    } else {
      setUserType(null)
    }
  }, [])

  const handleLogout = () => {
    StorageService.logout()
    setIsLoggedIn(false)
    setUserType(null)
    setCurrentUser(null)
    router.push("/")
    // Forcer un rechargement pour mettre à jour tous les composants
    window.location.reload()
  }

  const categories = [
    "Électroménager",
    "Informatique",
    "Plomberie",
    "Électricité",
    "Chauffage",
    "Serrurerie",
    "Multimédia",
    "Téléphonie",
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

          <Link href="/carte" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Carte
          </Link>
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
              {userType === "client" && (
                <Link href="/demande-reparation">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    Nouvelle demande
                  </Button>
                </Link>
              )}

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
                      <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback>
                        {currentUser?.firstName?.[0] || ""}
                        {currentUser?.lastName?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem asChild>
                    <Link href={userType === "client" ? "/profil" : "/profil-pro"} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {userType === "client" ? "Mon profil" : "Profil professionnel"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/parametres" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
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
                  {isLoggedIn ? (
                    <>
                      <Link href={userType === "client" ? "/profil" : "/profil-pro"}>
                        <Button variant="outline" className="w-full">
                          Mon profil
                        </Button>
                      </Link>
                      <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700">
                        Déconnexion
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/demande-reparation">
                        <Button variant="outline" className="w-full">
                          Demande de dépannage
                        </Button>
                      </Link>
                      <Link href="/devenir-reparateur">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Devenir réparateur</Button>
                      </Link>
                      <Link href="/connexion">
                        <Button variant="ghost" className="w-full">
                          Connexion
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
