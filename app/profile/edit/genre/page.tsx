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
        <div className="min-h-screen bg-white">
            <Navigation />
            <main className="max-w-4xl mx-auto p-6 pt-20">
                <div className="w-full border-b px-6">
                    <div className="flex justify-evenly w-full border-b border-gray-200 font-bold text-lg">
                        <Link href="/profile/edit" className={`px-4 py-2 ${pathname === "/profile/edit" ? "text-blue-600 border-b-2 border-blue-600" : "text-[#424242]"}`}>기본 정보</Link>
                        <Link href="/profile/edit/genre" className={`px-4 py-2 ${pathname === "/profile/edit/genre" ? "text-blue-600 border-b-2 border-blue-600" : "text-[#424242]"}`}>선호 장르</Link>
                        <Link href="/profile/edit/instruments" className={`px-4 py-2 ${pathname === "/profile/edit/instruments" ? "text-blue-600 border-b-2 border-blue-600" : "text-[#424242]"}`}>악기</Link>
                        <Link href="/profile/edit/notifications" className={`px-4 py-2 ${pathname === "/profile/edit/notifications" ? "text-blue-600 border-b-2 border-blue-600" : "text-[#424242]"}`}>알림 설정</Link>
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-4">선호 장르 수정</h1>
                <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
                    <div className="grid grid-cols-2 gap-4">
                        {GENRE_OPTIONS.map(genre => (
                            <div key={genre} className="flex items-center space-x-2">
                                <Checkbox
                                    id={genre}
                                    checked={selectedGenres.includes(genre)}
                                    onCheckedChange={() => toggleGenre(genre)}
                                />
                                <Label htmlFor={genre}>{genre}</Label>
                            </div>
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                            {saving ? "저장 중..." : "저장하기"}
                        </Button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    )
}
