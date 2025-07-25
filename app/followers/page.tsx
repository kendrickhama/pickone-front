// app/followers/page.tsx
"use client"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation";

interface FollowerItem {
  id: number;
  fromUserId: number;
  toUserId: number;
  nickname?: string;
}

export default function FollowersPage() {
  const [nickname, setNickname] = useState<string | null>(null);
  const [followers, setFollowers] = useState<FollowerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // 클라이언트에서만 localStorage 접근
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("userId");
      setUserId(id);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      let nick = null;
      // 닉네임 fetch
      const userRes = await fetch(`/api/users/${userId}`);
      if (userRes.ok) {
        const userJson = await userRes.json();
        if (userJson.isSuccess && userJson.result?.nickname) {
          nick = userJson.result.nickname;
        }
      }
      // fetch followers (query parameter)
      const res = await fetch(`/api/follow/followers?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.isSuccess && Array.isArray(data.result)) {
          setFollowers(data.result);
        }
      }
      setNickname(nick);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  if (!userId && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto p-6 pt-20">
         <h1 className="text-2xl font-bold text-[#292929] mb-2">{nickname ? `${nickname} 님의 팔로워 목록` : "내 팔로워 목록"}</h1>
         <p className="text-gray-500 mb-8">나를 팔로우하는 사람들을 확인해보세요.</p>
         {loading ? (
           <div className="flex flex-col items-center justify-center py-32 text-gray-400 min-h-[40vh]">
             <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-4"><path d="M12 12c2.7 0 4.5-1.8 4.5-4.5S14.7 3 12 3 7.5 4.8 7.5 7.5 9.3 12 12 12Zm0 2.25c-3 0-9 1.5-9 4.5V21h18v-2.25c0-3-6-4.5-9-4.5Z" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
             <p className="text-lg">불러오는 중...</p>
           </div>
         ) : followers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400 min-h-[40vh]">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-4"><path d="M12 12c2.7 0 4.5-1.8 4.5-4.5S14.7 3 12 3 7.5 4.8 7.5 7.5 9.3 12 12 12Zm0 2.25c-3 0-9 1.5-9 4.5V21h18v-2.25c0-3-6-4.5-9-4.5Z" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p className="text-lg">아직 팔로워가 없습니다.</p>
            <p className="text-sm mt-2 text-gray-300">더 많은 활동으로 팔로워를 늘려보세요!</p>
          </div>
         ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {followers.map((f) => (
              <Link key={f.id} href={`/profile/${f.fromUserId}`} className="group">
                <Card className="flex items-center gap-5 p-6 bg-white/90 border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-orange-50/40 transition-all cursor-pointer">
                  <div className="flex-shrink-0">
                    <img
                      src="/default-avatar.png"
                      alt={`user-${f.fromUserId}`}
                      className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow group-hover:border-orange-400 group-hover:shadow-orange-200 transition-all"
                    />
                  </div>
                  <CardContent className="p-0 flex-1 min-w-0 flex flex-col justify-center">
                    <div className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                      {f.nickname ? f.nickname : `User ID: ${f.fromUserId}`}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">{f.nickname ? `ID: ${f.fromUserId}` : "(상세 정보 없음)"}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
         )}
      </main>
      <Footer />
    </div>
  )
}