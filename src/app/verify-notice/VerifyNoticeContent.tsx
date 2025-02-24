'use client'

import { useSearchParams } from 'next/navigation'
import { tr } from '@/translations/tr'

export default function VerifyNoticeContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {tr.auth.verify.checkEmailDesc.replace('{email}', email || '')}
      </p>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-6">
        <p>{tr.auth.verify.spamNote}</p>
      </div>
    </div>
  )
} 