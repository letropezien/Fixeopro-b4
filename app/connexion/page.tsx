"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Connexion() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        const user = data.user

        // Stocker l'ID de l'utilisateur dans le localStorage
        localStorage.setItem("fixeopro_current_user_id", user.id)

        // Déclencher l'événement de changement de connexion
        window.dispatchEvent(new CustomEvent("fixeopro-login-change"))

        // Rediriger l'utilisateur vers la page d'accueil
        router.push("/")
      } else {
        // Gérer les erreurs d'authentification
        console.error("Erreur d'authentification")
        alert("Email ou mot de passe incorrect.")
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      alert("Erreur lors de la connexion. Veuillez réessayer.")
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Connexion</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Mot de passe:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Se connecter
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Mot de passe oublié?
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
