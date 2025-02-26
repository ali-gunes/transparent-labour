interface BadgeProps {
  voteCount: number
  role?: 'USER' | 'ADMIN'
}

export default function UserBadge({ voteCount, role }: BadgeProps) {
  // If user is admin, show admin badge regardless of vote count
  if (role === 'ADMIN') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30">
        Admin
      </span>
    )
  }

  const getBadgeInfo = (votes: number) => {
    // Negative reputation levels
    if (votes <= -25) return { 
      text: 'Güvenilmez Üye', 
      color: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30' 
    }
    if (votes <= -10) return { 
      text: 'Şüpheli Üye', 
      color: 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30' 
    }
    if (votes <= -5) return { 
      text: 'Gözetimde Üye', 
      color: 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30' 
    }

    // Positive reputation levels
    if (votes >= 250) return { 
      text: 'Saydam Emekçi', 
      color: 'bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30' 
    }
    if (votes >= 100) return { 
      text: 'İçeriden Üye', 
      color: 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30' 
    }
    if (votes >= 50) return { 
      text: 'Güvenilir Üye', 
      color: 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30' 
    }
    if (votes >= 10) return { 
      text: 'Katkı Sağlayan', 
      color: 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30' 
    }

    // Neutral/New user
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