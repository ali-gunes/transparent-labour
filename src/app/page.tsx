'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'
import VoteButtons from '@/components/VoteButtons'
import UserBadge from '@/components/UserBadge'
import Analytics from '@/components/analytics/Analytics'

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
  startDate: string
  endDate: string
  isCurrent: boolean
  workLifeBalance?: number
  compensationSatisfaction?: number
  salarySatisfaction?: number
  user: {
    totalVotes: number
    role: 'USER' | 'ADMIN'
  }
}

const FACTS = [
  {
    text: "Şeffaf maaş politikası uygulayan şirketlerde çalışan memnuniyeti %30 daha yüksek.",
    source: "Harvard Business Review, 2023",
    sourceUrl: "https://hbr.org/2023/02/research-the-complicated-effects-of-pay-transparency"
  },
  {
    text: "Maaş şeffaflığı olan şirketlerde cinsiyet bazlı maaş farkı %7 daha az.",
    source: "PayScale Research, 2023",
    sourceUrl: "https://www.payscale.com/research-and-insights/gender-pay-gap/"
  },
  {
    text: "İş görüşmelerinde adayların %92'si maaş aralığını önceden bilmek istiyor.",
    source: "LinkedIn Global Talent Trends, 2023",
    sourceUrl: "https://business.linkedin.com/talent-solutions/global-talent-trends/archival/global-talent-trends-october-2023"
  },
  {
    text: "Benzer eğitim seviyelerine sahip kişiler arasında bile, yüksek ve düşük gelir grupları arasındaki maaş farkı son 40 yılda giderek büyüdü.",
    source: "OECD Aile Veritabanı, 2024",
    sourceUrl: "https://webfs.oecd.org/Els-com/Family_Database/LMF_1_5_Gender_pay_gaps_for_full_time_workers.pdf"
  },
  {
    text: "Maaş kararlarının şeffaf olduğunu düşünen çalışanların %91'i, işverenlerinin adil ödeme yaptığını düşünüyor.",
    source: "ADP, Maaş Şeffaflık Araştırması",
    sourceUrl: "https://www.adp.com/spark/articles/2023/03/pay-transparency-what-it-is-and-laws-by-state.aspx"
  },
  {
    text: "Araştırmalar, maaş kıyaslamalarını bilmeyen çalışanların, bilgisi olanlara kıyasla daha düşük ücretleri kabul etme eğiliminde olduğunu gösteriyor.",
    source: "Glassdoor, Küresel Maaş Şeffaflık Araştırması",
    sourceUrl: "https://media.glassdoor.com/pr/press/pdf/GD_Survey_GlobalSalaryTransparency-FINAL.pdf"
  },
  
]

function RotatingFacts() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentFactIndex((prevIndex) => (prevIndex + 1) % FACTS.length)
        setIsTransitioning(false)
      }, 500) // Half of the transition duration
    }, 5000) // Change fact every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const fact = FACTS[currentFactIndex]

  return (
    <div className="relative h-24 mb-8">
      <div 
        className={`absolute w-full transition-all duration-500 ease-in-out transform ${
          isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-2">
          {fact.text}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
          <a href={fact.sourceUrl} target="_blank" rel="noopener noreferrer">{fact.source}</a>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {FACTS.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentFactIndex
                ? 'bg-blue-600 dark:bg-blue-400 w-4'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
            onClick={() => {
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentFactIndex(index)
                setIsTransitioning(false)
              }, 500)
            }}
          />
        ))}
      </div>
    </div>
  )
}

function FAQItem({ title, content }: { title: string; content: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <button
        className="w-full p-6 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 text-gray-700 dark:text-gray-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`transition-all duration-200 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <p className="px-6 pb-6 text-gray-700 dark:text-gray-300">
          {content}
        </p>
      </div>
    </div>
  )
}

export default function Home() {
  const { data: session } = useSession()
  const [latestSalaries, setLatestSalaries] = useState<Salary[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalSalaries: 0,
    totalCompanies: 0,
    totalPositions: 0,
    totalLocations: 0,
    averageVotes: 0
  })

  useEffect(() => {
    if (session) {
      fetchLatestSalaries()
    } else {
      fetchStats()
    }
  }, [session])

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  async function fetchLatestSalaries() {
    setLoading(true)
    try {
      const res = await fetch('/api/salary?limit=5')
      const data = await res.json()
      setLatestSalaries(data)
    } catch (error) {
      console.error('Failed to fetch salaries:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        {/* Hero Section */}
        <section className="text-center py-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl mb-12">
          <h1 className="text-5xl font-bold mb-6 text-gray-800 dark:text-white">
            {tr.home.welcome}
          </h1>
          {/* <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {tr.home.subtitle}
          </p> */}
          <p className="text-lg text-blue-600 dark:text-blue-400 mb-16 max-w-2xl mx-auto font-medium">
            {tr.home.subtitleTagline}
          </p>
          <RotatingFacts />
          
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-300">Kullanıcılarımızın Toplam Katkıları</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stats.totalSalaries.toLocaleString()}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-400">Maaş Verisi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stats.totalCompanies.toLocaleString()}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-400">Şirket</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stats.totalPositions.toLocaleString()}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-400">Pozisyon</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stats.totalLocations.toLocaleString()}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-400">Lokasyon</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-12">
          <div className="border-b border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{tr.home.howItWorks}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 p-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-blue-600 dark:text-blue-300">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{tr.home.step1}</h3>
              <p className="text-gray-700 dark:text-gray-300">{tr.home.step1Desc}</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-blue-600 dark:text-blue-300">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{tr.home.step2}</h3>
              <p className="text-gray-700 dark:text-gray-300">{tr.home.step2Desc}</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-blue-600 dark:text-blue-300">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{tr.home.step3}</h3>
              <p className="text-gray-700 dark:text-gray-300">{tr.home.step3Desc}</p>
            </div>
          </div>
        </section>

        {/* Why We Do It Section */}
        <section className="max-w-6xl mx-auto mt-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">{tr.home.whyWeDoIt}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{tr.home.salaryTransparencyTitle}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {tr.home.salaryTransparencyDesc}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{tr.home.communityDrivenTitle}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {tr.home.communityDrivenDesc}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{tr.home.fightingInequalityTitle}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {tr.home.fightingInequalityDesc}
              </p>
            </div>
          </div>
        </section>

        {/* Our Goals Section with Progress */}
        <section className="max-w-6xl mx-auto mt-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">{tr.home.ourGoals}</h2>
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{tr.home.dataPointsTitle}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    {tr.home.dataPointsDesc}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-blue-600 dark:bg-blue-400 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.totalSalaries / 100000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                {stats.totalSalaries.toLocaleString()} / 100,000 maaş verisi
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{tr.home.empowerTitle}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    {tr.home.empowerDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-6xl mx-auto mt-16 px-4 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">{tr.home.faq}</h2>
          <div className="space-y-4">
            <FAQItem
              title={tr.home.anonymousTitle}
              content={tr.home.anonymousDesc}
            />
            <FAQItem
              title={tr.home.dataVerificationTitle}
              content={tr.home.dataVerificationDesc}
            />
            <FAQItem
              title={tr.home.updateFrequencyTitle}
              content={tr.home.updateFrequencyDesc}
            />
          </div>
        </section>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Emek Görüleri
      </h1>
      <Analytics />
    </main>
  )
} 