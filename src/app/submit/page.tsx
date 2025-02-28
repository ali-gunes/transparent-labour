'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import AutocompleteInput from '@/components/AutocompleteInput'
import { CompanyFocus, EducationLevel } from '@prisma/client'
import { turkishCities, popularCountries } from '@/data/locations'

// Add helper function for text formatting
function formatFieldText(text: string, field?: string): string {
  const trimmedText = text.trim()
  
  // Skip initialization for company names
  if (field === 'company') {
    return trimmedText
  }
  
  return trimmedText
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export default function SubmitSalary() {
  const router = useRouter()
  const { data: session } = useSession()
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const [source, setSource] = useState('SELF')
  const [salaryType, setSalaryType] = useState('net')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isCurrent, setIsCurrent] = useState(true)
  const [hideCompany, setHideCompany] = useState(false)
  const [educationLevel, setEducationLevel] = useState<EducationLevel | ''>('')
  const [selectedCountry, setSelectedCountry] = useState('Türkiye')
  const [isSameLocation, setIsSameLocation] = useState(true)
  const [companyCountry, setCompanyCountry] = useState('Türkiye')
  const [workLocationType, setWorkLocationType] = useState('on-site')
  const [confirmedLowSalary, setConfirmedLowSalary] = useState(false)

  // Redirect if not authenticated
  if (session === null) {
    router.push('/login')
    return null
  }

  // Add source info
  const sourceNote = session?.user.username 
    ? `Submitted by ${session.user.username}`
    : undefined

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setWarning('')

    const formData = new FormData(event.currentTarget)
    const amount = Number(formData.get('amount'))
    const experience = Number(formData.get('experience'))

    // Validate numbers
    if (isNaN(amount) || amount <= 0) {
      setError(tr.submit.validation.invalidSalary)
      return
    }

    if (isNaN(experience) || experience < 0) {
      setError(tr.submit.validation.invalidExperience)
      return
    }

    // Check for minimum wage if the country is Turkey
    if ((selectedCountry === 'Türkiye' || companyCountry === 'Türkiye') && 
        amount < 22104 && 
        !confirmedLowSalary) {
      setWarning('Girdiğiniz maaş Türkiye\'deki asgari ücretin (₺22.104) altında. Bu maaşın doğru olduğundan emin misiniz?')
      setConfirmedLowSalary(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const source = formData.get('source') as string
    const sourceNote = source === 'OTHER' 
      ? formData.get('sourceNote') as string 
      : undefined

    // Validate source note when source is OTHER
    if (source === 'OTHER' && (!sourceNote || sourceNote.trim() === '')) {
      setError('Lütfen kaynak detayı giriniz')
      return
    }

    // Format location based on country selection
    let location
    if (isSameLocation) {
      location = selectedCountry
    } else {
      if (workLocationType === 'remote') {
        location = companyCountry
      } else {
        location = companyCountry
      }
    }

    try {
      const data = {
        amount,
        position: formatFieldText(formData.get('position') as string, 'position'),
        company: hideCompany ? undefined : formatFieldText(formData.get('company') as string, 'company'),
        companyFocus: formData.get('companyFocus') as CompanyFocus,
        experience,
        location,
        source,
        sourceNote,
        submittedBy: session?.user?.username || '',
        salaryType,
        startDate,
        endDate: !isCurrent ? endDate : null,
        isCurrent,
        educationLevel: educationLevel || undefined,
        workType: workLocationType === 'remote' ? 'REMOTE' : 'ONSITE',
        isSameLocation,
        ...(source === 'SELF' && {
          workLifeBalance: Number(formData.get('workLifeBalance')),
          compensationSatisfaction: Number(formData.get('compensationSatisfaction')),
          salarySatisfaction: Number(formData.get('salarySatisfaction')),
        })
      }

      console.log('Submitting salary data:', data) // Debug log

      const res = await fetch('/api/salary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        console.error('Submission error:', result) // Debug log
        setError(result.error || tr.common.error)
        return
      }

      router.push('/search')
      router.refresh()
    } catch (err) {
      console.error('Failed to submit salary:', err)
      setError(tr.common.error)
    }
  }

  const workLifeBalanceTexts = [
    "İşim, özel hayatıma hiç zaman bırakmıyor.",
    "Bazen iş ve özel hayatı dengelemekte zorlanıyorum.",
    "İş-yaşam dengesini genellikle koruyabiliyorum.",
    "İşim, özel hayatıma yeterince zaman ayırmama izin veriyor.",
    "İş ve özel hayatım mükemmel bir dengede."
  ];
  
  const compensationSatisfactionTexts = [
    "Yan haklarım çok yetersiz ve ihtiyacımı karşılamıyor.",
    "Yan haklarım sınırlı ve önemli eksiklikler var.",
    "Yan haklarım temel seviyede ve kabul edilebilir.",
    "Yan haklarım iyi ve çoğu ihtiyacımı karşılıyor.",
    "Yan haklarım oldukça kapsamlı ve beklentilerimi fazlasıyla karşılıyor."
  ];

  const salarySatisfactionTexts = [
    "Maaşım, emeğimin ve becerilerimin karşılığını vermiyor.",
    "Maaşım fena değil ama daha adil olabileceğini düşünüyorum.",
    "Maaşımın sektör ortalamasına yakın olduğunu düşünüyorum.",
    "Maaşım, yaşam standartlarımı rahatça karşılamama yetiyor.",
    "Maaşım beklentilerimi tamamen karşılıyor ve beni motive ediyor."
  ]

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.pageTitle}>{tr.submit.title}</h1>
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      {warning && (
        <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                {warning}
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setWarning('')
                    setConfirmedLowSalary(true)
                    document.querySelector('button[type="submit"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white dark:text-white rounded-md font-medium transition-colors duration-200"
                >
                  Evet, devam et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-xl mx-auto">
        <div className={styles.formCard}>
          <form onSubmit={onSubmit} className={styles.formBody}>
            <div className="space-y-6">
              <div>
                <label htmlFor="amount" className={`${styles.label} text-lg`}>
                  {tr.submit.salary}
                </label>
                <div className="flex gap-4 mb-2">
                  <div className="flex-[1]">
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      required
                      min="0"
                      max="10000000"
                      step="1"
                      onWheel={(e) => e.currentTarget.blur()}
                      className={`${styles.input} h-12 text-lg w-full`}
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      value={salaryType}
                      onChange={(e) => setSalaryType(e.target.value)}
                      className={`${styles.select} h-12 text-lg w-full`}
                    >
                      <option value="net">{tr.submit.salaryTypes.net}</option>
                      <option value="gross">{tr.submit.salaryTypes.gross}</option>
                    </select>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                  {tr.submit.salaryNote}
                </p>
              </div>
              <div>
                <label htmlFor="educationLevel" className={styles.label}>
                  {tr.submit.educationLevel}
                </label>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  className={styles.select}
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                >
                  <option value="">Seçiniz</option>
                  {Object.entries(tr.submit.educationLevels).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <AutocompleteInput
                  id="position"
                  name="position"
                  label={tr.submit.position}
                  required
                  maxLength={100}
                  placeholder={tr.submit.placeholders.position}
                  field="position"
                />
              </div>
              <div>
                {!hideCompany && (
                  <AutocompleteInput
                    id="company"
                    name="company"
                    label={tr.submit.company}
                    maxLength={100}
                    placeholder={tr.submit.placeholders.company}
                    field="company"
                  />
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                  {tr.submit.companyNote}
                </p>
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="hideCompany"
                    checked={hideCompany}
                    onChange={(e) => setHideCompany(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label htmlFor="hideCompany" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Şirket belirtmek istemiyorum
                  </label>
                </div>
                
              </div>
              {hideCompany && (
                <div>
                  <label htmlFor="companyFocus" className={`${styles.label} text-lg`}>
                    {tr.submit.companyFocus}
                  </label>
                  <select
                    id="companyFocus"
                    name="companyFocus"
                    required={hideCompany}
                    className={`${styles.select} h-12 text-lg`}
                  >
                    <option value="">Lütfen seçiniz</option>
                    {Object.entries(tr.submit.companyFocusTypes).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label htmlFor="experience" className={`${styles.label} text-lg`}>
                  {tr.submit.experience}
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  required
                  min="0"
                  max="50"
                  step="1"
                  onWheel={(e) => e.currentTarget.blur()}
                  className={`${styles.input} h-12 text-lg`}
                  placeholder={tr.submit.placeholders.experience}
                />
              </div>
              <div>
                <label className={`${styles.label} text-lg`}>
                  {tr.submit.location}
                </label>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isSameLocation"
                      checked={isSameLocation}
                      onChange={(e) => {
                        setIsSameLocation(e.target.checked)
                        if (e.target.checked) {
                          setCompanyCountry('Türkiye')
                          setWorkLocationType('on-site')
                        } else {
                          setWorkLocationType('remote')
                        }
                      }}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <label htmlFor="isSameLocation" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Şirketin bulunduğu ülke ile yaşadığım ülke aynı
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <select
                        id="country"
                        name="country"
                        className={`${styles.select} h-12 text-lg`}
                        value={isSameLocation ? selectedCountry : companyCountry}
                        onChange={(e) => {
                          if (isSameLocation) {
                            setSelectedCountry(e.target.value)
                          } else {
                            setCompanyCountry(e.target.value)
                          }
                        }}
                        required
                      >
                        {popularCountries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        id="workLocationType"
                        name="workLocationType"
                        className={`${styles.select} h-12 text-lg`}
                        value={workLocationType}
                        onChange={(e) => setWorkLocationType(e.target.value)}
                        disabled={!isSameLocation}
                        required
                      >
                        {isSameLocation ? (
                          <>
                            <option value="on-site">Ofisten</option>
                            <option value="remote">Remote</option>
                          </>
                        ) : (
                          <option value="remote">Remote</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className={`${styles.label} text-lg`}>
                  Çalışma Süresi
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Başlangıç Tarihi
                    </label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      className={`${styles.input} h-12 text-lg w-full`}
                      placeholderText="Ay/Yıl seçin"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Bitiş Tarihi
                    </label>
                    <div className="flex flex-col gap-2">
                      <DatePicker
                        selected={isCurrent ? null : endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className={`${styles.input} h-12 text-lg w-full ${isCurrent ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                        placeholderText="Devam ediyor"
                        minDate={startDate || undefined}
                        disabled={isCurrent}
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isCurrent"
                          checked={isCurrent}
                          onChange={(e) => {
                            setIsCurrent(e.target.checked)
                            if (e.target.checked) {
                              setEndDate(null)
                            }
                          }}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <label htmlFor="isCurrent" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          Halen bu pozisyonda çalışıyorum
                        </label>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
              <div>
                <label htmlFor="source" className={`${styles.label} text-lg`}>
                  {tr.submit.source}
                </label>
                <select
                  id="source"
                  name="source"
                  className={`${styles.select} h-12 text-lg`}
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  <option value="SELF">{tr.submit.sourceTypes.self}</option>
                  <option value="OTHER">{tr.submit.sourceTypes.other}</option>
                </select>
              </div>
              
            </div>

            {source === 'OTHER' && (
              <div className="mt-6">
                <label htmlFor="sourceNote" className={`${styles.label} text-lg`}>
                  {tr.submit.sourceNote}
                </label>
                <textarea
                  id="sourceNote"
                  name="sourceNote"
                  className={`${styles.textarea} text-lg`}
                  placeholder={tr.submit.sourceNotePlaceholder}
                  maxLength={500}
                  rows={4}
                  required
                />
              </div>
            )}

            {source === 'SELF' && (
              <div className="space-y-6 mt-6">
                <div>
                  <label htmlFor="workLifeBalance" className={`${styles.label} text-lg`}>
                    {tr.submit.workLifeBalance}
                  </label>
                  <select
                    id="workLifeBalance"
                    name="workLifeBalance"
                    required
                    className={`${styles.select} h-12 text-lg`}
                  >
                    <option value="">Lütfen seçiniz</option>
                    {workLifeBalanceTexts.map((text, index) => (
                    <option key={index + 1} value={index + 1}>
                      {text}
                    </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="compensationSatisfaction" className={`${styles.label} text-lg`}>
                    {tr.submit.compensationSatisfaction}
                  </label>
                  <select
                  id="compensationSatisfaction"
                  name="compensationSatisfaction"
                  required
                  className={`${styles.select} h-12 text-lg`}
                >
                  <option value="">Lütfen seçiniz</option>
                  {compensationSatisfactionTexts.map((text, index) => (
                    <option key={index + 1} value={index + 1}>
                      {text}
                    </option>
                  ))}
                </select>
                </div>

                <div>
                  <label htmlFor="salarySatisfaction" className={`${styles.label} text-lg`}>
                    {tr.submit.salarySatisfaction}
                  </label>
                  <select
                    id="salarySatisfaction"
                    name="salarySatisfaction"
                    required
                    className={`${styles.select} h-12 text-lg`}
                  >
                    <option value="">Lütfen seçiniz</option>
                  {salarySatisfactionTexts.map((text, index) => (
                    <option key={index + 1} value={index + 1}>
                      {text}
                    </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`${styles.button} mt-8 w-full py-3 text-lg`}
            >
              {tr.submit.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 