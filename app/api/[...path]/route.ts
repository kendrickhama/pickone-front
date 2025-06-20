// app/api/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_BASE = 'http://3.35.49.195:8080/api'

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  // ① 원본 요청의 쿼리스트링을 가져옵니다
  const queryString = request.nextUrl.search  // e.g. "?page=0&size=10"

  // ② catch-all으로 넘어온 path segments를 합칩니다
  const path = params.path.join('/')          // e.g. "recruitments"

  // ③ 최종 백엔드 URL에 queryString 붙이기
  const url = `${BACKEND_BASE}/${path}${queryString}`

  // ④ 헤더 복사 (불필요한 Host 삭제)
  const headers = new Headers(request.headers)
  headers.delete('host')

  try {
    const res = await fetch(url, { method: 'GET', headers })
    const body = await res.text()
    return new NextResponse(body, {
      status: res.status,
      headers: res.headers,
    })
  } catch (e) {
    console.error('프록시 GET 에러:', e)
    return new NextResponse('프록시 서버 오류', { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const queryString = request.nextUrl.search
  const path = params.path.join('/')
  const url = `${BACKEND_BASE}/${path}${queryString}`

  const headers = new Headers(request.headers)
  headers.delete('host')

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: await request.text(),
    })
    const body = await res.text()
    return new NextResponse(body, {
      status: res.status,
      headers: res.headers,
    })
  } catch (e) {
    console.error('프록시 POST 에러:', e)
    return new NextResponse('프록시 서버 오류', { status: 500 })
  }
}
