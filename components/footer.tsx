"use client"

import Link from "next/link"
import { Wrench, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { SiteSettingsService } from "@/lib/site-settings"
import { CategoriesService } from "@/lib/categories-service"
import { useState, useEffect } from "react"

export default function Footer() {
  const [siteSettings, setSiteSettings] = useState(SiteSettingsService.getSettings())
  const [categories, setCategories] = useState(CategoriesService.getEnabledCategories())

  useEffect(() => {
    setSiteSettings(SiteSettingsService.getSettings())
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
              <span className="text-xl font-bold">{siteSettings.siteName}</span>
            </div>
            <p className="text-gray-400 text-sm">{siteSettings.description}</p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link href={`/categories/${category.id}`} className="hover:text-white">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h3 className="font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/a-propos" className="hover:text-white">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/comment-ca-marche" className="hover:text-white">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="hover:text-white">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/devenir-reparateur" className="hover:text-white">
                  Devenir réparateur
                </Link>
              </li>
              <li>
                <Link href="/presse" className="hover:text-white">
                  Presse
                </Link>
              </li>
              <li>
                <Link href="/carriere" className="hover:text-white">
                  Carrière
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {siteSettings.contactEmail}
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {siteSettings.contactPhone}
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {siteSettings.city}, {siteSettings.country}
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/contact">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                  Nous contacter
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {siteSettings.siteName} - Tous droits réservés
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/mentions-legales" className="text-gray-400 hover:text-white text-sm">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-gray-400 hover:text-white text-sm">
              Confidentialité
            </Link>
            <Link href="/conditions" className="text-gray-400 hover:text-white text-sm">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
