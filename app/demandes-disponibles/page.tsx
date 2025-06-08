"use client"

import React from "react"

interface Request {
  id: string
  description: string
  photos?: string[]
}

const DemandesDisponiblesPage = () => {
  const [requests, setRequests] = React.useState<Request[]>([
    {
      id: "1",
      description: "Besoin d'aide pour le jardinage",
      photos: ["https://picsum.photos/200/300", "https://picsum.photos/200/300", "https://picsum.photos/200/300"],
    },
    { id: "2", description: "Recherche personne pour promener mon chien", photos: ["https://picsum.photos/200/300"] },
    { id: "3", description: "Cours de maths niveau collège", photos: [] },
  ])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Demandes Disponibles</h1>
      {requests.map((request) => (
        <div key={request.id} className="bg-white shadow-md rounded-md p-4 mb-4">
          <p className="text-gray-700">{request.description}</p>
          {request.photos && request.photos.length > 0 && (
            <div className="mt-3">
              <div className="flex space-x-2">
                {request.photos.slice(0, 2).map((photo, index) => (
                  <div key={index} className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {request.photos.length > 2 && (
                  <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    +{request.photos.length - 2}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default DemandesDisponiblesPage
