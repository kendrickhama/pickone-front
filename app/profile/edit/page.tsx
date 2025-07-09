"use client"

import { useState, useEffect, ChangeEvent, FormEvent } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent as SelectMenu,
    SelectItem,
} from "@/components/ui/select"

type Gender = "MALE" | "FEMALE"
type MBTI = string

type ProfileForm = {
    nickname: string
    birthDate: string
    gender: Gender
    mbti: MBTI
    introduction: string
}

export default function ProfileEditPage() {
    const router = useRouter()
    const pathname = usePathname()

    const [form, setForm] = useState<ProfileForm>({
        nickname: "",
        birthDate: "",
        gender: "MALE",
        mbti: "",
        introduction:""
    })
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [imageUploading, setImageUploading] = useState(false)
    const [imageUploadError, setImageUploadError] = useState("")

    useEffect(() => {
        const userId = localStorage.getItem("userId")
        if (!userId) return
        ; (async () => {
            const res = await fetch(`/api/users/${userId}`)
            const { result } = await res.json()
            setForm({
                nickname: result.nickname,
                birthDate: result.birthDate,
                gender: result.gender,
                mbti: result.mbti,
                introduction: result.introduction
            })
            setProfileImageUrl(result.profileImageUrl || null)
            setLoading(false)
        })()
    }, [])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    // 프로필 이미지 업로드 핸들러 (S3 연동)
    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageUploading(true)
            setImageUploadError("")
            try {
                const formData = new FormData()
                formData.append("file", file)
                formData.append("imgText", "profile")
                const token = localStorage.getItem("token")
                const res = await fetch("/api/s3/upload", {
                    method: "POST",
                    body: formData,
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                })
                let data: any = {}
                const text = await res.text()
                try { data = text ? JSON.parse(text) : {} } catch { }
                if (!res.ok || !data.isSuccess) {
                    setImageUploadError(data.message || "이미지 업로드에 실패했습니다.")
                    setImageUploading(false)
                    return
                }
                setProfileImageUrl(data.result.imgUrl)
            } catch (err: any) {
                setImageUploadError(err.message || "이미지 업로드 중 오류가 발생했습니다.")
            } finally {
                setImageUploading(false)
            }
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const userId = localStorage.getItem("userId")
        if (!userId) return
        setSaving(true)
        setError("")
        try {
            const res = await fetch(`/api/users/${userId}/profile`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, profileImageUrl }),
            })
            const text = await res.text()
            let data: any = {}
            try { data = text ? JSON.parse(text) : {} } catch { }
            if (!res.ok || !data.isSuccess) {
                setError(data.message || `프로필 수정에 실패했습니다. (${res.status})`)
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
                {/* 상단 탭 네비게이션 */}
                <div className="w-full max-w-md mb-8">
                    <div className="flex justify-evenly w-full border-b border-gray-200 font-bold text-lg bg-white rounded-t-2xl shadow-sm">
                        <Link
                            href="/profile/edit"
                            className={`px-4 py-2 ${pathname === "/profile/edit"
                                ? "text-orange-500 border-b-2 border-orange-500"
                                : "text-[#424242]"}`}
                        >
                            기본 정보
                        </Link>
                        <Link
                            href="/profile/edit/genre"
                            className={`px-4 py-2 ${pathname === "/profile/edit/genre"
                                ? "text-orange-500 border-b-2 border-orange-500"
                                : "text-[#424242]"}`}
                        >
                            선호 장르
                        </Link>
                        <Link
                            href="/profile/edit/instruments"
                            className={`px-4 py-2 ${pathname === "/profile/edit/instruments"
                                ? "text-orange-500 border-b-2 border-orange-500"
                                : "text-[#424242]"}`}
                        >
                            악기
                        </Link>
                        <Link
                            href="/profile/edit/notifications"
                            className={`px-4 py-2 ${pathname === "/profile/edit/notifications"
                                ? "text-orange-500 border-b-2 border-orange-500"
                                : "text-[#424242]"}`}
                        >
                            알림 설정
                        </Link>
                    </div>
                </div>
                {/* 프로필 수정 카드 */}
                <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">프로필 수정</h2>
                    {/* 프로필 이미지 */}
                    <div className="relative flex flex-col items-center mb-2">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 shadow bg-gray-100 flex items-center justify-center">
                            <img
                                src={profileImageUrl || "/default-avatar.png"}
                                alt="프로필 이미지"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <label className="mt-2 text-xs text-gray-500 cursor-pointer hover:text-orange-500 transition-colors">
                            이미지 변경
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={imageUploading} />
                        </label>
                        {imageUploading && <span className="text-xs text-orange-500 mt-1">이미지 업로드 중...</span>}
                        {imageUploadError && <span className="text-xs text-red-500 mt-1">{imageUploadError}</span>}
                    </div>
                    {/* 입력 필드 */}
                    <div className="w-full flex flex-col gap-4">
                        <div>
                            <Label htmlFor="nickname">닉네임</Label>
                            <Input id="nickname" name="nickname" value={form.nickname} onChange={handleChange} placeholder="닉네임을 입력하세요" autoComplete="off" />
                        </div>
                        <div>
                            <Label htmlFor="birthDate">생년월일</Label>
                            <Input type="date" id="birthDate" name="birthDate" value={form.birthDate} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>성별</Label>
                            <Select value={form.gender} onValueChange={val => setForm(prev => ({ ...prev, gender: val as Gender }))}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="성별 선택" /></SelectTrigger>
                                <SelectMenu>
                                    <SelectItem value="MALE">남성</SelectItem>
                                    <SelectItem value="FEMALE">여성</SelectItem>
                                </SelectMenu>
                            </Select>
                        </div>
                        <div>
                            <Label>MBTI</Label>
                            <Select value={form.mbti} onValueChange={val => setForm(prev => ({ ...prev, mbti: val }))}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="MBTI 선택" /></SelectTrigger>
                                <SelectMenu>
                                    {["INFJ", "INFP", "INTJ", "INTP", "ISFJ", "ISFP", "ISTJ", "ISTP", "ENFJ", "ENFP", "ENTJ", "ENTP", "ESFJ", "ESFP", "ESTJ", "ESTP"].map(m => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectMenu>
                            </Select>
                        </div>
                       <div>
                            <Label htmlFor="nickname">자기소개</Label>
                            <Input id="introduction" name="introduction" value={form.introduction} onChange={handleChange} placeholder="본인을 소개해주세요" autoComplete="off" />
                        </div>
                    </div>
                    {/* 에러/로딩 안내 */}
                    {error && <p className="text-red-500 text-sm w-full text-center">{error}</p>}
                    {loading && <p className="text-gray-400 text-sm w-full text-center">불러오는 중...</p>}
                    {/* 저장 버튼 */}
                    <Button type="submit" className="w-full mt-2" disabled={saving || loading}>{saving ? "저장 중..." : "저장하기"}</Button>
                </form>
            </main>
            <Footer />
        </div>
    )
}
