'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { tr } from '@/translations/tr'
import { motion } from 'framer-motion'

type VoteButtonsProps = {
  salaryId: string
  initialVoteCount: number
  initialVote: number | undefined
}

export default function VoteButtons({ 
  salaryId, 
  initialVoteCount = 0, 
  initialVote = undefined 
}: VoteButtonsProps) {
  const { data: session } = useSession()
  const [voteCount, setVoteCount] = useState<number>(initialVoteCount)
  const [currentVote, setCurrentVote] = useState<number | undefined>(initialVote)
  const [isVoting, setIsVoting] = useState(false)

  async function handleVote(value: number) {
    if (!session) {
      // Redirect to login or show message
      return
    }

    if (isVoting) return

    setIsVoting(true)

    // Optimistically update UI
    const oldVote = currentVote
    const oldCount = voteCount

    if (currentVote === value) {
      // Removing vote
      setCurrentVote(undefined)
      setVoteCount(voteCount - value)
    } else if (currentVote) {
      // Changing vote
      setCurrentVote(value)
      setVoteCount(voteCount + (value * 2)) // Double because we're switching from -1 to 1 or vice versa
    } else {
      // New vote
      setCurrentVote(value)
      setVoteCount(voteCount + value)
    }

    try {
      const res = await fetch(`/api/salary/${salaryId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      })

      if (!res.ok) {
        throw new Error('Vote failed')
      }
    } catch (error) {
      // Revert optimistic update on error
      setCurrentVote(oldVote)
      setVoteCount(oldCount)
      console.error('Vote error:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => handleVote(1)}
        disabled={isVoting}
        className={`p-1 rounded transition-colors ${
          currentVote === 1
            ? 'text-green-600 dark:text-green-400'
            : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'
        }`}
        title={tr.salary.upvote}
      >
        <ArrowUpIcon className="w-5 h-5" />
      </motion.button>
      <motion.span
        key={voteCount}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        className={`font-medium ${
          voteCount > 0 ? 'text-green-600 dark:text-green-400' :
          voteCount < 0 ? 'text-red-600 dark:text-red-400' :
          'text-gray-600 dark:text-gray-400'
        }`}
      >
        {voteCount}
      </motion.span>
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => handleVote(-1)}
        disabled={isVoting}
        className={`p-1 rounded transition-colors ${
          currentVote === -1
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-400 hover:text-red-600 dark:hover:text-red-400'
        }`}
        title={tr.salary.downvote}
      >
        <ArrowDownIcon className="w-5 h-5" />
      </motion.button>
    </div>
  )
} 