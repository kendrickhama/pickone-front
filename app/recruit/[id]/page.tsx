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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto px-4 py-8 pt-24">
                <Card className="overflow-hidden">
                    {post.thumbnail && (
                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-64 object-cover"
                        />
                    )}
                    <CardContent className="p-6">
                        {/* Type & Visibility */}
                        <div className="flex items-center space-x-2 mb-4">
                            <Badge variant="secondary" className="uppercase">
                                {post.type.replace(/_/g, " ")}
                            </Badge>
                            <Badge variant="outline" className="uppercase">
                                {post.visibility}
                            </Badge>
                        </div>

                        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
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
                        <p className="text-gray-700 mb-6 whitespace-pre-line">
                            {post.description}
                        </p>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.genres.genre.map((g) => (
                                <Badge key={g} variant="secondary">
                                    {g}
                                </Badge>
                            ))}
                        </div>

                        {/* Instruments */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">
                                모집 세션/ 지원 가능 실력
                            </h2>
                            <ul className="list-disc pl-5 text-gray-700">
                                {post.instruments.map((inst, idx) => (
                                    <li key={idx}>
                                        {inst.instrument.replace(/_/g, " ")} -{" "}
                                        {inst.proficiency.replace(/_/g, " ").toLowerCase()}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* SNS Link */}
                        {post.snsLink && (
                            <div className="mb-6">
                                <Link
                                    href={post.snsLink}
                                    target="_blank"
                                    className="text-orange-600 hover:underline"
                                >
                                    🔗 SNS 바로가기
                                </Link>
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