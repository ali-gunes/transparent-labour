type BadgeProps = {
  totalVotes: number
}

export default function UserBadge({ totalVotes }: BadgeProps) {
  const getBadgeInfo = (votes: number) => {
    if (votes >= 100) return { text: '(Expert)', color: 'bg-gold' }
    if (votes >= 50) return { text: '(Trusted)', color: 'bg-silver' }
    if (votes >= 25) return { text: '(Rising)', color: 'bg-bronze' }
    return null
  }

  const badge = getBadgeInfo(totalVotes)
  
  if (!badge) return null

  return (
    <span className={`${badge.color} text-white text-xs px-2 py-1 rounded-full ml-2`}>
      {badge.text}
    </span>
  )
} 