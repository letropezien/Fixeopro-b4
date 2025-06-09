"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wrench, Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
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
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition-colors">
              Catégories
            </Link>
            <Link href="/comment-ca-marche" className="text-gray-700 hover:text-blue-600 transition-colors">
              Comment ça marche
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Boutons d'action */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/demande-reparation">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Demander un dépannage
              </Button>
            </Link>
            <Link href="/devenir-reparateur">
              <Button className="bg-blue-600 hover:bg-blue-700">Devenir réparateur</Button>
            </Link>
          </div>

          {/* Menu mobile */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu mobile ouvert */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/categories" className="text-gray-700 hover:text-blue-600">
                Catégories
              </Link>
              <Link href="/comment-ca-marche" className="text-gray-700 hover:text-blue-600">
                Comment ça marche
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">
                Contact
              </Link>
              <div className="pt-4 space-y-2">
                <Link href="/demande-reparation">
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600">
                    Demander un dépannage
                  </Button>
                </Link>
                <Link href="/devenir-reparateur">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Devenir réparateur</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
