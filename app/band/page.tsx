"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Ticket, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

// 오늘 공연 데이터
const todayShows = [
  {
    id: 1,
    bandName: "마포구보안관",
    venue: "홍대 클럽 FF",
    time: "20:00",
    price: "15,000원",
    genre: "인디록",
    location: "서울 홍대",
    image: "https://i.pinimg.com/736x/dd/b4/6c/ddb46c06252392988f757bd1b8c4ad4e.jpg",
    ticketUrl: "#",
  },
  {
    id: 2,
    bandName: "회색도시",
    venue: "부산 라이브클럽",
    time: "19:30",
    price: "12,000원",
    genre: "재즈",
    location: "부산 서면",
    image: "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg",
    ticketUrl: "#",
  },
  {
    id: 3,
    bandName: "아직소년다",
    venue: "대구 뮤직홀",
    time: "21:00",
    price: "18,000원",
    genre: "포크",
    location: "대구 중구",
    image: "https://i.pinimg.com/736x/b4/bb/e9/b4bbe942e86a4765816788971719066e.jpg",
    ticketUrl: "#",
  },
  {
    id: 4,
    bandName: "혈오",
    venue: "인천 락클럽",
    time: "20:30",
    price: "20,000원",
    genre: "펑크",
    location: "인천 구월동",
    image: "https://i.pinimg.com/736x/5f/0b/c1/5f0bc1d993a7ffb11b79c6d92a9e4aeb.jpg",
    ticketUrl: "#",
  },
]

// 공연 달력 데이터 (예시)
const concertCalendar = [
  {
    id: 1,
    date: "2025-06-20",
    bandName: "새벽감성",
    venue: "홍대 클럽 스테이지",
    time: "19:00",
    price: "15,000원",
    genre: "인디",
    location: "서울",
  },
  {
    id: 2,
    date: "2025-06-21",
    bandName: "록스피릿",
    venue: "부산 라이브하우스",
    time: "20:00",
    price: "18,000원",
    genre: "록",
    location: "부산",
  },
  {
    id: 3,
    date: "2025-06-22",
    bandName: "재즈카페",
    venue: "대구 재즈바",
    time: "21:00",
    price: "25,000원",
    genre: "재즈",
    location: "대구",
  },
  {
    id: 4,
    date: "2025-06-23",
    bandName: "일렉트로닉웨이브",
    venue: "서울 클럽 옥타곤",
    time: "22:00",
    price: "30,000원",
    genre: "일렉트로닉",
    location: "서울",
  },
  {
    id: 5,
    date: "2025-06-24",
    bandName: "어쿠스틱소울",
    venue: "인천 소극장",
    time: "19:30",
    price: "12,000원",
    genre: "어쿠스틱",
    location: "인천",
  },
  {
    id: 6,
    date: "2025-06-25",
    bandName: "메탈스톰",
    venue: "대전 락클럽",
    time: "20:30",
    price: "22,000원",
    genre: "메탈",
    location: "대전",
  },
]

const bandProfiles = [
  {
    name: "마포구보안관",
    genre: "인디록",
    image: "https://i.pinimg.com/736x/dd/b4/6c/ddb46c06252392988f757bd1b8c4ad4e.jpg",
    bio: "홍대 인디씬을 대표하는 감성 밴드. 감각적인 멜로디와 진솔한 가사로 많은 팬들의 사랑을 받고 있습니다.",
    location: "서울 홍대",
    since: "2017년"
  },
  {
    name: "회색도시",
    genre: "재즈",
    image: "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg",
    bio: "몽환적인 재즈와 블루스의 조화. 감미로운 연주와 보컬이 매력적인 밴드.",
    location: "부산 서면",
    since: "2015년"
  },
  {
    name: "아직소년다",
    genre: "포크",
    image: "https://i.pinimg.com/736x/b4/bb/e9/b4bbe942e86a4765816788971719066e.jpg",
    bio: "청춘의 감성을 노래하는 포크 밴드. 따뜻한 멜로디와 서정적인 가사로 유명.",
    location: "대구 중구",
    since: "2019년"
  },
  {
    name: "혈오",
    genre: "펑크",
    image: "https://i.pinimg.com/736x/5f/0b/c1/5f0bc1d993a7ffb11b79c6d92a9e4aeb.jpg",
    bio: "강렬한 사운드와 에너지 넘치는 무대. 젊은 세대의 분노와 자유를 대변.",
    location: "인천 구월동",
    since: "2018년"
  },
];

