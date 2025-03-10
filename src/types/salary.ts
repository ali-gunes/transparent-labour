export type SalaryResponse = {
  id: string
  position: string
  company: string | null
  companyFocus: string | null
  experience: number
  location: string
  source: string
  sourceNote: string | null
  createdAt: Date
  salaryType: string
  rangeMin: number
  rangeMax: number
  submittedBy: string
  voteCount: number
  votes: { value: number }[] | false
  startDate: Date | null
  endDate: Date | null
  isCurrent: boolean
  workType: 'ONSITE' | 'REMOTE'
} 