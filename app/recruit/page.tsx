// app/recruit/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Heart, Share2, Eye, Plus } from "lucide-react"
import Navigation from "@/components/navigation"
import ModernFilter from "@/components/modern-filter"
import Pagination from "@/components/pagination"
import ProfileSlider from "@/components/profile-slider"
import Footer from "@/components/footer"

const heroSlides = [
  {
    id: 1,
    title: "GOOD BYE 2024",
    subtitle: "여기에 광고나 멤버모집글을 올릴...",
    description: "아무거나 뭔가",
    src: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241227_62%2F1735271197300mpNp2_JPEG%2FIMG_9202.jpeg"
  },
  {
    id: 2,
    title: "HELLO 2025",
    subtitle: "새로운 음악 여정을 시작하세요",
    description: "함께할 멤버를 찾아보세요",
    src:"https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250106_149%2F1736155489180a8mRy_JPEG%2FIMG_9838.jpeg"
  },
  {
    id: 3,
    title: "MUSIC TOGETHER",
    subtitle: "음악으로 하나되는 순간",
    description: "당신의 밴드를 만들어보세요",
    src:"https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240928_121%2F1727517617300r7BOW_JPEG%2F40482293-F930-4D27-89DC-08C70855DCF7.jpeg"
  },
]

export default function RecruitPage() {
  const POSTS_PER_PAGE = 6

  const [currentSlide, setCurrentSlide] = useState(0)

  const [currentPage, setCurrentPage] = useState(1) // 1-based page index for UI
  const [totalPages, setTotalPages] = useState(1)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // 히어로 슬라이드 제어
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }
  const handleNew = () => {
    router.push("/recruit/new")
  }


  // 페이지 변경 시 최상단으로 스크롤
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // API 호출: currentPage, POSTS_PER_PAGE에 따라
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        // 백엔드가 0-based 페이지를 사용한다면 currentPage-1을 쓸 수 있음.
        // 여기서는 백엔드가 1-based 페이지를 받는다고 가정. 
        // 만약 0-based라면 `page=${currentPage-1}`
        const res = await fetch(`/api/recruitments?page=${currentPage - 1}&size=${6}`, {
          headers: {
            Accept: "application/json",
          },
        })
        if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`)
        }
        const data = await res.json()


        console.log("✅ 백엔드 응답:", data)
        if (!data.isSuccess) {
          throw new Error(data.message || "데이터를 불러오지 못했습니다.")
        }
        const result = data.result
        setPosts(result.content || [])
        setTotalPages(result.totalPages > 0 ? result.totalPages : 1)
      } catch (e: any) {
        console.error("Error fetching recruitments:", e)
        setError(e.message || "데이터를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [currentPage])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      {/* Hero Slider */}
      <section className="relative h-96 overflow-hidden mt-16">
        <div className="relative w-full h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${index === currentSlide
                ? "translate-x-0"
                : index < currentSlide
                  ? "-translate-x-full"
                  : "translate-x-full"
                }`}
            >
              <div
                className="w-full h-full flex items-center justify-center relative overflow-hidden"
                style={{
                  backgroundImage: `url(${slide.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* 텍스트 오버레이 */}
                <div className="text-center text-white z-10">
                  <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-xl mb-2 drop-shadow-md">{slide.subtitle}</p>
                  <p className="text-sm opacity-90 drop-shadow-sm">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}</div>
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
        <div className="absolute bottom-6 right-6 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
          {currentSlide + 1}/{heroSlides.length}
        </div>
      </section>


      {/* Modern Filter */}
      <section className="container mx-auto px-4 py-8">
        <ModernFilter />
      </section>

      {/* 필터 및 글쓰기 버튼 */}
      <section className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button
          onClick={handleNew}
          className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          <Plus className="w-5 h-5 mr-2" />
          글쓰기
        </button>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 pb-8">
        {loading ? (
          <p className="text-center text-gray-500">로딩 중...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">게시물이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <Card
                key={post.id}
                className="overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
              >
                {/* 썸네일 영역 */}
                <div className="relative h-48 overflow-hidden">
                  {post.thumbnail ? (
                    // Next.js Image를 쓰고 싶다면 import Image from "next/image" 후 사용
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gray-200 flex items-center justify-center`}>
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                  {/* optional stats 영역(예: views/likes)이 API에 없으면 생략) */}
                  {/* <div className="absolute top-3 right-3 flex space-x-2">
                    ...
                  </div> */}

                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white text-lg font-bold drop-shadow-lg">
                      {post.region || ""}
                    </h3>
                  </div>
                </div>

                {/* 내용 영역 */}
                <CardContent className="p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.description}
                  </p>

                  {/* 장르 태그 */}
                  {post.genres?.genre && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.genres.genre.map((genre: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs bg-orange-100 text-orange-700 border border-orange-200 rounded-full"
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* 상세보기 및 공유 등 */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        // 예: 상세 페이지로 이동
                        router.push(`/recruit/${post.id}`)
                      }}
                      className="text-white bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded text-sm"
                    >
                      자세히 보기
                    </button>
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-red-500">
                        <Heart className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-blue-500">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && posts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>

      {/* Profile Slider */}
      <ProfileSlider />

      <Footer />
    </div>
  )
}