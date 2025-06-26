// app/recruit/[id]/apply/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

interface RecruitDetail {
  id: number;
  thumbnail: string;
  instruments: { instrument: string; proficiency: string }[];
}

const MBTI_OPTIONS = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export default function RecruitApplyPage() {
  const router = useRouter();
  const params = useParams();
  const recruitmentId = params?.id;

  const [post, setPost] = useState<RecruitDetail | null>(null);
  const [message, setMessage] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [thumbnailInput, setThumbnailInput] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [selectedMbti, setSelectedMbti] = useState('');
  const [proficiency, setProficiency] = useState('');

  // Fetch recruit details
  useEffect(() => {
    async function load() {
      if (!recruitmentId) return;
      const res = await fetch(`/api/recruitments/${recruitmentId}`);
      if (!res.ok) return;
      const json = await res.json();
      setPost(json.result);
    }
    load();
  }, [recruitmentId]);

  if (!post) {
    return <div className="h-screen flex items-center justify-center">로딩 중...</div>;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!recruitmentId) return;

    const body = {
      message,
      portfolioUrl,
      thumbnail: thumbnailInput,
      mbti: selectedMbti,
      instrument: selectedInstrument,
      proficiency
    };
    const token = localStorage.getItem('accessToken')  // 로그인 때 저장해 둔 JWT

    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
    const res = await fetch("/api/recruitments/apply/${recruitmentId}", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      // 1) 성공 메시지 띄우기
      alert('✔️ 신청이 정상적으로 완료되었습니다!');
      // 2) 상세 페이지로 이동
      router.push(`/recruit/${recruitmentId}`);
    }
    else alert('신청에 실패했습니다.');
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-grow container mx-auto px-6 py-8 pt-24">
        <Card className="max-w-2xl mx-auto rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          {post.thumbnail && (
            <div className="w-full aspect-video relative">
              <img
                src={post.thumbnail}
                alt="모집 이미지"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
          <CardContent className="p-8 bg-white">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">
              모집 #{recruitmentId} 신청하기
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  메시지
                </label>
                <Textarea
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="h-28 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    포트폴리오 URL
                  </label>
                  <Input
                    type="url"
                    value={portfolioUrl}
                    onChange={e => setPortfolioUrl(e.target.value)}
                    className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    썸네일 URL
                  </label>
                  <Input
                    type="url"
                    value={thumbnailInput}
                    onChange={e => setThumbnailInput(e.target.value)}
                    className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    세션 (악기)
                  </label>
                  <Select
                    value={selectedInstrument}
                    onValueChange={setSelectedInstrument}
                  >
                    <SelectTrigger className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary">
                      <SelectValue placeholder="악기 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {post.instruments.map(inst => (
                        <SelectItem key={inst.instrument} value={inst.instrument}>
                          {inst.instrument.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    실력 레벨
                  </label>
                  <Select
                    value={proficiency}
                    onValueChange={setProficiency}
                  >
                    <SelectTrigger className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary">
                      <SelectValue placeholder="레벨 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEVER_PLAYED">전혀 없음</SelectItem>
                      <SelectItem value="BEGINNER">초심자</SelectItem>
                      <SelectItem value="BASIC">기본</SelectItem>
                      <SelectItem value="INTERMEDIATE">중급</SelectItem>
                      <SelectItem value="ADVANCED">고급</SelectItem>
                      <SelectItem value="SEMI_PRO">세미 프로</SelectItem>
                      <SelectItem value="PROFESSIONAL">프로</SelectItem>
                      <SelectItem value="MASTER">마스터</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    MBTI
                  </label>
                  <Select value={selectedMbti} onValueChange={setSelectedMbti}>
                    <SelectTrigger className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary">
                      <SelectValue placeholder="MBTI 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {MBTI_OPTIONS.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                신청하기
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
