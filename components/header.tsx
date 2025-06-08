"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  User,
  LogOut,
  PenToolIcon as Tool,
  Search,
  MapPin,
  HelpCircle,
  CreditCard,
  MessageSquare,
} from "lucide-react"
import { StorageService } from "@/lib/storage"

export default function Header() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Récupérer l'utilisateur actuel
    const user = StorageService.getCurrentUser()
    setCurrentUser(user)
  }, [])

  const handleLogout = () => {
    StorageService.logout()
    setCurrentUser(null)
    window.location.href = "/"
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">FixeoPro</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={isActive("/categories") ? "font-bold" : ""}>
                  Catégories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/categories/electromenager">Électroménager</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categories/informatique">Informatique</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categories/plomberie">Plomberie</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categories/electricite">Électricité</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categories/chauffage">Chauffage</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categories/telephonie">Téléphonie</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/comment-ca-marche"
              className={`text-sm font-medium ${isActive("/comment-ca-marche") ? "font-bold" : ""}`}
            >
              Comment ça marche
            </Link>
            <Link href="/tarifs" className={`text-sm font-medium ${isActive("/tarifs") ? "font-bold" : ""}`}>
              Tarifs
            </Link>
            <Link href="/carte" className={`text-sm font-medium ${isActive("/carte") ? "font-bold" : ""}`}>
              Carte
            </Link>
            <Link href="/contact" className={`text-sm font-medium ${isActive("/contact") ? "font-bold" : ""}`}>
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="hidden md:flex gap-4 items-center">
              {currentUser.userType === "client" ? (
                <>
                  <Button asChild variant="outline">
                    <Link href="/demande-reparation">
                      <Search className="h-4 w-4 mr-2" />
                      Demander une réparation
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2">
                        <User className="h-4 w-4" />
                        <span>Mon compte</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profil">Mon profil</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link href="/demandes-disponibles">
                      <Search className="h-4 w-4 mr-2" />
                      Demandes disponibles
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2">
                        <Tool className="h-4 w-4" />
                        <span>Espace pro</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profil-pro">Mon profil pro</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex gap-4">
              <Button asChild variant="outline">
                <Link href="/connexion">Connexion</Link>
              </Button>
              <Button asChild>
                <Link href="/devenir-reparateur">Devenir réparateur</Link>
              </Button>
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  FixeoPro
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start px-0">
                      Catégories
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem asChild>
                      <Link href="/categories/electromenager">Électroménager</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/categories/informatique">Informatique</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/categories/plomberie">Plomberie</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/categories/electricite">Électricité</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/categories/chauffage">Chauffage</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/categories/telephonie">Téléphonie</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/comment-ca-marche" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Comment ça marche
                </Link>
                <Link href="/tarifs" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Tarifs
                </Link>
                <Link href="/carte" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Carte
                </Link>
                <Link href="/contact" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contact
                </Link>
                {currentUser ? (
                  <>
                    {currentUser.userType === "client" ? (
                      <>
                        <Link href="/demande-reparation" className="flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          Demander une réparation
                        </Link>
                        <Link href="/profil" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Mon profil
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/demandes-disponibles" className="flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          Demandes disponibles
                        </Link>
                        <Link href="/profil-pro" className="flex items-center gap-2">
                          <Tool className="h-4 w-4" />
                          Mon profil pro
                        </Link>
                      </>
                    )}
                    <Button variant="ghost" className="justify-start px-0" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/connexion" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Connexion
                    </Link>
                    <Link href="/devenir-reparateur" className="flex items-center gap-2">
                      <Tool className="h-4 w-4" />
                      Devenir réparateur
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
