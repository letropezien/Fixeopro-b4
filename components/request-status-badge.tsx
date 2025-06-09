import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle, MessageSquare } from "lucide-react"

interface RequestStatusBadgeProps {
  status: "new" | "in_progress" | "completed" | "open"
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  switch (status) {
    case "new":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Nouvelle
        </Badge>
      )
    case "in_progress":
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
          <Clock className="h-3 w-3 mr-1" />
          En cours
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Terminée
        </Badge>
      )
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Ouverte</Badge>
  }
}

interface ResponseCountBadgeProps {
  count: number
}

export function ResponseCountBadge({ count }: ResponseCountBadgeProps) {
  let bgColor = "bg-gray-100 text-gray-700"

  if (count === 0) {
    bgColor = "bg-red-50 text-red-700"
  } else if (count >= 5) {
    bgColor = "bg-green-50 text-green-700"
  } else if (count >= 1) {
    bgColor = "bg-blue-50 text-blue-700"
  }

  return (
    <Badge variant="outline" className={`${bgColor}`}>
      <MessageSquare className="h-3 w-3 mr-1" />
      {count} réponse{count > 1 ? "s" : ""}
    </Badge>
  )
}
