"use client"

import { useEffect, useState, FormEvent } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const GENRE_OPTIONS = [
    "INDIE_ROCK",
    "ALTERNATIVE_ROCK",
    "HARD_ROCK",
    "POST_ROCK",
    "SHOEGAZING",
    "HEAVY_METAL",
    "PUNK_ROCK",
    "GRUNGE",
    "PROGRESSIVE_ROCK",
    "GARAGE_ROCK",
    "CLASSIC_ROCK",
    "DEATH_METAL",
    "BLACK_METAL",
    "THRASH_METAL",
    "DOOM_METAL",
    "FOLK",
    "FOLK_ROCK",
    "ACOUSTIC",
    "JAZZ",
    "SMOOTH_JAZZ",
    "FUSION_JAZZ",
    "LOFI_JAZZ",
    "POP",
    "DREAM_POP",
    "SYNTH_POP",
    "ELECTRO_POP",
    "HIPHOP",
    "LOFI",
    "EDM",
    "AMBIENT",
    "HOUSE",
    "TECHNO",
    "TRANCE",
    "BLUES",
    "SOUL",
    "RNB",
    "CLASSICAL",
    "FUNK",
    "REGGAE",
    "WORLD_MUSIC",
    "EXPERIMENTAL",
    "POST_PUNK",
    "MATH_ROCK",
    "GOSPEL",
]

const GENRE_GROUPS: { [group: string]: { label: string, items: { value: string, label: string }[] } } = {
  "ROCK": {
    label: "록/락",
    items: [
      { value: "INDIE_ROCK", label: "인디록" },
      { value: "ALTERNATIVE_ROCK", label: "얼터너티브록" },
      { value: "HARD_ROCK", label: "하드록" },
      { value: "POST_ROCK", label: "포스트록" },
      { value: "SHOEGAZING", label: "슈게이징" },
      { value: "PUNK_ROCK", label: "펑크록" },
      { value: "GRUNGE", label: "그런지" },
      { value: "PROGRESSIVE_ROCK", label: "프로그레시브록" },
      { value: "GARAGE_ROCK", label: "개러지록" },
      { value: "CLASSIC_ROCK", label: "클래식록" },
      { value: "POST_PUNK", label: "포스트펑크" },
      { value: "MATH_ROCK", label: "매스록" },
    ]
  },
  "METAL": {
    label: "메탈",
    items: [
      { value: "HEAVY_METAL", label: "헤비메탈" },
      { value: "DEATH_METAL", label: "데스메탈" },
      { value: "BLACK_METAL", label: "블랙메탈" },
      { value: "THRASH_METAL", label: "스래시메탈" },
      { value: "DOOM_METAL", label: "둠메탈" },
    ]
  },
  "FOLK": {
    label: "포크/어쿠스틱",
    items: [
      { value: "FOLK", label: "포크" },
      { value: "FOLK_ROCK", label: "포크록" },
      { value: "ACOUSTIC", label: "어쿠스틱" },
    ]
  },
  "JAZZ": {
    label: "재즈",
    items: [
      { value: "JAZZ", label: "재즈" },
      { value: "SMOOTH_JAZZ", label: "스무스재즈" },
      { value: "FUSION_JAZZ", label: "퓨전재즈" },
      { value: "LOFI_JAZZ", label: "로파이재즈" },
    ]
  },
  "POP": {
    label: "팝",
    items: [
      { value: "POP", label: "팝" },
      { value: "DREAM_POP", label: "드림팝" },
      { value: "SYNTH_POP", label: "신스팝" },
      { value: "ELECTRO_POP", label: "일렉트로팝" },
    ]
  },
  "HIPHOP_EDM": {
    label: "힙합/EDM/일렉트로닉",
    items: [
      { value: "HIPHOP", label: "힙합" },
      { value: "LOFI", label: "로파이" },
      { value: "EDM", label: "EDM" },
      { value: "AMBIENT", label: "앰비언트" },
      { value: "HOUSE", label: "하우스" },
      { value: "TECHNO", label: "테크노" },
      { value: "TRANCE", label: "트랜스" },
    ]
  },
  "SOUL_RNB": {
    label: "소울/R&B/블루스",
    items: [
      { value: "BLUES", label: "블루스" },
      { value: "SOUL", label: "소울" },
      { value: "RNB", label: "R&B" },
    ]
  },
  "CLASSIC_FUN_REGGAE": {
    label: "클래식/펑크/레게/기타",
    items: [
      { value: "CLASSICAL", label: "클래식" },
      { value: "FUNK", label: "펑크" },
      { value: "REGGAE", label: "레게" },
      { value: "WORLD_MUSIC", label: "월드뮤직" },
      { value: "EXPERIMENTAL", label: "익스페리멘탈" },
      { value: "GOSPEL", label: "가스펠" },
    ]
  },
}

