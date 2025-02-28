# Saydam Emek (Transparent Labour)

## Mission

Saydam Emek is a platform dedicated to bringing transparency to the Turkish labor market by creating an anonymous, community-driven salary information sharing platform. Our mission is to:

- Empower employees with accurate salary data for better career decisions
- Promote fair compensation through market transparency
- Protect user privacy while maintaining data reliability
- Foster a more equitable job market through data-driven insights

## Features

### 💰 Salary Sharing
- Anonymous salary submissions with privacy-focused data handling
- Standardized salary ranges to protect individual privacy
- Optional company information with industry categorization
- Detailed position and experience tracking
- Work satisfaction metrics (work-life balance, compensation, overall satisfaction)

### 📊 Analytics
- Interactive salary distribution charts
- Experience-based salary scatter plots
- Industry-focused analysis
- Education level impact analysis
- Company and position-based comparisons

### 🔒 Privacy & Security
- Anonymous data sharing options
- Standardized salary ranges
- Variance-based data display (±7% with 500 TL rounding)
- Email verification system
- Secure authentication

### 👥 Community Features
- Reliability voting system
- Early adopter recognition
- User reputation system
- Anonymous communication channel
- Community-driven data validation

## Technology Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Styling**: TailwindCSS with Dark Mode support
- **Deployment**: Vercel

## Data Privacy

We take data privacy seriously and have implemented multiple layers of protection:

### Data Anonymization
- No exact salary figures are stored or displayed
- All salary data is standardized into ranges with ±7% variance
- Displayed values are rounded to nearest 500 TL
- Company names are optional and can be replaced with industry categories
- User profiles never display actual salary amounts

### User Protection
- Email verification required for account creation
- Secure password hashing and storage
- Option to use anonymous communication tokens
- No public profile information beyond username
- Early adopter badges and reputation scores don't reveal personal data

### Data Display
- Scatter plots use variance to prevent exact salary identification
- Salary ranges are aggregated for distribution charts
- Company statistics only shown when sufficient data exists
- Position titles are standardized to prevent individual identification
- Experience levels are grouped to maintain anonymity

### Technical Measures
- HTTPS encryption for all data transmission
- Secure session management
- Regular security audits
- Database encryption at rest
- Rate limiting on sensitive operations
- IP address anonymization

### User Control
- Users can delete their submissions at any time
- Option to hide company names
- Control over what information is shared
- Anonymous contact system for support
- Ability to disable account without data loss

### Compliance
- KVKK (Turkish Data Protection Law) compliant
- Transparent data handling practices
- Clear privacy policy
- Regular privacy impact assessments
- Minimal data collection principle

## Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/ali-gunes/transparent-labour.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or feedback, please use our anonymous contact form on the platform or reach out through GitHub issues.
