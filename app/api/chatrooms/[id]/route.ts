import { NextRequest, NextResponse } from 'next/server'

// context를 받아야 함: `params`는 여기서 꺼내야 함
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const roomId = context.params.id
    const accessToken = request.headers.get('authorization')

    const response = await fetch(`http://3.35.49.195:8080/api/chatrooms/${roomId}`, {
      headers: {
        ...(accessToken && { 'Authorization': accessToken })
      }
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('채팅방 정보 조회 오류:', error)
    return NextResponse.json(
      { isSuccess: false, message: '채팅방 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
