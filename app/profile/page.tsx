import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Save, MapPin, User, Settings, Info, UserSearch } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { notFound } from "next/navigation"
import { Calendar, Search } from "lucide-react"
import Link from "next/link"

interface ApiResponse {
  isSuccess: boolean
  message: string
  result: {
    id: number
    email: string
    nickname: string
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

export default async function ProfilePage() {
  const res = await fetch("http://3.35.49.195:8080/api/users/1", { cache: "no-store" })
  if (!res.ok) return notFound()
  const data: ApiResponse = await res.json()
  if (!data.isSuccess) return notFound()

  const { email, nickname, profileImageUrl, isPublic, role, bio = "", location = "" } = data.result

  // 2) 팔로잉 수
  const followingsRes = await fetch(
    `http://3.35.49.195:8080/api/follows/1/followings`,
    { cache: "no-store" }
  )
  const followingsJson: FollowResponse = await followingsRes.json()
  const followingCount = followingsJson.isSuccess ? followingsJson.result.length : 0

  // 3) 팔로워 수
  const followersRes = await fetch(
    `http://3.35.49.195:8080/api/follows/1/followers`,
    { cache: "no-store" }
  )
  const followersJson: FollowResponse = await followersRes.json()
  const followerCount = followersJson.isSuccess ? followersJson.result.length : 0



  // 가짜 공연 이력 데이터
  const fakePerformances = [
    { title: "홍대 클럽 공연", date: "2024-01-10", venue: "Club FF", role: "리드 기타" },
    { title: "대학 축제", date: "2023-11-15", venue: "서울대학교", role: "기타" },
    { title: "버스킹", date: "2023-09-20", venue: "홍대 걷고싶은거리", role: "어쿠스틱 기타" },
  ];
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

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{role}</Badge>
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