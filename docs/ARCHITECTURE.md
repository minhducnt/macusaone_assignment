# 🏗️ System Architecture

Comprehensive overview of the MERN Authentication System architecture, design patterns, and technical decisions.

## 🏛️ High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js Frontend]
        A1[React Components]
        A2[TypeScript]
        A3[Tailwind CSS]
    end

    subgraph "API Layer"
        B[Next.js API Routes]
        C[Express.js Backend]
        C1[RESTful APIs]
        C2[Middleware]
    end

    subgraph "Data Layer"
        D[MongoDB]
        D1[Mongoose ODM]
        D2[User Model]
        D3[JWT Tokens]
    end

    subgraph "Infrastructure"
        E[OpenLiteSpeed]
        F[Docker]
        G[PM2]
    end

    A --> B
    A --> C
    B --> D
    C --> D
    C --> E
    E --> F
    G --> C
    G --> A

    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#fff3e0
```

## 🏗️ Detailed Architecture

### Frontend Architecture (Next.js 15)

```mermaid
graph TD
    subgraph "Next.js App Router"
        App[app/]
        Layout[layout.tsx]
        PageRoot[page.tsx]
        AuthPages[login/ register/ dashboard/ profile/]
        APIRoutes[api/auth/ api/user/]
    end

    subgraph "Components (Atomic Design)"
        Atoms[atoms/ - Button, Input, Card, Badge]
        Molecules[forms/ - LoginForm, RegisterForm]
        Organisms[organisms/ - DashboardHeader]
        Providers[providers/ - ClientProviders]
    end

    subgraph "Core Systems"
        Context[contexts/ - AuthContext]
        Lib[lib/ - utils.ts]
        Middleware[middleware.ts]
    end

    subgraph "External Libraries"
        Radix[Radix UI]
        Tailwind[Tailwind CSS]
        ReactHook[React Hook Form]
        Zod[Zod Validation]
        Axios[Axios HTTP Client]
    end

    Layout --> Atoms
    Layout --> Providers
    AuthPages --> Molecules
    AuthPages --> Organisms
    AuthPages --> Context
    APIRoutes --> Lib
    Molecules --> Atoms
    Organisms --> Atoms
    Organisms --> Molecules
    Providers --> Context
    Context --> Axios
    Molecules --> ReactHook
    Molecules --> Zod

    style App fill:#e3f2fd
    style Atoms fill:#f3e5f5
    style Context fill:#e8f5e8
    style Radix fill:#fff3e0
```

### Backend Architecture (Express.js)

```mermaid
graph TD
    subgraph "Express Server"
        Server[server.js]
        Config[config/]
        Routes[routes/]
        Controllers[controllers/]
        Models[models/]
        Middleware[middleware/]
    end

    subgraph "Security Layer"
        AuthMW[auth.js - JWT Validation]
        CorsMW[cors.js - CORS]
        RateLimit[rateLimit.js - Rate Limiting]
        Helmet[helmet.js - Security Headers]
        ErrorHandler[errorHandler.js - Error Handling]
    end

    subgraph "Data Access"
        UserModel[User.js - Mongoose Schema]
        MongoDB[(MongoDB)]
    end

    subgraph "External Services"
        JWT[jwt - Token Generation]
        Bcrypt[bcryptjs - Password Hashing]
        Validator[express-validator - Input Validation]
    end

    Server --> Config
    Server --> Routes
    Server --> Middleware
    Routes --> Controllers
    Controllers --> Models
    Controllers --> AuthMW
    Models --> MongoDB
    Server --> AuthMW
    Server --> CorsMW
    Server --> RateLimit
    Server --> Helmet
    Server --> ErrorHandler
    AuthMW --> JWT
    Controllers --> Bcrypt
    Controllers --> Validator

    style Server fill:#e3f2fd
    style Security fill:#ffebee
    style MongoDB fill:#e8f5e8
