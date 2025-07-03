"use client"

import { useState, useEffect, ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

// Gender와 MBTI 타입 정의
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
    const [form, setForm] = useState<ProfileForm>({
        nickname: "",
        birthDate: "",
        gender: "MALE",
        mbti: "",
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string>("")

    // 사용자 정보 로드
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
                    mbti: result.mbti
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

            // 1) 먼저 텍스트로 읽어오기
            const text = await res.text()

            // 2) JSON 파싱 시도
            let data: any = {}
            try {
                data = text ? JSON.parse(text) : {}
            } catch {
                console.warn("JSON 파싱 실패, 빈 객체 사용")
            }

            // 3) 응답 상태 및 메시지 처리
            if (!res.ok || !data.isSuccess) {
                const msg = data.message || `프로필 수정에 실패했습니다. (${res.status})`
                setError(msg)
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
            <main className="max-w-sm mx-auto p-6 pt-20">
                <h1 className="text-2xl font-bold mb-4">프로필 수정</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <Select value={form.gender} onValueChange={(val) => setForm(prev => ({ ...prev, gender: val as Gender }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="성별 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* 빈 값 옵션 제거 */}
                                <SelectItem value="MALE">남성</SelectItem>
                                <SelectItem value="FEMALE">여성</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="mbti">MBTI</Label>
                        <Select value={form.mbti} onValueChange={val => setForm(prev => ({ ...prev, mbti: val }))}>
                            <SelectTrigger><SelectValue placeholder="MBTI 선택" /></SelectTrigger>
                            <SelectContent>{[
                                'INFJ', 'INFP', 'INTJ', 'INTP',
                                'ISFJ', 'ISFP', 'ISTJ', 'ISTP',
                                'ENFJ', 'ENFP', 'ENTJ', 'ENTP',
                                'ESFJ', 'ESFP', 'ESTJ', 'ESTP'
                            ].map(m => (
                                <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}</SelectContent>
                        </Select>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mt-2">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>{saving ? '저장 중...' : '저장하기'}</Button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    )
}
