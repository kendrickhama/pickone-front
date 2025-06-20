// app/api/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_BASE = 'http://3.35.49.195:8080'

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  const url = `${BACKEND_BASE}/${path}`

  const init: RequestInit = {
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()), // HeaderInit으로 변환
    body: await request.text(), // JSON 등 처리
  }

  const res = await fetch(url, init)
  const body = await res.text()

  return new NextResponse(body, {
    status: res.status,
    headers: res.headers,
  })
}

// GET 요청도 프록시 처리
export async function GET(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  return POST(request, context)
}