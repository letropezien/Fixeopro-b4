import Link from "next/link"
import { Wrench, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
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
              <span className="text-xl font-bold">FixeoPro</span>
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

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/categories/electromenager" className="hover:text-white">
                  Électroménager
                </Link>
              </li>
              <li>
                <Link href="/categories/informatique" className="hover:text-white">
                  Informatique
                </Link>
              </li>
              <li>
                <Link href="/categories/plomberie" className="hover:text-white">
                  Plomberie
                </Link>
              </li>
              <li>
                <Link href="/categories/electricite" className="hover:text-white">
                  Électricité
                </Link>
              </li>
              <li>
                <Link href="/categories/chauffage" className="hover:text-white">
                  Chauffage
                </Link>
              </li>
              <li>
                <Link href="/categories/serrurerie" className="hover:text-white">
                  Serrurerie
                </Link>
              </li>
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
                contact@fixeopro.fr
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                01 23 45 67 89
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Paris, France
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
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} FixeoPro.fr - Tous droits réservés</p>
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
