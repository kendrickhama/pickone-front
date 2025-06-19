"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      const response = await fetch("http://3.35.49.195:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("네트워크 오류 또는 응답 실패")
      }

      const data = await response.json()

      if (!data.isSuccess) {
        throw new Error(data.message || "로그인 실패")
      }

      const { accessToken, refreshToken } = data.result
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("email", email)

      router.push("/")
    } catch (err) {
      console.error("로그인 오류:", err)
      setError("이메일 또는 비밀번호를 확인해주세요.")
    }
  }

  return (
    <>
      <Navigation />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-24">
        <h1 className="text-2xl font-bold mb-6">로그인</h1>
        <div className="w-full max-w-sm space-y-4">
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleLogin} className="w-full">
            로그인
          </Button>

          {/* ✅ 회원가입 버튼 추가 */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/signup")}
          >
            회원가입
          </Button>
        </div>
      </div>
      <Footer />
    </>
  )
}