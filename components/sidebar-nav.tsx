import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon?: React.ReactNode
  }[]
  currentPath?: string
}

export function SidebarNav({ className, items, currentPath, ...props }: SidebarNavProps) {
  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {items.map((item) => {
        const isActive = currentPath === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium",
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground",
            )}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
