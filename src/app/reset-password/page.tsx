'use client'

import { Suspense } from 'react'
import ResetPasswordContent from './ResetPasswordContent'
import { tr } from '@/translations/tr'

export default function ResetPasswordPage() {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-4">{tr.auth.resetPassword.title}</h1>
      <Suspense fallback={
        <p className="text-gray-600 dark:text-gray-300">
          {tr.common.loading}
        </p>
      }>
        <ResetPasswordContent />
      </Suspense>
    </div>
  )
} 