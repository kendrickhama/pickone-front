"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")  // 에러 메시지
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError("")
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.isSuccess) {
        let msg = "로그인 실패"

        // 코드 기반 분기 처리
        switch (data.code) {
          case "INVALID_CREDENTIALS":
            msg = "이메일 또는 비밀번호가 올바르지 않습니다."
            break
          case "USER_NOT_FOUND":
            msg = "가입되지 않은 이메일입니다."
            break
          case "MISSING_FIELDS":
            msg = "이메일과 비밀번호를 모두 입력해주세요."
            break
          case "ACCOUNT_LOCKED":
            msg = "계정이 잠겨있습니다. 고객센터로 문의해주세요."
            break
          default:
            msg = data.message || "로그인에 실패했습니다."
        }

        throw new Error(msg)
      }

      // ✅ 로그인 성공 처리
      localStorage.setItem("accessToken", data.result.accessToken)
      localStorage.setItem("refreshToken", data.result.refreshToken)
      localStorage.setItem("email", email)
      localStorage.setItem("userId", data.result.userId)  
      router.push("/")

    } catch (e: any) {
      console.error("로그인 오류:", e)
      setError(e.message || "로그인 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
          {/* 로고+타이틀 */}
          <div className="flex items-center justify-center mb-6">
            <Image src="/icon.png" alt="Pickone Logo" width={64} height={64} className="object-contain" />
            <h1 className="text-2xl font-bold text-orange-500 ml-2">Pickone</h1>
          </div>

          {/* 이메일/비밀번호 컨테이너: 붙여서 배치 */}
          <div>
            <label htmlFor="login-credentials" className="sr-only">
              이메일 및 비밀번호
            </label>
            <div
              id="login-credentials"
              className={`border ${error ? "border-red-500" : "border-gray-300"
                } rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400`}
            >
              {/* 이메일 input */}
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`
                  w-full px-4 py-3 bg-white outline-none
                  rounded-t-lg
                  border-b
                  ${error && !email ? "border-red-500" : "border-gray-200"}
                  focus:border-blue-400
                `}
              />
              {/* 비밀번호 input */}
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`
                  w-full px-4 py-3 bg-white outline-none
                  rounded-b-lg
                  border-none
                  ${error && !password ? "border-red-500" : ""}
                `}
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
          )}

          {/* 버튼들 */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-4 py-2 rounded bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
          {/* 비밀번호 재설정과 회원가입 링크를 검정색 텍스트로 */}
          <div className="flex justify-center space-x-4 mt-4 text-sm">
            <Link href="/reset-password" className="text-gray-700 hover:underline">
              비밀번호 재설정
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/signup" className="text-gray-700 hover:underline">
              회원가입
            </Link>
          </div>

          {/* “sns 계정으로 간편 로그인/회원가입” 텍스트 */}
          <div className="text-center text-gray-400 text-sm mt-6">
            SNS 계정으로 간편 로그인/회원가입
          </div>

          {/* SNS 아이콘 버튼 한 줄로 */}
          <div className="flex justify-center space-x-4 mt-2">
            {/* Facebook */}
            <button
              onClick={() => {
                /* Facebook OAuth 로직 */
              }}
              className="p-2 bg-white rounded-full hover:bg-gray-200"
            >
              <Image src="https://blog.kakaocdn.net/dn/UGS0q/btree5Viurw/l07AH1VgWJHm4stsAHLdL0/img.png" alt="Facebook 로그인" width={42} height={42} />
            </button>
            {/* Kakao */}
            <button
              onClick={() => {
                /* Kakao OAuth 로직 */
              }}
              className="p-2 bg-white rounded-full hover:bg-gray-200"
            >
              <Image src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" alt="Kakao 로그인" width={42} height={42} />
            </button>
            {/* Naver */}
            <button
              onClick={() => {
                /* Naver OAuth 로직 */
              }}
              className="p-2 bg-white rounded-full hover:bg-gray-200"
            >
              <Image src="https://w7.pngwing.com/pngs/344/368/png-transparent-naver-round-logo-search-engines-thumbnail.png" alt="Naver 로그인" width={42} height={42} />
            </button>
          </div>
          <div className="text-center text-sm mt-6">
            <Link href="/signup" className="text-gray-300 hover:underline">
              로그인에 문제가 있으신가요?
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}