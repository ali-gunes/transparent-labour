'use client'

import { useState } from 'react'
import { tr } from '@/translations/tr'

function FAQItem({ title, content }: { title: string; content: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <button
        className="w-full p-6 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 text-gray-700 dark:text-gray-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`transition-all duration-200 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <p className="px-6 pb-6 text-gray-700 dark:text-gray-300">
          {content}
        </p>
      </div>
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
        Sıkça Sorulan Sorular
      </h1>
      
      <div className="space-y-6">
        <FAQItem title={tr.home.anonymousTitle} content={tr.home.anonymousDesc} />
        <FAQItem title={tr.home.dataVerificationTitle} content={tr.home.dataVerificationDesc} />
        <FAQItem title={tr.home.updateFrequencyTitle} content={tr.home.updateFrequencyDesc} />
        <FAQItem title={tr.home.dataSafetyTitle} content={tr.home.dataSafetyDesc} />
        <FAQItem title={tr.home.salaryRangeTitle} content={tr.home.salaryRangeDesc} />
        <FAQItem title={tr.home.companyOptionalTitle} content={tr.home.companyOptionalDesc} />
        <FAQItem title={tr.home.dataAccuracyTitle} content={tr.home.dataAccuracyDesc} />
        <FAQItem title={tr.home.multipleEntriesTitle} content={tr.home.multipleEntriesDesc} />
        <FAQItem title={tr.home.benefitsTitle} content={tr.home.benefitsDesc} />
      </div>
    </div>
  )
} 