// components/recruit-preview.tsx
'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Share2 } from "lucide-react"

interface Post {
  id: number
  title: string
  thumbnail: string | null
  genres: { genre: string[] }
  instruments: { instrument: string; proficiency: string }[]
}

export default function RecruitPreview() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const res = await fetch(`/api/recruitments?page=0&size=3`)
        if (!res.ok) throw new Error(`API 요청 실패: ${res.status}`)
        const json = await res.json()
        if (json.isSuccess) setPosts(json.result.content)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
        // 데이터 로드 후 fade-in 트리거
        setTimeout(() => setVisible(true), 50)
      }
    }
    fetchPosts()
  }, [])

  if (loading) return <div className="text-center py-16 text-gray-500">로딩 중...</div>
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>
  if (posts.length === 0) return null

  return (
    <section
      className={`bg-white py-16 px-4 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto text-left">
        <h2 className="text-xl font-semibold text-[#2F3438] mb-1">🎸 지금 모집 중인 밴드</h2>
        <h2 className="text-sm font-normal text-[#2F3438] mb-5"> 좋아하실 만한 모집을 보여드려요</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="max-w-sm shadow-md hover:shadow-lg transition">
              <Link href={`/recruit/${post.id}`}>
                <img
                  src={post.thumbnail || "/no-image.png"}
                  alt={post.title}
                  className="w-full h-40 object-cover rounded-t"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.genres.genre.map((g) => (
                      <Badge key={g}>{g}</Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.instruments.map((inst, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {inst.instrument.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Heart className="h-5 w-5 text-gray-500" />
                      <Share2 className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/recruit" className="text-orange-500 hover:underline text-sm font-medium">
            모집 게시판 전체 보기 →
          </Link>
        </div>
      </div>
    </section>
  )
}