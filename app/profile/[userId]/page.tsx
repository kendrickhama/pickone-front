"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useRouter, useParams, notFound } from "next/navigation"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { MapPin, User, UserSearch, Music, Search, Calendar, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react"

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
    introduction: string
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

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { userId } = params as { userId: string }

  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [userData, setUserData] = useState<ApiResponse["result"] | null>(null)
  const [followingCount, setFollowingCount] = useState(0)
  const [followerCount, setFollowerCount] = useState(0)
  const [userRecruits, setUserRecruits] = useState<any[]>([])
  const [recruitsLoading, setRecruitsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [followError, setFollowError] = useState<string | null>(null)

  // 앨범 슬라이더 관련
  const [albumImages, setAlbumImages] = useState<{ id: number, url: string, caption: string | null, uploadedAt: string }[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isBarDragging, setIsBarDragging] = useState(false);

  const updateScroll = () => {
    const c = containerRef.current
    if (!c) return
    const { scrollLeft, scrollWidth, clientWidth } = c
    const max = scrollWidth - clientWidth
    setScrollProgress(max > 0 ? (scrollLeft / max) * 100 : 0)
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < max)
  }

  useEffect(() => {
    const id = localStorage.getItem("userId")
    if (id) setCurrentUserId(Number(id))
    ;(async () => {
      if (!userId) {
        notFound()
        return
      }
      const [res, fRes, foRes] = await Promise.all([
        fetch(`/api/users/${userId}`, { cache: "no-store" }),
        fetch(`/api/follow/followings?userId=${userId}`, { cache: "no-store" }),
        fetch(`/api/follow/followers?userId=${userId}`, { cache: "no-store" }),
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
  }, [userId])

  useEffect(() => {
    if (!userId) return
    setRecruitsLoading(true)
    fetch(`/api/recruitments?userId=${userId}`)
      .then(res => res.json())
      .then(json => {
        if (json.isSuccess && json.result && json.result.content) {
          setUserRecruits(json.result.content)
        } else {
          setUserRecruits([])
        }
      })
      .catch(() => setUserRecruits([]))
      .finally(() => setRecruitsLoading(false))
  }, [userId])

  // 갤러리 이미지 API 연동
  useEffect(() => {
    if (!userId) return;
    setGalleryLoading(true);
    fetch(`/api/users/gallery/${userId}`)
      .then(res => res.json())
      .then(json => {
        if (json.isSuccess && Array.isArray(json.result)) {
          setAlbumImages(json.result);
        } else {
          setAlbumImages([]);
        }
      })
      .catch(() => setAlbumImages([]))
      .finally(() => setGalleryLoading(false));
  }, [userId]);

  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    updateScroll()
    c.addEventListener("scroll", updateScroll)
    window.addEventListener("resize", updateScroll)
    return () => {
      c.removeEventListener("scroll", updateScroll)
      window.removeEventListener("resize", updateScroll)
    }
  }, [albumImages])

  useEffect(() => {
    if (!isBarDragging) return
    const onMove = (e: MouseEvent) => handleBarMove(e.clientX)
    const onUp = () => setIsBarDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp, { once: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isBarDragging])

  // 팔로우 상태 확인 (is-following API 사용)
  useEffect(() => {
    if (!currentUserId || !userId) return;
    if (String(currentUserId) === String(userId)) return;
    fetch(`/api/follow/is-following?fromUserId=${currentUserId}&toUserId=${userId}`)
      .then(res => res.json())
      .then(json => {
        if (json.isSuccess && typeof json.result === "boolean") {
          setIsFollowing(json.result);
        }
      })
      .catch(() => {});
  }, [currentUserId, userId]);

  const handleFollow = async () => {
    if (!currentUserId || !userId) return;
    setFollowLoading(true);
    setFollowError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ fromUserId: currentUserId, toUserId: Number(userId) })
      });
      const json = await res.json();
      if (res.ok && json.isSuccess) {
        setIsFollowing(true);
      } else {
        setFollowError(json.message || "팔로우에 실패했습니다.");
      }
    } catch (e) {
      setFollowError("네트워크 오류로 팔로우에 실패했습니다.");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!currentUserId || !userId) return;
    setFollowLoading(true);
    setFollowError(null);
    try {
      const res = await fetch(`/api/follow/${currentUserId}/${userId}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (res.ok && json.isSuccess) {
        setIsFollowing(false);
      } else {
        setFollowError(json.message || "언팔로우에 실패했습니다.");
      }
    } catch (e) {
      setFollowError("네트워크 오류로 언팔로우에 실패했습니다.");
    } finally {
      setFollowLoading(false);
    }
  };

  if (!userData) {
    return
  }

  const isOwner = currentUserId === userData.id
  const { email, nickname, mbti, instruments, preference, profileImageUrl, isPublic, location, introduction = "" } = userData

  const genreColorMap: Record<string, string> = {
    INDIE_ROCK: 'text-indigo-600',
    ALTERNATIVE_ROCK: 'text-blue-600',
    HARD_ROCK: 'text-gray-800',
    POST_ROCK: 'text-purple-600',
    SHOEGAZING: 'text-pink-600',
    HEAVY_METAL: 'text-red-700',
    PUNK_ROCK: 'text-yellow-700',
    GRUNGE: 'text-green-800',
    PROGRESSIVE_ROCK: 'text-blue-800',
    GARAGE_ROCK: 'text-yellow-800',
    CLASSIC_ROCK: 'text-gray-600',
    DEATH_METAL: 'text-gray-900',
    BLACK_METAL: 'text-black',
    THRASH_METAL: 'text-red-800',
    DOOM_METAL: 'text-gray-700',
    FOLK: 'text-teal-700',
    FOLK_ROCK: 'text-green-600',
    ACOUSTIC: 'text-amber-600',
    JAZZ: 'text-teal-600',
    SMOOTH_JAZZ: 'text-blue-400',
    FUSION_JAZZ: 'text-indigo-500',
    LOFI_JAZZ: 'text-gray-400',
    POP: 'text-pink-500',
    DREAM_POP: 'text-pink-400',
    SYNTH_POP: 'text-purple-500',
    ELECTRO_POP: 'text-purple-400',
    HIPHOP: 'text-yellow-600',
    LOFI: 'text-gray-500',
    EDM: 'text-indigo-500',
    AMBIENT: 'text-emerald-600',
    HOUSE: 'text-amber-500',
    TECHNO: 'text-cyan-600',
    TRANCE: 'text-violet-500',
    BLUES: 'text-blue-700',
    SOUL: 'text-red-500',
    RNB: 'text-purple-700',
    CLASSICAL: 'text-gray-500',
    FUNK: 'text-orange-600',
    REGGAE: 'text-green-700',
    WORLD_MUSIC: 'text-emerald-500',
    EXPERIMENTAL: 'text-fuchsia-500',
    POST_PUNK: 'text-rose-600',
    MATH_ROCK: 'text-lime-700',
    GOSPEL: 'text-yellow-500',
  }

  const handleBarMove = (clientX: number) => {
    if (!progressBarRef.current || !containerRef.current) return;
    const barRect = progressBarRef.current.getBoundingClientRect();
    const x = clientX - barRect.left;
    const ratio = Math.max(0, Math.min(1, x / barRect.width));
    const c = containerRef.current;
    const max = c.scrollWidth - c.clientWidth;
    c.scrollLeft = max * ratio;
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 pt-20">
        {/* 프로필 카드 */}
        <Card className="flex flex-col md:flex-row items-center bg-white/80 border border-gray-200 shadow-xl rounded-2xl overflow-hidden py-10 px-8 mb-12 transition-all">
          <div className="flex-shrink-0 flex flex-col items-center justify-center mr-0 md:mr-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-300 shadow bg-gray-100 flex items-center justify-center">
              <img
                src={profileImageUrl || "https://pickone-web-assets-2025.s3.ap-northeast-2.amazonaws.com/profiles/%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5.png"}
                alt={nickname}
                className="w-full h-full object-cover"
              />
            </div>
            <Badge variant="secondary" className="mt-4 text-xs px-4 py-1 bg-orange-50 border-orange-200 text-orange-500">
              {isPublic ? "공개" : "비공개"}
            </Badge>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center md:items-start mt-8 md:mt-0">
            <div className="flex flex-col items-center md:items-start mb-3">
              <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{nickname}</h1>
              <p className="text-gray-500 text-base">{email}</p>
            </div>
            <div className="flex items-center space-x-8 mb-4">
              <Link href={`/followers?userId=${userId}`} className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
                <User className="w-5 h-5" />
                <span className="font-semibold text-lg">{followerCount}</span>
                <span className="text-xs text-gray-400">팔로워</span>
              </Link>
              <span className="text-gray-300">|</span>
              <Link href={`/followings?userId=${userId}`} className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
                <UserSearch className="w-5 h-5" />
                <span className="font-semibold text-lg">{followingCount}</span>
                <span className="text-xs text-gray-400">팔로잉</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="flex items-center space-x-1 text-xs px-3 py-1">
                <span>{mbti}</span>
              </Badge>
              {Array.isArray(instruments) && instruments.length > 0 ? (
                instruments.map((inst: string) => (
                  <Badge key={inst} variant="secondary" className="flex items-center space-x-1 text-xs px-3 py-1 bg-orange-50 border-orange-200 text-orange-500">
                    <Music className="w-4 h-4" />
                    <span>{inst}</span>
                  </Badge>
                ))
              ) : (
                <span className="italic text-gray-800 flex items-center space-x-1 text-xs">
                  <Badge variant="outline" className="flex items-center space-x-1 text-xs px-3 py-1">
                    <Music className="w-4 h-4" />
                    <span>관객</span>
                  </Badge>
                </span>
              )}
              {preference && (
                (typeof preference === "string" ? [preference] : Object.values(preference))
                  .filter((g) => !!g)
                  .map((g) => {
                    const textColor = genreColorMap[g] || 'text-orange-700'
                    return (
                      <Badge
                        key={g}
                        className={`${textColor} bg-white border border-orange-200 px-3 py-1 text-xs rounded-full shadow-sm`}
                      >
                        {g.replace(/_/g, " ")}
                      </Badge>
                    )
                  })
              )}
            </div>
            <div className="w-full max-w-xl text-center md:text-left mb-2">
              {introduction ? (
                <p className="text-gray-700 text-base leading-relaxed line-clamp-2">{introduction}</p>
              ) : (
                <p className="text-gray-400 italic text-base">자기소개가 없습니다.</p>
              )}
            </div>
            {location && (
              <div className="flex items-center text-gray-500 text-xs mb-2">
                <MapPin className="mr-1 w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
            {/* 팔로우 버튼 (본인이 아닐 때만) */}
            {!isOwner && (
              <div className="mt-6 flex flex-col items-center gap-2">
                {isFollowing ? (
                  <Button
                    variant="outline"
                    disabled={followLoading}
                    onClick={handleUnfollow}
                    className="text-orange-500 border-orange-300 bg-white"
                  >
                    {followLoading ? "언팔로우 중..." : "팔로잉 중"}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    disabled={followLoading}
                    onClick={handleFollow}
                  >
                    {followLoading ? "팔로우 중..." : "팔로우"}
                  </Button>
                )}
                {followError && <div className="text-xs text-red-500 mt-1">{followError}</div>}
              </div>
            )}
          </div>
        </Card>
        {/* 앨범 슬라이더 */}
        <section className="mt-8">
          <h2 className="text-xl font-normal text-[#292929] mb-3">{nickname} 님의 갤러리</h2>
          <div className="relative" style={{ minHeight: '240px' }}>
            <button
              className="absolute left-0 z-10 bg-white/80 hover:bg-orange-100 border rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-30"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => containerRef.current?.scrollBy({ left: -containerRef.current.clientWidth, behavior: 'smooth' })}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="w-6 h-6 text-gray-500" />
            </button>
            <div
              ref={containerRef}
              className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-6 px-10 py-1"
            >
              {galleryLoading ? (
                <div className="text-gray-400 text-lg flex items-center justify-center w-full h-40">로딩 중...</div>
              ) : albumImages.length === 0 ? (
                <div className="text-gray-400 text-lg flex items-center justify-center w-full h-40">갤러리 이미지가 없습니다.</div>
              ) : (
                albumImages.map((img, idx) => (
                  <div key={img.id} className="snap-start flex-shrink-0 min-w-[170px]">
                    <div className="w-[170px] h-[226px] rounded-xl overflow-hidden shadow border bg-gray-100">
                      <img src={img.url} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              className="absolute right-0 z-10 bg-white/80 hover:bg-orange-100 border rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-30"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => containerRef.current?.scrollBy({ left: containerRef.current.clientWidth, behavior: 'smooth' })}
              disabled={!canScrollRight}
            >
              <ChevronRight className="w-6 h-6 text-gray-500" />
            </button>
            <div
              ref={progressBarRef}
              className="w-full h-2 bg-gray-100 rounded-full mt-4 absolute left-0 bottom-0 cursor-pointer"
              onMouseDown={e => { setIsBarDragging(true); handleBarMove(e.clientX); }}
              onClick={e => handleBarMove(e.clientX)}
            >
              <div
                className="h-full rounded-full transition-all bg-gray-300"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        </section>
        {/* 내가 쓴 멤버모집글 */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">{nickname} 님이 작성한 멤버모집글</h2>
          {recruitsLoading ? (
            <div className="text-center text-gray-500 py-12 text-lg">로딩 중...</div>
          ) : userRecruits.length === 0 ? (
            <div className="text-center text-gray-400 py-12 text-lg">작성한 멤버모집글이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userRecruits.map((post) => (
                <Card key={post.id} className="group max-w-md mx-auto shadow-lg border border-gray-200 rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-2xl bg-white/90">
                  <Link href={`/recruit/${post.id}`}
                    className="block focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden border-b border-gray-100">
                      <img
                        src={post.thumbnail || "/no-image.png"}
                        alt={post.title}
                        className="w-full h-full object-cover object-center rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                        style={{ background: post.thumbnail ? undefined : '#f3f4f6' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none rounded-t-2xl" />
                    </div>
                    <CardContent className="p-6 flex flex-col gap-2">
                      <h3 className="font-semibold text-xl mb-1 truncate" title={post.title}>{post.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-1">
                        {post.genres?.genre?.map((g: string) => (
                          <Badge key={g} className="bg-orange-50 border border-orange-200 text-orange-500 px-2 py-1 text-xs rounded-full">{g}</Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-1">
                        {post.instruments?.map((inst: any, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-gray-50 border border-gray-200 text-gray-700 px-2 py-1 rounded-full">
                            {inst.instrument?.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex space-x-2">
                          <Heart className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                          <Share2 className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        </div>
                        <span className="text-xs text-gray-400">자세히 보기 →</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
} 