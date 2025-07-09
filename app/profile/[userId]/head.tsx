import { Metadata } from 'next';

type Props = { params: { userId: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const userId = params.userId;
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
      url: `https://pickone.site/profile/${userId}`,
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