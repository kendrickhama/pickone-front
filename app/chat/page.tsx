"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Plus, MessageCircle, Users } from 'lucide-react'

interface ChatRoom {
  id: number
  name: string
  lastMessage?: {
    content: string
    createdAt: string
    senderNickname: string
  }
  // participants, unreadCount 등은 필요시 추가
}

export default function ChatRoomsPage() {
  const router = useRouter()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchChatRooms()
  }, [])

  const fetchChatRooms = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await fetch('/api/chatrooms', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      })

      const data = await response.json()
      if (data.isSuccess) {
        setChatRooms(
          data.result.map((room: any) => ({
            id: room.roomId,
            name: room.roomName,
            lastMessage: room.lastMessage
              ? {
                  content: room.lastMessage,
                  createdAt: room.lastSentAt,
                  senderNickname: '', // 필요시 추가
                }
              : undefined,
            // participants, unreadCount 등 필요시 추가
          }))
        )
      } else {
        setError(data.message || '채팅방 목록을 불러오는데 실패했습니다.')
      }
    } catch (error) {
      setError('채팅방 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else if (diffInHours < 168) { // 7일
      return date.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric' 
      })
    } else {
      return date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 pt-24 pb-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">채팅방 목록을 불러오는 중...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-gray-50 pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">채팅</h1>
            <Button
              onClick={() => router.push('/chat/create')}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              새 채팅방
            </Button>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* 채팅방 목록 */}
          {chatRooms.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">채팅방이 없습니다</h3>
              <p className="text-gray-500 mb-6">
                새로운 채팅방을 만들어서 다른 사용자들과 대화를 시작해보세요.
              </p>
              <Button
                onClick={() => router.push('/chat/create')}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                새 채팅방 만들기
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => router.push(`/chat/${room.id}`)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {room.name}
                          </h3>
                          {room.lastMessage && (
                            <span className="text-xs text-gray-500 ml-2">
                              {formatTime(room.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {/* room.participants?.length ?? 0 */}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {room.lastMessage
                            ? room.lastMessage.content
                            : <span className="text-gray-400">메시지 없음</span>
                          }
                        </p>
                      </div>
                    </div>
                    {/* room.unreadCount && room.unreadCount > 0 && ( */}
                      <div className="ml-3">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">
                            {/* room.unreadCount > 99 ? '99+' : room.unreadCount */}
                          </span>
                        </div>
                      </div>
                    {/* ) */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
} 