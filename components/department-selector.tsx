"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DepartmentService } from "@/lib/departments"
import { Search } from "lucide-react"

interface DepartmentSelectorProps {
  value?: string
  onValueChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  showSearch?: boolean
}

export function DepartmentSelector({
  value,
  onValueChange,
  label = "Département",
  placeholder = "Sélectionnez votre département",
  required = false,
  showSearch = true,
}: DepartmentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const departments = DepartmentService.getAllDepartments()

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.includes(searchTerm) ||
      dept.region.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedDepartment = departments.find((dept) => dept.code === value)

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor="department">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un département..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder}>
            {selectedDepartment && DepartmentService.formatDepartmentDisplay(selectedDepartment)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {filteredDepartments.map((department) => (
            <SelectItem key={department.code} value={department.code}>
              <div className="flex flex-col">
                <span className="font-medium">{DepartmentService.formatDepartmentDisplay(department)}</span>
                <span className="text-xs text-gray-500">{department.region}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
