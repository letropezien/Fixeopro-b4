import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AuthButtonServer from "@/components/auth-button-server"
import type { User } from "@supabase/supabase-js"

async function getSession() {
  const supabase = createServerComponentClient({ cookies })
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

async function getRequests() {
  const supabase = createServerComponentClient({ cookies })
  try {
    const { data: requests, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching requests:", error)
      return []
    }

    return requests || []
  } catch (error) {
    console.error("Unexpected error fetching requests:", error)
    return []
  }
}

const canViewOwnData = (currentUser: User | null, request: any) => {
  if (!currentUser) return false

  // Les clients peuvent voir leurs propres demandes
  if (currentUser.user_metadata.userType === "client" && currentUser.id === request.clientId) return true

  // Les admins peuvent tout voir
  if (currentUser.user_metadata.userType === "admin") return true

  // Les réparateurs avec abonnement/essai peuvent voir
  if (currentUser.user_metadata.userType === "reparateur") {
    if (currentUser.user_metadata.subscription?.status === "active") return true
    if (currentUser.user_metadata.subscription?.status === "trial") {
      const expiresAt = new Date(currentUser.user_metadata.subscription.endDate)
      return expiresAt > new Date()
    }
  }

  return false
}

export default async function MesDemandes() {
  const session = await getSession()
  if (!session) {
    redirect("/")
  }

  const requests = await getRequests()
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Mes Demandes</h1>
      <AuthButtonServer />

      {requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white shadow-md rounded-md p-4">
              <h2 className="text-xl font-semibold mb-2">Demande #{request.id}</h2>
              <p>
                <strong>Description:</strong> {request.description}
              </p>
              <p>
                <strong>Status:</strong> {request.status}
              </p>
              {canViewOwnData(user, request) ? (
                <>
                  <p>
                    <strong>Client ID:</strong> {request.clientId}
                  </p>
                  <p>
                    <strong>Created At:</strong> {request.created_at}
                  </p>
                </>
              ) : (
                <p>Vous n'avez pas la permission de voir les détails de cette demande.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune demande trouvée.</p>
      )}
    </div>
  )
}
