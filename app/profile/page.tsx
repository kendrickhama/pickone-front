"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, Star, Calendar, MapPin, Edit, Save } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

const userProfile = {
  name: "김민수",
  instrument: "기타",
  experience: "3년",
  location: "서울 홍대",
  bio: "음악을 사랑하는 기타리스트입니다. 다양한 장르에 관심이 많아요.",
  image: "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg",
  rating: 4.8,
  genres: ["록", "인디", "블루스"],
  instruments: [
    { name: "일렉트릭 기타", experience: "3년", level: "중급" },
    { name: "어쿠스틱 기타", experience: "2년", level: "초급" },
  ],
  favoriteArtists: ["Radiohead", "Arctic Monkeys", "The Strokes", "Pink Floyd", "Led Zeppelin"],
  favoriteAlbums: [
    { title: "OK Computer", artist: "Radiohead", year: "1997" },
    { title: "AM", artist: "Arctic Monkeys", year: "2013" },
    { title: "Is This It", artist: "The Strokes", year: "2001" },
    { title: "Dark Side of the Moon", artist: "Pink Floyd", year: "1973" },
  ],
  performances: [
    { title: "홍대 클럽 공연", date: "2024-01-10", venue: "Club FF", role: "리드 기타" },
    { title: "대학 축제", date: "2023-11-15", venue: "서울대학교", role: "기타" },
    { title: "버스킹", date: "2023-09-20", venue: "홍대 걷고싶은거리", role: "어쿠스틱 기타" },
  ],
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(userProfile)

  const handleSave = () => {
    setIsEditing(false)
    // 여기서 실제로는 서버에 저장하는 로직이 들어갑니다
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 bg-white border border-gray-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-6">
                  <img
                    src={profile.image || "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg"}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg"
                    }}
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-lg px-3 py-1 bg-gray-100 text-gray-700">
                        {profile.instrument}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-1" />
                        <span className="text-lg font-semibold">{profile.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {profile.location}
                    </div>
                    <p className="text-gray-700 mt-2 max-w-md">{profile.bio}</p>
                  </div>
                </div>
                <Button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                  {isEditing ? "저장" : "편집"}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="instruments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
              <TabsTrigger
                value="instruments"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                악기 이력
              </TabsTrigger>
              <TabsTrigger value="music" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                음악 취향
              </TabsTrigger>
              <TabsTrigger
                value="performances"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                공연 정보
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                설정
              </TabsTrigger>
            </TabsList>

            {/* Instruments Tab */}
            <TabsContent value="instruments">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Music className="mr-2 h-5 w-5" />
                    악기 이력
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.instruments.map((instrument, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{instrument.name}</h3>
                            <p className="text-gray-600">경력: {instrument.experience}</p>
                            <Badge variant="outline" className="mt-2 border-gray-300 text-gray-700">
                              {instrument.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                        + 악기 추가
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Music Tab */}
            <TabsContent value="music">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">좋아하는 아티스트</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {profile.favoriteArtists.map((artist, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-900">{artist}</span>
                          {isEditing && (
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                              삭제
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                          + 아티스트 추가
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">좋아하는 앨범</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.favoriteAlbums.map((album, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded">
                          <h4 className="font-semibold text-gray-900">{album.title}</h4>
                          <p className="text-sm text-gray-600">
                            {album.artist} • {album.year}
                          </p>
                          {isEditing && (
                            <Button variant="ghost" size="sm" className="mt-2 text-gray-600 hover:text-gray-900">
                              삭제
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                          + 앨범 추가
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performances Tab */}
            <TabsContent value="performances">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Calendar className="mr-2 h-5 w-5" />
                    공연 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.performances.map((performance, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{performance.title}</h3>
                            <p className="text-gray-600">{performance.venue}</p>
                            <p className="text-sm text-gray-500">{performance.date}</p>
                            <Badge variant="outline" className="mt-2 border-gray-300 text-gray-700">
                              {performance.role}
                            </Badge>
                          </div>
                          {isEditing && (
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                              삭제
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                        + 공연 추가
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">프로필 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900">이름</label>
                    <Input value={profile.name} className="mt-1 border-gray-300" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">주요 악기</label>
                    <Input value={profile.instrument} className="mt-1 border-gray-300" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">지역</label>
                    <Input value={profile.location} className="mt-1 border-gray-300" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">자기소개</label>
                    <Textarea value={profile.bio} className="mt-1 border-gray-300" rows={3} />
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600">설정 저장</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
