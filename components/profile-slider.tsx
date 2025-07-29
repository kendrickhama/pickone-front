"use client"

import { useRef, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface UserProfile {
  id: number
  nickname: string
  profileImageUrl: string | null
  mbti: string
  preference: {
    genre1: string | null
    genre2: string | null
  } | null
}

export default function MainProfileSlider() {
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://3.35.49.195:8080/api/main")
        const data = await response.json()
        if (data?.result) {
          setProfiles(data.result.slice(0, 10))
        }
      } catch (error) {
        console.error("프로필 불러오기 실패:", error)
      }
    }
    fetchProfiles()
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 160 + 16
      const currentScroll = sliderRef.current.scrollLeft
      sliderRef.current.scrollTo({
        left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-lg font-medium text-[#2F3438] mb-4">함께할 밴드를 찾고 있어요🙌</h3>
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:shadow-lg p-2 rounded-full"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:shadow-lg p-2 rounded-full"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>

          <div
            ref={sliderRef}
            className="flex overflow-x-auto gap-4 scroll-smooth pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {profiles.map((profile, index) => (
              <div
                key={profile.id}
                className="block flex-shrink-0 w-40 relative text-white hover:opacity-95 transition"
              >
                <div className="w-full h-52 overflow-hidden rounded-xl shadow-md relative">
                  <img
                    src={profile.profileImageUrl || "https://pickone-web-assets-2025.s3.ap-northeast-2.amazonaws.com/profiles/%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5.png"}
                    alt={`${profile.nickname} 프로필 사진`}
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-3 text-left">
                    <p className="text-sm font-bold">{profile.nickname}</p>
                    <p className="text-xs text-gray-100">{profile.mbti}</p>
                    <p className="text-[10px] text-gray-300 mt-1">
                      장르: {profile.preference?.genre1 || "-"}, {profile.preference?.genre2 || "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
