// app/recruit/new/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

const typeOptions = ["Long", "Once"]
const instrumentOptions = [
    "ACOUSTIC_GUITAR",
    "ELECTRIC_GUITAR",
    "BASS",
    "DRUMS",
    "PERCUSSION",
    "KEYBOARD",
    "SYNTHESIZER",
    "VOCALS",
    "VIOLIN",
    "SAXOPHONE",
    "TRUMPET",
    "FLUTE"
    // 필요시 추가
]
const proficiencyOptions = [
    "NEVER_PLAYED",
    "BEGINNER",
    "BASIC",
    "INTERMEDIATE",
    "ADVANCED",
    "SEMI_PRO",
    "PROFESSIONAL",
    "MASTER"
]
const genreOptions = [
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

export default function NewRecruitPage() {
    const router = useRouter()
    // 기본 필드
    const [title, setTitle] = useState("")
    const [type, setType] = useState("Long") // 기본값 LONG 
    const [description, setDescription] = useState("")
    const [region, setRegion] = useState("")
    const [thumbnail, setThumbnail] = useState("")
    const [snsLink, setSnsLink] = useState("")

    // 악기/숙련도 배열: [{instrument, proficiency}, ...]
    const [instrumentDetails, setInstrumentDetails] = useState<{ instrument: string; proficiency: string }[]>([
        { instrument: "", proficiency: "" },
    ])

    // 장르 선택: string 배열
    const [genres, setGenres] = useState<string[]>([])

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // 악기 항목 추가/제거
    const addInstrument = () => {
        setInstrumentDetails([...instrumentDetails, { instrument: "", proficiency: "" }])
    }
    const removeInstrument = (idx: number) => {
        const arr = [...instrumentDetails]
        arr.splice(idx, 1)
        setInstrumentDetails(arr.length ? arr : [{ instrument: "", proficiency: "" }])
    }
    const updateInstrument = (idx: number, field: "instrument" | "proficiency", value: string) => {
        const arr = [...instrumentDetails]
        arr[idx] = { ...arr[idx], [field]: value }
        setInstrumentDetails(arr)
    }

    // 장르 선택 토글
    const toggleGenre = (g: string) => {
        if (genres.includes(g)) {
            setGenres(genres.filter((x) => x !== g))
        } else {
            setGenres([...genres, g])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        // 간단 검증
        if (!title.trim()) {
            setError("제목을 입력해주세요.")
            return
        }
        if (!description.trim()) {
            setError("설명을 입력해주세요.")
            return
        }
        if (!region.trim()) {
            setError("지역을 입력해주세요.")
            return
        }
        // 악기 검증: instrument와 proficiency가 모두 선택됐는지
        for (const item of instrumentDetails) {
            if (!item.instrument || !item.proficiency) {
                setError("악기와 숙련도를 모두 선택해주세요.")
                return
            }
        }
        if (genres.length === 0) {
            setError("하나 이상의 장르를 선택해주세요.")
            return
        }

        setLoading(true)
        try {
            const body = {
                type,
                status: "Recruiting",
                visibility: "PUBLIC",
                title: title.trim(),
                description: description.trim(),
                region: region.trim(),
                thumbnail: thumbnail.trim(),
                snsLink: snsLink.trim(),
                instrumentProficiencyDto: instrumentDetails.map((item) => ({
                    instrumentDetails: [
                        {
                            instrument: item.instrument,
                            proficiency: item.proficiency,
                        },
                    ],
                })),
                genreRequestDto: {
                    recruitmentGenres: genres,
                },
            }
            const accessToken = localStorage.getItem("accessToken")
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
            // app/recruit/new/page.tsx 의 handleSubmit 안에서
            const res = await fetch(`/api/recruitments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            })
            const resBody = await res.json()
            console.log("✅ 백엔드 응답:", resBody)
            if (!res.ok) {
                const errData = await res.json().catch(() => null)
                throw new Error(errData?.message || `서버 오류: ${res.status}`)
            }
            if (!res.ok) {
                console.log("서버 응답:", resBody)
                throw new Error(resBody?.message || `서버 오류: ${res.status}`)
            }

            if (!resBody.isSuccess) {
                throw new Error(resBody.message || "등록에 실패했습니다.")
            }

            router.push("/recruit")
        } catch (e: any) {
            console.error("글쓰기 오류:", e)
            setError(e.message || "등록 중 오류가 발생했습니다.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navigation />
            <div className="flex flex-col items-center justify-center bg-gray-50 px-4 pt-24 pb-8 min-h-screen">
                <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4">모집글 작성</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 제목 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                            <Input
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목을 입력하세요"
                            />
                        </div>
                        {/* 설명 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                            <Textarea
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="자세한 설명을 입력하세요"
                                rows={4}
                            />
                        </div>
                        {/* 지역 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                            <Input
                                name="region"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                placeholder="예: 서울"
                            />
                        </div>
                        {/* 썸네일 URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                썸네일 이미지 URL
                            </label>
                            <Input
                                name="thumbnail"
                                value={thumbnail}
                                onChange={(e) => setThumbnail(e.target.value)}
                                placeholder="이미지 URL을 입력하세요"
                            />
                        </div>
                        {/* SNS 링크 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SNS 링크</label>
                            <Input
                                name="snsLink"
                                value={snsLink}
                                onChange={(e) => setSnsLink(e.target.value)}
                                placeholder="SNS URL을 입력하세요"
                            />
                        </div>
                        {/* 악기/숙련도 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">악기 및 숙련도</label>
                            <div className="space-y-2">
                                {instrumentDetails.map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                        <select
                                            value={item.instrument}
                                            onChange={(e) => updateInstrument(idx, "instrument", e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded"
                                        >
                                            <option value="">악기 선택</option>
                                            {instrumentOptions.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={item.proficiency}
                                            onChange={(e) => updateInstrument(idx, "proficiency", e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded"
                                        >
                                            <option value="">숙련도 선택</option>
                                            {proficiencyOptions.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => removeInstrument(idx)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addInstrument}
                                    className="flex items-center text-blue-500 hover:text-blue-700 mt-1"
                                >
                                    <Plus className="mr-1" /> 악기 추가
                                </button>
                            </div>
                        </div>
                        {/* 장르 선택 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">장르 선택</label>
                            <div className="flex flex-wrap gap-2">
                                {genreOptions.map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => toggleGenre(g)}
                                        className={`px-3 py-1 border rounded-full text-sm ${genres.includes(g)
                                            ? "bg-orange-500 text-white border-transparent"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 에러 */}
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        {/* 제출 */}
                        <div className="flex justify-end">
                            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                                {loading ? "등록 중..." : "등록"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}