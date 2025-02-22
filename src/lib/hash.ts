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
  
  return hashed
} 