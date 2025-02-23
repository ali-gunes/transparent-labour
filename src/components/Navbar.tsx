'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import ThemeToggle from './ThemeToggle'
import { tr } from '@/translations/tr'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
          {tr.nav.home}
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/search" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            {tr.nav.search}
          </Link>
          {session ? (
            <>
              <Link href="/submit" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                {tr.nav.submitSalary}
              </Link>
              <Link href="/profile" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                {tr.nav.profile}
              </Link>
              <Link href="/settings" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {tr.nav.settings}
                </Link>
              {/* <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.user.username}
              </span> */}
              <button
                onClick={() => signOut()}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {tr.nav.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                {tr.nav.login}
              </Link>
              <Link href="/signup" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                {tr.nav.signup}
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}