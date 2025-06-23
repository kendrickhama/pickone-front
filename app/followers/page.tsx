// app/followers/page.tsx
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface User {
  id: number
  email: string
  nickname: string
  profileImageUrl: string | null
  isPublic: boolean
  role: string
}

interface ApiResponse {
  isSuccess: boolean
  message: string
  result: User[]
}

export default async function FollowersPage() {
  const userId = 1  // 실제로는 JWT나 세션에서 가져오세요
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"
  const res = await fetch(
    `${base}/api/follows/${userId}/followers`,
    { cache: "no-store" }
  )
  const data: ApiResponse = await res.json()
  const users = data.isSuccess ? data.result : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto p-6 pt-20">
        <h1 className="text-2xl font-bold mb-4">팔로워 목록</h1>
        {users.length === 0 ? (
          <p className="text-center text-gray-500">아직 팔로워가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((u) => (
              <Card key={u.id} className="flex items-center space-x-4 p-4">
                <img
                  src={u.profileImageUrl || "/default-avatar.png"}
                  alt={u.nickname}
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
                <CardContent className="p-0">
                  <Link href={`/profile`} className="text-lg font-semibold text-gray-800 hover:underline">
                    {u.nickname}
                  </Link>
                  <p className="text-gray-500 text-sm">{u.email}</p>
                  <div className="flex space-x-2 mt-1">
                    <Badge variant="secondary">{u.role}</Badge>
                    <Badge variant="secondary">{u.isPublic ? "공개" : "비공개"}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}