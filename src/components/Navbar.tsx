'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import ThemeToggle from './ThemeToggle'
import { tr } from '@/translations/tr'
import { useState } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="Saydam Emek Logo" 
              width={24} 
              height={24}
            />
            <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
              Saydam Emek
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              {tr.nav.analytics}
            </Link>
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {!isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden mt-4`}>
          <div className="flex flex-col space-y-4 py-4">
          <Link 
              href="/analytics" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              {tr.nav.analytics}
            </Link>
            <Link 
              href="/search" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              {tr.nav.search}
            </Link>
            
            {session ? (
              <>
                <Link 
                  href="/submit" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tr.nav.submitSalary}
                </Link>
                <Link 
                  href="/profile" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tr.nav.profile}
                </Link>
                
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    signOut()
                  }}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-left"
                >
                  {tr.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tr.nav.login}
                </Link>
                <Link 
                  href="/signup" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tr.nav.signup}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}