"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wrench, UserPlus, MessageCircle } from "lucide-react"

export default function FloatingActionButtons() {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col space-y-3">
      {/* Bouton demande de réparation */}
      <Link href="/demande-reparation">
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 shadow-lg rounded-full h-14 w-14 p-0"
          title="Demander une réparation"
        >
          <Wrench className="h-6 w-6" />
        </Button>
      </Link>

      {/* Bouton devenir réparateur */}
      <Link href="/devenir-reparateur">
        <Button
          size="lg"
          variant="outline"
          className="bg-white border-green-600 text-green-600 hover:bg-green-50 shadow-lg rounded-full h-14 w-14 p-0"
          title="Devenir réparateur"
        >
          <UserPlus className="h-6 w-6" />
        </Button>
      </Link>

      {/* Bouton contact rapide */}
      <Link href="/contact">
        <Button
          size="lg"
          variant="outline"
          className="bg-white border-orange-600 text-orange-600 hover:bg-orange-50 shadow-lg rounded-full h-14 w-14 p-0"
          title="Contact rapide"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  )
}
