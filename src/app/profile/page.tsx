'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getUserProfile } from '@/app/actions/user'
import { tr } from '@/translations/tr'
import VerificationStatus from '@/components/VerificationStatus'
import VoteButtons from '@/components/VoteButtons'
import { commonStyles as styles } from '@/styles/common'
import type { UserProfile } from '@/types/user'
import ContactTokenGenerator from '@/components/ContactTokenGenerator'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session) {
      getUserProfile().then(data => {
        setProfile(data)
        setLoading(false)
      })
    }
  }, [session, status, router])

  if (loading) {
    return <div className="text-center p-4">{tr.common.loading}</div>
  }

  if (!profile) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-8">Merhaba {profile.username}</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <VerificationStatus 
          isVerified={profile.emailVerified}
          email={session!.user.email}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <ContactTokenGenerator />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">
          {tr.profile.title}
        </h2>
        
        <div className="grid gap-4">
        {Array.isArray(profile.salaries) && profile.salaries.map((salary) => (
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
                {new Date(salary.createdAt).toLocaleDateString("tr-TR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className={`text-lg font-medium ${styles.text} mb-2`}>
                ₺{salary.rangeMin.toLocaleString()} - ₺{salary.rangeMax.toLocaleString()}
                <span className={styles.textSmall}> ({salary.salaryType === 'net' ? tr.submit.salaryTypes.net : tr.submit.salaryTypes.gross})</span>
              </p>
              <div className="relative">
                <div className={styles.textSmall}>
                  <p>{salary.experience} {tr.search.yearsExp}</p>
                  <p>{salary.location}</p>
                  <p className="mt-2">
                    {tr.profile.source}: {salary.source === 'SELF' ? tr.profile.sourceSelf : tr.profile.sourceOther}
                    {salary.sourceNote && (
                      <span className="block italic mt-1">&quot;{salary.sourceNote}&quot;</span>
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
        {profile.salaries.length === 0 && (
          <p className={styles.textMuted}>{tr.search.noResults}</p>
        )}
      </div>
      </div>
    </div>
  )
} 