```

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Next.js)
    participant A as AuthContext
    participant B as Backend API
    participant M as MongoDB
    participant J as JWT Service

    U->>F: Visit Protected Route
    F->>A: Check Authentication
    A->>A: Read Token from Cookies
    A->>B: Validate Token (/api/auth/status)
    B->>J: Verify JWT Token
    J->>B: Token Valid/Invalid
    B->>A: User Data / Error
    A->>F: Authentication State
    F->>U: Render Protected Content / Redirect

    U->>F: Submit Login Form
    F->>A: Login Request
    A->>B: POST /api/auth/login
    B->>M: Find User by Email
    M->>B: User Data
    B->>B: Verify Password (bcrypt)
    B->>J: Generate JWT Token
    J->>B: Signed Token
    B->>A: Token + User Data
    A->>A: Store in Cookies
    A->>F: Login Success
    F->>U: Redirect to Dashboard
```

## 🎨 Component Architecture (Atomic Design)

```mermaid
stateDiagram-v2
    [*] --> Atoms: Basic UI Components
    Atoms --> Molecules: Combine Atoms
    Molecules --> Organisms: Complex Combinations
    Organisms --> Templates: Page Layouts
    Templates --> Pages: Specific Pages

    state Atoms as "Atoms\n• Button\n• Input\n• Card\n• Badge\n• Label"
    state Molecules as "Molecules\n• LoginForm\n• RegisterForm\n• Form Fields"
    state Organisms as "Organisms\n• DashboardHeader\n• Navigation\n• Data Tables"
    state Templates as "Templates\n• Auth Layout\n• Dashboard Layout\n• Profile Layout"
    state Pages as "Pages\n• /login\n• /dashboard\n• /profile"

    note right of Pages : Final Implementation
    note right of Templates : Reusable Layouts
    note right of Organisms : Complex Components
    note right of Molecules : Functional Groups
    note right of Atoms : Basic Elements
```

## 🗂️ Data Flow Architecture

```mermaid
graph LR
    subgraph "User Interface"
        UI[React Components]
        Forms[Form Components]
        State[Component State]
    end

    subgraph "State Management"
        Context[AuthContext]
        Cookies[(Browser Cookies)]
    end

    subgraph "API Communication"
        Axios[HTTP Client]
        API[API Routes]
    end

    subgraph "Business Logic"
        Controllers[Express Controllers]
        Services[Business Services]
        Validation[Input Validation]
    end

    subgraph "Data Persistence"
        Models[Mongoose Models]
        DB[(MongoDB)]
    end

    UI --> Forms
    Forms --> State
    State --> Context
    Context --> Cookies
    Context --> Axios
    Axios --> API
    API --> Controllers
    Controllers --> Services
    Services --> Validation
    Controllers --> Models
    Models --> DB

    style UI fill:#e3f2fd
    style Context fill:#f3e5f5
    style Controllers fill:#e8f5e8
    style DB fill:#fff3e0
```

## 🔄 Request-Response Flow

```mermaid
graph TD
    subgraph "Client Request"
        RQ1[HTTP Request]
        RQ2[Headers: Authorization]
        RQ3[Body: JSON Data]
        RQ4[Cookies: JWT Token]
    end

    subgraph "Middleware Pipeline"
        MW1[CORS Middleware]
        MW2[Rate Limiting]
        MW3[Security Headers]
        MW4[Authentication Check]
        MW5[Input Validation]
    end

    subgraph "Route Handler"
        RH1[Parse Request]
        RH2[Business Logic]
        RH3[Database Operations]
        RH4[Response Formatting]
    end

    subgraph "Client Response"
        RS1[HTTP Response]
        RS2[Status Code]
        RS3[JSON Data]
        RS4[Set-Cookie Header]
    end

    RQ1 --> MW1
    MW1 --> MW2
    MW2 --> MW3
    MW3 --> MW4
    MW4 --> MW5
    MW5 --> RH1
    RH1 --> RH2
    RH2 --> RH3
    RH3 --> RH4
    RH4 --> RS1
    RS1 --> RS2
    RS1 --> RS3
    RS1 --> RS4

    style RQ1 fill:#e3f2fd
    style MW1 fill:#fff3e0
    style RH1 fill:#e8f5e8
    style RS1 fill:#f3e5f5
```

