import { Resend } from 'resend' // or your preferred email service

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY environment variable')
    throw new Error('Email service not configured')
  }

  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

    const { data, error } = await resend.emails.send({
      from: 'Saydam Emek <noreply@saydamemek.com>',
      to: email,
      subject: 'Email Adresinizi Doğrulayın',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                
                <!-- Hosted SVG Logo -->
                <div style="text-align: center; margin-bottom: 20px;">
                  <img src="https://saydamemek.com/logo.png" alt="Saydam Emek Logo" width="150" height="150" style="display: block; margin: 0 auto;">
                </div>

                <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Saydam Emek'e Hoş Geldiniz!</h1>
                <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Merhaba,<br><br>
                  Türkiye'de maaş şeffaflığına katkıda bulunmak istediğiniz için teşekkür ederiz. Sizin gibi değerli kullanıcılarımız sayesinde, iş arayanlar ve çalışanlar daha bilinçli kariyer kararları alabiliyorlar.
                </p>
                <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Platforma katılarak:<br>
                  • Sektörünüzdeki maaş aralıklarını görebilecek<br>
                  • Kendi deneyimlerinizi paylaşabilecek<br>
                  • Türkiye'deki maaş haksızlıklarının önüne geçmede katkıda bulunabileceksiniz
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationUrl}" 
                    style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Email Adresimi Doğrula
                  </a>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  Bu bağlantı 24 saat içinde geçerliliğini yitirecektir. Eğer bu emaili siz talep etmediyseniz, lütfen dikkate almayın.
                </p>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  Saydam Emek projesindeki desteğiniz, iş dünyasında daha adil ve şeffaf bir ortam yaratmamıza yardımcı oluyor. Katkınız için tekrar teşekkür ederiz.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">
                  Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.<br>
                  Gizlilik ve güvenliğiniz bizim için önemlidir.
                </p>
              </div>
            </div>
          </body>
        </html>
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

export async function sendPasswordResetEmail(email: string, token: string) {
  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY environment variable')
    throw new Error('Email service not configured')
  }

  try {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

    const { data, error } = await resend.emails.send({
      from: 'Saydam Emek <noreply@saydamemek.com>',
      to: email,
      subject: 'Şifre Sıfırlama',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                
                <!-- Hosted SVG Logo -->
                <div style="text-align: center; margin-bottom: 20px;">
                  <img src="https://saydamemek.com/logo.png" alt="Saydam Emek Logo" width="150" height="150" style="display: block; margin: 0 auto;">
                </div>

                <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Şifrenizi Sıfırlayın</h1>
                <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Merhaba,<br><br>
                  Saydam Emek hesabınız için bir şifre sıfırlama isteğinde bulundunuz. Yeni bir şifre belirlemek için aşağıdaki butona tıklayın:
                </p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" 
                    style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Şifremi Sıfırla
                  </a>
                </div>

                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  Bu bağlantı 24 saat içinde geçerliliğini yitirecektir. Eğer bu isteği siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.
                </p>

                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  Hesabınızı güvende tutmak için güçlü bir şifre oluşturduğunuzdan emin olun. Destek ekibimizle iletişime geçmek için bizimle 
                  <a href="mailto:destek@saydamemek.com" style="color: #007bff; text-decoration: none;">iletişime geçin</a>.
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                <p style="color: #999; font-size: 12px; text-align: center;">
                  Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.<br>
                  Gizlilik ve güvenliğiniz bizim için önemlidir.
                </p>
              </div>
            </div>
          </body>
        </html>

      `
    })

    if (error) {
      console.error('Resend API error:', error)
      throw error
    }

    console.log('Password reset email sent successfully:', data)
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    throw error
  }
} 