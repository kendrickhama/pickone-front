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
  const path = params.path.join('/')
  const url = `${BACKEND_BASE}/${path}${request.nextUrl.search}`

  const headers = new Headers(request.headers)
  headers.delete('host')

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: request.body,
      duplex: 'half'
    } as any)
    

    const buffer = await res.arrayBuffer()
    const respHeaders = new Headers(res.headers)
    respHeaders.set('content-length', String(buffer.byteLength))

    return new NextResponse(buffer, {
      status: res.status,
      headers: respHeaders,
    })
  } catch (e) {
    console.error('프록시 POST 에러:', e)
    return new NextResponse('프록시 서버 오류', { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  const queryString = request.nextUrl.search
  const path = params.path.join('/')
  const url = `${BACKEND_BASE}/${path}${queryString}`

  // strip Host/Origin so backend sees it as a same-origin call
  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('origin')
  headers.delete('referer')

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: await request.text(),
    })
    const body = await res.text()
    return new NextResponse(body, {
      status: res.status,
      headers: res.headers,
    })
  } catch (e) {
    console.error('프록시 PATCH 에러:', e)
    return new NextResponse('프록시 서버 오류', { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // ① 원본 요청의 쿼리스트링을 가져옵니다
  const queryString = request.nextUrl.search  // e.g. "?page=0&size=10"

  // ② catch-all으로 넘어온 path segments를 합칩니다
  const path = params.path.join('/')          // e.g. "follow/1/2"

  // ③ 최종 백엔드 URL에 queryString 붙이기
  const url = `${BACKEND_BASE}/${path}${queryString}`

  // ④ 헤더 복사 (불필요한 Host/Origin 삭제)
  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('origin')
  headers.delete('referer')

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers,
      // body 포함이 필요한 경우 아래 주석 해제
      // body: await request.text(),
    })
    const body = await res.text()
    return new NextResponse(body, {
      status: res.status,
      headers: res.headers,
    })
  } catch (e) {
    console.error('프록시 DELETE 에러:', e)
    return new NextResponse('프록시 서버 오류', { status: 500 })
  }
}