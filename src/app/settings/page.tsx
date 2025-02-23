import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import PasswordChangeForm from '@/components/PasswordChangeForm'
import { tr } from '@/translations/tr'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">{tr.settings.title}</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">{tr.settings.changePassword}</h2>
        <PasswordChangeForm />
      </div>
    </div>
  )
} 