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
}

export default function ProfileEditPage() {
    const router = useRouter()
    const pathname = usePathname()

    const [form, setForm] = useState<ProfileForm>({
        nickname: "",
        birthDate: "",
        gender: "MALE",
        mbti: "",
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

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
                })
                setLoading(false)
            })()
    }, [])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
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
                body: JSON.stringify(form),
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
        <div className="min-h-screen bg-white">
            <Navigation />
            <main className="max-w-4xl mx-auto p-6 pt-20">
                <div className="w-full border-b px-6">
                    <div className="flex justify-evenly w-full border-gray-200 font-bold text-lg">
                        <Link
                            href="/profile/edit"
                            className={`px-4 py-2 ${pathname === "/profile/edit"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-[#424242]"
                                }`}
                        >
                            기본 정보
                        </Link>
                        <Link
                            href="/profile/edit/genre"
                            className={`px-4 py-2 ${pathname === "/profile/edit/genre"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-[#424242]"
                                }`}
                        >
                            선호 장르
                        </Link>
                        <Link
                            href="/profile/edit/instruments"
                            className={`px-4 py-2 ${pathname === "/profile/edit/instruments"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-[#424242]"
                                }`}
                        >
                            악기
                        </Link>
                        <Link
                            href="/profile/edit/notifications"
                            className={`px-4 py-2 ${pathname === "/profile/edit/notifications"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-[#424242]"
                                }`}
                        >
                            알림 설정
                        </Link>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
                    <div>
                        <Label htmlFor="nickname">닉네임</Label>
                        <Input id="nickname" name="nickname" value={form.nickname} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="birthDate">생년월일</Label>
                        <Input type="date" id="birthDate" name="birthDate" value={form.birthDate} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>성별</Label>
                        <Select value={form.gender} onValueChange={val => setForm(prev => ({ ...prev, gender: val as Gender }))}>
                            <SelectTrigger><SelectValue placeholder="성별 선택" /></SelectTrigger>
                            <SelectMenu>
                                <SelectItem value="MALE">남성</SelectItem>
                                <SelectItem value="FEMALE">여성</SelectItem>
                            </SelectMenu>
                        </Select>
                    </div>
                    <div>
                        <Label>MBTI</Label>
                        <Select value={form.mbti} onValueChange={val => setForm(prev => ({ ...prev, mbti: val }))}>
                            <SelectTrigger><SelectValue placeholder="MBTI 선택" /></SelectTrigger>
                            <SelectMenu>
                                {[
                                    "INFJ", "INFP", "INTJ", "INTP",
                                    "ISFJ", "ISFP", "ISTJ", "ISTP",
                                    "ENFJ", "ENFP", "ENTJ", "ENTP",
                                    "ESFJ", "ESFP", "ESTJ", "ESTP"
                                ].map(m => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectMenu>
                        </Select>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>{saving ? "저장 중..." : "저장하기"}</Button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    )
}
