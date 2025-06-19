"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/recruit", label: "멤버모집" },
    { href: "/explore", label: "파동" },
    { href: "/profile", label: "마이페이지" },
    { href: "/login", label: "Login" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            pickone
          </Link>

          {/* PC 버전 메뉴 */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) =>
              item.label === "Login" ? (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {item.label}
                  </Button>
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-gray-600 hover:text-gray-900 transition-colors font-medium",
                    pathname === item.href && "text-gray-900"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* 모바일 버전 메뉴 */}
          <div className="md:hidden flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm text-gray-600 hover:text-gray-900 transition-colors",
                  pathname === item.href && "text-gray-900 font-medium"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}