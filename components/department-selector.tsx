"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { DepartmentService } from "@/lib/departments"

interface DepartmentSelectorProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  showSearch?: boolean
  className?: string
}

export function DepartmentSelector({
  value,
  onValueChange,
  placeholder = "Sélectionner un département",
  showSearch = true,
  className,
}: DepartmentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const departments = DepartmentService.getAllDepartments()

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.region.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showSearch && (
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un département..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
          </div>
        )}
        <SelectItem value="all">Tous les départements</SelectItem>
        {filteredDepartments.map((dept) => (
          <SelectItem key={dept.code} value={dept.code}>
            {dept.code} - {dept.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
