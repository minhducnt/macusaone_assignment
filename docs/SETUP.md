# 🚀 Setup Guide

Complete setup instructions for the MERN Authentication System.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js**: Version 18.0 or higher
- **MongoDB**: Version 5.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: For version control

### Optional (for production)
- **PM2**: Process manager for production
- **OpenLiteSpeed**: Web server for production deployment

## 🔧 Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mern-auth-system
```

### 2. Environment Variables

Create environment files for both backend and frontend.

#### Backend Environment (.env)

Create `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mern_auth_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Bcrypt Configuration
BCRYPT_ROUNDS=12
```

#### Frontend Environment (.env.local)

Create `frontend/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Next.js Configuration
NEXT_PUBLIC_APP_NAME=MERN Auth System
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🗄️ Database Setup

### MongoDB Installation

#### Option 1: Local MongoDB Installation

**Windows:**
```bash
# Using Chocolatey
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community
```

**macOS:**
```bash
# Using Homebrew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

#### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### Database Initialization

MongoDB will automatically create the database and collections when you first run the application.

## ⚙️ Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start MongoDB service:**
   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will be available at: http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at: http://localhost:3000

## 🔍 Verification

### Check Backend
1. Visit: http://localhost:5000/api/auth/status
2. Should return: `{"message": "Auth status endpoint"}`

### Check Frontend
1. Visit: http://localhost:3000
2. Should show the application landing page

## 🧪 Testing the Application

### 1. Create Admin User
Since there's no initial admin user, you'll need to register a user and manually set their role to 'admin' in MongoDB.

**Using MongoDB Compass:**
1. Connect to your MongoDB instance
2. Navigate to your database (mern_auth_db)
3. Find the `users` collection
4. Edit a user document and change the `role` field to "admin"

**Using MongoDB Shell:**
```bash
mongo
use mern_auth_db
db.users.updateOne({email: "your-admin-email@example.com"}, {$set: {role: "admin"}})
```

### 2. Test Authentication Flow
1. Visit http://localhost:3000
2. Click "Register" and create a new account
3. Login with your credentials
4. Verify role-based access to different dashboards

## 🚀 Production Deployment

### Backend Deployment

1. **Build for production:**
   ```bash
   cd backend
   npm run build
   ```

2. **Using PM2 (recommended):**
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name "mern-backend"
   pm2 save
   pm2 startup
   ```

### Frontend Deployment

1. **Build for production:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

### OpenLiteSpeed Configuration

The project includes OpenLiteSpeed configuration files:
- `openlitespeed-config/httpd_config.conf` - Main server configuration
- `openlitespeed-config/vhconf.conf` - Virtual host configuration

## 🐳 Docker Setup (Optional)

### Using Docker Compose

Create `docker-compose.yml` in the root directory:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:5.0
    container_name: mern-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    container_name: mern-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017/mern_auth_db?authSource=admin
      JWT_SECRET: your-super-secret-jwt-key-change-this-in-production
      NODE_ENV: production
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: mern-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:5000/api
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Running with Docker

```bash
docker-compose up -d
```

## 🔧 Troubleshooting

### Common Issues

#### Backend won't start
- Check if MongoDB is running
- Verify environment variables in `backend/.env`
- Check if port 5000 is available

#### Frontend shows API errors
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Verify CORS settings

#### Database connection fails
- Check MongoDB connection string
- Ensure MongoDB service is running
- Verify database credentials

#### Build fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Next.js cache: `cd frontend && rm -rf .next`
- Check TypeScript errors: `npm run type-check`

### Port Conflicts

If ports 3000 or 5000 are in use:

**Change backend port:**
```env
PORT=5001
```

**Change frontend port:**
```bash
npm run dev -- -p 3001
```

**Update frontend environment:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 📊 Monitoring & Logs

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
```

### Application Logs
- Backend logs: Check PM2 logs or `backend/logs/`
- Frontend logs: Browser developer console

## 🎯 Next Steps

After successful setup:

1. **Explore the codebase** - Review the atomic design structure
2. **Add features** - Implement role-specific functionality
3. **Write tests** - Add unit and integration tests
4. **Deploy to production** - Set up CI/CD pipeline
5. **Add monitoring** - Implement logging and error tracking

## 📞 Support

If you encounter issues:
1. Check this documentation
2. Review the [Architecture Guide](ARCHITECTURE.md)
3. Check GitHub Issues for similar problems
4. Create a new issue with detailed information

Happy coding! 🚀
