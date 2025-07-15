"use client"

import { useEffect, useRef, useState } from "react"
import SockJS from "sockjs-client"
import { Client, Message } from "@stomp/stompjs"
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Send } from 'lucide-react'

export default function ChatRoomPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  // roomId 파싱: string 또는 string[] 모두 안전하게 처리
  const roomId = Array.isArray(params.id) ? Number(params.id[0]) : Number(params.id)
  const roomNameFromQuery = searchParams.get('roomName')
  const [chatRoomName, setChatRoomName] = useState<string>(roomNameFromQuery || `채팅방 ${roomId}`)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const stompClient = useRef<Client | null>(null)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  // 로그인한 사용자 ID 가져오기
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    setCurrentUserId(userId && !isNaN(Number(userId)) ? Number(userId) : null)
  }, [])

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
    const messageToSend = input.trim()
    if (!messageToSend) return
    setInput("") // input을 먼저 비움
    const userId = localStorage.getItem("userId")
    const accessToken = localStorage.getItem("accessToken")
    const numericRoomId = Number(roomId)
    const body = { roomId: numericRoomId, content: messageToSend }
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
    } catch (e) {
      console.error("메시지 전송 에러:", e)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded p-3 border border-gray-200"
            >
              {messages.length === 0 ? (
                <div className="text-gray-400 text-center mt-20">아직 메시지가 없습니다.</div>
              ) : (
                messages.map((m, i) => {
                  const isMine = currentUserId !== null && Number(m.senderId) === currentUserId
                  return (
                    <div
                      key={i}
                      className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`relative max-w-[70%] px-4 py-2 rounded-lg shadow text-sm break-words flex flex-col
                          ${isMine
                            ? "bg-gray-100 text-gray-900 items-end rounded-br-none"
                            : "bg-gray-700 text-white items-start rounded-bl-none"}
                        `}
                      >
                        <span>{m.content}</span>
                        {/* 말풍선 꼬리 색상도 맞춰줌 */}
                        {isMine ? (
                          <span className="absolute right-0 bottom-0 w-0 h-0 border-t-8 border-t-gray-100 border-r-8 border-r-transparent border-b-0 border-l-0"></span>
                        ) : (
                          <span className="absolute left-0 bottom-0 w-0 h-0 border-t-8 border-t-gray-700 border-l-8 border-l-transparent border-b-0 border-r-0"></span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            {/* 입력창 */}
            <div className="flex items-center gap-2 mt-auto">
              <textarea
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="메시지 입력"
                rows={1}
              />
              <button
                onClick={sendMessage}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors shadow text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                aria-label="메시지 보내기"
                type="button"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
} 