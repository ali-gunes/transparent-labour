'use client'

import { Suspense } from 'react'
import VerificationContent from './VerificationContent'
import { tr } from '@/translations/tr'

export default function VerifyEmailPage() {
  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-4">{tr.auth.verify.title}</h1>
      <Suspense fallback={<p>{tr.common.loading}</p>}>
        <VerificationContent />
      </Suspense>
    </div>
  )
} 