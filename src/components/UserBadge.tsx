interface BadgeProps {
  voteCount: number
}

export default function UserBadge({ voteCount }: BadgeProps) {
  const getBadgeInfo = (votes: number) => {
    // Negative reputation levels - Red spectrum
    if (votes <= -50) return { 
      text: 'Güvenilmez', 
      color: 'bg-red-100 text-red-800 border-2 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' 
    }
    if (votes <= -25) return { 
      text: 'Şüpheli', 
      color: 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800/30' 
    }
    if (votes <= -10) return { 
      text: 'Dikkat', 
      color: 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/30' 
    }

    // Positive reputation levels - Green spectrum
    if (votes >= 250) return { 
      text: 'Saydam Emekçi', 
      color: 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' 
    }
    if (votes >= 100) return { 
      text: 'İçeriden Üye', 
      color: 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30' 
    }
    if (votes >= 50) return { 
      text: 'Güvenilir', 
      color: 'bg-teal-100 text-teal-800 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800/30' 
    }
    if (votes >= 10) return { 
      text: 'Katkı Sağlayan', 
      color: 'bg-cyan-100 text-cyan-800 border border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800/30' 
    }

    // Neutral/New user - Gray
    return { 
      text: 'Yeni Katılan', 
      color: 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700' 
    }
  }

  const { text, color } = getBadgeInfo(voteCount)

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {text}
    </span>
  )
} 