"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const profiles = [
  {
    id: 1,
    name: "마포구보안관",
    instrument: "기타리스트",
    experience: "활동 12년차",
    genres: "인디록, 포스트락",
    image:
      "https://mblogthumb-phinf.pstatic.net/20160129_279/eogk8709_1454029801075SvqP5_JPEG/resource%2811%29%281%29.jpg?type=w2",
    link: "/profile",
  },
  {
    id: 2,
    name: "JunoBass",
    instrument: "베이시스트",
    experience: "활동 7년차",
    genres: "재즈, 펑크",
    image:
      "https://i.namu.wiki/i/9RFGHI8iX8PwRBiIpY_ZDqKc8VZYPe7bgSjXlnHvANhyfkSFg9BQkBfcVzss_MJo2AA6WXLkNmtojPQEm7CXWg.webp",
    link: "/profile",
  },
  {
    id: 3,
    name: "SkySynth",
    instrument: "키보디스트",
    experience: "활동 6년차",
    genres: "신스팝, 시티팝",
    image: "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg",
    link: "/profile",
  },
  {
    id: 4,
    name: "ChloeBeats",
    instrument: "드러머",
    experience: "활동 9년차",
    genres: "펑크, 개러지락",
    image: "https://i.pinimg.com/736x/b4/bb/e9/b4bbe942e86a4765816788971719066e.jpg",
    link: "/profile",
  },
  {
    id: 5,
    name: "apeDl",
    instrument: "베이시스트",
    experience: "활동 8년차",
    genres: "인디록, 포스트락",
    image:
      "https://i.namu.wiki/i/bXgWecuHqGZAXWYTginORjT1lwPsEMnhKht1BvbrBEsL0LvRQRrJ8nne5xNxU4EyNO_8oGRqZY2NaEqE8VOh1Q.webp",
    link: "/profile",
  },
  {
    id: 6,
    name: "SilverChorus",
    instrument: "보컬",
    experience: "활동 4년차",
    genres: "인디록, 드림팝",
    image: "https://pbs.twimg.com/media/FZhPvKRagAApeTS.jpg:large",
    link: "/profile",
  },
  {
    id: 7,
    name: "MoonRhythm",
    instrument: "기타리스트",
    experience: "활동 2년차",
    genres: "재즈, 네오소울",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxHrDzYAfubzNL0klPwAooy6JZ2O2taXNzgg&s",
    link: "/profile",
  },
  {
    id: 8,
    name: "EchoVox",
    instrument: "보컬",
    experience: "활동 5년차",
    genres: "얼터너티브, 드림팝",
    image:
      "https://i.namu.wiki/i/zfs_EIH_bwl3rbQ9330EEK3ACa6AYnSHerx6BBn9WmLqouccC2viicvLBoP7QuiYe5D7-HFYuBGIThy15PeTcA.webp",
    link: "/profile",
  },
  {
    id: 9,
    name: "TapeDelay",
    instrument: "기타리스트",
    experience: "활동 12년차",
    genres: "인디록, 포스트락",
    image: "https://i.pinimg.com/736x/5f/0b/c1/5f0bc1d993a7ffb11b79c6d92a9e4aeb.jpg",
    link: "/profile",
  },
]

interface ProfileSliderProps {
  title?: string
  showClickHint?: boolean
}

export default function ProfileSlider({
  title = "👋함께할 밴드를 찾고 있어요",
  showClickHint = true,
}: ProfileSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 176 + 16 // 카드 너비(w-44 = 176px) + 간격(gap-4 = 16px)
      const currentScroll = sliderRef.current.scrollLeft

      sliderRef.current.scrollTo({
        left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h3 className="text-xl font-bold text-[#ff7f00] mb-4">{title}</h3>

      <div className="relative">
        {/* 좌우 버튼 */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:shadow-lg px-2 py-2 rounded-full transition-shadow"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:shadow-lg px-2 py-2 rounded-full transition-shadow"
        >
          <ChevronRight className="h-4 w-4 text-gray-700" />
        </button>

        {/* 슬라이더 */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-4 scroll-smooth pb-2 scrollbar-hide relative px-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {profiles.map((profile, index) => (
            <a
              key={profile.id}
              href={profile.link}
              className="block flex-shrink-0 w-44 relative text-white hover:opacity-95 transition"
            >
              <div className="w-full h-56 overflow-hidden rounded-xl shadow-md relative">
                <img
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                  src={profile.image || "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg"}
                  alt={`${profile.name} 프로필 사진`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg"
                  }}
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-3 text-left">
                  {showClickHint && index === 0 && <p className="text-sm font-bold mb-1">📌클릭시 프로필로 이동</p>}
                  <p className="text-sm font-bold">{profile.name}</p>
                  <p className="text-xs text-gray-100">
                    {profile.instrument} · {profile.experience}
                  </p>
                  <p className="text-[10px] text-gray-300 mt-1">선호 장르: {profile.genres}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
