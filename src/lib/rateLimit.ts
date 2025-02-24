const rateLimits = new Map<string, { count: number; timestamp: number }>()

export async function rateLimit(key: string, limit: number, duration: number) {
  const now = Date.now()
  const record = rateLimits.get(key)
  
  // If no record exists or the record has expired
  if (!record || now - record.timestamp >= duration * 1000) {
    rateLimits.set(key, { count: 1, timestamp: now })
    return true
  }

  // If within duration window, increment count
  if (record.count < limit) {
    rateLimits.set(key, { count: record.count + 1, timestamp: record.timestamp })
    return true
  }

  return false
}

// Optional: Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimits.entries()) {
    if (now - record.timestamp >= 3600 * 1000) { // Clean after 1 hour
      rateLimits.delete(key)
    }
  }
}, 3600 * 1000) // Run every hour 