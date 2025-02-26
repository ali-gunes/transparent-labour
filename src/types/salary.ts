export type SalaryResponse = {
  id: string
  position: string
  company: string
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
  user: {
    totalVotes: number
    role: 'USER' | 'ADMIN'
  }
} 