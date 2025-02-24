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
      <h1 className="text-2xl font-bold mb-8">{tr.profile.title}</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <VerificationStatus 
          isVerified={profile.emailVerified}
          email={session!.user.email}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">
          {profile.username}&apos;nin {tr.profile.title}
        </h2>
        
        <div className="grid gap-4">
          {profile.salaries.length > 0 ? (
            profile.salaries.map((salary) => (
              <div key={salary.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{salary.position}</h3>
                    <p className="text-gray-600">{salary.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(salary.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-lg font-medium mb-2">
                  ₺{salary.rangeMin.toLocaleString()} - ₺{salary.rangeMax.toLocaleString()}
                  <span className="text-sm text-gray-600">
                    {' '}({salary.salaryType === 'net' ? tr.submit.salaryTypes.net : tr.submit.salaryTypes.gross})
                  </span>
                </p>

                <div className="text-sm text-gray-600">
                  <p>{salary.experience} {tr.search.yearsExp}</p>
                  <p>{salary.location}</p>
                  <p className="mt-2">
                    {tr.profile.source}: {salary.source === 'SELF' ? tr.profile.sourceSelf : tr.profile.sourceOther}
                    {salary.sourceNote && (
                      <span className="block italic mt-1">"{salary.sourceNote}"</span>
                    )}
                  </p>
                </div>

                <div className="mt-4">
                  <VoteButtons
                    salaryId={salary.id}
                    initialVoteCount={salary.voteCount}
                    initialVote={salary.userVote}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">{tr.profile.noSalaries}</p>
          )}
        </div>
      </div>
    </div>
  )
} 