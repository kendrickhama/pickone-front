"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { webSocketService, SendMessageRequest, MessageResponse } from '@/lib/websocket'
import { Send, Users } from 'lucide-react'

interface ChatRoomProps {
  roomId: number
  roomName: string
  participants: Array<{
    id: number
    nickname: string
    profileImageUrl?: string
  }>
}

export default function ChatRoom({ roomId, roomName, participants }: ChatRoomProps) {
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUserId = Number(localStorage.getItem('userId'))

  useEffect(() => {
    if (!currentUserId) return

    // WebSocket 연결
    webSocketService.connect(
      currentUserId,
      () => {
        setIsConnected(true)
        console.log('채팅방에 연결되었습니다.')
      },
      (error) => {
        console.error('채팅방 연결 실패:', error)
        setIsConnected(false)
      }
    )

    // 채팅방 구독
    webSocketService.subscribeToRoom(roomId, (message) => {
      setMessages(prev => [...prev, message])
    })

    return () => {
      webSocketService.unsubscribeFromRoom(roomId)
      webSocketService.disconnect()
    }
  }, [roomId, currentUserId])

  useEffect(() => {
    // 새 메시지가 오면 스크롤을 맨 아래로
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected) return

    const messageRequest: SendMessageRequest = {
      roomId,
      content: newMessage.trim(),
      messageType: 'TEXT'
    }

    webSocketService.sendMessage(messageRequest)
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* 채팅방 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{roomName}</h3>
            <p className="text-sm text-gray-500">
              {participants.length}명 참여 중
            </p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>아직 메시지가 없습니다.</p>
            <p className="text-sm">첫 번째 메시지를 보내보세요!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === currentUserId
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.senderId === currentUserId ? 'text-orange-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 영역 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            disabled={!isConnected}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-2">
            연결이 끊어졌습니다. 다시 연결 중...
          </p>
        )}
      </div>
    </div>
  )
} 