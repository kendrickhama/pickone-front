import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.headers.get('authorization')
    const userId = request.headers.get('userId')

    const response = await fetch('http://3.35.49.195:8080/api/chatrooms', {
      headers: {
        ...(accessToken && { 'Authorization': accessToken }),
        ...(userId && { 'userId': userId })
      }
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('채팅방 목록 조회 오류:', error)
    return NextResponse.json(
      { isSuccess: false, message: '채팅방 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const accessToken = request.headers.get('authorization')
    const userId = request.nextUrl.searchParams.get('userId')

    const url = userId 
      ? `http://3.35.49.195:8080/api/chatrooms?userId=${userId}`
      : 'http://3.35.49.195:8080/api/chatrooms'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': accessToken })
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('채팅방 생성 오류:', error)
    return NextResponse.json(
      { isSuccess: false, message: '채팅방 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
} 