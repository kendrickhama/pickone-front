"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Mail, Lock, User, Calendar, Users, Music, ArrowRight } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: "",
    emailDomain: "naver.com",
    customDomain: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    birthDate: "",
    gender: "",
    agreeToTerms: false,
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCustomDomain, setIsCustomDomain] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    if (name === "emailDomain" && value === "custom") {
      setIsCustomDomain(true)
      return
    }
    
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
    
    setIsSubmitting(true)
    setError("")
    
    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `${form.email}@${isCustomDomain ? form.customDomain : form.emailDomain}`,
          password: form.password,
          nickname: form.nickname,
          birthDate: form.birthDate,
          gender: form.gender,
          terms: [{ termId: 1, consented: true }],
        }),
      })
      const data = await response.json()
      console.log("백엔드 응답:", data)
      if (!data.isSuccess) {
        let message = "회원가입 실패"

        switch (data.code) {
          case "DUPLICATE_EMAIL":
            message = "이미 사용 중인 이메일입니다."
            break
          case "INVALID_PASSWORD":
            message = "비밀번호 형식이 올바르지 않습니다."
            break
          case "WEAK_PASSWORD":
            message = "비밀번호가 너무 약합니다."
            break
          case "MISSING_FIELDS":
            message = "필수 입력값이 누락되었습니다."
            break
          default:
            message = data.message || "회원가입에 실패했습니다."
        }

        throw new Error(message)
      }

      alert("회원가입 성공! 로그인 페이지로 이동합니다.")
      router.push("/login")

    } catch (err: any) {
      console.error("회원가입 오류:", err)
      setError(err.message || "입력 정보를 다시 확인해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <>
      <Navigation />
      
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-24 bg-gray-50">
        <div className="w-full max-w-lg">
          {/* 헤더 섹션 */}
          <div className="text-left mb-8">
            <h1 className="text-xl font-bold text-gray-800 mb-2">회원가입</h1>
          </div>

          {/* 폼 컨테이너 */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
            <div className="space-y-6">
              {/* 이메일 입력 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">이메일 주소</label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      name="email"
                      type="text"
                      placeholder="이메일 아이디"
                      value={form.email}
                      onChange={handleChange}
                      className="pl-10 h-12 text-base border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                  <span className="text-gray-500 font-medium">@</span>
                  <div className="relative flex-1">
                    {isCustomDomain ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          name="customDomain"
                          type="text"
                          placeholder="도메인 입력"
                          value={form.customDomain}
                          onChange={handleChange}
                          className="flex-1 h-12 text-base border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomDomain(false)
                            setForm({ ...form, customDomain: "" })
                          }}
                          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <select
                        name="emailDomain"
                        value={form.emailDomain}
                        onChange={handleChange}
                        className="w-full h-12 text-base border border-gray-200 rounded-md px-3 focus:border-orange-400 focus:ring-orange-400 bg-white"
                      >
                        <option value="naver.com">naver.com</option>
                        <option value="gmail.com">gmail.com</option>
                        <option value="daum.net">daum.net</option>
                        <option value="kakao.com">kakao.com</option>
                        <option value="outlook.com">outlook.com</option>
                        <option value="hotmail.com">hotmail.com</option>
                        <option value="yahoo.com">yahoo.com</option>
                        <option value="nate.com">nate.com</option>
                        <option value="hanmail.net">hanmail.net</option>
                        <option value="custom">직접입력</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">비밀번호</label>
                <p className="text-xs text-gray-500 mb-2">영문, 숫자, 특수문자 조합 8자 이상</p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={form.password}
                    onChange={handleChange}
                    className="pl-10 h-12 text-base border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">비밀번호 확인</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 h-12 text-base border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* 닉네임 입력 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">닉네임</label>
                <p className="text-xs text-gray-500 mb-2">2~20자 사이의 한글, 영문, 숫자 조합</p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="nickname"
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    value={form.nickname}
                    onChange={handleChange}
                    className="pl-10 h-12 text-base border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* 생년월일 입력 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">생년월일</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={handleChange}
                    className="pl-10 h-12 text-base border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* 성별 선택 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">성별</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="pl-10 h-12 text-base border border-gray-200 rounded-md focus:border-orange-400 focus:ring-orange-400 bg-white w-full"
                  >
                    <option value="">성별을 선택하세요</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                  </select>
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={form.agreeToTerms}
                  onChange={handleChange}
                  className="h-5 w-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-0.5"
                />
                <div className="text-sm text-gray-700">
                  <span className="font-medium">이용약관</span> 및 <span className="font-medium">개인정보처리방침</span>에 동의합니다
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* 회원가입 버튼 */}
              <Button 
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>가입 중...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>회원가입하기</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>

              {/* 로그인 링크 */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  이미 계정이 있으신가요?{" "}
                  <button 
                    onClick={() => router.push("/login")}
                    className="text-orange-600 hover:text-orange-700 font-semibold underline"
                  >
                    로그인하기
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>



      <Footer />
    </>
  )
}