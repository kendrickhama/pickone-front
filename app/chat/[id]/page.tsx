"use client"

import { useEffect, useRef, useState } from "react"
import SockJS from "sockjs-client"
import { Client, Message } from "@stomp/stompjs"
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { useParams, useRouter } from 'next/navigation'

export default function ChatRoomPage() {
  const params = useParams()
  const router = useRouter()
  // roomId 파싱: string 또는 string[] 모두 안전하게 처리
  const roomId = Array.isArray(params.id) ? Number(params.id[0]) : Number(params.id)
  const [chatRoomName, setChatRoomName] = useState<string>(`채팅방 ${roomId}`)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const stompClient = useRef<Client | null>(null)

  // 메시지 히스토리 불러오기 (JWT 필요)
  useEffect(() => {
    const fetchMessages = async () => {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) return
      try {
        const res = await fetch(`/api/chatrooms/${roomId}/messages`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        if (res.ok) {
          const data = await res.json()
          if (data.isSuccess && Array.isArray(data.result)) {
            setMessages(data.result)
          }
        }
      } catch (e) {
        // 무시
      }
    }
    fetchMessages()
  }, [roomId])

  // WebSocket + STOMP 연결
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    const userId = localStorage.getItem("userId")
    const socket = new SockJS("http://3.35.49.195:8080/ws")
    const client = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
        userId: userId || ""
      },
      onConnect: () => {
        client.subscribe(`/topic/room.${roomId}`, (msg: Message) => {
          const body = JSON.parse(msg.body)
          console.log("수신 메시지:", body) // 메시지 수신 로그 추가
          setMessages(msgs => [...msgs, body])
        })
      },
      debug: (str) => console.log("[STOMP]", str),
    })
    client.activate()
    stompClient.current = client
    return () => { client.deactivate() }
  }, [roomId])

  // 메시지 전송
  const sendMessage = () => {
    if (!stompClient.current || !stompClient.current.connected) return
    const userId = localStorage.getItem("userId")
    const accessToken = localStorage.getItem("accessToken")
    // roomId가 숫자인지 최종 확인
    const numericRoomId = Number(roomId)
    const body = { roomId: numericRoomId, content: input }
    console.log("전송 body JSON:", JSON.stringify(body))
    try {
      stompClient.current.publish({
        destination: "/app/chat/send",
        headers: {
          userId: userId || "",
          Authorization: `Bearer ${accessToken}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(body),
      })
      setInput("")
    } catch (e) {
      console.error("메시지 전송 에러:", e)
    }
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-24 pb-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-[600px]">
            {/* 채팅방 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 truncate">{chatRoomName}</h2>
              <button
                onClick={() => router.push('/chat')}
                className="text-sm text-orange-500 hover:underline"
              >채팅방 목록</button>
            </div>
            {/* 메시지 리스트 */}
            <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded p-3 border border-gray-200">
              {messages.length === 0 ? (
                <div className="text-gray-400 text-center mt-20">아직 메시지가 없습니다.</div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className="mb-2">
                    <span className="font-semibold text-orange-600 mr-2">{m.senderNickname || m.senderId || "익명"}</span>
                    <span className="text-gray-800">{m.content}</span>
                  </div>
                ))
              )}
            </div>
            {/* 입력창 */}
            <div className="flex items-center gap-2 mt-auto">
              <input
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendMessage() }}
                placeholder="메시지 입력"
              />
              <button
                onClick={sendMessage}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold"
              >보내기</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
} 