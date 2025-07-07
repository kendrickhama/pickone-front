"use client"

import { useEffect, useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Bell, User, MessageCircle, Users, Heart, Megaphone } from "lucide-react"

interface Notification {
  id: string
  userId: number
  message: string
  type: "FOLLOW" | "MESSAGE" | "APPLICATION" | "RECRUITMENT" | "LIKE"
  status: "UNREAD" | "READ"
  createdAt: string
  fromNickname?: string // 팔로우 등에서 보낸 사람 닉네임
}

const typeIconMap = {
  FOLLOW: <User className="w-5 h-5 text-blue-500" />,
  MESSAGE: <MessageCircle className="w-5 h-5 text-green-500" />,
  APPLICATION: <Users className="w-5 h-5 text-orange-500" />,
  RECRUITMENT: <Megaphone className="w-5 h-5 text-purple-500" />,
  LIKE: <Heart className="w-5 h-5 text-pink-500" />,
}

function getNotificationText(n: Notification) {
  if (n.type === "FOLLOW") {
    // message에 닉네임이 포함되어 있지 않으면 fromNickname 사용, 없으면 fallback
    if (n.fromNickname) {
      return `${n.fromNickname}님이 회원님을 팔로우합니다.`
    }
    // message가 "xxx님이 회원님을 팔로우합니다." 형식이면 그대로 사용
    if (n.message && n.message.includes("회원님을 팔로우")) {
      return n.message
    }
    // fallback
    return `새로운 사용자가 회원님을 팔로우합니다.`
  }
  return n.message
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      setError("로그인이 필요합니다.")
      setLoading(false)
      return
    }
    fetch(`/api/notifications/${userId}`)
      .then(res => res.json())
      .then(json => {
        if (json.isSuccess && Array.isArray(json.result)) {
          setNotifications(json.result)
        } else {
          setError("알림을 불러오지 못했습니다.")
        }
      })
      .catch(() => setError("알림을 불러오지 못했습니다."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Bell className="w-7 h-7 text-orange-500" /> 알림
        </h1>
        {loading ? (
          <div className="text-center text-gray-500 py-12">로딩 중...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-400 py-12">알림이 없습니다.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`flex items-start gap-4 py-5 transition-colors ${n.status === "UNREAD" ? "bg-[#FFF9F3]" : "bg-white"}`}
                onClick={async () => {
                  if (n.status === "READ") return;
                  // optimistic update
                  setNotifications((prev) => prev.map((item) =>
                    item.id === n.id ? { ...item, status: "READ" } : item
                  ));
                  try {
                    await fetch(`/api/notifications/${n.id}/read`, { method: "PATCH" });
                  } catch (e) {
                    // 실패 시 다시 UNREAD로 롤백 (선택)
                    setNotifications((prev) => prev.map((item) =>
                      item.id === n.id ? { ...item, status: "UNREAD" } : item
                    ));
                  }
                }}
                style={{ cursor: n.status === "UNREAD" ? "pointer" : "default" }}
              >
                <div className="mt-1">{typeIconMap[n.type] || <Bell className="w-5 h-5 text-gray-400" />}</div>
                <div className="flex-1">
                  <div className={`font-medium ${n.status === "UNREAD" ? "text-orange-700" : "text-gray-800"}`}>{getNotificationText(n)}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {n.status === "UNREAD" && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-orange-400 text-white font-semibold">NEW</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  )
} 