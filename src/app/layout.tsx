import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/components/AuthProvider'
import { ThemeProvider } from '@/context/ThemeContext'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Saydam Emek',
  description: 'Saydam bir şekilde emeğinizin karşılığını paylaşın ve diğer emek verenlerin karşılığını görün.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}