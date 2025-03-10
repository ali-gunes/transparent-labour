'use client'

import { useState, useRef } from 'react'
import toast from 'react-hot-toast'

type ContactFormType = 'general' | 'anonymous'

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formType, setFormType] = useState<ContactFormType>('general')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = formType === 'general' ? {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    } : {
      token: formData.get('token'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch(`/api/contact/${formType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Bir hata oluştu')
      }

      toast.success('Mesajınız iletildi. En kısa sürede size geri dönüş yapacağız.')
      formRef.current?.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Mesajınız iletilemedi. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Bize Ulaşın</h1>
        
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFormType('general')}
            className={`px-4 py-2 rounded-md transition-colors ${
              formType === 'general' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Genel İletişim
          </button>
          <button
            onClick={() => setFormType('anonymous')}
            className={`px-4 py-2 rounded-md transition-colors ${
              formType === 'anonymous' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Üye İletişimi
          </button>
        </div>

        {formType === 'anonymous' ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 dark:text-yellow-200">
              📌 Bu form üye iletişimi içindir. <br /><br /> Anonim kalma hakkınızı önemsiyoruz. Profilinizden anonim iletişim kodu oluşturarak kişisel bilgilerinizi paylaşmak zorunda kalmadan bizimle iletişime geçebilirsiniz.
            </p>
          </div>
        ) : (
          <div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 dark:text-yellow-200">
              📌 Eğer Saydam Emek üyeyiyseniz gizliliğinizi korumak için lütfen Üye İletişim formunu kullanın.
            </p>
            </div>
            <p className="text-gray-700 dark:text-gray-400 mb-8">
              Herhangi bir soru, öneri veya geri bildiriminiz için aşağıdaki formu kullanabilirsiniz.
            </p>
          </div>
          
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {formType === 'general' ? (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Adınız
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full p-2 border border-gray-200 rounded-md bg-white text-gray-800 placeholder:text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  E-posta Adresiniz
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full p-2 border border-gray-200 rounded-md bg-white text-gray-800 placeholder:text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
                />
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                İletişim Kodunuz
              </label>
              <input
                type="text"
                id="token"
                name="token"
                required
                placeholder="Profilinizden oluşturduğunuz iletişim kodu"
                className="w-full p-2 border border-gray-200 rounded-md bg-white text-gray-800 placeholder:text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>
          )}

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
              Konu
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              className="w-full p-2 border border-gray-200 rounded-md bg-white text-gray-800 placeholder:text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
              Mesajınız
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full p-2 border border-gray-200 rounded-md bg-white text-gray-800 placeholder:text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
      </div>
    </div>
  )
} 