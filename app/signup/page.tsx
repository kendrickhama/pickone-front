"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    birthDate: "",
    gender: "",         // 초기값을 빈 문자열로
    agreeToTerms: false,
  })
  const [error, setError] = useState("")
  const [showGenderSheet, setShowGenderSheet] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }
    if (!form.agreeToTerms) {
      setError("이용약관에 동의해주세요.")
      return
    }
    if (!form.gender) {
      setError("성별을 선택해주세요.")
      return
    }
    try {
      const response = await fetch("http://3.35.49.195:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          nickname: form.nickname,
          birthDate: form.birthDate,
          gender: form.gender,
          agreements: [{ termId: 1, consented: true }],
        }),
      })
      const data = await response.json()
      console.log("백엔드 응답:", data)
      if (!data.isSuccess) throw new Error(data.message || "회원가입 실패")
      alert("회원가입 성공! 로그인 페이지로 이동합니다.")
      router.push("/login")
    } catch (err) {
      console.error("회원가입 오류:", err)
      setError("입력 정보를 다시 확인해주세요.")
    }
  }

  // Input에 표시할 텍스트: 선택 전이면 빈 문자열 대신 placeholder가 보이도록
  const genderLabel = form.gender === "MALE" ? "남자"
    : form.gender === "FEMALE" ? "여자"
    : ""

  return (
    <>
      <Navigation />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-24 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border">
          <h1 className="text-3xl font-bold text-center text-orange-500 mb-6">회원가입</h1>
          <div className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="이메일"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
            />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="비밀번호 재입력"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <Input
              name="nickname"
              type="text"
              placeholder="닉네임"
              value={form.nickname}
              onChange={handleChange}
            />
            <Input
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
            />

            {/* 성별 선택 Input: value 비어있으면 placeholder “성별”로 보여짐 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
              <Input
                readOnly
                placeholder="성별"
                value={genderLabel}
                className="cursor-pointer bg-white"
                onClick={() => setShowGenderSheet(true)}
              />
            </div>

            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={form.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span>이용약관에 동의합니다</span>
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button className="w-full mt-2" onClick={handleSubmit}>
              회원가입
            </Button>
          </div>
        </div>
      </div>

      {/* 작게 올라오는 바텀시트 */}
      {showGenderSheet && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-end justify-center"
          onClick={() => setShowGenderSheet(false)}
        >
          <div
            className="bg-white rounded-t-xl w-full max-w-md mx-4 mb-4 p-4"
            style={{ maxHeight: '180px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-2 text-center">성별 선택</h3>
            <div className="flex flex-col space-y-2">
              <button
                className={`w-full text-left p-2 rounded ${form.gender === "MALE" ? "bg-gray-100" : ""}`}
                onClick={() => {
                  setForm({ ...form, gender: "MALE" })
                  setShowGenderSheet(false)
                }}
              >
                남자
              </button>
              <button
                className={`w-full text-left p-2 rounded ${form.gender === "FEMALE" ? "bg-gray-100" : ""}`}
                onClick={() => {
                  setForm({ ...form, gender: "FEMALE" })
                  setShowGenderSheet(false)
                }}
              >
                여자
              </button>
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setShowGenderSheet(false)}
            >
              취소
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}