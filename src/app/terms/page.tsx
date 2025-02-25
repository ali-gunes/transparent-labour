export default function TermsOfService() {
  return (
    <article className="container mx-auto px-4 py-8">
      <div className="prose prose-lg dark:prose-invert mx-auto">
        <h1 className="text-3xl font-bold mb-6">Kullanım Koşulları</h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">Son güncellenme: 25 Şubat 2025</p>

        <section className="mb-8">
          <p className="mb-4">
            Bu Hizmet Şartları ("Şartlar"), Saydam Emek ("Platform", "Biz", "Bize" veya "Bizim") hizmetlerini kullanan bireyler ("Kullanıcı", "Siz" veya "Sizin") için geçerlidir. Platformumuzu kullanarak bu Şartları kabul etmiş olursunuz.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Hizmetin Kapsamı</h2>
          <p className="mb-4">
            Saydam Emek, kullanıcıların maaş verilerini anonim olarak paylaşmalarına ve sektörel maaş trendleri hakkında bilgi edinmelerine olanak tanıyan bir platformdur. Kullanıcılar, hesap oluşturarak ve içerik paylaşarak bu Şartlara uymayı kabul ederler.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Kullanıcı Hesabı ve Güvenliği</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Platformu kullanmak için bir hesap oluşturmanız gerekmektedir.</li>
            <li>E-posta adresiniz ve şifreniz şifrelenerek saklanır, ancak güvenliğiniz için güçlü bir şifre kullanmanızı öneririz.</li>
            <li>Hesabınızın güvenliğinden siz sorumlusunuz. Hesabınızın yetkisiz kullanımı halinde derhal bizimle iletişime geçmelisiniz.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Kullanıcı İçeriği ve Sorumluluklar</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Platformda yalnızca gerçek ve doğru bilgiler paylaşmalısınız.</li>
            <li>Paylaşılan maaş bilgileri anonim olarak görüntülenir, ancak kullanıcı adınız görünür olabilir. Bu sebeple gerçek kimliğinizle bağdaştırılamayacak bir kullanıcı adı seçmelisiniz.</li>
            <li>Şirketler veya üçüncü şahıslar hakkında yanıltıcı, hakaret içeren veya yanlış bilgiler paylaşmak yasaktır.</li>
            <li>Yasadışı, spam veya reklam niteliğinde içerik paylaşmak yasaktır.</li>
          </ul>
          <p className="mb-4">
            Eğer bir içeriğin bu kurallara aykırı olduğunu tespit edersek, içeriği kaldırma ve kullanıcı hesabını askıya alma hakkını saklı tutarız.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Verilerin Kullanımı ve Gizlilik</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>E-posta adresiniz sadece hesap doğrulama ve şifre sıfırlama için kullanılır ve üçüncü taraflarla paylaşılmaz.</li>
            <li>Paylaşılan maaş verileri anonimleştirilir ve istatistiksel amaçlarla analiz edilebilir.</li>
            <li>Verilerinizin işlenmesiyle ilgili ayrıntılar için <a href="/privacy" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">Gizlilik Politikamızı</a> okuyabilirsiniz.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Hizmetin Kullanılabilirliği ve Sınırlamaları</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Platformun kesintisiz ve hatasız çalışacağını garanti etmiyoruz.</li>
            <li>Zaman zaman teknik güncellemeler, bakım veya beklenmedik kesintiler yaşanabilir.</li>
            <li>Platformdaki içeriklerden veya kullanıcılar arasında gerçekleşen etkileşimlerden kaynaklanan hiçbir doğrudan veya dolaylı zarardan sorumlu değiliz.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Hizmet Şartlarında Değişiklikler</h2>
          <p className="mb-4">
            Bu Şartlar zaman zaman güncellenebilir. Güncellemeler hakkında sizi bilgilendireceğiz ve en son sürümü bu sayfada yayınlayacağız.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. İletişim</h2>
          <p className="mb-4">
            Bu Hizmet Şartları ile ilgili herhangi bir sorunuz varsa, Saydam Emek ekibine <a href="/contact" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">İletişim Sayfası</a> aracılığıyla mesaj bırakabilirsiniz.
          </p>
        </section>
      </div>
    </article>
  )
} 