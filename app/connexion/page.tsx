"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { StorageService } from "../../services/storageService"

export default function Connexion() {
  const [activeTab, setActiveTab] = useState("connexion")
  const [emailLogin, setEmailLogin] = useState("")
  const [passwordLogin, setPasswordLogin] = useState("")
  const [nomClient, setNomClient] = useState("")
  const [prenomClient, setPrenomClient] = useState("")
  const [emailClient, setEmailClient] = useState("")
  const [passwordClient, setPasswordClient] = useState("")
  const [adresseClient, setAdresseClient] = useState("")
  const [telephoneClient, setTelephoneClient] = useState("")
  const [nomReparateur, setNomReparateur] = useState("")
  const [prenomReparateur, setPrenomReparateur] = useState("")
  const [emailReparateur, setEmailReparateur] = useState("")
  const [passwordReparateur, setPasswordReparateur] = useState("")
  const [adresseReparateur, setAdresseReparateur] = useState("")
  const [telephoneReparateur, setTelephoneReparateur] = useState("")
  const [specialiteReparateur, setSpecialiteReparateur] = useState("")
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    sms: false,
  })

  const router = useRouter()

  useEffect(() => {
    // Obtenir la géolocalisation au montage du composant
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error)
          setErrorMessage("Erreur de géolocalisation. Veuillez activer la localisation.")
        },
      )
    } else {
      console.error("La géolocalisation n'est pas prise en charge par ce navigateur.")
      setErrorMessage("La géolocalisation n'est pas prise en charge par ce navigateur.")
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMessage("") // Réinitialiser les messages d'erreur
    setSuccessMessage("")

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailLogin, password: passwordLogin }),
      })

      if (response.ok) {
        const data = await response.json()
        const user = data.user

        // Stocker l'ID de l'utilisateur dans le StorageService
        StorageService.setItem("fixeopro_current_user_id", user.id)

        // Déclencher l'événement de changement de connexion
        window.dispatchEvent(new CustomEvent("fixeopro-login-change"))

        // Rediriger l'utilisateur vers la page d'accueil
        router.push("/")
      } else {
        // Gérer les erreurs d'authentification
        console.error("Erreur d'authentification")
        setErrorMessage("Email ou mot de passe incorrect.")
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      setErrorMessage("Erreur lors de la connexion. Veuillez réessayer.")
    }
  }

  const handleRegisterClient = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    // Validation basique côté client
    if (!nomClient || !prenomClient || !emailClient || !passwordClient || !adresseClient || !telephoneClient) {
      setErrorMessage("Veuillez remplir tous les champs.")
      return
    }

    try {
      const response = await fetch("/api/registerClient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: nomClient,
          prenom: prenomClient,
          email: emailClient,
          password: passwordClient,
          adresse: adresseClient,
          telephone: telephoneClient,
          latitude,
          longitude,
        }),
      })

      if (response.ok) {
        setSuccessMessage("Inscription réussie! Vous pouvez maintenant vous connecter.")
        // Réinitialiser les champs du formulaire
        setNomClient("")
        setPrenomClient("")
        setEmailClient("")
        setPasswordClient("")
        setAdresseClient("")
        setTelephoneClient("")
        setActiveTab("connexion") // Rediriger vers l'onglet de connexion
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.message || "Erreur lors de l'inscription.")
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      setErrorMessage("Erreur lors de l'inscription. Veuillez réessayer.")
    }
  }

  const handleRegisterReparateur = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    // Validation basique côté client
    if (
      !nomReparateur ||
      !prenomReparateur ||
      !emailReparateur ||
      !passwordReparateur ||
      !adresseReparateur ||
      !telephoneReparateur ||
      !specialiteReparateur
    ) {
      setErrorMessage("Veuillez remplir tous les champs.")
      return
    }

    try {
      const response = await fetch("/api/registerReparateur", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: nomReparateur,
          prenom: prenomReparateur,
          email: emailReparateur,
          password: passwordReparateur,
          adresse: adresseReparateur,
          telephone: telephoneReparateur,
          specialite: specialiteReparateur,
          latitude,
          longitude,
          notificationPreferences,
        }),
      })

      if (response.ok) {
        setSuccessMessage("Inscription réussie! Vous pouvez maintenant vous connecter.")
        // Réinitialiser les champs du formulaire
        setNomReparateur("")
        setPrenomReparateur("")
        setEmailReparateur("")
        setPasswordReparateur("")
        setAdresseReparateur("")
        setTelephoneReparateur("")
        setSpecialiteReparateur("")
        setActiveTab("connexion") // Rediriger vers l'onglet de connexion
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.message || "Erreur lors de l'inscription.")
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      setErrorMessage("Erreur lors de l'inscription. Veuillez réessayer.")
    }
  }

  const handleDemoLogin = async (email, password) => {
    setErrorMessage("")
    setSuccessMessage("")

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

        // Stocker l'ID de l'utilisateur dans le StorageService
        StorageService.setItem("fixeopro_current_user_id", user.id)

        // Déclencher l'événement de changement de connexion
        window.dispatchEvent(new CustomEvent("fixeopro-login-change"))

        // Rediriger l'utilisateur vers la page d'accueil
        router.push("/")
      } else {
        // Gérer les erreurs d'authentification
        console.error("Erreur d'authentification")
        setErrorMessage("Email ou mot de passe incorrect.")
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      setErrorMessage("Erreur lors de la connexion. Veuillez réessayer.")
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Connexion</h2>

        {/* Barre d'onglets */}
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "connexion" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("connexion")}
          >
            Connexion
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "client" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("client")}
          >
            Client
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "reparateur" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("reparateur")}
          >
            Réparateur
          </button>
        </div>

        {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}

        {/* Formulaire de connexion */}
        {activeTab === "connexion" && (
          <div>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="emailLogin" className="block text-gray-700 text-sm font-bold mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="emailLogin"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="passwordLogin" className="block text-gray-700 text-sm font-bold mb-2">
                  Mot de passe:
                </label>
                <input
                  type="password"
                  id="passwordLogin"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={passwordLogin}
                  onChange={(e) => setPasswordLogin(e.target.value)}
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
            <div className="mt-4">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                onClick={() => handleDemoLogin("client@demo.com", "password")}
              >
                Démo Client
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => handleDemoLogin("reparateur@demo.com", "password")}
              >
                Démo Réparateur
              </button>
            </div>
          </div>
        )}

        {/* Formulaire d'inscription Client */}
        {activeTab === "client" && (
          <form onSubmit={handleRegisterClient}>
            <div className="mb-4">
              <label htmlFor="nomClient" className="block text-gray-700 text-sm font-bold mb-2">
                Nom:
              </label>
              <input
                type="text"
                id="nomClient"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={nomClient}
                onChange={(e) => setNomClient(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="prenomClient" className="block text-gray-700 text-sm font-bold mb-2">
                Prénom:
              </label>
              <input
                type="text"
                id="prenomClient"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={prenomClient}
                onChange={(e) => setPrenomClient(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="emailClient" className="block text-gray-700 text-sm font-bold mb-2">
                Email:
              </label>
              <input
                type="email"
                id="emailClient"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={emailClient}
                onChange={(e) => setEmailClient(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="passwordClient" className="block text-gray-700 text-sm font-bold mb-2">
                Mot de passe:
              </label>
              <input
                type="password"
                id="passwordClient"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={passwordClient}
                onChange={(e) => setPasswordClient(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="adresseClient" className="block text-gray-700 text-sm font-bold mb-2">
                Adresse:
              </label>
              <input
                type="text"
                id="adresseClient"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={adresseClient}
                onChange={(e) => setAdresseClient(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="telephoneClient" className="block text-gray-700 text-sm font-bold mb-2">
                Téléphone:
              </label>
              <input
                type="tel"
                id="telephoneClient"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={telephoneClient}
                onChange={(e) => setTelephoneClient(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                S'inscrire
              </button>
            </div>
          </form>
        )}

        {/* Formulaire d'inscription Réparateur */}
        {activeTab === "reparateur" && (
          <form onSubmit={handleRegisterReparateur}>
            <div className="mb-4">
              <label htmlFor="nomReparateur" className="block text-gray-700 text-sm font-bold mb-2">
                Nom:
              </label>
              <input
                type="text"
                id="nomReparateur"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={nomReparateur}
                onChange={(e) => setNomReparateur(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="prenomReparateur" className="block text-gray-700 text-sm font-bold mb-2">
                Prénom:
              </label>
              <input
                type="text"
                id="prenomReparateur"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={prenomReparateur}
                onChange={(e) => setPrenomReparateur(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="emailReparateur" className="block text-gray-700 text-sm font-bold mb-2">
                Email:
              </label>
              <input
                type="email"
                id="emailReparateur"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={emailReparateur}
                onChange={(e) => setEmailReparateur(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="passwordReparateur" className="block text-gray-700 text-sm font-bold mb-2">
                Mot de passe:
              </label>
              <input
                type="password"
                id="passwordReparateur"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={passwordReparateur}
                onChange={(e) => setPasswordReparateur(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="adresseReparateur" className="block text-gray-700 text-sm font-bold mb-2">
                Adresse:
              </label>
              <input
                type="text"
                id="adresseReparateur"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={adresseReparateur}
                onChange={(e) => setAdresseReparateur(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="telephoneReparateur" className="block text-gray-700 text-sm font-bold mb-2">
                Téléphone:
              </label>
              <input
                type="tel"
                id="telephoneReparateur"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={telephoneReparateur}
                onChange={(e) => setTelephoneReparateur(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="specialiteReparateur" className="block text-gray-700 text-sm font-bold mb-2">
                Spécialité:
              </label>
              <input
                type="text"
                id="specialiteReparateur"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={specialiteReparateur}
                onChange={(e) => setSpecialiteReparateur(e.target.value)}
                required
              />
            </div>

            {/* Préférences de notification */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Préférences de notification:</label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-500"
                  checked={notificationPreferences.email}
                  onChange={(e) => setNotificationPreferences({ ...notificationPreferences, email: e.target.checked })}
                />
                <span className="ml-2 text-gray-700">Email</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-500"
                  checked={notificationPreferences.sms}
                  onChange={(e) => setNotificationPreferences({ ...notificationPreferences, sms: e.target.checked })}
                />
                <span className="ml-2 text-gray-700">SMS</span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                S'inscrire
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
