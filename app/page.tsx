import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import ProfileSlider from "@/components/profile-slider"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
              피크원은 당신이 좋아하는 장르, 연주 스타일, 음악적 성질을 바탕으로
              <br />
              취향이 맞는 멤버를 추천합니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              당신의 음악을 만아주는 사람들과 진짜 어울리는 밴드를 만들어보세요.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg rounded-full"
          >
            <Link href="/recruit">View more {">"}</Link>
          </Button>
        </div>
      </section>

      {/* Members Section */}
      <section className="bg-white py-16">
        <ProfileSlider />
      </section>

      <Footer />
    </div>
  )
}
