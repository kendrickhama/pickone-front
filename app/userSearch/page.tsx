// app/search/page.tsx
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search } from "lucide-react"

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
  result: {
    content: User[]
    pageable: any
    totalPages: number
    totalElements: number
  }
}

interface PageProps {
  searchParams: {
    keyword?: string
    onlyPublic?: string
    page?: string
    size?: string
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"
  const keyword = encodeURIComponent(searchParams.keyword || "")
  const onlyPublic = searchParams.onlyPublic ?? "true"
  const page = searchParams.page ?? "0"
  const size = searchParams.size ?? "10"

  const res = await fetch(
    `${base}/api/users/search?keyword=${keyword}&onlyPublic=${onlyPublic}&page=${page}&size=${size}`,
    { cache: "no-store" }
  )
  const data: ApiResponse = await res.json()
  const users = data.isSuccess ? data.result.content : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-4xl mx-auto p-6 pt-20">
        <h1 className="text-2xl font-bold mb-6">사용자 검색 결과</h1>

        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2">“{searchParams.keyword}”에 대한 검색 결과가 없습니다.</p>
            <p className="text-gray-400">다른 키워드로 검색해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((user) => (
              <Card
                key={user.id}
                className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={user.profileImageUrl || "/default-avatar.png"}
                  alt={user.nickname}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <CardContent className="p-0">
                  <Link
                    href={`/profile`}
                    className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition"
                  >
                    {user.nickname}
                  </Link>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                  <div className="flex space-x-2 mt-2">
                    <Badge variant="secondary">{user.role}</Badge>
                    <Badge variant="secondary">{user.isPublic ? "공개" : "비공개"}</Badge>
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