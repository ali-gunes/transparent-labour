import { Resend } from 'resend' // or your preferred email service

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`
    
    const { data, error } = await resend.emails.send({
      from: 'Saydam Emek <noreply@saydamemek.com>',
      to: email,
      subject: 'Email Adresinizi Doğrulayın',
      html: `
        <h1>Email Doğrulama</h1>
        <p>Email adresinizi doğrulamak için aşağıdaki bağlantıya tıklayın:</p>
        <a href="${verificationUrl}">Email Adresimi Doğrula</a>
        <p>Bu bağlantı 24 saat içinde geçerliliğini yitirecektir.</p>
      `
    })

    if (error) {
      console.error('Resend API error:', error)
      throw error
    }

    console.log('Email sent successfully:', data)
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
} 