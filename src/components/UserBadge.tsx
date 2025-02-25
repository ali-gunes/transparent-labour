interface BadgeProps {
  voteCount: number
}

export default function UserBadge({ voteCount }: BadgeProps) {
  const getBadgeInfo = (votes: number) => {
    if (votes >= 1512) return { 
      text: 'Saydam Emekçi', 
      color: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30' 
    }
    if (votes >= 100) return { 
      text: 'İçeriden Üye', 
      color: 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30' 
    }
    if (votes >= 50) return { 
      text: 'Güvenilir', 
      color: 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30' 
    }
    if (votes >= 10) return { 
      text: 'Katkı Sağlayan', 
      color: 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30' 
    }
    return { 
      text: 'Yeni Katılan', 
      color: 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' 
    }
  }

  const { text, color } = getBadgeInfo(voteCount)

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {text}
    </span>
  )
} 