"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Users, Plus, X } from 'lucide-react'

interface User {
  id: number
  nickname: string
  profileImageUrl?: string
}

export default function CreateChatRoomPage() {
  const router = useRouter()
  const [roomName, setRoomName] = useState('')
  const [participantIds, setParticipantIds] = useState<string>('')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userInfo, setUserInfo] = useState<{ [key: number]: string }>({})

  const handleAddParticipant = async () => {
    if (!participantIds.trim()) {
      setError('사용자 ID를 입력해주세요.')
      return
    }

    const ids = participantIds.split(',').map(id => id.trim()).filter(id => id)
    
    for (const id of ids) {
      const userId = parseInt(id)
      if (isNaN(userId)) {
        setError(`잘못된 사용자 ID입니다: ${id}`)
        return
      }

      // 이미 선택된 사용자인지 확인
      if (selectedUsers.some(user => user.id === userId)) {
        setError(`이미 추가된 사용자입니다: ${id}`)
        return
      }

      // 본인인지 확인
      const currentUserId = localStorage.getItem('userId')
      if (userId.toString() === currentUserId) {
        setError('자기 자신은 추가할 수 없습니다.')
        return
      }

      try {
        // 사용자 정보 가져오기
        const accessToken = localStorage.getItem('accessToken')
        const response = await fetch(`/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        
        const data = await response.json()
        if (data.isSuccess) {
          const user: User = {
            id: data.result.id,
            nickname: data.result.nickname,
            profileImageUrl: data.result.profileImageUrl
          }
          setSelectedUsers(prev => [...prev, user])
          setUserInfo(prev => ({ ...prev, [userId]: data.result.nickname }))
          setError('')
        } else {
          setError(`사용자를 찾을 수 없습니다: ${id}`)
        }
      } catch (error) {
        setError(`사용자 정보를 가져오는데 실패했습니다: ${id}`)
      }
    }
    
    setParticipantIds('')
  }

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId))
    setUserInfo(prev => {
      const newInfo = { ...prev }
      delete newInfo[userId]
      return newInfo
    })
  }

  const handleUserSelect = (user: User) => {
    const isSelected = selectedUsers.some(u => u.id === user.id)
    if (isSelected) {
      // 선택 해제
      setSelectedUsers(prev => prev.filter(u => u.id !== user.id))
    } else {
      // 최대 10명까지만 선택 가능
      if (selectedUsers.length >= 10) {
        setError('최대 10명까지만 선택할 수 있습니다.')
        return
      }
      setSelectedUsers(prev => [...prev, user])
      setError('') // 에러 메시지 초기화
    }
  }

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setError('채팅방 이름을 입력해주세요.')
      return
    }
    if (selectedUsers.length === 0) {
      setError('참여자를 추가해주세요.')
      return
    }

    // 추가 검증
    const userId = localStorage.getItem('userId')
    if (!userId || isNaN(Number(userId))) {
      setError('로그인 정보가 없거나 userId가 올바르지 않습니다. 다시 로그인 해주세요.')
      return
    }
    const token = localStorage.getItem('accessToken')
    const participantIds = selectedUsers
      .map(user => user.id)
      .filter(id => id !== Number(userId)) // 본인 제외

    if (participantIds.length === 0) {
      setError('본인을 제외한 참여자를 1명 이상 추가해야 합니다.')
      return
    }

    const requestBody = {
      name: roomName.trim(),
      participantIds
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      "userId": localStorage.getItem("userId")!,
    }

    console.log('채팅방 생성 실제 요청 body:', JSON.stringify(requestBody))
    console.log('채팅방 생성 실제 요청 headers:', headers)

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chatrooms', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('채팅방 생성 실패:', errorText)
        throw new Error(`서버 오류: ${response.status}`)
      }

      const data = await response.json()
      if (data.isSuccess) {
        alert('채팅방이 생성되었습니다!')
        router.push(`/chat/${data.result.id}`)
      } else {
        setError(data.message || '채팅방 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('채팅방 생성 오류:', error)
      setError(error instanceof Error ? error.message : '채팅방 생성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-gray-50 pt-24 pb-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">새 채팅방 만들기</h1>

            {/* 채팅방 이름 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                채팅방 이름
              </label>
              <Input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="채팅방 이름을 입력하세요"
                className="w-full"
              />
            </div>

            {/* 참여자 추가 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                참여자 추가 (사용자 ID 입력)
              </label>
              <div className="flex space-x-2 mb-4">
                <Input
                  value={participantIds}
                  onChange={(e) => setParticipantIds(e.target.value)}
                  placeholder="사용자 ID를 입력하세요 (쉼표로 구분)"
                  className="flex-1"
                />
                <Button
                  onClick={handleAddParticipant}
                  disabled={!participantIds.trim()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  추가
                </Button>
              </div>

              {/* 선택된 참여자 목록 */}
              {selectedUsers.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">추가된 참여자</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map(user => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{user.nickname} (ID: {user.id})</span>
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500">
                • 사용자 ID를 쉼표(,)로 구분하여 여러 명을 한 번에 추가할 수 있습니다.<br/>
                • 예: 1, 2, 3
              </p>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* 생성 버튼 */}
            <div className="flex space-x-3">
              <Button
                onClick={handleCreateRoom}
                disabled={loading || !roomName.trim() || selectedUsers.length === 0}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {loading ? '생성 중...' : '채팅방 만들기'}
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
} 