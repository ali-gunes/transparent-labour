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
import UserBadge from '@/components/UserBadge'
import PasswordChangeForm from '@/components/PasswordChangeForm'
import { div } from 'framer-motion/client'
import Notifications from '@/components/Notifications'

type TabType = 'profile' | 'contact' | 'password' | 'salaries' | 'notifications'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('profile')

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

  const educationLevels = {
    HIGH_SCHOOL: 'Lise',
    ASSOCIATE: 'Ön Lisans',
    BACHELORS: 'Lisans',
    MASTERS: 'Yüksek Lisans',
    PHD: 'Doktora',
    OTHER: 'Diğer',
}

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex flex-col gap-4">
                <VerificationStatus
                  isVerified={profile!.emailVerified}
                  email={session!.user.email}
                />
                <div className="flex items-center gap-2">
                  <span className="text-gray-800 dark:text-gray-400">
                    Profil Durumu:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    <UserBadge 
                      voteCount={profile!.totalVotes} 
                      role={profile!.role}
                      isEarlyAdapter={profile!.isEarlyAdapter}
                    />
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-800 dark:text-gray-400">
                    Toplam Katkı Puanı:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {profile!.totalVotes}
                  </span>
                </div>
              </div>
            </div>
            <br />
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <ContactTokenGenerator />
            </div>
          </div>
        )
        
      case 'notifications':
        return (
          <div>
            <Notifications />
          </div>
        )

      case 'salaries':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            {/* <h2 className="text-xl font-bold mb-6">{tr.profile.title}</h2> */}
            <div className="grid gap-4">
              {Array.isArray(profile!.salaries) && profile!.salaries.map((salary) => (
                <div key={salary.id} className={styles.card}>
                  <div className={styles.cardBody}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className={`text-xl font-semibold ${styles.text}`}>
                          {salary.position}
                        </h2>
                        <p className={styles.textMuted}>
                    {salary.company || "Şirket Gizlenmiştir (Sektör: " + tr.submit.companyFocusTypes[salary.companyFocus as keyof typeof tr.submit.companyFocusTypes] + ")"}
                  </p>
                  <p className={`text-sm ${styles.textMuted}`}>
                    {salary.location.split(' -> ')[0]}
                  </p>
                      </div>
                      <span className={styles.textSmall}>
                        {new Date(salary.createdAt).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700"></div>
                    <p className={`text-lg font-medium ${styles.text} mb-2`}>
                      ₺{salary.rangeMin.toLocaleString()} - ₺{salary.rangeMax.toLocaleString()}
                      <span className={styles.textSmall}> ({salary.salaryType === 'net' ? tr.submit.salaryTypes.net : tr.submit.salaryTypes.gross})</span>
                    </p>
                    <div className="relative">
                      <div className={styles.textSmall}>
                      <p className={`text-sm font-medium ${styles.text} mb-2`}>
                          {salary.startDate ? new Date(salary.startDate).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) : ''}
                          {' - '}
                          {salary.isCurrent
                            ? 'Devam ediyor'
                            : salary.endDate
                              ? new Date(salary.endDate).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
                              : ''
                          }
                        </p>
                        <p className={`text-base font-medium ${styles.text} mb-2`}>{salary.experience} yıl deneyim</p>
                        <p className={`text-sm font-medium ${styles.text} mb-2`}>{educationLevels[salary.educationLevel as keyof typeof educationLevels]} mezunu</p>
                        <p className={`text-sm font-medium ${styles.text} mb-2`}>
                    {salary.workType === 'REMOTE' 
                      ? 'Remote çalışıyor'
                      : `${salary.location.split(' -> ')[0]}${
                          ['a', 'ı', 'o', 'u'].includes(salary.location.split(' -> ')[0].slice(-1).toLowerCase()) 
                            ? '\'da' 
                            : ['e', 'i', 'ö', 'ü'].includes(salary.location.split(' -> ')[0].slice(-1).toLowerCase())
                              ? '\'de'
                              : '\'de'
                        } ofisten çalışıyor`
                    }
                  </p>
                        
                        {salary.source === 'SELF' && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid gap-2">
                              <div className="flex items-center justify-between">
                                <span className={`text-sm font-medium ${styles.text} mb-2`}>İş-Yaşam Dengesi:</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} className={star <= (salary.workLifeBalance || 0) ? "text-yellow-400" : "text-gray-300"}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-sm font-medium ${styles.text} mb-2`}>Yan Haklar:</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} className={star <= (salary.compensationSatisfaction || 0) ? "text-yellow-400" : "text-gray-300"}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-sm font-medium ${styles.text} mb-2`}>Maaş Memnuniyeti:</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} className={star <= (salary.salarySatisfaction || 0) ? "text-yellow-400" : "text-gray-300"}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>

                            </div>

                          </div>

                        )}
                        <div className="mt-4 border-t border-gray-200 dark:border-gray-700"></div>

                        <p className="mt-2">
                          {tr.profile.source}: {salary.source === 'SELF' ? tr.profile.sourceSelf : tr.profile.sourceOther}
                          {salary.sourceNote && (
                            <span className="block italic mt-1">&quot;{salary.sourceNote}&quot;</span>
                          )}
                        </p>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          {tr.profile.submittedBy}: {salary.submittedBy}
                          <UserBadge voteCount={profile!.totalVotes} role={profile!.role} />
                        </p>


                      </div>
                      <div className="mt-4 border-t border-gray-200 dark:border-gray-700"></div>
                      <div className="mt-4 flex justify-center">
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
              {profile!.salaries.length === 0 && (
                <p className={styles.textMuted}>{tr.search.noResults}</p>
              )}
            </div>
          </div>
        )

      case 'password':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <PasswordChangeForm />
          </div>
        )


    }
  }

  if (loading) return <div className="text-center p-4">{tr.common.loading}</div>
  if (!profile) return null

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Merhaba, {profile.username}</h1>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 -mb-px ${activeTab === 'profile'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
        >
          Profil
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 -mb-px ${activeTab === 'notifications'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
        >
          İletişim
        </button>
        <button
          onClick={() => setActiveTab('salaries')}
          className={`px-4 py-2 -mb-px ${activeTab === 'salaries'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
        >
          Katkılarım
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 -mb-px ${activeTab === 'password'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
        >
          Şifre Değiştir
        </button>
      </div>

      {renderTabContent()}
    </div>
  )
} 