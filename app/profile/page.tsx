"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Save, MapPin, User, Settings, Info, UserSearch, Music, Search, Calendar, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useRouter, notFound } from "next/navigation"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

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

export default function ProfilePage() {
  const router = useRouter()

  // 1) 로그인한 유저 ID
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  // 2) API로 받아온 프로필 정보
  const [userData, setUserData] = useState<ApiResponse["result"] | null>(null)
  const [followingCount, setFollowingCount] = useState(0)
  const [followerCount, setFollowerCount] = useState(0)
  // 내가 쓴 모집글
  const [myRecruits, setMyRecruits] = useState<any[]>([])
  const [recruitsLoading, setRecruitsLoading] = useState(true)

  // Album gallery slider hooks (all at top level)
  const albumImages = [
    { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR70z5enUakifRegyzhIKcTD9tW4sBQ1PuErg&s" },
    { url: "https://i.namu.wiki/i/4lrnp8YbRn-JqsdDN1AY62ycbjlJ3BrRICTPFA6oCbVxHW3ysObQ4VEGE_0igIJ46klaC-jrwU8MQAP-ZLWuWg.webp" },
    { url: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbjmsNN%2FbtrLjjtmyDR%2FAAAAAAAAAAAAAAAAAAAAAGD7eH6hs6xIjqkzPGlB5FCkRSGdZtF-8gLPExtxR_0U%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1753973999%26allow_ip%3D%26allow_referer%3D%26signature%3DMHmCF47%252BWxItr%252F%252B2gnhfGvdsA6s%253D" },
    { url: "https://image-cdn.hypb.st/https%3A%2F%2Fkr.hypebeast.com%2Ffiles%2F2023%2F04%2Fsilica-gel-ep-machine-boy-interview-info-3.jpg?w=1260&cbr=1&q=90&fit=max" },
    { url: "https://pbs.twimg.com/media/FjtLS5EUoAAW_94.jpg:large" },
    { url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80&ixid=1" },
    { url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80&ixid=2" },
    { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80&ixid=3" },
    { url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80&ixid=4" },
    { url: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80&ixid=5" },
    { url: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80&ixid=6" },
    { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80&ixid=7" },
  ];
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isBarDragging, setIsBarDragging] = useState(false);

  // 스크롤 위치가 바뀔 때마다 진행도와 버튼 활성화 계산
  const updateScroll = () => {
    const c = containerRef.current
    if (!c) return
    const { scrollLeft, scrollWidth, clientWidth } = c
    const max = scrollWidth - clientWidth
    setScrollProgress(max > 0 ? (scrollLeft / max) * 100 : 0)
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < max)
  }

  // 1. 로그인한 유저 ID 및 프로필/팔로우 데이터 fetch
  useEffect(() => {
    const id = localStorage.getItem("userId")
    if (id) setCurrentUserId(Number(id))
      ; (async () => {
        if (!id) {
          notFound()
          return
        }
        const [res, fRes, foRes] = await Promise.all([
          fetch(`/api/users/${id}`, { cache: "no-store" }),
          fetch(`/api/follow/followings?userId=${id}`, { cache: "no-store" }),
          fetch(`/api/follow/followers?userId=${id}`, { cache: "no-store" }),
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

  // 2. 내가 쓴 모집글 fetch
  useEffect(() => {
    if (!currentUserId) return
    setRecruitsLoading(true)
    fetch(`/api/recruitments?userId=${currentUserId}`)
      .then(res => res.json())
      .then(json => {
        if (json.isSuccess && json.result && json.result.content) {
          setMyRecruits(json.result.content)
        } else {
          setMyRecruits([])
        }
      })
      .catch(() => setMyRecruits([]))
      .finally(() => setRecruitsLoading(false))
  }, [currentUserId])

  // 3. 갤러리 스크롤 위치/진행도 업데이트
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

  // 4. 슬라이드바 드래그 이벤트 등록
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

  if (!userData) {
    return
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
    introduction="",
  } = userData


  // 가짜 공연 이력 데이터
  const fakePerformances = [
    {
      title: "홍대 클럽 공연",
      date: "2024-01-10",
      venue: "Club FF",
      role: "리드 기타",
      image: "https://i.namu.wiki/i/4lrnp8YbRn-JqsdDN1AY62ycbjlJ3BrRICTPFA6oCbVxHW3ysObQ4VEGE_0igIJ46klaC-jrwU8MQAP-ZLWuWg.webp?auto=format&fit=crop&w=400&q=80",
      setlist: ["Machine Boy", "Silica Gel", "Intro"]
    },
    {
      title: "대학 축제",
      date: "2023-11-15",
      venue: "서울대학교",
      role: "기타",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      setlist: ["Festival Song", "Campus Rock"]
    },
    {
      title: "버스킹",
      date: "2023-09-20",
      venue: "홍대 걷고싶은거리",
      role: "어쿠스틱 기타",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
      setlist: ["Street Melody", "Acoustic Vibes"]
    },
  ];

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

  // 진행바 클릭/드래그 핸들러
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
        {/*검색 영역 - 개선된 modern 스타일*/}
        <section className="mb-8">
          <form action="/userSearch" method="get" className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl w-full mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="keyword"
                placeholder="닉네임 또는 이메일로 검색"
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow focus:outline-none focus:ring-2 focus:ring-orange-400 text-base bg-white"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base px-6 py-3 rounded-full shadow transition-all focus:outline-none focus:ring-2 focus:ring-orange-400"
              style={{ minWidth: 120 }}
            >
              검색
            </button>
          </form>
        </section>

        {/* 프로필 카드 - 미니멀 & 세련된 UI */}
        <Card className="flex flex-col md:flex-row items-center bg-white/80 border border-gray-200 shadow-xl rounded-2xl overflow-hidden py-10 px-8 mb-12 transition-all">
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center mr-0 md:mr-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-300 bg-white shadow bg-gray-100 flex items-center justify-center">
              <img
                src={profileImageUrl || "https://pickone-web-assets-2025.s3.ap-northeast-2.amazonaws.com/profiles/%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5.png"}
                alt={nickname}
                className="w-full h-full object-cover"
              />
            </div>
            {/* 공개/비공개 뱃지 */}
            <Badge variant="secondary" className="mt-4 text-xs px-4 py-1 bg-orange-50 border-orange-200 text-orange-500">
              {isPublic ? "공개" : "비공개"}
            </Badge>
          </div>
          {/* 정보 영역 */}
          <div className="flex-1 flex flex-col justify-center items-center md:items-start mt-8 md:mt-0 w-full relative">
            {/* 닉네임 & 이메일 */}
            <div className="flex flex-col items-center md:items-start mb-3">
              <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{nickname}</h1>
              <p className="text-gray-500 text-base">{email}</p>
            </div>
            {/* 팔로워/팔로잉 */}
            <div className="flex items-center space-x-8 mb-4">
              <Link href="/followers" className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
                <User className="w-5 h-5" />
                <span className="font-semibold text-lg">{followerCount}</span>
                <span className="text-xs text-gray-400">팔로워</span>
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/followings" className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
                <UserSearch className="w-5 h-5" />
                <span className="font-semibold text-lg">{followingCount}</span>
                <span className="text-xs text-gray-400">팔로잉</span>
              </Link>
            </div>
            {/* MBTI, 악기, 장르 */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="flex items-center space-x-1 text-xs px-3 py-1">
                <span>{mbti}</span>
              </Badge>
              {Array.isArray(instruments) && instruments.length > 0 ? (
                instruments.map(inst => (
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
            {/* 자기소개 */}
            <div className="w-full max-w-xl text-center md:text-left mb-2">
              {introduction ? (
                <p className="text-gray-700 text-base leading-relaxed line-clamp-2">{introduction}</p>
              ) : (
                <p className="text-gray-400 italic text-base">자기소개가 없습니다.</p>
              )}
            </div>
            {/* 위치 */}
            {location && (
              <div className="flex items-center text-gray-500 text-xs mb-2">
                <MapPin className="mr-1 w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
            {/* SNS 링크 - 아이콘만, hover시 툴팁 */}
            <div className="flex space-x-4 mt-3">
              <a href="https://facebook.com/fake" target="_blank" rel="noreferrer" title="Facebook" className="hover:text-[#0AA5FF]">
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" /></svg>
              </a>
              <a href="https://twitter.com/fake" target="_blank" rel="noreferrer" title="Twitter" className="hover:text-[#1DA1F2]">
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21 0-.423-.016-.634A9.936 9.936 0 0 0 24 4.557z" /></svg>
              </a>
              <a href="https://instagram.com/fake" target="_blank" rel="noreferrer" title="Instagram" className="hover:text-[#E4405F]">
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.808 2.256 6.088 2.243 6.497 2.243 12c0 5.503.013 5.912.072 7.192.059 1.276.353 2.449 1.32 3.416.967.967 2.14 1.261 3.416 1.32 1.28.059 1.689.072 7.192.072s5.912-.013 7.192-.072c1.276-.059 2.449-.353 3.416-1.32.967-.967 1.261-2.14 1.32-3.416.059-1.28.072-1.689.072-7.192s-.013-5.912-.072-7.192c-.059-1.276-.353-2.449-1.32-3.416C19.449.425 18.276.131 17 .072 15.721.013 15.312 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
              </a>
            </div>
            {/* 프로필 수정 버튼 (주인만) */}
            {isOwner && (
              <div className="mt-6">
                <Button variant="outline" onClick={() => router.push("/profile/edit")}>프로필 수정</Button>
              </div>
            )}
          </div>
          {/* 사운드클라우드 플레이어: 카드 오른쪽 */}
          <div className="w-full md:w-80 flex flex-col justify-center items-center mt-8 md:mt-0 md:ml-8">
            <span className="mb-2 text-xs text-gray-500 font-semibold tracking-wide">SoundCloud Player</span>
            <div className="w-full max-w-[320px] rounded-lg overflow-hidden shadow border border-gray-300 bg-gray-900 flex items-center justify-center">
              <iframe
                width="100%"
                height="120"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/32rgf83kkjzt/roy?si=91dd14b499ab4d57bcdf6fd1187e839f&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false"
                title="SoundCloud Player"
              ></iframe>
            </div>
            {/* 공유 버튼: 플레이어 아래, 오른쪽 정렬 */}
            <div className="w-full flex justify-end mt-3">
              <button
                onClick={() => {
                  if (!userData?.id) return;
                  const shareUrl = `${window.location.origin}/profile/${userData.id}`;
                  navigator.clipboard.writeText(shareUrl)
                    .then(() => alert('프로필 링크가 복사되었습니다!'))
                    .catch(() => alert('복사에 실패했습니다.'));
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 shadow transition-all border border-gray-200"
                title="프로필 공유"
                type="button"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">공유</span>
              </button>
            </div>
          </div>
        </Card>
        <p className="text-[#292929] pt-4 font-normal text-xl">Top 5 Album</p>
        <div className="flex gap-4 pt-4 w-full">
          {[
            "https://i.scdn.co/image/ab67616d0000b2733303a842ee1bc0b23204333d",
            "https://i.scdn.co/image/ab67616d0000b2739293c743fa542094336c5e12",
            "https://i.scdn.co/image/ab67616d0000b27304f4a7915e062a1282289073",
            "https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe",
            "https://i.scdn.co/image/ab67616d0000b2733ed60b59aaa75ed572d7fc30",
          ].map((src, idx) => (
            <div key={src} className="flex-1 min-w-0 aspect-square">
              <img
                src={src}
                alt={`Album ${idx + 1}`}
                className="w-full h-full object-cover rounded-lg shadow"
                style={{ aspectRatio: '1/1' }}
              />
            </div>
          ))}
        </div>

        {/* Album Slider Section */}
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
              {albumImages.map((img, idx) => (
                <div key={idx} className="snap-start flex-shrink-0 min-w-[170px]">
                  <div className="w-[170px] h-[226px] rounded-xl overflow-hidden shadow border bg-gray-100">
                    <img src={img.url} alt={`album-${idx}`} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
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


        {/* 공연 이력 */}
        <div className="mt-8">
          <h2 className="text-xl font-normal text-[#292929] mb-3">공연 이력</h2>
          <div className="flex flex-col gap-5">
            {fakePerformances.map((perf, idx) => (
              <div
                key={`${perf.title}-${perf.date}`}
                className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm p-3 gap-5"
              >
                {/* 썸네일 */}
                <div className="flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={perf.image || '/placeholder.jpg'}
                    alt={perf.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 공연 정보 */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-semibold text-gray-900 truncate">{perf.title}</span>
                    <span className="text-xs text-gray-400">{perf.venue}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{perf.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{perf.role}</Badge>
                  </div>
                  {/* Setlist 예시 */}
                  {perf.setlist && perf.setlist.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-400 mr-2">Setlist:</span>
                      <span className="text-xs text-gray-700">{perf.setlist.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 내가 쓴 멤버모집글 */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">내가 작성한 멤버모집글</h2>
          {recruitsLoading ? (
            <div className="text-center text-gray-500 py-12 text-lg">로딩 중...</div>
          ) : myRecruits.length === 0 ? (
            <div className="text-center text-gray-400 py-12 text-lg">작성한 멤버모집글이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myRecruits.map((post) => (
                <Card key={post.id} className="group max-w-md mx-auto shadow-lg border border-gray-200 rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-2xl bg-white/90">
                  <Link href={`/recruit/${post.id}`}
                    className="block focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {/* 썸네일 영역 */}
                    <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden border-b border-gray-100">
                      <img
                        src={post.thumbnail || "/no-image.png"}
                        alt={post.title}
                        className="w-full h-full object-cover object-center rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                        style={{ background: post.thumbnail ? undefined : '#f3f4f6' }}
                      />
                      {/* 그라데이션 오버레이 */}
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