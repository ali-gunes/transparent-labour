import { useState, useEffect, useRef } from 'react'
import { commonStyles as styles } from '@/styles/common'

interface AutocompleteInputProps {
  id: string
  name: string
  label: string
  placeholder?: string
  required?: boolean
  maxLength?: number
  field: 'position' | 'company' | 'location'
  className?: string
}

export default function AutocompleteInput({
  id,
  name,
  label,
  placeholder,
  required = false,
  maxLength,
  field,
  className = ''
}: AutocompleteInputProps) {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add click outside listener to close suggestions
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 2) {
        setSuggestions([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch(
          `/api/suggestions?field=${field}&q=${encodeURIComponent(value)}&limit=5`
        )
        if (res.ok) {
          const data = await res.json()
          setSuggestions(data)
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [value, field])

  return (
    <div className="relative">
      <label htmlFor={id} className={`${styles.label} text-lg`}>
        {label}
      </label>
      <input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => value.length >= 2 && setShowSuggestions(true)}
        required={required}
        maxLength={maxLength}
        className={`${styles.input} h-12 text-lg ${className}`}
        placeholder={placeholder}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setValue(suggestion)
                setShowSuggestions(false)
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      {loading && (
        <div className="absolute right-3 top-[42px]">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      )}
    </div>
  )
} 