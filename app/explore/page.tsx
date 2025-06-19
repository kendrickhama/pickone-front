"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Heart, MessageCircle, Music, MapPin } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

// 프로필 데이터에 간단한 크기 정보 추가
const exploreProfiles = [
  {
    id: 1,
    name: "마포구보안관",
    instrument: "기타리스트",
    experience: "12년차",
    genres: ["인디록", "포스트락"],
    location: "서울",
    image: "https://i.pinimg.com/736x/dd/b4/6c/ddb46c06252392988f757bd1b8c4ad4e.jpg",
    likes: 124,
    comments: 23,
    isOnline: true,
    size: "square", // 정방형
  },
  {
    id: 2,
    name: "JunoBass",
    instrument: "베이시스트",
    experience: "7년차",
    genres: ["재즈", "펑크"],
    location: "부산",
    image: "https://antiegg.kr/wp-content/uploads/2023/10/maxresdefault-1024x576.jpg.webp",
    likes: 89,
    comments: 15,
    isOnline: false,
    size: "wide", // 가로로 긴 정방형
  },
  {
    id: 3,
    name: "SkySynth",
    instrument: "키보디스트",
    experience: "6년차",
    genres: ["신스팝", "시티팝"],
    location: "대구",
    image: "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg",
    likes: 156,
    comments: 31,
    isOnline: true,
    size: "square", // 정방형
  },
  {
    id: 4,
    name: "ChloeBeats",
    instrument: "드러머",
    experience: "9년차",
    genres: ["펑크", "개러지락"],
    location: "인천",
    image: "https://i.pinimg.com/736x/b4/bb/e9/b4bbe942e86a4765816788971719066e.jpg",
    likes: 203,
    comments: 42,
    isOnline: true,
    size: "tall", // 세로로 긴 정방형
  },
  {
    id: 5,
    name: "apeDl",
    instrument: "베이시스트",
    experience: "8년차",
    genres: ["인디록", "포스트락"],
    location: "대전",
    image:
      "https://i.namu.wiki/i/bXgWecuHqGZAXWYTginORjT1lwPsEMnhKht1BvbrBEsL0LvRQRrJ8nne5xNxU4EyNO_8oGRqZY2NaEqE8VOh1Q.webp",
    likes: 178,
    comments: 28,
    isOnline: false,
    size: "square", // 정방형
  },
  {
    id: 6,
    name: "SilverChorus",
    instrument: "보컬",
    experience: "4년차",
    genres: ["인디록", "드림팝"],
    location: "광주",
    image: "https://pbs.twimg.com/media/FZhPvKRagAApeTS.jpg:large",
    likes: 267,
    comments: 56,
    isOnline: true,
    size: "square", // 정방형
  },
  {
    id: 7,
    name: "MoonRhythm",
    instrument: "기타리스트",
    experience: "2년차",
    genres: ["재즈", "네오소울"],
    location: "서울",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxHrDzYAfubzNL0klPwAooy6JZ2O2taXNzgg&s",
    likes: 92,
    comments: 18,
    isOnline: false,
    size: "wide", // 가로로 긴 정방형
  },
  {
    id: 8,
    name: "EchoVox",
    instrument: "보컬",
    experience: "5년차",
    genres: ["얼터너티브", "드림팝"],
    location: "부산",
    image:
      "https://i.namu.wiki/i/zfs_EIH_bwl3rbQ9330EEK3ACa6AYnSHerx6BBn9WmLqouccC2viicvLBoP7QuiYe5D7-HFYuBGIThy15PeTcA.webp",
    likes: 145,
    comments: 33,
    isOnline: true,
    size: "square", // 정방형
  },
  {
    id: 9,
    name: "TapeDelay",
    instrument: "기타리스트",
    experience: "12년차",
    genres: ["인디록", "포스트락"],
    location: "대구",
    image: "https://i.pinimg.com/736x/b7/3d/ec/b73dec992e56a97bb6c21057d8418aef.jpg",
    likes: 234,
    comments: 47,
    isOnline: false,
    size: "tall", // 세로로 긴 정방형
  },
  {
    id: 10,
    name: "VintageSound",
    instrument: "기타리스트",
    experience: "15년차",
    genres: ["클래식록", "블루스"],
    location: "서울",
    image: "https://i.pinimg.com/736x/eb/ce/bc/ebcebc433bbae95d52eb8848f7017744.jpg",
    likes: 189,
    comments: 35,
    isOnline: true,
    size: "square", // 정방형
  },
  {
    id: 11,
    name: "ElectroWave",
    instrument: "신디사이저",
    experience: "8년차",
    genres: ["일렉트로닉", "앰비언트"],
    location: "인천",
    image: "https://i.pinimg.com/736x/8c/bd/e0/8cbde006346633f0a007d0a71dbe7c80.jpg",
    likes: 167,
    comments: 29,
    isOnline: false,
    size: "square", // 정방형
  },
  {
    id: 12,
    name: "JazzCat",
    instrument: "색소폰",
    experience: "11년차",
    genres: ["재즈", "퓨전"],
    location: "부산",
    image: "https://i.pinimg.com/736x/b4/bb/e9/b4bbe942e86a4765816788971719066e.jpg",
    likes: 198,
    comments: 41,
    isOnline: true,
    size: "square", // 가로로 긴 정방형
  },
  {
    id: 13,
    name: "RockStar",
    instrument: "보컬",
    experience: "10년차",
    genres: ["록", "메탈"],
    location: "서울",
    image: "https://i.pinimg.com/736x/5f/0b/c1/5f0bc1d993a7ffb11b79c6d92a9e4aeb.jpg",
    likes: 312,
    comments: 67,
    isOnline: true,
    size: "square", // 정방형
  },
  {
    id: 14,
    name: "BluesMaster",
    instrument: "기타리스트",
    experience: "20년차",
    genres: ["블루스", "재즈"],
    location: "부산",
    image: "https://i.pinimg.com/736x/8c/bd/e0/8cbde006346633f0a007d0a71dbe7c80.jpg",
    likes: 445,
    comments: 89,
    isOnline: false,
    size: "tall", // 세로로 긴 정방형
  },
  {
    id: 15,
    name: "SynthWave",
    instrument: "키보디스트",
    experience: "6년차",
    genres: ["신스웨이브", "일렉트로닉"],
    location: "대구",
    image: "https://i.pinimg.com/736x/dd/b4/6c/ddb46c06252392988f757bd1b8c4ad4e.jpg",
    likes: 234,
    comments: 45,
    isOnline: true,
    size: "square", // 정방형
  },
]

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<any>(null)

  const filteredProfiles = exploreProfiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.instrument.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.genres.some((genre) => genre.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">파동</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="이름, 악기, 장르로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 rounded-xl"
            />
          </div>
        </div>

        {/* Instagram-style Grid Layout - 3가지 사이즈만 사용 */}
        <div className="grid grid-cols-3 gap-[1px] auto-rows-[120px] md:auto-rows-[160px] lg:auto-rows-[200px]">
          {filteredProfiles.map((profile) => {
            // 3가지 레이아웃만 사용
            let gridClass = ""
            switch (profile.size) {
              case "wide":
                gridClass = "col-span-1 row-span-1" // 가로로 긴 정방형 (2x1)
                break
              case "tall":
                gridClass = "col-span-2 row-span-2" // 세로로 긴 정방형 (1x2)
                break
              default:
                gridClass = "col-span-1 row-span-1" // 정방형 (1x1)
            }

            return (
              <div
                key={profile.id}
                className={`relative overflow-hidden cursor-pointer group bg-gray-200 ${gridClass}`}
                onClick={() => setSelectedProfile(profile)}
              >
                <img
                  src={profile.image || "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg"}
                  alt={profile.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg"
                  }}
                />

                {/* Online indicator */}
                {profile.isOnline && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white z-10"></div>
                )}

                {/* Like button */}
                <button className="absolute bottom-2 right-2 bg-white/80 hover:bg-white rounded-full p-1.5 transition-colors z-10 opacity-0 group-hover:opacity-100">
                  <Heart className="h-3 w-3 text-gray-700" />
                </button>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center px-2">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">{profile.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">{profile.comments}</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold truncate">{profile.name}</p>
                    <p className="text-xs truncate">{profile.instrument}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Profile Modal */}
        {selectedProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-md w-full max-h-[90vh] overflow-y-auto rounded-xl">
              <div className="relative">
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                >
                  ✕
                </button>
                <img
                  src={
                    selectedProfile.image || "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg"
                  }
                  alt={selectedProfile.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg"
                  }}
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedProfile.name}</h2>
                      <p className="text-gray-600">
                        {selectedProfile.instrument} · {selectedProfile.experience}
                      </p>
                    </div>
                    {selectedProfile.isOnline && (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm">온라인</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{selectedProfile.location}</span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">선호 장르</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.genres.map((genre: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-orange-100 text-orange-700 border border-orange-200"
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-600">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>{selectedProfile.likes}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{selectedProfile.comments}</span>
                        </div>
                      </div>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <Music className="h-4 w-4 mr-2 inline" />
                        연결하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
