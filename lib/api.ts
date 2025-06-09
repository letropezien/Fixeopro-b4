// Classe API pour gérer les requêtes vers le backend
export class ApiService {
  private baseUrl: string
  private headers: HeadersInit

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
    this.headers = {
      "Content-Type": "application/json",
    }
  }

  // Méthode pour définir un token d'authentification
  setAuthToken(token: string) {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  // Méthode générique pour les requêtes GET
  async get<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    // Ajouter les paramètres à l'URL
    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key])
    })

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      return (await response.json()) as T
    } catch (error) {
      console.error("API GET request failed:", error)
      throw error
    }
  }

  // Méthode générique pour les requêtes POST
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      return (await response.json()) as T
    } catch (error) {
      console.error("API POST request failed:", error)
      throw error
    }
  }

  // Méthode générique pour les requêtes PUT
  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: this.headers,
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      return (await response.json()) as T
    } catch (error) {
      console.error("API PUT request failed:", error)
      throw error
    }
  }

  // Méthode générique pour les requêtes DELETE
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      return (await response.json()) as T
    } catch (error) {
      console.error("API DELETE request failed:", error)
      throw error
    }
  }

  // Méthode pour uploader des fichiers
  async uploadFile(endpoint: string, file: File, additionalData: Record<string, any> = {}): Promise<any> {
    const formData = new FormData()
    formData.append("file", file)

    // Ajouter des données supplémentaires si nécessaire
    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key])
    })

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          // Ne pas inclure Content-Type ici, il sera automatiquement défini avec le boundary
          Authorization: this.headers["Authorization"],
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API file upload failed:", error)
      throw error
    }
  }
}

// Exporter une instance par défaut
export const api = new ApiService()
