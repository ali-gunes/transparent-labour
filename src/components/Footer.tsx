'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const quotes = [
  "Çok canım sıkılıyor, kuş vuralım istersen",
  "Her isyan deneyim",
  "Zorba sistem hürriyeti aldı zorla bizden",
  "Şol zulümden çıkar yol, mevcudiyet kavgası"
]

const Footer = () => {
  const [quote, setQuote] = useState('')

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }, [])

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          
          
          <nav className="flex gap-6">
            <Link 
              href="/contact" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              İletişim
            </Link>
            <Link 
              href="/faq" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              SSS
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Gizlilik Politikası
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Kullanım Koşulları
            </Link>
          </nav>
          <p className="text-gray-600 dark:text-gray-300 italic text-sm">
            "{quote}"
          </p>
          <p className="text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Saydam Emek. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 