## 🗃️ Database Schema

```mermaid
erDiagram
    User {
        string id PK
        string name
        string email UK
        string password
        string role "admin|manager|staff"
        boolean isActive
        date createdAt
        date lastLogin
        date updatedAt
    }

    User ||--o{ User : "manages (admin only)"
    User ||--o{ User : "supervises (manager only)"
```

## 🔒 Security Architecture

```mermaid
graph TD
    subgraph "Client Security"
        CS1[JWT in HttpOnly Cookies]
        CS2[CORS Protection]
        CS3[Input Sanitization]
        CS4[CSRF Protection]
    end

    subgraph "Server Security"
        SS1[JWT Token Validation]
        SS2[Password Hashing (bcrypt)]
        SS3[Rate Limiting]
        SS4[Security Headers (Helmet)]
        SS5[Input Validation]
        SS6[SQL Injection Prevention]
    end

    subgraph "Data Security"
        DS1[MongoDB Injection Prevention]
        DS2[Data Encryption at Rest]
        DS3[Secure Password Storage]
        DS4[Audit Logging]
    end

    subgraph "Infrastructure Security"
        IS1[Environment Variables]
        IS2[HTTPS Only]
        IS3[Firewall Configuration]
        IS4[Regular Security Updates]
    end

    CS1 --> SS1
    CS2 --> SS2
    CS3 --> SS5
    SS1 --> DS1
    SS2 --> DS3
    SS3 --> IS1
    SS4 --> IS2

    style CS1 fill:#e3f2fd
    style SS1 fill:#ffebee
    style DS1 fill:#e8f5e8
    style IS1 fill:#fff3e0
```

## 📊 Performance Architecture

```mermaid
graph TD
    subgraph "Frontend Performance"
        FP1[Next.js SSR/SSG]
        FP2[Code Splitting]
        FP3[Image Optimization]
        FP4[Bundle Analysis]
        FP5[Caching Strategies]
    end

    subgraph "Backend Performance"
        BP1[Express Clustering]
        BP2[Database Indexing]
        BP3[Query Optimization]
        BP4[Redis Caching]
        BP5[Load Balancing]
    end

    subgraph "Database Performance"
        DP1[MongoDB Indexing]
        DP2[Connection Pooling]
        DP3[Query Optimization]
        DP4[Read Replicas]
        DP5[Sharding Strategy]
    end

    subgraph "CDN & Edge"
        CE1[Static Asset CDN]
        CE2[API Edge Functions]
        CE3[Global Distribution]
        CE4[Edge Caching]
    end

    FP1 --> BP1
    BP1 --> DP1
    DP1 --> CE1
    FP2 --> CE2

    style FP1 fill:#e3f2fd
    style BP1 fill:#f3e5f5
    style DP1 fill:#e8f5e8
    style CE1 fill:#fff3e0
```

## 🚀 Deployment Architecture

```mermaid
graph TD
    subgraph "Development"
        DEV[Local Development]
        DEV1[Hot Reload]
        DEV2[Dev Databases]
        DEV3[Debug Tools]
    end

    subgraph "Staging"
        STG[Staging Environment]
        STG1[Automated Tests]
        STG2[Integration Testing]
        STG3[Performance Testing]
    end

    subgraph "Production"
        PROD[Production Environment]
        PROD1[Load Balancer]
        PROD2[Web Server]
        PROD3[Application Server]
        PROD4[Database Cluster]
        PROD5[CDN]
        PROD6[Monitoring]
    end

    subgraph "Infrastructure"
        INF[Cloud Provider]
        INF1[VPC]
        INF2[Security Groups]
        INF3[Auto Scaling]
        INF4[Backup Systems]
    end

    DEV --> STG
    STG --> PROD
    PROD --> INF

    style DEV fill:#e3f2fd
    style STG fill:#fff3e0
    style PROD fill:#e8f5e8
    style INF fill:#f3e5f5
```

