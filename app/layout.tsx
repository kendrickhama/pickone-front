import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PickOne - 밴드 매칭 플랫폼',
  description: 'Created with v0',
  generator: 'v0.dev',
  icons: {
    icon: '/icon.png', // 또는 .png, .svg도 가능
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
