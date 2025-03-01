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
                      <div className="flex flex-col items-end gap-2">
                      {salary.status === 'APPROVED' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 shadow-sm dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 dark:border-green-800/30">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Doğrulanmış Kart
                    </span>
                    )}
                      <span className={styles.textSmall}>
                        {new Date(salary.createdAt).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                      </div>
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
                            : salary.workType === 'HYBRID'
                              ? `${salary.location.split(' -> ')[0]}${['a', 'ı', 'o', 'u'].includes(salary.location.split(' -> ')[0].slice(-1).toLowerCase())
                                ? '\'da'
                                : ['e', 'i', 'ö', 'ü'].includes(salary.location.split(' -> ')[0].slice(-1).toLowerCase())
                                  ? '\'de'
                                  : '\'de'
                              } hibrit çalışıyor`
                              : `${salary.location.split(' -> ')[0]}${['a', 'ı', 'o', 'u'].includes(salary.location.split(' -> ')[0].slice(-1).toLowerCase())
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