"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Music, Users, MapPin, Calendar, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

// Last.fm API 설정
const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY || "YOUR_LASTFM_API_KEY" // 실제 API 키로 교체 필요
const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0/"

// Last.fm API 호출 함수
const searchLastfmArtists = async (query: string) => {
  try {
    const response = await fetch(
      `${LASTFM_BASE_URL}?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${LASTFM_API_KEY}&format=json&limit=10`
    )
    
    if (!response.ok) {
      throw new Error('API 호출 실패')
    }
    
    const data = await response.json()
    return data.results?.artistmatches?.artist || []
  } catch (error) {
    console.error('Last.fm API 오류:', error)
    return []
  }
}

// 아티스트 상세 정보 가져오기
const getArtistInfo = async (artistName: string) => {
  try {
    const response = await fetch(
      `${LASTFM_BASE_URL}?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json`
    )
    
    if (!response.ok) {
      throw new Error('API 호출 실패')
    }
    
    const data = await response.json()
    return data.artist
  } catch (error) {
    console.error('아티스트 정보 가져오기 오류:', error)
    return null
  }
}

export default function BandRegisterPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBand, setSelectedBand] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [formData, setFormData] = useState({
    bandName: "",
    genre: "",
    description: "",
    location: "",
    formedYear: "",
    members: "",
    imageUrl: "",
    socialLinks: {
      instagram: "",
      youtube: "",
      twitter: ""
    }
  })

  // 검색 기능
  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    setIsSearching(true)
    try {
      // API 키가 설정되어 있지 않으면 샘플 데이터 사용
      if (!LASTFM_API_KEY || LASTFM_API_KEY === "YOUR_LASTFM_API_KEY") {
        // 샘플 데이터로 시뮬레이션
        setTimeout(() => {
          const sampleArtists = [
            {
              name: "BTS",
              listeners: "2,500,000",
              country: "South Korea",
              image: [
                { size: "small", "#text": "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg" },
                { size: "medium", "#text": "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg" },
                { size: "large", "#text": "https://i.pinimg.com/736x/68/92/46/689246fedf6c075e402b3c3a2709ebcc.jpg" }
              ]
            },
            {
              name: "BlackPink",
              listeners: "1,800,000",
              country: "South Korea",
              image: [
                { size: "small", "#text": "https://i.pinimg.com/736x/dd/b4/6c/ddb46c06252392988f757bd1b8c4ad4e.jpg" },
                { size: "medium", "#text": "https://i.pinimg.com/736x/dd/b4/6c/ddb46c06252392988f757bd1b8c4ad4e.jpg" },
                { size: "large", "#text": "https://i.pinimg.com/736x/dd/b4/6c/ddb46c06252392988f757bd1b8c4ad4e.jpg" }
              ]
            },
            {
              name: "NewJeans",
              listeners: "950,000",
              country: "South Korea",
              image: [
                { size: "small", "#text": "https://i.pinimg.com/736x/b4/bb/e9/b4bbe942e86a4765816788971719066e.jpg" },
                { size: "medium", "#text": "https://i.pinimg.com/736x/b4/bb/e9/b4bbe942e86a4765816788971719066e.jpg" },
                { size: "large", "#text": "https://i.pinimg.com/736x/b4/bb/e9/b4bbe942e86a4765816788971719066e.jpg" }
              ]
            }
          ].filter(artist => 
            artist.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          setSearchResults(sampleArtists)
          setIsSearching(false)
        }, 1000)
        return
      }
      
      const artists = await searchLastfmArtists(searchTerm)
      setSearchResults(artists)
    } catch (error) {
      console.error('검색 오류:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // 밴드 선택
  const handleBandSelect = async (artist: any) => {
    setSelectedBand(artist)
    
    // API 키가 설정되어 있지 않으면 기본 정보만 설정
    if (!LASTFM_API_KEY || LASTFM_API_KEY === "YOUR_LASTFM_API_KEY") {
      setFormData({
        ...formData,
        bandName: artist.name,
        genre: "K-Pop", // 샘플 데이터의 기본 장르
        description: `${artist.name}은(는) ${artist.country}의 인기 아티스트입니다.`,
        imageUrl: artist.image?.[2]?.['#text'] || artist.image?.[1]?.['#text'] || "",
        location: artist.country || "",
        formedYear: "2020" // 샘플 데이터의 기본 년도
      })
      return
    }
    
    // 아티스트 상세 정보 가져오기
    try {
      const artistInfo = await getArtistInfo(artist.name)
      if (artistInfo) {
        setFormData({
          ...formData,
          bandName: artist.name,
          genre: artistInfo.tags?.tag?.[0]?.name || "Unknown",
          description: artistInfo.bio?.summary?.replace(/<[^>]*>/g, '') || artistInfo.bio?.content?.replace(/<[^>]*>/g, '') || "",
          imageUrl: artist.image?.[2]?.['#text'] || artist.image?.[1]?.['#text'] || "",
          location: artistInfo.country || "",
          formedYear: artistInfo.bio?.published || ""
        })
      } else {
        setFormData({
          ...formData,
          bandName: artist.name,
          genre: "Unknown",
          description: "",
          imageUrl: artist.image?.[2]?.['#text'] || artist.image?.[1]?.['#text'] || ""
        })
      }
    } catch (error) {
      console.error('아티스트 정보 가져오기 오류:', error)
      setFormData({
        ...formData,
        bandName: artist.name,
        genre: "Unknown",
        description: "",
        imageUrl: artist.image?.[2]?.['#text'] || artist.image?.[1]?.['#text'] || ""
      })
    }
  }

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 여기서 실제 API 호출을 하여 밴드 등록
    console.log("밴드 등록:", formData)
    alert("밴드가 성공적으로 등록되었습니다!")
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로 가기
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">밴드 등록</h1>
          <p className="text-gray-600">실제 밴드를 검색하고 등록하거나 새로운 밴드를 등록하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 밴드 검색 섹션 */}
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Search className="h-5 w-5 text-orange-500" />
                실제 밴드 검색
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="밴드명 또는 장르로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isSearching ? "검색중..." : "검색"}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {searchResults.map((artist, index) => (
                    <Card 
                      key={artist.name + index} 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedBand?.name === artist.name ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                      }`}
                      onClick={() => handleBandSelect(artist)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={artist.image?.[2]?.['#text'] || artist.image?.[1]?.['#text'] || "/placeholder-user.jpg"} 
                            alt={artist.name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder-user.jpg"
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{artist.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Badge variant="secondary" className="text-xs">
                                {artist.listeners ? `${artist.listeners}명 청취` : "Unknown"}
                              </Badge>
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {artist.country || "Unknown"}
                              </span>
                            </div>
                          </div>
                          {selectedBand?.name === artist.name && (
                            <CheckCircle className="h-5 w-5 text-orange-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {searchResults.length === 0 && searchTerm && !isSearching && (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>검색 결과가 없습니다.</p>
                  <p className="text-sm">다른 키워드로 검색해보세요.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 밴드 등록 폼 */}
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Music className="h-5 w-5 text-orange-500" />
                밴드 정보 등록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="bandName">밴드명 *</Label>
                  <Input
                    id="bandName"
                    value={formData.bandName}
                    onChange={(e) => setFormData({...formData, bandName: e.target.value})}
                    placeholder="밴드명을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="genre">장르 *</Label>
                  <Select value={formData.genre} onValueChange={(value) => setFormData({...formData, genre: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="장르를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="K-Pop">K-Pop</SelectItem>
                      <SelectItem value="인디">인디</SelectItem>
                      <SelectItem value="록">록</SelectItem>
                      <SelectItem value="재즈">재즈</SelectItem>
                      <SelectItem value="일렉트로닉">일렉트로닉</SelectItem>
                      <SelectItem value="어쿠스틱">어쿠스틱</SelectItem>
                      <SelectItem value="메탈">메탈</SelectItem>
                      <SelectItem value="팝">팝</SelectItem>
                      <SelectItem value="힙합">힙합</SelectItem>
                      <SelectItem value="R&B">R&B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">밴드 소개</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="밴드에 대한 소개를 작성하세요"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">활동 지역</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="서울, 부산 등"
                    />
                  </div>
                  <div>
                    <Label htmlFor="formedYear">결성년도</Label>
                    <Input
                      id="formedYear"
                      value={formData.formedYear}
                      onChange={(e) => setFormData({...formData, formedYear: e.target.value})}
                      placeholder="2020"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="members">멤버 수</Label>
                  <Input
                    id="members"
                    value={formData.members}
                    onChange={(e) => setFormData({...formData, members: e.target.value})}
                    placeholder="5"
                    type="number"
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">프로필 이미지 URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-3">
                  <Label>소셜 미디어 링크</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Instagram URL"
                      value={formData.socialLinks.instagram}
                      onChange={(e) => setFormData({
                        ...formData, 
                        socialLinks: {...formData.socialLinks, instagram: e.target.value}
                      })}
                    />
                    <Input
                      placeholder="YouTube URL"
                      value={formData.socialLinks.youtube}
                      onChange={(e) => setFormData({
                        ...formData, 
                        socialLinks: {...formData.socialLinks, youtube: e.target.value}
                      })}
                    />
                    <Input
                      placeholder="Twitter URL"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => setFormData({
                        ...formData, 
                        socialLinks: {...formData.socialLinks, twitter: e.target.value}
                      })}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
                >
                  밴드 등록하기
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 정보 섹션 */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              밴드 등록 안내
            </h3>
            <div className="text-blue-800 space-y-2 text-sm">
              <p>• Last.fm API를 통해 실제 아티스트 정보를 검색하고 자동으로 가져올 수 있습니다.</p>
              <p>• API 키가 설정되지 않은 경우 샘플 데이터로 기능을 테스트할 수 있습니다.</p>
              <p>• 새로운 밴드를 등록할 때는 정확한 정보를 입력해주세요.</p>
              <p>• 등록된 밴드는 관리자 검토 후 공개됩니다.</p>
              <p>• 무료로 등록 가능하며, 추가 기능은 프리미엄 서비스에서 제공됩니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
} 