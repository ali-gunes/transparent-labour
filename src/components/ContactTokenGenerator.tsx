'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function ContactTokenGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [expiryTime, setExpiryTime] = useState<Date | null>(null)

  // Check token validity periodically
  useEffect(() => {
    const checkValidity = () => {
      if (expiryTime && new Date() > new Date(expiryTime)) {
        setToken(null)
        setExpiryTime(null)
      }
    }

    const interval = setInterval(checkValidity, 1000)
    return () => clearInterval(interval)
  }, [expiryTime])

  // Fetch existing token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/user/contact-token')
        const data = await response.json()
        if (response.ok && data.token) {
          setToken(data.token)
          setExpiryTime(new Date(data.expiry))
        }
      } catch (error) {
        console.error('Error fetching token:', error)
      }
    }

    fetchToken()
  }, [])

  const generateToken = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/user/contact-token', {
        method: 'POST',
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setToken(data.token)
      setExpiryTime(new Date(data.expiry))
      toast.success('İletişim kodu oluşturuldu')
    } catch (error) {
      toast.error('Kod oluşturulamadı. Lütfen tekrar deneyin.')
    } finally {
      setIsGenerating(false)
    }
  }

  const getTimeLeft = () => {
    if (!expiryTime) return null
    const now = new Date()
    const expiry = new Date(expiryTime)
    const diff = expiry.getTime() - now.getTime()
    
    if (diff <= 0) return null

    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const timeLeft = getTimeLeft()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Anonim İletişim Kodu</h3>
      
      {token && timeLeft ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200 mb-2">
            📌 Kodunuz (kalan süre: {timeLeft}):
          </p>
          <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">
            {token}
          </code>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
            Bu kodu iletişim sayfasındaki "Üye İletişimi" formunda kullanabilirsiniz.
          </p>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          Bizimle anonim olarak iletişime geçmek için iletişim kodu oluşturabilirsin.
        </p>
      )}

      <button
        onClick={generateToken}
        disabled={isGenerating || Boolean(token && timeLeft !== null)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isGenerating 
          ? 'Oluşturuluyor...' 
          : token && timeLeft 
            ? 'Aktif kodunuz var' 
            : 'Kod Oluştur'}
      </button>
    </div>
  )
} 