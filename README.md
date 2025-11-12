# MERN Authentication App

A full-stack MERN (MongoDB, Express.js, React, Node.js) application with role-based authentication using clean architecture principles.

## ✨ Features

### **🔐 Authentication & Security**
- **Multi-level Authentication**: JWT tokens with email verification
- **Role-based Access Control**: Admin, Manager, and Staff permissions
- **Password Security**: bcrypt hashing with strength validation
- **Email Verification**: Secure user registration workflow
- **Password Recovery**: Token-based password reset system
- **Advanced Security**: Rate limiting, CORS, Helmet headers, input sanitization

### **👥 User Management**
- **Admin Dashboard**: Complete user CRUD operations
- **User Analytics**: Statistics and reporting
- **Profile Management**: User profile updates and settings
- **Account Controls**: User activation/deactivation

### **📁 File Management**
- **Multi-format Upload**: Images, documents, and media files
- **Dual Storage**: Local filesystem + AWS S3 cloud storage
- **File Organization**: Categories and metadata management
- **Access Control**: Private/public file permissions

### **📊 System Monitoring**
- **Real-time Metrics**: API performance and error tracking
- **Health Monitoring**: System health checks and alerts
- **Cache Analytics**: Redis performance statistics
- **Request Tracking**: Correlation IDs for debugging

### **🚀 Developer Experience**
- **Environment Management**: Development, staging, production configs
- **API Documentation**: Interactive Swagger UI documentation
- **Database Migrations**: Version-controlled schema updates
- **Docker Support**: Containerized development and deployment
- **Email Testing**: MailHog integration for development
- **Hot Reload**: Fast development with automatic reloading

### **🏗️ Architecture**
- **Clean Architecture**: Separation of concerns and modular design
- **API Versioning**: Future-proof API design with v1 implementation
- **Scalable Design**: Horizontal scaling support with Redis caching
- **Modern UI**: Next.js 15 with TypeScript, Tailwind CSS, Radix UI
- **Production Ready**: OpenLiteSpeed server configuration

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **helmet** and **cors** for security

### Frontend
- **Next.js 16.0.1** with TypeScript and App Router
- **React 19.2.0** with TypeScript
- **Tailwind CSS v4** for styling
- **Radix UI** for components
- **Shadcn UI** for component library
- **React Hook Form** with Zod for form validation
- **Recharts** for data visualization
- **Next.js App Router** with dynamic routes (`/dashboard/[role]`, `/api/user/[id]`)
- **Server Components** for better performance and SEO
- **Middleware** for authentication and route protection
- **Clean Architecture** with domain-driven design
- **Axios** for API calls

### Server
- **OpenLiteSpeed** for production deployment

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

### **📖 Core Documentation**
- **[`docs/SYSTEM-OVERVIEW.md`](docs/SYSTEM-OVERVIEW.md)** - Complete system architecture and overview
- **[`docs/API.md`](docs/API.md)** - Complete API reference with examples
- **[`docs/BACKEND.md`](docs/BACKEND.md)** - Backend implementation details
- **[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)** - System architecture and design patterns

### **🎨 Frontend Documentation**
- **[`docs/COMPONENTS.md`](docs/COMPONENTS.md)** - Component architecture and usage
- **[`docs/REQUIREMENT.md`](docs/REQUIREMENT.md)** - System requirements and setup

