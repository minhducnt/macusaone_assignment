# MERN Authentication Frontend

A modern, scalable frontend application built with Next.js 14+ and TypeScript, featuring Clean Architecture principles.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with the following structure:

```
src/
├── domain/          # Business Logic Layer
├── application/     # Application Logic Layer
├── infrastructure/  # External Concerns Layer
├── presentation/    # UI Layer
└── shared/         # Shared Utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Backend server running on port 5000

### Installation

1. **Clone and install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. **Set up environment variables:**
```bash
# Copy the environment example
cp env.example .env.local

# Or create environment-specific files:
cp env.example .env.development  # For development
cp env.example .env.staging     # For staging
cp env.example .env.production  # For production

# Edit with your configuration
# Note: .env.local is for local development and is not committed to git
```

3. **Start the development server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Configuration

### Environment Files

The application supports multiple environment configurations:

- **`.env.local`** - Local development (highest priority, not committed)
- **`.env.development`** - Development environment
- **`.env.staging`** - Staging environment
- **`.env.production`** - Production environment

### Environment Variables

#### Required Variables

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Optional Variables

```bash
# Application Configuration
NEXT_PUBLIC_APP_NAME="MERN Auth App"
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_DEFAULT_THEME=dark

# Feature Flags
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true

# External Services
NEXT_PUBLIC_GA_TRACKING_ID=
NEXT_PUBLIC_SENTRY_DSN=

# Security Settings
NEXT_PUBLIC_SESSION_TIMEOUT=1440
NEXT_PUBLIC_MAX_LOGIN_ATTEMPTS=5
NEXT_PUBLIC_LOCKOUT_DURATION=15

# UI Configuration
NEXT_PUBLIC_TOAST_DURATION=5000
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
```

### Environment-Specific Configurations

#### Development (`.env.development`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

#### Staging (`.env.staging`)
```bash
NEXT_PUBLIC_API_URL=https://api-staging.yourdomain.com/api
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

#### Production (`.env.production`)
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── domain/                 # Business entities & rules
│   ├── entities/          # Domain models
│   ├── repositories/      # Repository interfaces
│   └── services/          # Domain services
├── application/           # Application use cases
│   ├── use-cases/         # Application logic
│   └── services/          # Application services
├── infrastructure/        # External concerns
│   ├── api/              # HTTP client & API services
│   ├── repositories/     # Repository implementations
│   └── storage/          # Local storage utilities
├── presentation/          # UI Layer
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   └── pages/            # Page components
└── shared/               # Shared utilities
    ├── constants/        # App constants
    ├── types/            # TypeScript types
    └── utils/            # Utility functions
```

## 🔧 Available Scripts

### Development
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript compiler check
```

### Testing
```bash
npm run test       # Run tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Code Quality
```bash
npm run lint       # Check code style
npm run lint:fix   # Fix code style issues
npm run format     # Format code with Prettier
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run e2e tests (if configured)
npm run test:e2e
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Variables for Deployment
Make sure to set these in your deployment platform:

- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `NEXT_PUBLIC_APP_ENV` - Environment (production)
- `NEXT_PUBLIC_SENTRY_DSN` - Error reporting (optional)

## 🔒 Security

This application implements several security measures:

- **CSRF Protection** - Server-side validation
- **Rate Limiting** - API request throttling
- **Input Sanitization** - XSS prevention
- **JWT Authentication** - Secure token-based auth
- **HTTPS Only** - Secure connections in production

## 📊 Monitoring & Analytics

### Error Reporting
Configure Sentry for error tracking:
```bash
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

### Analytics
Configure Google Analytics:
```bash
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_tracking_id_here
```

## 🛠️ Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Follow Clean Architecture principles

### Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation update
style: code style changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

### Branch Naming
```
feature/feature-name
bugfix/bug-description
hotfix/critical-fix
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, please contact the development team or create an issue in the repository.

---

Built with ❤️ using [Next.js](https://nextjs.org), [TypeScript](https://www.typescriptlang.org), and [Tailwind CSS](https://tailwindcss.com)
