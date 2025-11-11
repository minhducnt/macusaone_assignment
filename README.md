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
- **Next.js 16** with TypeScript and App Router
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** for components
- **Shadcn UI** for component library
- **React Hook Form** with Zod for form validation
- **Next.js App Router** with dynamic routes (`/dashboard/[role]`, `/api/user/[id]`)
- **Server Components** for better performance and SEO
- **Middleware** for authentication and route protection
- **API Routes** for server-side functionality
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
mern-auth-app/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database and configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication and error handling
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   │   ├── api/       # API Routes
│   │   │   │   ├── auth/  # Authentication API routes
│   │   │   │   └── user/  # User API routes with dynamic [id]
│   │   │   ├── login/     # Login page
│   │   │   ├── register/  # Register page
│   │   │   ├── dashboard/ # Protected dashboard
│   │   │   │   └── [role]/ # Dynamic role-based routes
│   │   │   ├── profile/   # Server component profile page
│   │   │   ├── layout.tsx # Root layout
│   │   │   ├── page.tsx   # Home page with redirects
│   │   │   └── globals.css # Tailwind styles
│   │   ├── components/    # Reusable UI components (Shadcn UI)
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # Utilities
│   │   └── middleware.ts  # Next.js middleware
│   └── public/            # Static assets
├── openlitespeed-config/   # OpenLiteSpeed configuration
└── README.md
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