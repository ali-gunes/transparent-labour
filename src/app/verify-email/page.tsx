'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { tr } from '@/translations/tr'
import VerificationContent from './VerificationContent'

export default function VerifyEmailPage() {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Email Doğrulama</h1>
      <Suspense fallback={
        <p className="text-gray-600 dark:text-gray-300">
          Email adresiniz doğrulanıyor...
        </p>
      }>
        <VerificationContent />
      </Suspense>
    </div>
  )
} 