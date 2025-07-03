"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Bell } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const storedEmail = localStorage.getItem("email")
    setEmail(storedEmail)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("email")
    localStorage.removeItem("userId")
    setEmail(null)
    router.push("/") // 홈으로 이동
  }

  const navItems = [
    { href: "/", label: "홈" },
    { href: "/band", label: "밴드" },
    { href: "/recruit", label: "멤버모집" },
    { href: "/explore", label: "파동" },
    { href: "/profile", label: "마이페이지" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFFF] backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Pickone
          </Link>

          {/* PC 메뉴 */}
          <div className="font-semibold hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              // '/profile' 은 로그인된 상태에서만 보여줌
              if (item.href === "/profile" && !email) return null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-gray-600 hover:text-gray-900 transition-colors font-medium",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            {email && (
              <button
                onClick={() => router.push("/notifications")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="알림 보기"
              >
                <Bell className="w-5 h-5" />
              </button>
            )}

            {email ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">{email}</span>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* 모바일 메뉴 */}
          <div className="md:hidden flex items-center space-x-2">
            {navItems.map((item) => {
              if (item.href === "/profile" && !email) return null;
              return (
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
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}