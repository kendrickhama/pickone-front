"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Bell } from "lucide-react"

interface Notification {
  id: string
  userId: number
  message: string
  type: "FOLLOW" | "MESSAGE" | "APPLICATION" | "RECRUITMENT" | "LIKE"
  status: "UNREAD" | "READ"
  createdAt: string
}

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState<number>(0)

  useEffect(() => {
    const storedEmail = localStorage.getItem("email")
    setEmail(storedEmail)
  }, [])

  // 알림 데이터 가져오기
  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = localStorage.getItem("userId")
      const accessToken = localStorage.getItem("accessToken")
      
      if (!userId || !accessToken) {
        setUnreadCount(0)
        return
      }

      try {
        const response = await fetch(`/api/notifications`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.isSuccess && Array.isArray(data.result)) {
            const unreadNotifications = data.result.filter((notification: Notification) => 
              notification.status === "UNREAD"
            )
            setUnreadCount(unreadNotifications.length)
          }
        }
      } catch (error) {
        console.error('알림 데이터 가져오기 실패:', error)
        setUnreadCount(0)
      }
    }

    if (email) {
      fetchNotifications()
    }
  }, [email])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("email")
    localStorage.removeItem("userId")
    setEmail(null)
    setUnreadCount(0)
    router.push("/")
  }

  const navItems = [
    { href: "/", label: "홈" },
    { href: "/band", label: "밴드" },
    { href: "/recruit", label: "멤버모집" },
    { href: "/explore", label: "파동" },
    { href: "/chat", label: "채팅" },
    { href: "/profile", label: "마이페이지" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Pickone
          </Link>

          {/* PC 메뉴 */}
          <div className="hidden md:flex items-center space-x-8 font-semibold">
            {navItems.map((item) => {
              if (item.href === "/profile" && !email) return null
              return (
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
            })}
            {email && (
              <button
                onClick={() => router.push("/notifications")}
                className="text-gray-600 hover:text-gray-900 transition-colors relative"
                aria-label="알림 보기"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}
            {email ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 truncate max-w-xs">{email}</span>
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
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* 모바일 메뉴 */}
          <div className="md:hidden flex items-center space-x-4 px-2">
            {navItems.map((item) => {
              if (item.href === "/profile" && !email) return null
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-block text-sm text-gray-600 hover:text-gray-900 transition-colors",
                    pathname === item.href && "text-gray-900 font-medium"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            {email && (
              <button
                onClick={() => router.push("/notifications")}
                className="text-gray-600 hover:text-gray-900 transition-colors relative"
                aria-label="알림 보기"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}
            {!email && (
              <Link href="/login" className="inline-block">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-3 py-2 whitespace-nowrap"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
