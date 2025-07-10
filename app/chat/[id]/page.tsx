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
  const roomId = Number(params.id)
  const [chatRoomName, setChatRoomName] = useState<string>(`채팅방 ${roomId}`)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const stompClient = useRef<Client | null>(null)

  // 채팅방 이름 등 정보 조회 (REST, 필요시)
  useEffect(() => {
    fetch(`/api/chatrooms/${roomId}`)
      .then(res => res.json())
      .then(data => {
        if (data?.result?.name) setChatRoomName(data.result.name)
      })
      .catch(() => {})
  }, [roomId])

  // WebSocket + STOMP 연결
  useEffect(() => {
    const socket = new SockJS("http://3.35.49.195:8080/ws")
    const client = new Client({
      webSocketFactory: () => socket as any,
      onConnect: () => {
        client.subscribe(`/topic/room.${roomId}`, (msg: Message) => {
          const body = JSON.parse(msg.body)
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
    stompClient.current.publish({
      destination: "/app/chat/send",
      headers: { userId: userId || "" },
      body: JSON.stringify({ roomId, content: input }),
    })
    setInput("")
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
                    <span className="font-semibold text-orange-600 mr-2">{m.senderNickname || "익명"}</span>
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