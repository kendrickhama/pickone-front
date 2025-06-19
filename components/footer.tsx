import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-12 bg-gradient-to-r from-orange-50 to-amber-50 text-amber-900 text-sm border-t border-orange-100">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 브랜드 섹션 */}
          <div className="md:col-span-2">
            <h4 className="text-xl font-bold mb-2 text-orange-500">Pickone</h4>
            <p className="text-amber-700 mb-2 leading-relaxed text-sm">
              당신의 음악, 당신의 밴드.
              <br />
              취향대로 만나는 밴드메이커 플랫폼
            </p>
            <p className="text-xs text-amber-600">&copy; 2025 Pickone. All rights reserved.</p>
          </div>

          {/* 링크 섹션 */}
          <div>
            <h5 className="font-semibold mb-2 text-amber-800 text-sm">서비스</h5>
            <div className="space-y-1">
              <Link href="/recruit" className="block hover:text-orange-500 transition-colors text-sm">
                멤버모집
              </Link>
              <Link href="/explore" className="block hover:text-orange-500 transition-colors text-sm">
                파동
              </Link>
              <Link href="/profile" className="block hover:text-orange-500 transition-colors text-sm">
                마이페이지
              </Link>
            </div>
          </div>

          {/* 연락처 섹션 */}
          <div>
            <h5 className="font-semibold mb-2 text-amber-800 text-sm">연락처</h5>
            <div className="space-y-1 text-amber-700 text-sm">
              <p>
                <strong className="text-amber-800">고객문의</strong>
                <br />
                <a href="mailto:support@pickone.kr" className="hover:text-orange-500 transition-colors">
                  support@pickone.kr
                </a>
              </p>
              <p>
                <strong className="text-amber-800">광고/제휴</strong>
                <br />
                <a href="mailto:ads@pickone.kr" className="hover:text-orange-500 transition-colors">
                  ads@pickone.kr
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* SNS 섹션 */}
        <div className="border-t border-orange-200 mt-4 pt-4 flex flex-col sm:flex-row justify-between items-center text-xs">
          <div className="flex space-x-4 mb-3 sm:mb-0">
            <a href="#" className="text-amber-700 hover:text-orange-500 transition-colors">
              Instagram
            </a>
            <a href="#" className="text-amber-700 hover:text-orange-500 transition-colors">
              YouTube
            </a>
            <a href="#" className="text-amber-700 hover:text-orange-500 transition-colors">
              Facebook
            </a>
          </div>
          <div className="text-amber-600">Made with ❤️ for musicians</div>
        </div>
      </div>
    </footer>
)
}