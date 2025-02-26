interface BadgeProps {
  voteCount: number
  role?: 'USER' | 'ADMIN'
}

export default function UserBadge({ voteCount, role }: BadgeProps) {
  // If user is admin, show admin badge regardless of vote count
  if (role === 'ADMIN') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-500 text-white border border-purple-400 shadow-sm hover:shadow-md transition-shadow duration-200 ml-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
        Saydam Emek Ekibi
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
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color} ml-2`}>
      {text}
    </span>
  )
} 