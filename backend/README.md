# MERN Backend - Complete API Solution

A comprehensive Node.js/Express backend for **MERN** stack applications with advanced features including authentication, file uploads, caching, monitoring, and database migrations.

## Architecture

This backend is built using **Clean Architecture** principles, providing excellent maintainability, testability, and scalability:

### **Clean Architecture Layers**
```
src/
├── domain/                    # Business Logic Layer
│   ├── entities/              # Domain Entities (User, File)
│   ├── repositories/          # Repository Interfaces (contracts)
│   └── value-objects/         # Value Objects (Email, Password)
├── application/               # Application Layer
│   ├── dto/                   # Data Transfer Objects
│   └── use-cases/             # Use Cases / Application Services
├── infrastructure/            # Infrastructure Layer
│   ├── controllers/           # HTTP Controllers
│   ├── routes/                # Route Definitions
│   ├── middleware/            # HTTP Middleware
│   └── repositories/          # Repository Implementations
└── shared/                    # Shared Kernel
    ├── kernel/                # Cross-cutting concerns
    └── services/              # Shared Services
```

### **Benefits**
- **Dependency Inversion**: Domain doesn't depend on frameworks
- **Testability**: Each layer can be unit tested independently
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add features without affecting existing code
- **Technology Agnostic**: Business logic is framework-independent

## Features

### Core Features
- **RESTful API** with versioning (`/api/v1/`)
- **JWT Authentication** with role-based authorization
- **Email Verification** and password reset flows
- **File Upload** with local/S3 storage support
- **Redis Caching** for performance optimization
- **API Monitoring** and metrics collection
- **Database Migrations** and seeding
- **Swagger Documentation** for all endpoints

### Security Features
- Rate limiting and DDoS protection
- Input validation and sanitization
- CSRF protection
- Helmet security headers
- Correlation ID tracking
- Secure password hashing (bcrypt)

## Prerequisites

- Node.js 18+
- MongoDB
- Redis (optional, for caching)
- AWS S3 account (optional, for cloud file storage)

## Installation

```bash
# Install dependencies
npm install

# Configure environment (optional - uses env/development.env by default)
# Edit env/development.env with your settings if needed
```

**Note for Windows PowerShell users:** This project uses `cross-env` to ensure cross-platform compatibility for environment variables. All npm scripts are configured to work on Windows, macOS, and Linux.

## Project Structure

```
backend/
├── src/                          # Clean Architecture source code
│   ├── domain/                   # Business Logic Layer
│   │   ├── entities/             # Domain Entities
│   │   ├── repositories/         # Repository Interfaces
│   │   └── value-objects/        # Value Objects
│   ├── application/              # Application Layer
│   │   ├── dto/                  # Data Transfer Objects
│   │   └── use-cases/            # Use Cases / Application Services
│   ├── infrastructure/           # Infrastructure Layer
│   │   ├── config/               # Configuration files
│   │   ├── controllers/          # HTTP Controllers
│   │   ├── models/               # MongoDB models
│   │   ├── routes/               # Route Definitions
│   │   ├── middleware/           # HTTP Middleware
│   │   └── repositories/         # Repository Implementations
│   └── shared/                   # Shared Kernel
│       ├── kernel/               # Dependency Injection
│       ├── services/             # Shared Services
│       └── utils/                # Utility functions
├── middleware/                   # HTTP middleware (shared, root level)
├── scripts/                      # Database scripts (root level)
├── migrations/                   # Database migrations (root level)
├── seeds/                        # Database seeds (root level)
├── env/                          # Environment files (root level)
├── server.js                     # Main server file
├── package.json                  # Dependencies & scripts
└── README.md                     # This file
```

## Environment Configuration

The application supports **multiple environments** with dedicated configuration files:

### **Environment Files Structure**
```
env/
├── development.env    # Local development
├── staging.env        # Staging/testing environment
└── production.env     # Production deployment
```

### **Quick Setup**

1. **Choose your environment:**
   ```bash
   # Development (default)
   NODE_ENV=development npm run dev

   # Staging
   NODE_ENV=staging npm run dev:staging

   # Production
   NODE_ENV=production npm start
   ```

2. **Configure environment variables** in the appropriate `env/*.env` file

### **Environment Structure**

```
env/
├── development.env    # Local development
├── staging.env        # Testing/staging environment
└── production.env     # Production deployment
```

### **Environment Variables by Environment**

