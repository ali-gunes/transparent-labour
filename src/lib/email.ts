import { Resend } from 'resend' // or your preferred email service

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`

  await resend.emails.send({
    from: 'noreply@transparentlabour.com',
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Welcome to Transparent Labour</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `
  })
} 