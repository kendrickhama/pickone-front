"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Save, MapPin, User, Settings, Info, UserSearch } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useRouter, notFound } from "next/navigation"
import { Calendar, Search, Music, Heart } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface ApiResponse {
  isSuccess: boolean
  message: string
  result: {
    id: number
    email: string
    nickname: string
    mbti: string
    preference: | string | {
      primaryGenre: string
      secondaryGenre: string
      tertiaryGenre: string
      fouriaryGenre: string
    }
    instruments: string
    profileImageUrl: string | null
    isPublic: boolean
    role: string
    bio?: string
    location?: string
  }
}

interface FollowResponse {
  isSuccess: boolean
  message: string
  result: any[]
}

export default function ProfilePage() {
  const router = useRouter()

  // 1) 로그인한 유저 ID
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  // 2) API로 받아온 프로필 정보
  const [userData, setUserData] = useState<ApiResponse["result"] | null>(null)
  const [followingCount, setFollowingCount] = useState(0)
  const [followerCount, setFollowerCount] = useState(0)

  useEffect(() => {
    // 2-1) localStorage에서 userId 꺼내기
    const id = localStorage.getItem("userId")
    if (id) setCurrentUserId(Number(id))

      // 2-2) 프로필 + 팔로우 데이터 fetch
      ; (async () => {
        if (!id) {
          notFound()
          return
        }
        const [res, fRes, foRes] = await Promise.all([
          fetch(`/api/users/${id}`, { cache: "no-store" }),
          fetch(`/api/follows/${id}/followings`, { cache: "no-store" }),
          fetch(`/api/follows/${id}/followers`, { cache: "no-store" }),
        ])
        if (!res.ok) return notFound()
        const json: ApiResponse = await res.json()
        if (!json.isSuccess) return notFound()
        setUserData(json.result)

        const fJson: FollowResponse = await fRes.json()
        setFollowingCount(fJson.isSuccess ? fJson.result.length : 0)

        const foJson: FollowResponse = await foRes.json()
        setFollowerCount(foJson.isSuccess ? foJson.result.length : 0)
      })()
  }, [])

  if (!userData) {
    return <div>로딩 중...</div>
  }

  // 3) 주인 여부 플래그
  const isOwner = currentUserId === userData.id

  const {
    email,
    nickname,
    mbti,
    instruments,
    preference,
    profileImageUrl,
    isPublic,
    role,
    bio = "",
    location = "",
  } = userData


  // 가짜 공연 이력 데이터
  const fakePerformances = [
    { title: "홍대 클럽 공연", date: "2024-01-10", venue: "Club FF", role: "리드 기타" },
    { title: "대학 축제", date: "2023-11-15", venue: "서울대학교", role: "기타" },
    { title: "버스킹", date: "2023-09-20", venue: "홍대 걷고싶은거리", role: "어쿠스틱 기타" },
  ];

  const genreColorMap: Record<string, string> = {
  INDIE_ROCK:       'text-indigo-600',
  ALTERNATIVE_ROCK: 'text-blue-600',
  HARD_ROCK:        'text-gray-800',
  POST_ROCK:        'text-purple-600',
  SHOEGAZING:       'text-pink-600',
  HEAVY_METAL:      'text-red-700',
  PUNK_ROCK:        'text-yellow-700',
  GRUNGE:           'text-green-800',
  PROGRESSIVE_ROCK: 'text-blue-800',
  GARAGE_ROCK:      'text-yellow-800',
  CLASSIC_ROCK:     'text-gray-600',

  DEATH_METAL:      'text-gray-900',
  BLACK_METAL:      'text-black',
  THRASH_METAL:     'text-red-800',
  DOOM_METAL:       'text-gray-700',

  FOLK:             'text-teal-700',
  FOLK_ROCK:        'text-green-600',
  ACOUSTIC:         'text-amber-600',

  JAZZ:             'text-teal-600',
  SMOOTH_JAZZ:      'text-blue-400',
  FUSION_JAZZ:      'text-indigo-500',
  LOFI_JAZZ:        'text-gray-400',

  POP:              'text-pink-500',
  DREAM_POP:        'text-pink-400',
  SYNTH_POP:        'text-purple-500',
  ELECTRO_POP:      'text-purple-400',

  HIPHOP:           'text-yellow-600',
  LOFI:             'text-gray-500',
  EDM:              'text-indigo-500',
  AMBIENT:          'text-emerald-600',
  HOUSE:            'text-amber-500',
  TECHNO:           'text-cyan-600',
  TRANCE:           'text-violet-500',

  BLUES:            'text-blue-700',
  SOUL:             'text-red-500',
  RNB:              'text-purple-700',

  CLASSICAL:        'text-gray-500',
  FUNK:             'text-orange-600',
  REGGAE:           'text-green-700',
  WORLD_MUSIC:      'text-emerald-500',
  EXPERIMENTAL:     'text-fuchsia-500',
  POST_PUNK:        'text-rose-600',
  MATH_ROCK:        'text-lime-700',
  GOSPEL:           'text-yellow-500',
}

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navigation />

      <main className="max-w-6xl mx-auto p-6 pt-20">
        {/*검색 영역*/}
        <section>
          <div className="max-w-md mx-auto pb-2">
            {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">사용자 검색</h2> */}
            <form action="/userSearch" method="get" className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="keyword"
                  placeholder="닉네임 또는 이메일로 검색"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center bg-white border border-gray-300 text-gray-800 font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition-shadow hover:shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                검색
              </button>
            </form>
          </div>
        </section>



        <Card className="flex flex-col md:flex-row bg-gradient-to-br from-white to-gray-50 border border-[#dadcdf] shadow-md rounded-sm overflow-hidden pt-6 pb-6">
          {/* 이미지 영역 */}
          <div className="w-40 h-40 bg-gray-100 flex items-center justify-center p-2 rounded-full overflow-hidden border border-gray-200 ml-8">
            <img
              src={profileImageUrl || "/default-avatar.png"}
              alt={nickname}
              className="w-full h-full object-cover "
            />
          </div>

          {/* 내용 영역 */}
          <CardContent className="flex-1 p-6 space-y-4">
            <div className="flex items-start space-x-6">
              {/* 왼쪽: 닉네임 / 이메일 / 뱃지 */}
              <div className="flex-1 space-y-2">
                <h1 className="text-3xl font-bold text-[#292929]">{nickname}</h1>
                <p className="text-gray-500">{email}</p>
                <p className="text-[#828C94] flex items-center space-x-2">
                  <Link
                    href="/followers"
                    className="hover:text-[#c4cfd9] transition-colors"
                  >
                    팔로워 <span className="font-semibold text-[#2F3438]">{followerCount}</span>
                  </Link>
                  <span>│</span>
                  <Link
                    href="/followings"
                    className="hover:text-[#c4cfd9] transition-colors"
                  >
                    팔로잉 <span className="font-semibold text-[#2F3438]">{followingCount}</span>
                  </Link>
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  {/* MBTI */}
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{mbti}</span>
                  </Badge>

                  {/* Instruments */}
                  {Array.isArray(instruments) && instruments.length > 0 ? (
                    instruments.map(inst => (
                      <Badge
                        key={inst}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <Music className="w-4 h-4" />
                        <span>{inst}</span>
                      </Badge>
                    ))
                  ) : (
                    <span className="italic text-gray-800 flex items-center space-x-1">
                      <Music className="w-4 h-4" />
                      <span>관객</span>
                    </span>
                  )}
                </div>
                <div className="flex space-x-6">
                  {/* Preference (Primary Genre) */}
                  {preference && (
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-semibold text-gray-700">선호 장르</p>
                      <div className="flex items-center space-x-2 flex-wrap">
                        {(
                          typeof preference === "string"
                            ? [preference]
                            : Object.values(preference)
                        )
                          .filter((g) => !!g)
                          .map((g) => {
                            const textColor = genreColorMap[g] || 'text-gray-700'
                            return (
                              <Badge
                                key={g}
                                className={`${textColor} bg-white border border-gray-200 px-2 py-1 text-xs rounded-full shadow-sm`}
                              >
                                {g.replace(/_/g, " ")}
                              </Badge>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </div>


                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{isPublic ? "공개" : "비공개"}</Badge>
                </div>
              </div>

              {/* 세로 구분선 */}
              <div className="w-px bg-gray-200 h-24" />

              {/* 오른쪽: 자기소개 & SNS */}
              <div className="flex-1 space-y-4">
                {/* 자기소개 */}
                {bio ? (
                  <p className="text-gray-700">{bio}</p>
                ) : (
                  <p className="text-gray-500 italic">자기소개가 없습니다.</p>
                )}
                {/* SNS 링크 */}
                <div className="flex flex-col space-y-1 text-[#0AA5FF]">
                  <a href="https://facebook.com/fake" target="_blank" rel="noreferrer" className=" hover:underline">
                    Facebook
                  </a>
                  <a href="https://twitter.com/fake" target="_blank" rel="noreferrer" className=" hover:underline">
                    Twitter
                  </a>
                  <a href="https://instagram.com/fake" target="_blank" rel="noreferrer" className=" hover:underline">
                    Instagram
                  </a>
                </div>
              </div>
            </div>
            {isOwner ? (
              // 주인인 경우: 수정/삭제 버튼
              <div className="mt-4 flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/profile/edit")}
                >
                  프로필 수정
                </Button>
              </div>
            ) : (
              // 주인이 아닌 경우: 팔로우 토글 버튼
              <div className="mt-4">
                <Button onClick={() => {/* 팔로우/언팔로우 로직 */ }}>
                  { /* isFollowing 상태에 따라 */ "팔로우"}
                </Button>
              </div>
            )}
            {bio && <p className="text-gray-700">{bio}</p>}
            {location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-2" />
                <span>{location}</span>
              </div>
            )}
          </CardContent>
        </Card>
        <p className="text-[#292929] pt-4 font-semibold text-xl">Top 5 Album</p>
        <div className="flex flex-col space-y-4 pt-4 ml-2 md:flex-row md:space-x-8 md:space-y-0 md:ml-2">
          <img
            src="https://i.scdn.co/image/ab67616d0000b2733303a842ee1bc0b23204333d"
            alt="Album 1"
            className="w-full md:w-48 h-48 object-cover rounded"
          />
          <img
            src="https://i.scdn.co/image/ab67616d0000b2739293c743fa542094336c5e12"
            alt="Album 2"
            className="w-full md:w-48 h-48 object-cover rounded"
          />
          <img
            src="https://i.scdn.co/image/ab67616d0000b27304f4a7915e062a1282289073"
            alt="Album 3"
            className="w-full md:w-48 h-48 object-cover rounded"
          />
          <img
            src="https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe"
            alt="Album 4"
            className="w-full md:w-48 h-48 object-cover rounded"
          />
          <img
            src="https://i.scdn.co/image/ab67616d0000b2733ed60b59aaa75ed572d7fc30"
            alt="Album 5"
            className="w-full md:w-48 h-48 object-cover rounded"
          />
        </div>



        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">공연 이력</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fakePerformances.map((perf) => (
              <div
                key={`${perf.title}-${perf.date}`}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col"
              >
                <h3 className="text-lg font-bold text-gray-900">{perf.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{perf.venue}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{perf.date}</span>
                </div>
                <Badge variant="outline" className="self-start mt-3">
                  {perf.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        <Tabs defaultValue="settings" className="mt-8 bg-white rounded-lg shadow">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="settings" className="flex items-center justify-center py-3 font-medium">
              <Settings className="mr-2" /> 설정
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center justify-center py-3 font-medium">
              <User className="mr-2" /> 추가정보
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                <Input value={nickname} disabled className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <Input value={email} disabled className="w-full" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Save className="mr-2" /> 저장
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="info" className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">활동 통계</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent>
                  <p className="text-2xl font-bold text-orange-500">12</p>
                  <p className="text-gray-600">작성글</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent>
                  <p className="text-2xl font-bold text-orange-500">34</p>
                  <p className="text-gray-600">댓글</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent>
                  <p className="text-2xl font-bold text-orange-500">5</p>
                  <p className="text-gray-600">좋아요</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}