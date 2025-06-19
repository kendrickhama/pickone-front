"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Heart, Share2, Eye } from "lucide-react"
import Navigation from "@/components/navigation"
import ModernButton from "@/components/modern-button"
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
    bgColor: "from-green-400 via-green-500 to-emerald-600",
  },
  {
    id: 2,
    title: "HELLO 2025",
    subtitle: "새로운 음악 여정을 시작하세요",
    description: "함께할 멤버를 찾아보세요",
    bgColor: "from-blue-400 via-blue-500 to-indigo-600",
  },
  {
    id: 3,
    title: "MUSIC TOGETHER",
    subtitle: "음악으로 하나되는 순간",
    description: "당신의 밴드를 만들어보세요",
    bgColor: "from-purple-400 via-purple-500 to-pink-600",
  },
]

const allRecruitPosts = [
  {
    id: 1,
    hashtag: "#따뜻한파도",
    title: "따뜻한파도",
    description: "모던 팝 키보드 세션을 구합니다. 포크와 시티팝을 좋아하는 분 환영.",
    tags: ["서울", "포크", "키보드", "모던"],
    bgColor: "from-cyan-500 via-blue-500 to-blue-600",
    likes: 24,
    views: 156,
  },
  {
    id: 2,
    hashtag: "#아직소년다",
    title: "아직소년다",
    description: "음악적 몰입기의 극을 올릴 베이시스트를 찾고 있습니다.",
    tags: ["대구", "드럼", "베이스"],
    bgColor: "from-orange-400 via-orange-500 to-red-500",
    likes: 18,
    views: 203,
  },
  {
    id: 3,
    hashtag: "#회색도시",
    title: "회색도시",
    description: "재즈/클래식을 기반으로 하는 혼성 세션 팀입니다.",
    tags: ["인천", "재즈", "기타", "피아노"],
    bgColor: "from-gray-600 via-gray-700 to-gray-800",
    likes: 31,
    views: 298,
  },
  {
    id: 4,
    hashtag: "#혈오",
    title: "혈오",
    description: "펑키한 리듬과 사운드 그리고 뜨거운 사람들이 모인 곳.",
    tags: ["부산", "펑크", "드럼"],
    bgColor: "from-red-500 via-pink-500 to-pink-600",
    likes: 42,
    views: 187,
  },
  {
    id: 5,
    hashtag: "#아직소년다",
    title: "아직소년다",
    description: "감성적 멜로디와 따뜻한 하모니를 추구하는 듀오입니다.",
    tags: ["서울", "어쿠스틱", "듀오"],
    bgColor: "from-amber-400 via-yellow-500 to-orange-500",
    likes: 27,
    views: 134,
  },
  {
    id: 6,
    hashtag: "#회색도시",
    title: "회색도시",
    description: "일렉트로닉과 록의 경계를 넘나드는 실험적 사운드.",
    tags: ["대전", "일렉트로닉", "기타"],
    bgColor: "from-purple-500 via-purple-600 to-pink-500",
    likes: 35,
    views: 221,
  },
  {
    id: 7,
    hashtag: "#새벽감성",
    title: "새벽감성",
    description: "새벽에 들으면 좋은 감성적인 음악을 만드는 팀입니다.",
    tags: ["서울", "인디", "어쿠스틱"],
    bgColor: "from-indigo-500 via-purple-500 to-pink-500",
    likes: 19,
    views: 142,
  },
  {
    id: 8,
    hashtag: "#록스피릿",
    title: "록스피릿",
    description: "클래식 록의 정신을 이어가는 밴드입니다.",
    tags: ["부산", "록", "기타"],
    bgColor: "from-red-600 via-orange-500 to-yellow-500",
    likes: 33,
    views: 267,
  },
  {
    id: 9,
    hashtag: "#재즈카페",
    title: "재즈카페",
    description: "카페에서 연주할 재즈 트리오를 모집합니다.",
    tags: ["대구", "재즈", "피아노"],
    bgColor: "from-amber-600 via-orange-500 to-red-500",
    likes: 28,
    views: 189,
  },
]

const POSTS_PER_PAGE = 6

export default function RecruitPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(allRecruitPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const currentPosts = allRecruitPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      {/* Hero Slider - 네비게이션 높이만큼 마진 추가 */}
      <section className="relative h-96 overflow-hidden mt-16">
        <div className="relative w-full h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                index === currentSlide
                  ? "translate-x-0"
                  : index < currentSlide
                    ? "-translate-x-full"
                    : "translate-x-full"
              }`}
            >
              <div
                className={`w-full h-full bg-gradient-to-r ${slide.bgColor} flex items-center justify-center relative overflow-hidden`}
              >
                <div className="text-center text-white z-10">
                  <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">{slide.title}</h1>
                  <p className="text-xl mb-2 drop-shadow-md">{slide.subtitle}</p>
                  <p className="text-sm opacity-90 drop-shadow-sm">{slide.description}</p>
                </div>
                {/* Enhanced decorative musical notes */}
                <div className="absolute top-10 right-20 text-white text-5xl opacity-20 animate-pulse">♪</div>
                <div className="absolute bottom-20 left-20 text-white text-4xl opacity-15 animate-bounce">♫</div>
                <div className="absolute top-1/3 left-1/4 text-white text-3xl opacity-10">♪</div>
                <div className="absolute bottom-1/3 right-1/3 text-white text-2xl opacity-20">♫</div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Navigation Arrows */}
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

        {/* Enhanced Slide Indicator */}
        <div className="absolute bottom-6 right-6 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
          {currentSlide + 1}/{heroSlides.length}
        </div>
      </section>

      {/* Modern Filter Section */}
      <section className="container mx-auto px-4 py-8">
        <ModernFilter />
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <div className={`w-full h-full bg-gradient-to-br ${post.bgColor} flex items-center justify-center`}>
                  <div className="text-center text-white z-10">
                    <h3 className="text-2xl font-bold drop-shadow-lg">{post.hashtag}</h3>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                {/* Stats overlay */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <div className="bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {post.views}
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    {post.likes}
                  </div>
                </div>

                {/* Hashtag overlay */}
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-white text-lg font-bold drop-shadow-lg">{post.hashtag}</h3>
                </div>
              </div>

              <CardContent className="p-5">
                <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200 transition-colors rounded-full"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <ModernButton variant="primary" size="sm">
                    자세히 보기
                  </ModernButton>
                  <div className="flex space-x-2">
                    <ModernButton variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </ModernButton>
                    <ModernButton variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </ModernButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </section>

      {/* Profile Slider Section */}
      <ProfileSlider />

      <Footer />
    </div>
  )
}