export default function BandsPage() {
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [currentSlide, setCurrentSlide] = useState(0)

  // 필터링된 공연 목록
  const filteredConcerts = concertCalendar.filter((concert) => {
    const locationMatch = selectedLocation === "all" || concert.location === selectedLocation
    const genreMatch = selectedGenre === "all" || concert.genre === selectedGenre

    let priceMatch = true
    if (selectedPriceRange !== "all") {
      const price = Number.parseInt(concert.price.replace(/[^0-9]/g, ""))
      switch (selectedPriceRange) {
        case "under15":
          priceMatch = price < 15000
          break
        case "15to25":
          priceMatch = price >= 15000 && price <= 25000
          break
        case "over25":
          priceMatch = price > 25000
          break
      }
    }

    return locationMatch && genreMatch && priceMatch
  })

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % todayShows.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + todayShows.length) % todayShows.length)
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">밴드 공연</h1>
            <p className="text-gray-600">인디 밴드들의 공연 정보를 확인하세요</p>
          </div>
          <Button 
            onClick={() => window.location.href = '/band/register'} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            밴드 등록하기
          </Button>
        </div>

        {/* 오늘의 공연 */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <div className="w-2 h-8 bg-orange-500 rounded-full mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">🎵 오늘의 공연</h2>
          </div>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {todayShows.map((show) => (
                <div key={show.id} className="w-full flex-shrink-0">
                  <Card className="bg-white border border-orange-200 rounded-3xl shadow-xl min-h-[340px] flex items-stretch overflow-hidden">
                    <CardContent className="p-0 flex flex-row items-stretch min-h-[340px]">
                      <div className="relative w-2/5 min-w-[200px] max-w-[320px] flex-shrink-0 flex items-center justify-center bg-gray-100">
                        <img
                          src={show.image || "/placeholder.svg"}
                          alt={show.bandName}
                          className="w-full h-full object-cover object-center rounded-none border-r-2 border-orange-200 shadow-xl"
                          style={{ minHeight: 340, maxHeight: 420 }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none rounded-none" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center px-10 py-8 gap-4">
                        <h3 className="text-3xl font-extrabold text-gray-900 mb-1 leading-tight drop-shadow">{show.bandName}</h3>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 border border-orange-200 mb-2 text-base px-4 py-1 rounded-full">{show.genre}</Badge>
                        <div className="flex flex-wrap gap-6 text-lg text-gray-700 font-medium">
                          <span className="flex items-center"><MapPin className="h-5 w-5 mr-1 text-orange-400" />{show.venue}</span>
                          <span className="flex items-center"><Clock className="h-5 w-5 mr-1 text-orange-400" />{show.time}</span>
                          <span className="flex items-center"><Ticket className="h-5 w-5 mr-1 text-orange-400" />{show.price}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mt-2">{show.location}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {todayShows.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-orange-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="border-b border-gray-200 mt-10" />
        </section>

        {/* 공연 필터 */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <div className="w-2 h-6 bg-orange-400 rounded-full mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Filter className="h-5 w-5 text-orange-400" /> 공연 필터</h3>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 mb-2 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="지역 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 지역</SelectItem>
                    <SelectItem value="서울">서울</SelectItem>
                    <SelectItem value="부산">부산</SelectItem>
                    <SelectItem value="대구">대구</SelectItem>
                    <SelectItem value="인천">인천</SelectItem>
                    <SelectItem value="대전">대전</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">장르</label>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="장르 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 장르</SelectItem>
                    <SelectItem value="인디">인디</SelectItem>
                    <SelectItem value="록">록</SelectItem>
                    <SelectItem value="재즈">재즈</SelectItem>
                    <SelectItem value="일렉트로닉">일렉트로닉</SelectItem>
                    <SelectItem value="어쿠스틱">어쿠스틱</SelectItem>
                    <SelectItem value="메탈">메탈</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">가격대</label>
                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="가격대 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 가격</SelectItem>
                    <SelectItem value="under15">15,000원 미만</SelectItem>
                    <SelectItem value="15to25">15,000원 - 25,000원</SelectItem>
                    <SelectItem value="over25">25,000원 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-200 mt-8" />
        </section>

        {/* 공연 일정 */}
        <section>
          <div className="flex items-center mb-6 mt-2">
            <div className="w-2 h-8 bg-orange-500 rounded-full mr-3" />
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">📅 공연 일정</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConcerts.map((concert) => (
              <Card key={concert.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <CardContent className="p-6 flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{concert.bandName}</h4>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 border border-orange-200">
                        {concert.genre}
                      </Badge>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {new Date(concert.date).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{concert.venue}</span>
                    <span className="flex items-center"><Clock className="h-4 w-4 mr-1" />{concert.time}</span>
                    <span className="flex items-center"><Ticket className="h-4 w-4 mr-1" />{concert.price}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">{concert.location}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredConcerts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">선택한 조건에 맞는 공연이 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">다른 필터 조건을 선택해보세요.</p>
            </div>
          )}
          <div className="border-b border-gray-200 mt-12" />
        </section>

        {/* 여러 밴드 프로필 하단 추가 */}
        <section className="mt-16 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-2 h-8 bg-orange-500 rounded-full mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">밴드 프로필</h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-2">
            {bandProfiles.map((band, idx) => (
              <Card key={band.name + idx} className="min-w-[320px] max-w-xs flex flex-col items-center bg-white/90 border border-gray-200 shadow rounded-2xl p-8">
                <img
                  src={band.image}
                  alt={band.name}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-orange-200 shadow mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">{band.name}</h3>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 border border-orange-200 mb-2">{band.genre}</Badge>
                <p className="text-gray-700 text-sm mb-2 text-center">{band.bio}</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  <span className="text-xs text-gray-500">활동지역: {band.location}</span>
                  <span className="text-xs text-gray-500">결성: {band.since}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
