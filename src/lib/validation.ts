// List of restricted admin-like usernames
const RESTRICTED_USERNAMES = [
  // English admin terms
  'admin',
  'administrator',
  'moderator',
  'mod',
  'system',
  'root',
  'superuser',
  'super',
  'support',
  'staff',
  'team',
  'security',
  'official',
  'owner',
  'master',
  'hr',
  'sysadmin',
  'webmaster',
  'helpdesk',
  'support',
  'info',
  'contact',
  'admin_',
  '_admin',
  'mod_',
  '_mod',

  // Turkish admin terms
  'yonetici',
  'yönetici',
  'yetkili',
  'sistem',
  'destek',
  'help',
  'yardim',
  'yardım',
  'resmi',
  'resmî',
  'ekip',
  'guvenlik',
  'güvenlik',
  'mudur',
  'yonetim',
  'yönetim',
  'baskan',
  'başkan',
  'patron',
  'sahip',
  'kurucu',
  'teknik',
  'bilgi',
  'iletisim',
  'iletişim',
  'insan_kaynaklari',
  'insan_kaynakları',
  'ik',
  'İk',
  'IK',
  'yonetici_',
  '_yonetici',
  'yetkili_',
  '_yetkili',
];

// List of common profanity words in English and Turkish
// Note: This is a basic list and should be expanded based on needs
const PROFANITY_LIST = [
  // English profanity
  'fuck',
  'shit',
  'ass',
  'bitch',
  'dick',
  'pussy',
  'cunt',
  'whore',
  'slut',
  'bastard',
  'piss',
  'cock',
  'wank',
  'twat',
  'prick',
  'fag',
  'homo',
  'retard',
  'nigger',
  'nigga',

  // Turkish profanity
  'amk',
  'aq',
  'sik',
  'oç',
  'piç',
  'yarak',
  'göt',
  'got',
  'amına',
  'amina',
  'orospu',
  'ibne',
  'pezevenk',
  'gavat',
  'mal',
  'gerizekalı',
  'gerizekali',
  'salak',
  'aptal',
  'dangalak',
  'siktir',
  'puşt',
  'pust',
  'yarrak',
  'amcik',
  'amcık',
  'oruspu',
  'ananı',
  'anani',
  'mk',
  'sg',
  'sktr',
  'pic',
  'pic',
  'serefsiz',
  'şerefsiz',
];

export function isValidUsername(username: string): { isValid: boolean; reason?: string } {
  // Convert username to lowercase for case-insensitive comparison
  const lowercaseUsername = username.toLowerCase();

  // Check for minimum length
  if (username.length < 3) {
    return {
      isValid: false,
      reason: 'Kullanıcı adı en az 3 karakter olmalıdır',
    };
  }

  // Check for maximum length
  if (username.length > 30) {
    return {
      isValid: false,
      reason: 'Kullanıcı adı en fazla 30 karakter olabilir',
    };
  }

  // Check for restricted admin-like usernames
  if (RESTRICTED_USERNAMES.some(restricted => 
    lowercaseUsername.includes(restricted) || 
    restricted.includes(lowercaseUsername)
  )) {
    return {
      isValid: false,
      reason: 'Bu kullanıcı adı kullanılamaz',
    };
  }

  // Check for profanity
  if (PROFANITY_LIST.some(word => 
    lowercaseUsername.includes(word) || 
    word.includes(lowercaseUsername)
  )) {
    return {
      isValid: false,
      reason: 'Bu kullanıcı adı uygunsuz içerik barındırıyor',
    };
  }

  // Check if username contains only allowed characters (letters, numbers, and underscores)
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      reason: 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir',
    };
  }

  return { isValid: true };
} 