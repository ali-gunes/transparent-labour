import crypto from 'crypto'

export function hashEmail(email: string): string {
  return crypto
    .createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex')
}

export function hashPassword(password: string): string {
  const hashed = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex')
  
  console.log('Hashing password:', {
    original: password,
    hashed: hashed.substring(0, 10) + '...' // Only log first 10 chars for security
  })
  
  return hashed
} 