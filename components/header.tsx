import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My App</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-gray-700">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700">
                  Contact
                </Link>
              </li>
              {/* Lien admin temporaire - à supprimer en production */}
              <li>
                <Link
                  href="/admin-direct"
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                  title="Accès admin temporaire"
                >
                  🔧 Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
