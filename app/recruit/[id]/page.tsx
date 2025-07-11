// app/recruit/[id]/page.tsx
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Eye, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecruitDetail {
    id: number;
    type: string;
    visibility: string;
    instruments: { instrument: string; proficiency: string }[];
    genres: { genre: string[] };
    title: string;
    description: string;
    region: string;
    thumbnail: string;
    snsLink: string;
    createdAt: string | null;
}

interface PageProps {
    // params가 Promise<{ id: string }> 타입이 되도록 선언
    params: Promise<{ id: string }>;
}

export default async function RecruitDetailPage({ params }: PageProps) {
    // ① params를 await으로 풀어서 실제 객체를 꺼내옵니다
    const { id } = await params;

    // ② 절대 URL 사용 (환경변수 또는 host 헤더 활용)
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/recruitments/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) return notFound();

    const json = await res.json();
    if (!json.isSuccess) return notFound();

    const post: RecruitDetail = json.result;

    // YouTube embed 변환 함수
    function getEmbedUrl(url: string) {
        const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
        if (ytMatch) {
            return `https://www.youtube.com/embed/${ytMatch[1]}`;
        }
        return null; // 지원하지 않는 경우
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto max-w-4xl px-4 py-8 pt-24">
                <Card className="overflow-hidden max-w-4xl">
                    <CardContent className="p-6">
                        {/* Type & Visibility */}
                        <div className="-mx-6 -mt-6 mb-8 relative">
                            {post.thumbnail ? (
                                <>
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="w-full h-64 md:h-80 object-cover rounded-t-xl border-b shadow-none"
                                    />
                                    {/* 오버레이와 제목/뱃지 */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent rounded-t-xl flex flex-col justify-between">
                                        <div className="flex justify-between items-start p-4">
                                            <span className="bg-orange-500 text-white font-bold rounded-full px-6 py-2 text-lg shadow-lg animate-bounce">모집중</span>
                                        </div>
                                        <div className="p-6">
                                            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">{post.title}</h1>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-64 md:h-80 bg-gray-200 rounded-t-xl flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>
                        {/* 제목은 배너로 이동 */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="secondary" className="uppercase">{post.type.replace(/_/g, " ")}</Badge>
                            <Badge variant="outline" className="uppercase">{post.visibility}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                            <span className="mr-4">지역: {post.region}</span>
                            <span>
                                등록일:{" "}
                                {post.createdAt
                                    ? new Date(post.createdAt).toLocaleDateString()
                                    : "-"}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="font-semibold text-lg mb-2">본문</div>
                        <p className="text-gray-700 mb-6 whitespace-pre-line">
                            {post.description}
                        </p>

                        {/* Genres */}
                        <div className="font-semibold text-lg mb-2">레퍼런스 장르</div>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.genres.genre.map((g) => (
                                <Badge key={g} variant="secondary">
                                    {g}
                                </Badge>
                            ))}
                        </div>

                        {/* Instruments */}
                        <div className="font-semibold text-lg mb-2">모집 세션/ 지원 가능 실력</div>
                        <div className="mb-6">
                            <ul className="list-disc pl-5 text-gray-700">
                                {post.instruments.map((inst, idx) => (
                                    <li key={idx}>
                                        {inst.instrument.replace(/_/g, " ")} - {inst.proficiency.replace(/_/g, " ").toLowerCase()}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* SNS Embed Preview */}
                        {post.snsLink && (
                            <div className="mb-6">
                                <div className="font-semibold text-lg mb-2">레퍼런스 곡/ 밴드/ 작업물</div>
                                {getEmbedUrl(post.snsLink) ? (
                                    <div style={{ aspectRatio: '16/9', maxWidth: 480, margin: '0 auto', minHeight: 320 }} className="w-full rounded-lg overflow-hidden border bg-black shadow-lg">
                                        <iframe
                                            src={getEmbedUrl(post.snsLink)!}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-center py-8">
                                        미리보기를 지원하지 않는 링크입니다.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-6">
                            <button className="flex items-center text-gray-500 hover:text-gray-700">
                                <Eye className="mr-1" /> 조회
                            </button>
                            <button className="flex items-center text-red-500 hover:text-red-700">
                                <Heart className="mr-1" /> 좋아요
                            </button>
                            <button className="flex items-center text-blue-500 hover:text-blue-700">
                                <Share2 className="mr-1" /> 공유
                            </button>
                        </div>
                        {/* 신청하기 버튼 */}
                        <div className="mt-4">
                            <Link href={`/recruit/${id}/apply`}>
                                <Button className="w-full">신청하기</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}