### **🚀 Development Guides**
- **[`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md)** - Development guidelines and best practices
- **[`docs/SETUP.md`](docs/SETUP.md)** - Detailed installation and setup guide

### **🔧 Quick Access**
- **API Documentation**: `http://localhost:5000/api-docs` (when running)
- **Email Testing**: `http://localhost:8025` (when running MailHog)

## Project Structure

```
macusaone/
├── backend/                          # Node.js/Express backend
│   ├── src/
│   │   ├── application/              # Application layer (use cases)
│   │   │   ├── dto/                  # Data transfer objects
│   │   │   └── use-cases/            # Business logic use cases
│   │   │       ├── auth/             # Authentication use cases
│   │   │       ├── files/            # File management use cases
│   │   │       └── users/            # User management use cases
│   │   ├── domain/                   # Domain layer (business rules)
│   │   │   ├── entities/             # Domain entities
│   │   │   ├── repositories/         # Repository interfaces
│   │   │   │   └── interfaces/       # Repository contracts
│   │   │   └── value-objects/        # Value objects
│   │   ├── infrastructure/           # Infrastructure layer
│   │   │   ├── config/               # Configuration files
│   │   │   ├── controllers/          # HTTP controllers
│   │   │   ├── middleware/           # Express middleware
│   │   │   ├── models/               # MongoDB models
│   │   │   ├── repositories/         # Repository implementations
│   │   │   ├── routes/               # API routes
│   │   │   └── services/             # External services
│   │   └── shared/                   # Shared utilities
│   │       ├── kernel/               # Dependency injection
│   │       └── services/             # Shared services
│   ├── migrations/                   # Database migrations
│   ├── seeds/                        # Database seeders
│   ├── scripts/                      # Utility scripts
│   ├── env/                          # Environment configurations
│   └── package.json                  # Backend dependencies
├── frontend/                         # Next.js frontend
│   ├── src/
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── dashboard/            # Protected dashboard routes
│   │   │   │   └── [role]/           # Dynamic role-based routes
│   │   │   ├── login/                # Login page
│   │   │   ├── register/             # Register page
│   │   │   ├── profile/              # Profile page
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── page.tsx              # Home page
│   │   │   └── globals.css           # Global styles
│   │   ├── domain/                   # Domain layer
│   │   │   ├── entities/             # Domain entities
│   │   │   ├── repositories/         # Repository interfaces
│   │   │   └── services/             # Domain services
│   │   ├── application/              # Application layer
│   │   │   └── use-cases/            # Application use cases
│   │   ├── infrastructure/           # Infrastructure layer
│   │   │   ├── api/                  # API client
│   │   │   ├── repositories/         # Repository implementations
│   │   │   └── storage/              # Local storage utilities
│   │   ├── presentation/             # Presentation layer
│   │   │   ├── components/           # React components
│   │   │   │   ├── atoms/            # Atomic components
│   │   │   │   ├── molecules/        # Molecular components
│   │   │   │   ├── organisms/        # Organism components
│   │   │   │   ├── pages/            # Page components
│   │   │   │   ├── providers/        # Context providers
│   │   │   │   └── templates/        # Layout templates
│   │   │   ├── contexts/             # React contexts
│   │   │   └── hooks/                # Custom hooks
│   │   └── shared/                   # Shared utilities
│   │       ├── constants/            # Application constants
│   │       ├── types/                # TypeScript types
│   │       └── utils/                # Utility functions
│   ├── public/                       # Static assets
│   └── package.json                  # Frontend dependencies
├── docs/                             # Documentation
│   ├── API.md                        # API documentation
│   ├── ARCHITECTURE.md               # Architecture documentation
│   ├── BACKEND.md                    # Backend documentation
│   ├── COMPONENTS.md                 # Component documentation
│   ├── DEVELOPMENT.md                # Development guide
│   ├── REQUIREMENT.md                # Requirements
│   ├── SETUP.md                      # Setup guide
│   └── SYSTEM-OVERVIEW.md           # System overview
├── openlitespeed-config/             # OpenLiteSpeed configuration
└── README.md                         # Main project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Update the MongoDB connection string and JWT secret

4. Start MongoDB service (if running locally)

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create `frontend/.env.local` with:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be running on `http://localhost:3000`

## Features

### Next.js Advanced Features
- **App Router**: Modern file-based routing with nested layouts
- **Middleware**: Server-side authentication checks and redirects
- **Server Components**: Profile page rendered on server for better performance
- **API Routes**: Built-in API endpoints (`/api/auth/status`, `/api/user/[id]`)
- **Dynamic Routes**: Role-based dashboards (`/dashboard/[role]`) and user profiles
- **Static Generation**: Pre-rendered role dashboard pages

### Dynamic Routes Examples
- `/dashboard/admin` - Admin-specific dashboard
- `/dashboard/manager` - Manager-specific dashboard
- `/dashboard/staff` - Staff-specific dashboard
- `/api/user/123` - User profile API with dynamic ID

## API Endpoints

### Backend API (Express)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### User Management (Backend)
- `GET /api/users` - Get users with pagination and filtering (Manager+)
- `POST /api/users` - Create new user (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID (Manager+)
- `GET /api/users/stats` - Get user statistics (Admin only)

### File Management (Backend)
- `GET /api/files` - Get files with pagination and filtering
- `POST /api/files` - Upload new file
- `GET /api/files/:id` - Get file metadata by ID
- `GET /api/files/:id/download` - Download file by ID
- `PUT /api/files/:id` - Update file metadata by ID
- `DELETE /api/files/:id` - Delete file by ID

### Frontend API Routes (Next.js)
- `GET /api/auth/status` - Check authentication status
- `GET /api/user/[id]` - Get user profile by ID (dynamic route)

### Request/Response Examples

#### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "staff"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "Password123"
}
```

## User Roles

- **Admin**: Full system access, user management
- **Manager**: Team management capabilities
- **Staff**: Basic user access

## OpenLiteSpeed Deployment

1. Install OpenLiteSpeed on your server
2. Copy the configuration files from `openlitespeed-config/` to your OLS config directory
3. Update the domain names and paths in the configuration
4. Build the frontend for production:
   ```bash
   cd frontend
   npm run build
   ```
5. Copy the built files to the appropriate directory
6. Restart OpenLiteSpeed

## Development

### Available Scripts

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- ESLint and Prettier for code formatting
- TypeScript for type safety
- Input validation on both client and server

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input sanitization and validation
- CORS protection
- Rate limiting
- Security headers (Helmet)
- XSS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.