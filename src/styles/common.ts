export const commonStyles = {
  // Layout
  pageContainer: "max-w-4xl mx-auto",
  
  // Typography
  pageTitle: "text-2xl font-bold mb-6 text-gray-900 dark:text-white",
  text: "text-gray-900 dark:text-white",
  textMuted: "text-gray-600 dark:text-gray-300",
  textSmall: "text-sm text-gray-500 dark:text-gray-400",
  
  // Cards
  card: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors",
  cardHeader: "border-b border-gray-200 dark:border-gray-700 p-6",
  cardBody: "p-6",
  
  // Forms
  formContainer: "max-w-md mx-auto",
  formCard: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors",
  formBody: "p-6 space-y-4",
  label: "block mb-2 text-gray-900 dark:text-white",
  input: "w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
  select: "w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
  textarea: "w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
  button: `
    w-full px-4 py-2 text-white bg-blue-600 rounded-lg
    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  `,
  buttonLoading: `
    relative !text-transparent
    after:content-[''] after:block after:w-6 after:h-6
    after:border-4 after:border-white after:border-t-transparent
    after:rounded-full after:animate-spin
    after:absolute after:left-1/2 after:top-1/2
    after:-translate-x-1/2 after:-translate-y-1/2
  `,
  
  // Error messages
  error: "bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 p-4 rounded-lg mb-6 border border-red-100 dark:border-red-800",
  
  // Loading state
  loading: "text-gray-600 dark:text-gray-300"
} 