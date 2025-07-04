"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import ProfileSlider from "@/components/profile-slider"
import Footer from "@/components/footer"
import RecruitPreview from "@/components/recruit-preview"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navigation />

      {/* Hero Section - 네비게이션 높이만큼 패딩 추가 */}
      <section className="container mx-auto px-4 py-24 pt-32 text-center">
      <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            당신의 음악, <span className="text-orange-500">당신의 밴드</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-medium">취향대로 만나는 밴드메이커</p>

          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-gray-600 mb-4 leading-relaxed">
              🎵 <strong>오늘의 공연</strong>을 확인하고 티켓을 예매하세요
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              🔥 <strong>인기 모집글</strong>에서 당신과 맞는 밴드를 찾아보세요
            </p>
            <p className="text-gray-600 leading-relaxed">
              ✨ 피크원에서 <strong>1,247개 밴드</strong>와 <strong>3,892명의 멤버</strong>가 활동 중입니다
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-white text-orange-500     px-6 py-2 rounded-full     border border-orange-300 
                hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-600     hover:text-white     transition-all duration-200  "          >
            <Link href="/recruit">멤버모집 보러가기 {">"}</Link>
          </Button>
        </div>
      </section>
         <RecruitPreview /> {/* ← 추가 */}

      {/* Members Section */}
      <section className="bg-white py-16">
        <ProfileSlider />
      </section>

      <Footer />
    </div>
  )
}
