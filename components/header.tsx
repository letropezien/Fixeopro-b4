"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Wrench, Menu, User, Settings, LogOut, Bell, Shield } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Vérifier l'état de connexion
    const userId = localStorage.getItem("fixeopro_current_user_id")
    if (userId) {
      const users = JSON.parse(localStorage.getItem("fixeopro_users") || "[]")
      const user = users.find((u: any) => u.id === userId)
      if (user) {
        setCurrentUser(user)
        setIsLoggedIn(true)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("fixeopro_current_user_id")
    setIsLoggedIn(false)
    setCurrentUser(null)
    window.location.href = "/"
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-600">Fixeo.pro</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Catégories
            </Link>
            <Link href="/liste-demandes" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Liste des demandes
            </Link>
            <Link href="/comment-ca-marche" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Comment ça marche
            </Link>
            <Link href="/tarifs" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Tarifs
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link href="/demande-reparation">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    Demander un dépannage
                  </Button>
                </Link>
                <Link href="/devenir-reparateur">
                  <Button className="bg-green-600 hover:bg-green-700">Devenir réparateur</Button>
                </Link>
                <Link href="/connexion">
                  <Button variant="ghost" className="text-gray-700">
                    Se connecter
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* Actions selon le type d'utilisateur */}
                {currentUser?.userType === "client" && (
                  <Link href="/demande-reparation">
                    <Button variant="outline" size="sm">
                      Nouvelle demande
                    </Button>
                  </Link>
                )}

                {currentUser?.userType === "reparateur" && (
                  <Link href="/mes-interventions">
                    <Button variant="outline" size="sm">
                      Mes interventions
                    </Button>
                  </Link>
                )}

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* Menu utilisateur */}
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
                      <Link
                        href={currentUser?.userType === "reparateur" ? "/profil-pro" : "/profil"}
                        className="flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Mon profil
                      </Link>
                    </DropdownMenuItem>
                    {currentUser?.userType === "client" && (
                      <DropdownMenuItem asChild>
                        <Link href="/mes-demandes" className="flex items-center">
                          <Bell className="mr-2 h-4 w-4" />
                          Mes demandes
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {currentUser?.userType === "reparateur" && (
                      <DropdownMenuItem asChild>
                        <Link href="/mes-interventions" className="flex items-center">
                          <Wrench className="mr-2 h-4 w-4" />
                          Mes interventions
                        </Link>
                      </DropdownMenuItem>
                    )}
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
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Menu mobile */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-8">
                {/* Navigation */}
                <div className="space-y-4">
                  <Link href="/categories" className="block text-lg font-medium text-gray-700 hover:text-blue-600">
                    Catégories
                  </Link>
                  <Link href="/liste-demandes" className="block text-lg font-medium text-gray-700 hover:text-blue-600">
                    Liste des demandes
                  </Link>
                  <Link
                    href="/comment-ca-marche"
                    className="block text-lg font-medium text-gray-700 hover:text-blue-600"
                  >
                    Comment ça marche
                  </Link>
                  <Link href="/tarifs" className="block text-lg font-medium text-gray-700 hover:text-blue-600">
                    Tarifs
                  </Link>
                  <Link href="/contact" className="block text-lg font-medium text-gray-700 hover:text-blue-600">
                    Contact
                  </Link>
                </div>

                {/* Actions */}
                <div className="border-t pt-6 space-y-3">
                  {!isLoggedIn ? (
                    <>
                      <Link href="/demande-reparation">
                        <Button variant="outline" className="w-full border-blue-600 text-blue-600">
                          Demander un dépannage
                        </Button>
                      </Link>
                      <Link href="/devenir-reparateur">
                        <Button className="w-full bg-green-600 hover:bg-green-700">Devenir réparateur</Button>
                      </Link>
                      <Link href="/connexion">
                        <Button variant="ghost" className="w-full">
                          Se connecter
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="text-center py-2">
                        <p className="font-medium">
                          {currentUser?.firstName} {currentUser?.lastName}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {currentUser?.userType === "reparateur" ? "Réparateur" : "Client"}
                        </p>
                      </div>
                      <Link href={currentUser?.userType === "reparateur" ? "/profil-pro" : "/profil"}>
                        <Button variant="outline" className="w-full">
                          Mon profil
                        </Button>
                      </Link>
                      <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700">
                        Déconnexion
                      </Button>
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
