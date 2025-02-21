'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const router = useRouter()
  const [error, setError] = useState('')
  
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    const name = formData.get('name')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (res.ok) {
        router.push('/login')
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong')
      }
    } catch (error) {
      setError('Something went wrong')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h1>
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
          {error}
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-gray-800">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-gray-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-gray-800">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              placeholder="Choose a password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
} 