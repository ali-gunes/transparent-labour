'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'
import VoteButtons from '@/components/VoteButtons'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import VerificationStatus from '@/components/VerificationStatus'

type Salary = {
  id: string
  position: string
  company: string
  amount: number
  salaryType: string
  experience: number
  location: string
  source: string
  sourceNote?: string
  createdAt: string
  salaryRange: {
    min: number
    max: number
  }
  submittedBy: string
  voteCount: number
  userVote?: number
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      emailVerified: true,
      username: true,
      // ... other fields you want to display
    }
  })

  const router = useRouter()
  const [salaries, setSalaries] = useState<Salary[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (session) {
      fetchUserSalaries()
    }
  }, [session])

  async function fetchUserSalaries() {
    try {
      const res = await fetch('/api/salary/user')
      const data = await res.json()
      setSalaries(data)
    } catch (error) {
      console.error('Failed to fetch user salaries:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className={styles.loading}>{tr.common.loading}</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-8">{tr.profile.title}</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <VerificationStatus 
          isVerified={user?.emailVerified} 
          email={session.user.email}
        />
      </div>

      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>
          {session?.user.username}&apos;nin {tr.profile.title}
        </h1>
        <div className="grid gap-4">
          {Array.isArray(salaries) && salaries.map((salary) => (
            <div key={salary.id} className={styles.card}>
              <div className={styles.cardBody}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className={`text-xl font-semibold ${styles.text}`}>
                      {salary.position}
                    </h2>
                    <p className={styles.textMuted}>{salary.company}</p>
                  </div>
                  <span className={styles.textSmall}>
                    {new Date(salary.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-lg font-medium ${styles.text} mb-2`}>
                  ₺{salary.salaryRange.min.toLocaleString()} - ₺{salary.salaryRange.max.toLocaleString()}
                  <span className={styles.textSmall}> ({salary.salaryType === 'net' ? tr.submit.salaryTypes.net : tr.submit.salaryTypes.gross})</span>
                </p>
                <div className="relative">
                  <div className={styles.textSmall}>
                    <p>{salary.experience} {tr.search.yearsExp}</p>
                    <p>{salary.location}</p>
                    <p className="mt-2">
                      {tr.profile.source}: {salary.source === 'SELF' ? tr.profile.sourceSelf : tr.profile.sourceOther}
                      {salary.sourceNote && (
                        <span className="block italic mt-1">"{salary.sourceNote}"</span>
                      )}
                    </p>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                      {tr.profile.submittedBy}: {salary.submittedBy}
                    </p>
                  </div>
                  <div className="absolute bottom-0 right-0">
                    <VoteButtons
                      salaryId={salary.id}
                      initialVoteCount={salary.voteCount}
                      initialVote={salary.userVote}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {salaries.length === 0 && (
            <p className={styles.textMuted}>{tr.search.noResults}</p>
          )}
        </div>
      </div>
    </div>
  )
} 