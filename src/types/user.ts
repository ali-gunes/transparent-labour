export type UserProfile = {
  emailVerified: boolean
  username: string
  salaries: Array<{
    id: string
    position: string
    company: string
    rangeMin: number
    rangeMax: number
    salaryType: string
    experience: number
    location: string
    source: string
    sourceNote?: string
    createdAt: Date
    submittedBy: string
    voteCount: number
    userVote?: number
    workLifeBalance?: number
    compensationSatisfaction?: number
    salarySatisfaction?: number
    startDate: Date | null
    endDate: Date | null
    isCurrent: boolean
  }>
  totalVotes: number
} 