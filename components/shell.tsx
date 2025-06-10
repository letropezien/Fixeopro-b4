import type React from "react"
import { cn } from "@/lib/utils"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div className={cn("grid items-start gap-8", className)} {...props}>
      {children}
    </div>
  )
}

interface ShellHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function ShellHeader({ children, className, ...props }: ShellHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  )
}

interface ShellContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function ShellContent({ children, className, ...props }: ShellContentProps) {
  return (
    <div className={cn("grid gap-4", className)} {...props}>
      {children}
    </div>
  )
}
