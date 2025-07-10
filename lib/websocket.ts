import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'

export interface SendMessageRequest {
  roomId: number
  content: string
  messageType?: 'TEXT' | 'IMAGE' | 'FILE'
}

export interface MessageResponse {
  id: number
  roomId: number
  senderId: number
  content: string
  messageType: string
  createdAt: string
}

class WebSocketService {
  private stompClient: any = null
  private subscriptions: Map<string, any> = new Map()
  private messageHandlers: Map<string, (message: MessageResponse) => void> = new Map()

  connect(userId: number, onConnected?: () => void, onError?: (error: any) => void) {
    const socket = new SockJS('http://3.35.49.195:8080/ws')
    
    this.stompClient = Stomp.over(socket)
    this.stompClient.reconnect_delay = 5000

    this.stompClient.connect(
      { userId: userId.toString() },
      () => {
        console.log('WebSocket 연결 성공')
        onConnected?.()
      },
      (error: any) => {
        console.error('WebSocket 연결 실패:', error)
        onError?.(error)
      }
    )
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect()
      this.stompClient = null
    }
    this.subscriptions.clear()
    this.messageHandlers.clear()
  }

  subscribeToRoom(roomId: number, onMessage: (message: MessageResponse) => void) {
    if (!this.stompClient) {
      console.error('WebSocket이 연결되지 않았습니다.')
      return
    }

    const topic = `/topic/room.${roomId}`
    
    // 이미 구독 중이면 제거
    if (this.subscriptions.has(topic)) {
      this.unsubscribeFromRoom(roomId)
    }

    const subscription = this.stompClient.subscribe(topic, (message: any) => {
      try {
        const messageData: MessageResponse = JSON.parse(message.body)
        onMessage(messageData)
      } catch (error) {
        console.error('메시지 파싱 오류:', error)
      }
    })

    this.subscriptions.set(topic, subscription)
    this.messageHandlers.set(topic, onMessage)
    
    console.log(`채팅방 ${roomId} 구독 완료`)
  }

  unsubscribeFromRoom(roomId: number) {
    const topic = `/topic/room.${roomId}`
    const subscription = this.subscriptions.get(topic)
    
    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete(topic)
      this.messageHandlers.delete(topic)
      console.log(`채팅방 ${roomId} 구독 해제`)
    }
  }

  sendMessage(request: SendMessageRequest) {
    if (!this.stompClient) {
      console.error('WebSocket이 연결되지 않았습니다.')
      return
    }

    this.stompClient.send('/app/chat/send', {}, JSON.stringify(request))
  }

  isConnected(): boolean {
    return this.stompClient && this.stompClient.connected
  }
}

export const webSocketService = new WebSocketService() 