// Service de géocodage pour convertir les coordonnées en adresse
export interface Address {
  street?: string
  city: string
  postalCode: string
  country: string
}

export interface Coordinates {
  lat: number
  lng: number
}

// Base de données simplifiée des villes françaises avec codes postaux
const FRENCH_CITIES = [
  { name: "Paris", postalCode: "75001", lat: 48.8566, lng: 2.3522 },
  { name: "Marseille", postalCode: "13001", lat: 43.2965, lng: 5.3698 },
  { name: "Lyon", postalCode: "69001", lat: 45.764, lng: 4.8357 },
  { name: "Toulouse", postalCode: "31000", lat: 43.6047, lng: 1.4442 },
  { name: "Nice", postalCode: "06000", lat: 43.7102, lng: 7.262 },
  { name: "Nantes", postalCode: "44000", lat: 47.2184, lng: -1.5536 },
  { name: "Strasbourg", postalCode: "67000", lat: 48.5734, lng: 7.7521 },
  { name: "Montpellier", postalCode: "34000", lat: 43.611, lng: 3.8767 },
  { name: "Bordeaux", postalCode: "33000", lat: 44.8378, lng: -0.5792 },
  { name: "Lille", postalCode: "59000", lat: 50.6292, lng: 3.0573 },
  { name: "Rennes", postalCode: "35000", lat: 48.1173, lng: -1.6778 },
  { name: "Reims", postalCode: "51100", lat: 49.2583, lng: 4.0317 },
  { name: "Toulon", postalCode: "83000", lat: 43.1242, lng: 5.928 },
  { name: "Grenoble", postalCode: "38000", lat: 45.1885, lng: 5.7245 },
  { name: "Dijon", postalCode: "21000", lat: 47.3215, lng: 5.0415 },
  { name: "Angers", postalCode: "49000", lat: 47.4784, lng: -0.5632 },
  { name: "Nancy", postalCode: "54000", lat: 48.6921, lng: 6.1844 },
  { name: "Nîmes", postalCode: "30000", lat: 43.8367, lng: 4.3601 },
  { name: "Limoges", postalCode: "87000", lat: 45.8336, lng: 1.2611 },
  { name: "Tours", postalCode: "37000", lat: 47.3941, lng: 0.6848 },
  { name: "Amiens", postalCode: "80000", lat: 49.8941, lng: 2.2958 },
  { name: "Metz", postalCode: "57000", lat: 49.1193, lng: 6.1757 },
  { name: "Besançon", postalCode: "25000", lat: 47.2378, lng: 6.0241 },
  { name: "Brest", postalCode: "29200", lat: 48.3905, lng: -4.4861 },
  { name: "Orléans", postalCode: "45000", lat: 47.9029, lng: 1.9093 },
  { name: "Rouen", postalCode: "76000", lat: 49.4431, lng: 1.0993 },
  { name: "Caen", postalCode: "14000", lat: 49.1829, lng: -0.3707 },
  { name: "Mulhouse", postalCode: "68100", lat: 47.7508, lng: 7.3359 },
  { name: "Perpignan", postalCode: "66000", lat: 42.6886, lng: 2.8946 },
  { name: "Clermont-Ferrand", postalCode: "63000", lat: 45.7797, lng: 3.0863 },
]

export class GeocodingService {
  // Calculer la distance entre deux points GPS
  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLng = (lng2 - lng1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Obtenir la position GPS actuelle de l'utilisateur
  static getCurrentPosition(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("La géolocalisation n'est pas supportée par ce navigateur"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          let errorMessage = "Erreur de géolocalisation"
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "L'accès à la géolocalisation a été refusé"
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Les informations de localisation ne sont pas disponibles"
              break
            case error.TIMEOUT:
              errorMessage = "La demande de géolocalisation a expiré"
              break
          }
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    })
  }

  // Convertir des coordonnées GPS en adresse
  static async reverseGeocode(coordinates: Coordinates): Promise<Address> {
    try {
      // Essayer d'abord avec l'API Nominatim (OpenStreetMap)
      const nominatimResult = await this.reverseGeocodeWithNominatim(coordinates)
      if (nominatimResult) {
        return nominatimResult
      }
    } catch (error) {
      console.warn("Erreur avec Nominatim:", error)
    }

    // Fallback : utiliser notre base de données locale
    return this.reverseGeocodeLocal(coordinates)
  }

  // Géocodage inverse avec l'API Nominatim (OpenStreetMap)
  private static async reverseGeocodeWithNominatim(coordinates: Coordinates): Promise<Address | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}&zoom=18&addressdetails=1&accept-language=fr`,
        {
          headers: {
            "User-Agent": "Fixeo.pro/1.0",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data && data.address) {
        const address = data.address
        return {
          street: address.house_number && address.road ? `${address.house_number} ${address.road}` : address.road,
          city: address.city || address.town || address.village || address.municipality || "Ville inconnue",
          postalCode: address.postcode || "00000",
          country: address.country || "France",
        }
      }

      return null
    } catch (error) {
      console.error("Erreur Nominatim:", error)
      return null
    }
  }

  // Géocodage inverse local (fallback)
  private static reverseGeocodeLocal(coordinates: Coordinates): Address {
    // Trouver la ville la plus proche dans notre base de données
    let closestCity = FRENCH_CITIES[0]
    let minDistance = this.calculateDistance(coordinates.lat, coordinates.lng, closestCity.lat, closestCity.lng)

    for (const city of FRENCH_CITIES) {
      const distance = this.calculateDistance(coordinates.lat, coordinates.lng, city.lat, city.lng)
      if (distance < minDistance) {
        minDistance = distance
        closestCity = city
      }
    }

    return {
      city: closestCity.name,
      postalCode: closestCity.postalCode,
      country: "France",
    }
  }

  // Géolocaliser et obtenir l'adresse complète
  static async geolocateAndGetAddress(): Promise<Address> {
    const coordinates = await this.getCurrentPosition()
    const address = await this.reverseGeocode(coordinates)
    return address
  }
}
