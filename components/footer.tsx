"use client"

import Link from "next/link"
import { Wrench, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { CategoriesService } from "@/lib/categories-service"
import { useState, useEffect } from "react"

export default function Footer() {
  const [categories, setCategories] = useState(CategoriesService.getEnabledCategories())

  useEffect(() => {
    setCategories(CategoriesService.getEnabledCategories())
  }, [])

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Fixeo.pro</span>
            </div>
            <p className="text-gray-400 text-sm">
              La plateforme de référence pour trouver un expert en réparation près de chez vous.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Services - Tags design */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Services</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.id}`} className="inline-block">
                  <span className="bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border border-gray-700 hover:border-blue-500">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
            {categories.length === 0 && (
              <p className="text-gray-500 text-sm italic">Aucun service disponible pour le moment</p>
            )}
          </div>

          {/* Contact - Vraies informations */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <Mail className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@fixeo.pro" className="hover:text-white transition-colors">
                  contact@fixeo.pro
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <a href="tel:0783497262" className="hover:text-white transition-colors">
                  07 83 49 72 62
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <div>Fixeo.pro</div>
                  <div>Les Saquèdes</div>
                  <div>83120 Sainte-Maxime</div>
                  <div>France</div>
                </div>
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/contact">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
                  Nous contacter
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Section Fixeo.Pro déplacée en bas */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Fixeo.Pro */}
            <div>
              <h3 className="font-semibold mb-4">Fixeo.Pro</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-400">
                <Link href="/a-propos" className="hover:text-white transition-colors">
                  À propos
                </Link>
                <Link href="/comment-ca-marche" className="hover:text-white transition-colors">
                  Comment ça marche
                </Link>
                <Link href="/tarifs" className="hover:text-white transition-colors">
                  Tarifs
                </Link>
                <Link href="/devenir-reparateur" className="hover:text-white transition-colors">
                  Devenir réparateur
                </Link>
                <Link href="/presse" className="hover:text-white transition-colors">
                  Presse
                </Link>
                <Link href="/carriere" className="hover:text-white transition-colors">
                  Carrière
                </Link>
              </div>
            </div>

            {/* Liens légaux */}
            <div>
              <h3 className="font-semibold mb-4">Informations légales</h3>
              <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-400">
                <Link href="/mentions-legales" className="hover:text-white transition-colors">
                  Mentions légales
                </Link>
                <Link href="/confidentialite" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
                <Link href="/conditions" className="hover:text-white transition-colors">
                  Conditions générales d'utilisation
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Fixeo.pro - Tous droits réservés</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
