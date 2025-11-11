# 💻 Development Guide

Developer-focused guide for working with the MERN Authentication System codebase.

## 🚀 Development Workflow

### Daily Development Setup

```bash
# 1. Start MongoDB
sudo systemctl start mongod
# or on macOS: brew services start mongodb-community

# 2. Backend development server
cd backend && npm run dev

# 3. Frontend development server (new terminal)
cd frontend && npm run dev

# 4. Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Code Quality Checks

```bash
# Backend linting
cd backend && npm run lint

# Frontend linting
cd frontend && npm run lint

# Type checking
cd frontend && npm run type-check

# Build check
cd frontend && npm run build
```

## 🏗️ Adding New Features

### 1. Backend API Endpoint

```bash
# Create new controller
touch backend/controllers/newFeatureController.js

# Add routes
# Edit backend/routes/newFeatureRoutes.js

# Update main routes
# Edit backend/server.js
```

**Controller Template:**
```javascript
const asyncHandler = require('express-async-handler');

// @desc    Description
// @route   METHOD /api/resource
// @access  Public/Private
const getResource = asyncHandler(async (req, res) => {
  // Implementation
});

module.exports = { getResource };
```

### 2. Frontend Component

#### Adding an Atom
```bash
# Create new atom
touch frontend/src/components/atoms/NewAtom.tsx
```

**Atom Template:**
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface NewAtomProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary';
}

const NewAtom = React.forwardRef<HTMLDivElement, NewAtomProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-styles",
          variant === 'secondary' && "secondary-styles",
          className
        )}
        {...props}
      />
    );
  }
);

NewAtom.displayName = "NewAtom";

export { NewAtom };
```

#### Adding a Molecule (Form)
```bash
# Create new form component
touch frontend/src/components/forms/NewForm.tsx
```

**Form Template:**
```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import { useToast } from '@/components/atoms/use-toast';

const formSchema = z.object({
  field: z.string().min(1, 'Field is required'),
});

type FormData = z.infer<typeof formSchema>;

export function NewForm() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // API call
      toast({
        title: 'Success',
        description: 'Operation completed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Form Title</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="field">Field Label</Label>
            <Input
              id="field"
              {...register('field')}
              disabled={isSubmitting}
            />
            {errors.field && (
              <p className="text-sm text-red-600">{errors.field.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### 3. Database Model

```bash
# Create new model
touch backend/models/NewModel.js
```

**Model Template:**
```javascript
const mongoose = require('mongoose');

const newModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for performance
newModelSchema.index({ name: 1 });

module.exports = mongoose.model('NewModel', newModelSchema);
```

## 🧪 Testing

### Backend Testing

```bash
# Run all tests
cd backend && npm test

# Run specific test file
npm test -- tests/auth.test.js

# Run with coverage
npm run test:coverage
```

**Test Template:**
```javascript
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('token');
    });
  });
});
```

### Frontend Testing

```bash
# Run all tests
cd frontend && npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- Button.test.tsx
```

**Component Test Template:**
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/atoms/button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🔒 Security Checklist

### Before Committing Code

- [ ] **Input Validation**: All user inputs validated
- [ ] **Authentication**: Protected routes require valid JWT
- [ ] **Authorization**: Role-based access control implemented
- [ ] **Passwords**: Never logged or stored in plain text
- [ ] **CORS**: Properly configured for allowed origins
- [ ] **Rate Limiting**: Applied to authentication endpoints
- [ ] **SQL Injection**: No raw database queries (use Mongoose)
- [ ] **XSS Prevention**: User input sanitized
- [ ] **CSRF Protection**: State-changing operations protected

### Environment Variables

```bash
# Check for sensitive data in code
grep -r "password\|secret\|key" --exclude-dir=node_modules .

# Verify environment variables are used
grep -r "process.env" --exclude-dir=node_modules .
```

## 🚀 Deployment

### Development Deployment

```bash
# Backend
cd backend
npm run build
npm run start:dev

# Frontend
cd frontend
npm run build
npm start
```

### Production Deployment

```bash
# Using PM2
cd backend
pm2 start dist/server.js --name "mern-backend"

cd frontend
pm2 start npm --name "mern-frontend" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Docker Deployment

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=3
```

## 🔍 Debugging

### Backend Debugging

```bash
# Run with debug logging
cd backend
DEBUG=* npm run dev

# Check MongoDB connection
mongosh
db.users.find()
```

### Frontend Debugging

```bash
# React DevTools
# Install React DevTools browser extension

# Next.js debugging
cd frontend
npm run dev -- --inspect

# Check network requests
# Use browser DevTools Network tab
```

### Common Issues

#### "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
cd frontend && rm -rf .next
```

#### Database connection issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Test connection
mongosh --eval "db.adminCommand('ping')"
```

#### Port conflicts
```bash
# Find process using port
lsof -i :5000
lsof -i :3000

# Kill process
kill -9 <PID>
```

## 📊 Performance Monitoring

### Backend Metrics

```javascript
// Add to server.js
const responseTime = require('response-time');
app.use(responseTime((req, res, time) => {
  console.log(`${req.method} ${req.url} took ${time} ms`);
}));
```

### Frontend Performance

```bash
# Bundle analyzer
cd frontend
npm install --save-dev @next/bundle-analyzer
npm run build:analyze
```

### Database Performance

```javascript
// Check slow queries
db.system.profile.find().sort({ ts: -1 }).limit(5);

// Add indexes
db.users.createIndex({ email: 1 });
db.users.createIndex({ role: 1 });
```

## 📚 Code Style Guidelines

### Naming Conventions

```javascript
// Files: kebab-case
user-controller.js
auth-middleware.js

// Functions: camelCase
getUserById()
validatePassword()

// Classes: PascalCase
UserController
AuthService

// Constants: UPPER_SNAKE_CASE
JWT_SECRET
PORT
```

### TypeScript Guidelines

```typescript
// Use interfaces for objects
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type aliases for unions
type UserRole = 'admin' | 'manager' | 'staff';

// Prefer const assertions
const roles = ['admin', 'manager', 'staff'] as const;
type Role = typeof roles[number];
```

### React Best Practices

```tsx
// Use functional components
const UserProfile = ({ user }: UserProfileProps) => {
  return <div>{user.name}</div>;
};

// Custom hooks for logic
const useUserProfile = (userId: string) => {
  // Logic here
};

// Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});
```

## 🔄 Git Workflow

### Branch Naming
```
feature/add-user-profile
bugfix/fix-login-validation
hotfix/security-patch
docs/update-api-docs
```

### Commit Messages
```
feat: add user profile page
fix: resolve login validation bug
docs: update API documentation
style: format code with prettier
refactor: simplify authentication logic
```

### Pull Request Process
1. Create feature branch from `main`
2. Make changes with tests
3. Run full test suite
4. Update documentation if needed
5. Create pull request with description
6. Code review and approval
7. Merge to main

This development guide should help you work effectively with the codebase while maintaining code quality and following best practices.
