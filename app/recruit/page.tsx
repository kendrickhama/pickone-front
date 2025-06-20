import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ModernFilter from "@/components/modern-filter";
import ProfileSlider from "@/components/profile-slider";
import Pagination from "@/components/pagination";
import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";

const heroSlides = [
  {
    id: 1,
    title: "GOOD BYE 2024",
    subtitle: "여기에 광고나 멤버모집글을 올릴...",
    description: "아무거나 뭔가",
    src: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241227_62%2F1735271197300mpNp2_JPEG%2FIMG_9202.jpeg"
  },
  {
    id: 2,
    title: "HELLO 2025",
    subtitle: "새로운 음악 여정을 시작하세요",
    description: "함께할 멤버를 찾아보세요",
    src: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250106_149%2F1736155489180a8mRy_JPEG%2FIMG_9838.jpeg"
  },
  {
    id: 3,
    title: "MUSIC TOGETHER",
    subtitle: "음악으로 하나되는 순간",
    description: "당신의 밴드를 만들어보세요",
    src: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240928_121%2F1727517617300r7BOW_JPEG%2F40482293-F930-4D27-89DC-08C70855DCF7.jpeg"
  },
]
interface PageParams {
  searchParams?: { page?: string };
}

export default async function RecruitPage({ searchParams }: PageParams) {
  const POSTS_PER_PAGE = 6;
  const page = parseInt(searchParams?.page || "1", 10) - 1; // 0-based

  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(
    `${base}/api/recruitments?page=${page}&size=${POSTS_PER_PAGE}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("데이터 로드 실패");
  const json = await res.json();
  if (!json.isSuccess) throw new Error(json.message);

  const { content: posts, totalPages } = json.result;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSlider slides={heroSlides} />

      {/* 필터 + 글쓰기 */}
      <section className=" mx-auto max-w-7xl px-4 py-6">
        {/* 1️⃣ 필터 영역 (full-width) */}
        <div>
          <ModernFilter />
        </div>

        {/* 2️⃣ 버튼 영역 (필터 아래, 오른쪽 정렬) */}
        <div className="mt-4 flex justify-end">
          <Link
            href="/recruit/new"
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            글쓰기
          </Link>
        </div>
      </section>
      {/* 게시물 그리드 */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">게시물이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <Card key={post.id} className="shadow-lg hover:shadow-xl ">
                <Link href={`/recruit/${post.id}`}>
                  <img
                    src={post.thumbnail || "/no-image.png"}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-sm"
                  />
                </Link>
                <CardContent>
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.genres.genre.map((g: string) => (
                      <Badge key={g}>{g}</Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/recruit/${post.id}`}
                      className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
                    >
                      자세히 보기
                    </Link>
                    <div className="flex space-x-2">
                      <Heart className="h-5 w-5 text-gray-500" />
                      <Share2 className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 페이징 */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i}
              href={`/recruit?page=${i + 1}`}
              className={`px-3 py-1 rounded ${i === page ? "bg-orange-500 text-white" : "bg-white text-gray-700"
                }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      </section>

      <ProfileSlider />
      <Footer />
    </div>
  );
}