#### **Development** (`env/development.env`)
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/mern_auth_dev
EMAIL_SERVICE=mailhog
EMAIL_HOST=localhost
EMAIL_PORT=1025
UPLOAD_STORAGE=local
REDIS_ENABLED=false
```

#### **Staging** (`env/staging.env`)
```env
NODE_ENV=staging
PORT=5000
CLIENT_URL=https://staging.yourdomain.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mern_auth_staging
EMAIL_SERVICE=gmail
UPLOAD_STORAGE=local
REDIS_ENABLED=true
```

#### **Production** (`env/production.env`)
```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://yourdomain.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mern_auth_prod
EMAIL_SERVICE=gmail
UPLOAD_STORAGE=s3
REDIS_ENABLED=true
```

### **Environment-Specific Commands**

```bash
# Development (default)
npm run dev

# Staging
npm run dev:staging

# Production (simulated)
npm run dev:prod

# Database commands by environment
npm run migrate              # Development
npm run migrate:staging      # Staging
npm run migrate:prod         # Production
```

### **Docker Environment Setup**

```bash
# Development with all services
NODE_ENV=development docker-compose up

# Production deployment
NODE_ENV=production docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Staging deployment
NODE_ENV=staging docker-compose up -d
```

## Getting Started

### 1. Start Development Services

```bash
# Start MailHog (email testing)
docker-compose up mailhog

# Start MongoDB (optional)
docker-compose up mongodb

# Start Redis (optional)
docker-compose up redis
```

### 2. Run Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
npm run db:status

# Rollback last migration
npm run migrate:rollback

# Run seed data
npm run seed
```

### 3. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### Swagger UI
Access interactive API documentation at: `http://localhost:5000/api-docs`

### Health Check
```bash
GET /api/v1/health
```

### Authentication Endpoints

#### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```

#### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```

#### Email Verification
```bash
POST /api/v1/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-here"
}
```

#### Password Reset
```bash
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-here",
  "password": "NewStrongPass123!"
}
```

### File Upload Endpoints

#### Upload Single File
```bash
POST /api/v1/files/upload
Content-Type: multipart/form-data

# Form data: file, category (optional), isPublic (optional), metadata (optional JSON)
```

#### Upload Multiple Files
```bash
POST /api/v1/files/upload-multiple
Content-Type: multipart/form-data

# Form data: files[], category (optional), isPublic (optional)
```

#### List Files
```bash
GET /api/v1/files?page=1&limit=10&category=profile&search=document.pdf
```

### Admin Endpoints (Require Admin Role)

#### User Management
```bash
GET /api/v1/users                    # List all users
GET /api/v1/users/:id               # Get user details
PUT /api/v1/users/:id               # Update user
DELETE /api/v1/users/:id            # Delete user
GET /api/v1/users/stats             # User statistics
```

#### System Management
```bash
GET /api/v1/metrics                 # API metrics
POST /api/v1/metrics/reset          # Reset metrics
GET /api/v1/cache/stats             # Cache statistics
DELETE /api/v1/cache                # Clear cache
```

## Email Testing with MailHog

MailHog provides a local SMTP server and web interface for testing emails:

1. **Start MailHog**: `docker-compose up mailhog`
2. **Web Interface**: Visit `http://localhost:8025`
3. **SMTP Server**: Available at `localhost:1025`
4. **View Emails**: All sent emails appear in the web interface

## Database Migrations

### Creating Migrations
```bash
# Create a new migration file
# backend/migrations/003_your_migration_name.js

export const up = async () => {
  // Migration logic here
};

export const down = async () => {
  // Rollback logic here
};
```

### Creating Seeds
```bash
# Create a new seed file
# backend/seeds/002_your_seed_name.js

export const run = async () => {
  // Seed data logic here
};
```

## Monitoring & Metrics

The API includes built-in monitoring:

- **Response Times**: Average, median, P95, P99
- **Error Rates**: Overall and per-endpoint
- **Request Counts**: Total and per-endpoint
- **Cache Performance**: Hit rates and Redis stats

Access metrics at `/api/v1/metrics` (admin only).

## File Storage Options

### Local Storage (Default)
- Files stored in `./uploads` directory
- Served via `/uploads/` static route
- Good for development and small applications
- **No additional dependencies required**

### AWS S3 Storage (Optional)
To enable S3 storage, install additional dependencies and configure:

```bash
npm install aws-sdk multer-s3
```

Then set environment variables:
```env
UPLOAD_STORAGE=s3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

**Benefits:**
- Scalable cloud storage
- CDN integration ready
- Automatic file management

## User Roles & Permissions

- **admin**: Full system access, user management, system monitoring
- **manager**: Extended permissions for team management
- **staff**: Standard user permissions

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
REDIS_ENABLED=true
EMAIL_SERVICE=gmail
UPLOAD_STORAGE=s3
```

### Docker Deployment
```bash
docker build -t mern-backend .
docker run -p 5000:5000 mern-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Run migrations and tests
4. Submit a pull request


## Support

For issues and questions:
- Check the Swagger documentation
- Review server logs with correlation IDs
- Test with MailHog for email issues