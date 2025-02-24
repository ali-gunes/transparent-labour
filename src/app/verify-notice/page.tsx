'use client'

import { useSearchParams } from 'next/navigation'
import { tr } from '@/translations/tr'

export default function VerifyNoticePage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">{tr.auth.verify.checkEmail}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {tr.auth.verify.checkEmailDesc.replace('{email}', email || '')}
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          <p>{tr.auth.verify.spamNote}</p>
        </div>
      </div>
    </div>
  )
} 