"use client"

import { useState, useEffect } from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { DepartmentSelector } from "@/components/department-selector"

interface Demande {
  id: string
  name: string
  email: string
  department: string
  urgent: boolean
  createdAt: Date
}

const data: Demande[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Marketing",
    urgent: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Sales",
    urgent: false,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    department: "Engineering",
    urgent: true,
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Bob Williams",
    email: "bob.williams@example.com",
    department: "HR",
    urgent: false,
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    department: "Finance",
    urgent: true,
    createdAt: new Date(),
  },
]

const columns: ColumnDef<Demande>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "department",
    header: "Département",
  },
  {
    accessorKey: "urgent",
    header: "Urgent",
    cell: ({ row }) => {
      const isUrgent = row.getValue("urgent")
      return isUrgent ? <Badge>Urgent</Badge> : null
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date de création",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return date.toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const demande = row.original
      const router = useRouter()
      const { toast } = useToast()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(demande.id)
                toast({
                  description: "Demande ID copié.",
                })
              }}
            >
              Copier ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/listes-demandes/${demande.id}`)}>
              Voir détails
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function ListesDemandesPage() {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [urgentFilter, setUrgentFilter] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [result, setResult] = useState<Demande[]>(data)

  useEffect(() => {
    let result: Demande[] = data

    // Filtre d'urgence
    if (urgentFilter) {
      result = result.filter((request) => request.urgent)
    }

    // Filtre de département
    if (departmentFilter !== "all") {
      result = result.filter((request) => request.department === departmentFilter)
    }

    setResult(result)
  }, [urgentFilter, departmentFilter])

  const table = useReactTable({
    data: result,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  })

  return (
    <div>
      <div className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">Listes des demandes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
        <Input
          type="text"
          placeholder="Rechercher..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Urgent</label>
          <Checkbox checked={urgentFilter} onCheckedChange={setUrgentFilter} />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Département</label>
          <DepartmentSelector
            value={departmentFilter}
            onValueChange={setDepartmentFilter}
            placeholder="Tous les départements"
            className="w-full"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