## 🎯 Design Patterns Used

### Frontend Patterns
- **Atomic Design**: Component composition hierarchy
- **Container/Presentational**: Separation of logic and presentation
- **Custom Hooks**: Reusable stateful logic
- **Compound Components**: Related component groups

### Backend Patterns
- **MVC Architecture**: Model-View-Controller separation
- **Middleware Chain**: Request processing pipeline
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Modular service architecture

### Security Patterns
- **JWT Token Authentication**: Stateless authentication
- **Role-Based Access Control**: Permission-based authorization
- **Input Validation**: Request sanitization
- **Error Handling**: Centralized error management

## 🔧 Configuration Architecture

```mermaid
graph TD
    subgraph "Environment Variables"
        ENV1[NODE_ENV]
        ENV2[MONGODB_URI]
        ENV3[JWT_SECRET]
        ENV4[PORT]
        ENV5[API_URL]
    end

    subgraph "Configuration Files"
        CFG1[database.js]
        CFG2[config.js]
        CFG3[next.config.ts]
        CFG4[tailwind.config.js]
    end

    subgraph "Runtime Configuration"
        RTC1[Process Environment]
        RTC2[Build-time Constants]
        RTC3[Dynamic Imports]
    end

    ENV1 --> CFG1
    ENV2 --> CFG2
    ENV3 --> CFG1
    CFG1 --> RTC1
    CFG2 --> RTC1
    CFG3 --> RTC2
    RTC1 --> RTC3

    style ENV1 fill:#e3f2fd
    style CFG1 fill:#f3e5f5
    style RTC1 fill:#e8f5e8
```

## 📈 Scalability Considerations

### Horizontal Scaling
- **Stateless Design**: No server-side sessions
- **Database Sharding**: MongoDB sharding for large datasets
- **Load Balancing**: Multiple application instances
- **CDN Integration**: Static asset distribution

### Vertical Scaling
- **Database Optimization**: Indexing and query optimization
- **Caching Layer**: Redis for frequently accessed data
- **Background Jobs**: Queue system for heavy operations
- **Microservices**: Service decomposition for complex features

### Monitoring & Observability
- **Application Metrics**: Response times, error rates
- **Infrastructure Monitoring**: CPU, memory, disk usage
- **Log Aggregation**: Centralized logging system
- **Alerting**: Automated incident response

## 🔄 CI/CD Pipeline Architecture

```mermaid
graph LR
    subgraph "Source Control"
        GIT[Git Repository]
        PR[Pull Requests]
    end

    subgraph "Build Pipeline"
        CI[Continuous Integration]
        CI1[Lint & Test]
        CI2[Build Artifacts]
        CI3[Security Scan]
    end

    subgraph "Deployment Pipeline"
        CD[Continuous Deployment]
        CD1[Staging Deploy]
        CD2[Integration Tests]
        CD3[Production Deploy]
        CD4[Rollback Plan]
    end

    subgraph "Monitoring"
        MON[Production Monitoring]
        MON1[Health Checks]
        MON2[Performance Metrics]
        MON3[Error Tracking]
    end

    GIT --> CI
    PR --> CI
    CI --> CI1
    CI1 --> CI2
    CI2 --> CI3
    CI3 --> CD
    CD --> CD1
    CD1 --> CD2
    CD2 --> CD3
    CD3 --> MON
    MON --> CD4

    style GIT fill:#e3f2fd
    style CI fill:#fff3e0
    style CD fill:#e8f5e8
    style MON fill:#ffebee
```

This architecture provides a solid foundation for a scalable, secure, and maintainable MERN authentication system with clear separation of concerns and modern development practices.
