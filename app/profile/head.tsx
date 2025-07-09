import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  // 서버 환경에서 쿠키 등으로 userId를 얻는 로직이 필요할 수 있음
  // 여기서는 예시로 1번 유저로 고정 (실제 서비스에서는 세션/쿠키에서 userId 추출 권장)
  let userId = 1;
  let nickname = 'Pickone 유저';
  let introduction = '음악 커뮤니티 Pickone의 프로필';
  let profileImageUrl = 'https://pickone.site/default-avatar.png';

  try {
    const res = await fetch(`https://pickone.site/api/users/${userId}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.isSuccess && json.result) {
        nickname = json.result.nickname || nickname;
        introduction = json.result.introduction || introduction;
        profileImageUrl = json.result.profileImageUrl || profileImageUrl;
      }
    }
  } catch (e) {
    // ignore, fallback to default
  }

  return {
    title: `${nickname}님의 프로필`,
    description: introduction,
    openGraph: {
      title: `${nickname}님의 프로필`,
      description: introduction,
      url: `https://pickone.site/profile`,
      siteName: 'Pickone',
      images: [
        {
          url: profileImageUrl,
          width: 400,
          height: 400,
          alt: `${nickname}의 프로필 이미지`,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${nickname}님의 프로필`,
      description: introduction,
      images: [profileImageUrl],
    },
  };
} 