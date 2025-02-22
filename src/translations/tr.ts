export const tr = {
  common: {
    loading: 'Yükleniyor...',
    error: 'Bir hata oluştu',
  },
  nav: {
    home: 'Saydam Emek',
    search: 'Ara',
    submitSalary: 'Maaş Bildir',
    profile: 'Profil',
    login: 'Giriş Yap',
    signup: 'Kayıt Ol',
    logout: 'Çıkış Yap',
  },
  home: {
    welcome: 'Saydam Emek\'e Hoş Geldiniz',
    subtitle: 'Maaş bilgilerini şeffaf bir şekilde paylaş ve keşfet',
    howItWorks: 'Nasıl Çalışır',
    step1: '1. Anonim Olarak Paylaş',
    step1Desc: 'Maaş bilgilerini güvenli ve anonim olarak paylaş',
    step2: '2. Verileri Keşfet',
    step2Desc: 'Pozisyon, şirket ve deneyime göre maaş aralıklarını ara',
    step3: '3. Bilinçli Kararlar Al',
    step3Desc: 'Gerçek verilerle daha iyi ücret pazarlığı yap',
  },
  search: {
    title: 'Maaş Bilgileri',
    filters: 'Arama Filtreleri',
    searchPlaceholder: 'Pozisyon, şirket veya lokasyon ara',
    minSalary: 'Minimum Maaş',
    maxSalary: 'Maksimum Maaş',
    yearsExp: 'yıl deneyim',
  },
  submit: {
    title: 'Maaş Bilgisi Gir',
    salary: 'Aylık Maaş (TL)',
    salaryType: 'Maaş Türü',
    salaryTypes: {
      net: 'Net Maaş',
      gross: 'Brüt Maaş',
    },
    salaryNote: 'Not: Maaşınızı standartlaştırarak anonimliğinizi koruyoruz. Girdiğiniz maaş bilgisi asla doğrudan gösterilmeyecektir ya da saklanmayacaktır.',
    position: 'Pozisyon',
    company: 'Şirket',
    experience: 'Deneyim (Yıl)',
    location: 'Lokasyon',
    source: 'Bilgi Kaynağı',
    sourceTypes: {
      self: 'Kendi Maaşım',
      other: 'Başka Birinden',
    },
    sourceNote: 'Kaynak Detayı (opsiyonel)',
    sourceNotePlaceholder: 'Örn: Bir arkadaştan, LinkedIn gönderisi, vb.',
    submit: 'Gönder',
    placeholders: {
      salary: 'Aylık net maaşınızı girin, sizin için standartlaştıracağız.',
      position: 'Pozisyon girin',
      company: 'Şirket adı girin',
      experience: 'Deneyim yılı girin',
      location: 'Lokasyon girin',
    },
    validation: {
      invalidSalary: 'Lütfen geçerli bir maaş girin',
      invalidExperience: 'Lütfen geçerli bir deneyim yılı girin',
    }
  },
  profile: {
    title: 'Paylaşımları',
    source: 'Kaynak',
    sourceSelf: 'Kendi Maaşım',
    sourceOther: 'Başkasından',
    salaryType: {
      net: '(Net)',
      gross: '(Brüt)'
    }
  },
  auth: {
    login: {
      title: 'Giriş Yap',
      username: 'Kullanıcı Adı',
      usernamePlaceholder: 'Kullanıcı adınızı girin',
      email: 'E-posta',
      password: 'Şifre',
      submit: 'Giriş Yap',
    },
    signup: {
      title: 'Kayıt Ol',
      username: 'Kullanıcı Adı',
      usernamePlaceholder: 'Kullanıcı adınızı girin',
      usernameNote: 'Not: Lütfen kimliğinizle ilişkilendirilemeyecek bir kullanıcı adı giriniz.',
      email: 'E-posta',
      emailPlaceholder: 'E-posta adresinizi girin',
      emailNote: 'E-posta adresiniz hash\'lenerek saklanacak',
      password: 'Şifre',
      passwordPlaceholder: 'Şifre belirleyin',
      submit: 'Kayıt Ol',
    },
    errors: {
      userExists: 'Bu kullanıcı adı veya e-posta zaten kullanımda',
      invalidCredentials: 'Geçersiz kullanıcı adı veya şifre',
    }
  }
} 