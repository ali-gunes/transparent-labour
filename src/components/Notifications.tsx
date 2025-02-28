'use client'

import { useState, useEffect } from 'react'
import { commonStyles as styles } from '@/styles/common'

type AnonymousMessage = {
  id: string
  subject: string
  message: string
  answer: string | null
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export default function Notifications() {
  const [messages, setMessages] = useState<AnonymousMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages/anonymous')
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center p-4">Yükleniyor...</div>
  }

  if (messages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <p className="text-gray-600 dark:text-gray-400">Henüz hiç mesajınız bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="mb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {message.subject}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(message.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{message.message}</p>
          </div>
          
          {message.answer && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Yanıtımız:
                </h4>
                <p className="text-gray-700 dark:text-gray-300">{message.answer}</p>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-sm">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
              message.status === 'REPLIED' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                : message.status === 'READ'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                : message.status === 'ARCHIVED'
                ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
            }`}>
              {message.status === 'REPLIED' ? 'Yanıtlandı' : 
               message.status === 'READ' ? 'Okundu' :
               message.status === 'ARCHIVED' ? 'Arşivlendi' :
               'Okunmadı'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
} 