export default function GenreEditPage() {
    const router = useRouter()
    const pathname = usePathname()

    const [selectedGenres, setSelectedGenres] = useState<string[]>([])
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const userId = localStorage.getItem("userId")
        if (!userId) return
            ; (async () => {
                try {
                    const res = await fetch(`/api/users/${userId}/preference`)
                    const data = await res.json()
                    const genreObj = data.result?.genres
                    if (genreObj) {
                        const genreArray = Object.values(genreObj) as string[] // 타입 단언 추가
                        setSelectedGenres(genreArray)
                    }
                } catch (e) {
                    console.error("Failed to load genre preference", e)
                }
            })()
    }, [])

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        )
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const userId = localStorage.getItem("userId")
        if (!userId) return

        setSaving(true)
        setError("")

        try {
            const res = await fetch(`/api/users/${userId}/preference`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ genres: selectedGenres }),
            })
            const data = await res.json()
            if (!res.ok || !data.isSuccess) {
                setError(data.message || "저장에 실패했습니다.")
                return
            }
            router.push("/profile")
        } catch (err: any) {
            setError(err.message || "네트워크 오류가 발생했습니다.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
            <Navigation />
            <main className="flex flex-col items-center justify-center min-h-[80vh] pt-24 px-2 w-full">
                <div className="w-full max-w-md mb-8">
                    <div className="flex justify-evenly w-full border-b border-gray-200 font-bold text-lg bg-white rounded-t-2xl shadow-sm">
                        <Link href="/profile/edit" className={`px-4 py-2 ${pathname === "/profile/edit" ? "text-orange-500 border-b-2 border-orange-500" : "text-[#424242]"}`}>기본 정보</Link>
                        <Link href="/profile/edit/genre" className={`px-4 py-2 ${pathname === "/profile/edit/genre" ? "text-orange-500 border-b-2 border-orange-500" : "text-[#424242]"}`}>선호 장르</Link>
                        <Link href="/profile/edit/instruments" className={`px-4 py-2 ${pathname === "/profile/edit/instruments" ? "text-orange-500 border-b-2 border-orange-500" : "text-[#424242]"}`}>악기</Link>
                        <Link href="/profile/edit/notifications" className={`px-4 py-2 ${pathname === "/profile/edit/notifications" ? "text-orange-500 border-b-2 border-orange-500" : "text-[#424242]"}`}>알림 설정</Link>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">선호 장르 수정</h2>
                    <div className="w-full flex flex-col gap-8">
                        {Object.entries(GENRE_GROUPS).map(([groupKey, group]) => (
                            <div key={groupKey} className="w-full">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">{group.label}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-2">
                                    {group.items.map(item => (
                                        <label key={item.value} className="flex items-center space-x-2 cursor-pointer text-sm">
                                            <Checkbox
                                                id={item.value}
                                                checked={selectedGenres.includes(item.value)}
                                                onCheckedChange={() => toggleGenre(item.value)}
                                            />
                                            <span>{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-sm w-full text-center">{error}</p>}
                    <Button type="submit" className="w-full mt-2" disabled={saving}>{saving ? "저장 중..." : "저장하기"}</Button>
                </form>
            </main>
            <Footer />
        </div>
    )
}
