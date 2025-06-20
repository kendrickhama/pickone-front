// app/recruit/[id]/page.tsx
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Eye, Heart, Share2 } from "lucide-react";
import Link from "next/link";

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
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/recruitments/${id}`, {
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
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}

[
  {
    "type": "Long",
    "status": "Recruiting",
    "visibility": "PUBLIC",
    "title": "1년 동안 빡시게 할 밴드 구함 (nell 커버)",
    "description": "nell 너무 좋아요효요요요",
    "region": "서울 성동구",
    "thumbnail": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDteHozoM71udQds504yazmAWkzbJ4pSZapg&s",
    "snsLink": "https://www.instagram.com/woong__o/",
    "instrumentProficiencyDto": [
      {
        "instrumentDetails": [
          {
            "instrument": "ELECTRIC_GUITAR",
            "proficiency": "ADVANCED"
          },
          {
            "instrument": "BASS",
            "proficiency": "INTERMEDIATE"
          }
        ]
      }
    ],
    "genreRequestDto": {
      "recruitmentGenres": [
        "INDIE_ROCK",
        "FOLK",
        "ALTERNATIVE_ROCK",
        "SHOEGAZING"
      ]
    }
  },
  ,
  {
    "type": "Long",
    "status": "Recruiting",
    "visibility": "PUBLIC",
    "title": "보컬만 있으면 완성되는 팀",
    "description": "기타, 베이스, 드럼 다 모였어요. 보컬 구합니다.",
    "region": "서울 강남구",
    "thumbnail": "https://via.placeholder.com/150",
    "snsLink": "https://instagram.com/sample2",
    "instrumentProficiencyDto": [
      {
        "instrumentDetails": [
          {
            "instrument": "VOCAL",
            "proficiency": "INTERMEDIATE"
          }
        ]
      }
    ],
    "genreRequestDto": {
      "recruitmentGenres": ["MODERN_ROCK", "POP"]
    }
  },
  {
    "type": "Project",
    "status": "Recruiting",
    "visibility": "PUBLIC",
    "title": "The Smile 느낌의 실험적인 사운드 팀",
    "description": "Radiohead, The Smile 좋아하는 분들 환영",
    "region": "경기 고양시",
    "thumbnail": "https://via.placeholder.com/150",
    "snsLink": "https://instagram.com/sample3",
    "instrumentProficiencyDto": [
      {
        "instrumentDetails": [
          {
            "instrument": "SYNTHESIZER",
            "proficiency": "ADVANCED"
          }
        ]
      }
    ],
    "genreRequestDto": {
      "recruitmentGenres": ["EXPERIMENTAL", "ALTERNATIVE_ROCK"]
    }
  },
  {
    "type": "Short",
    "status": "Recruiting",
    "visibility": "PUBLIC",
    "title": "이태원에서 놀며 합주할 분!",
    "description": "이태원 스튜디오에서 주 1회 합주, 음악은 자유롭게",
    "region": "서울 용산구",
    "thumbnail": "https://via.placeholder.com/150",
    "snsLink": "https://instagram.com/sample4",
    "instrumentProficiencyDto": [
      {
        "instrumentDetails": [
          {
            "instrument": "ELECTRIC_GUITAR",
            "proficiency": "INTERMEDIATE"
          }
        ]
      }
    ],
    "genreRequestDto": {
      "recruitmentGenres": ["POP_ROCK", "CITY_POP"]
    }
  },
  {
    "type": "Long",
    "status": "Recruiting",
    "visibility": "PUBLIC",
    "title": "기타 듀오 결성할 분 (조지/백예린 스타일)",
    "description": "R&B, 네오소울 스타일 좋아하는 기타리스트 찾아요",
    "region": "서울 동작구",
    "thumbnail": "https://via.placeholder.com/150",
    "snsLink": "https://instagram.com/sample5",
    "instrumentProficiencyDto": [
      {
        "instrumentDetails": [
          {
            "instrument": "ELECTRIC_GUITAR",
            "proficiency": "ADVANCED"
          }
        ]
      }
    ],
    "genreRequestDto": {
      "recruitmentGenres": ["RNB", "NEO_SOUL"]
    }
  },
  {
    "type": "Project",
    "status": "Recruiting",
    "visibility": "PUBLIC",
    "title": "90년대 얼터락 리바이벌 프로젝트",
    "description": "Nirvana, Smashing Pumpkins 커버 프로젝트",
    "region": "서울 관악구",
    "thumbnail": "https://via.placeholder.com/150",
    "snsLink": "https://instagram.com/sample6",
    "instrumentProficiencyDto": [
      {
        "instrumentDetails": [
          {
            "instrument": "BASS",
            "proficiency": "INTERMEDIATE"
          }
        ]
      }
    ],
    "genreRequestDto": {
      "recruitmentGenres": ["GRUNGE", "ALTERNATIVE_ROCK"]
    }
  },
  {
    "type": "Short",
    "status": "Recruiting",
    "visibility": "PUBLIC",
    "title": "여자 멤버들로만 구성된 밴드 구함",
    "description": "여성 기타/베이스/드럼 멤버 모집합니다",
    "region": "서울 종로구",
    "thumbnail": "https://via.placeholder.com/150",
    "snsLink": "https://instagram.com/sample7",
    "instrumentProficiencyDto": [
      {
        "instrumentDetails": [
          {
            "instrument": "DRUM",
            "proficiency": "BEGINNER"
          },
          {
            "instrument": "BASS",
            "proficiency": "BEGINNER"
          }
        ]
      }
    ],
    "genreRequestDto": {
      "recruitmentGenres": ["INDIE_ROCK", "GIRL_GROUP"]
    }
  }
]