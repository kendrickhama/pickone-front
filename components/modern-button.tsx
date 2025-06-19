import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type LucideIcon } from 'lucide-react'

interface ModernButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  icon?: LucideIcon
  className?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

export default function ModernButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className,
  onClick,
  type = "button",
  disabled = false,
}: ModernButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl focus:ring-orange-500 border-0",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 shadow-md hover:shadow-lg focus:ring-gray-500 border-0",
    outline: "border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 shadow-sm hover:shadow-md focus:ring-orange-500 bg-white",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500"
  }

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  )
}
