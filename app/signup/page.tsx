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
    gender: "MALE",
    agreeToTerms: false,
  })

  const [error, setError] = useState("")

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

    try {
      const response = await fetch("http://3.35.49.195:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      if (!data.isSuccess) throw new Error(data.message || "회원가입 실패")

      alert("회원가입 성공! 로그인 페이지로 이동합니다.")
      router.push("/login")
    } catch (err) {
      console.error("회원가입 오류:", err)
      setError("입력 정보를 다시 확인해주세요.")
    }
  }

  return (
    <>
      <Navigation />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-24 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border">
          <h1 className="text-3xl font-bold text-center text-orange-500 mb-6">회원가입</h1>
          <div className="space-y-4">
            <Input name="email" type="email" placeholder="이메일" value={form.email} onChange={handleChange} />
            <Input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} />
            <Input name="confirmPassword" type="password" placeholder="비밀번호 재입력" value={form.confirmPassword} onChange={handleChange} />
            <Input name="nickname" type="text" placeholder="닉네임" value={form.nickname} onChange={handleChange} />
            <Input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center space-x-2">
                <input type="radio" name="gender" value="MALE" checked={form.gender === "MALE"} onChange={handleChange} />
                <span>남자</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="gender" value="FEMALE" checked={form.gender === "FEMALE"} onChange={handleChange} />
                <span>여자</span>
              </label>
            </div>

            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input type="checkbox" name="agreeToTerms" checked={form.agreeToTerms} onChange={handleChange} />
              <span>이용약관에 동의합니다</span>
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button className="w-full mt-2" onClick={handleSubmit}>
              회원가입
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}