'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Share2 } from "lucide-react"

export default function RecruitPreview() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"
      const res = await fetch(`${base}/api/recruitments?page=0&size=3`)
      const json = await res.json()
      if (json.isSuccess) setPosts(json.result.content)
    }
    fetchPosts()
  }, [])

  if (!posts.length) return null

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-left">
        <h2 className="text-3xl font-semibold text-[#292929] mb-6">🎸 지금 모집 중인 밴드</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
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
                    {post.genres.genre.map((g: string) => (
                      <Badge key={g}>{g}</Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.instruments.map((inst: any, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
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