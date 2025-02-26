export default function AdminBadge() {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-800 border-2 border-indigo-300 dark:from-purple-900/30 dark:to-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700 shadow-sm">
      <svg 
        className="w-3.5 h-3.5 mr-1.5" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
      </svg>
      Saydam Emek Ekibi
    </span>
  )
} 