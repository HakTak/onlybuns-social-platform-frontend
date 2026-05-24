# 🐇 OnlyBuns - Frontend

> **Already familiar with OnlyBuns?** If you've read the [Backend README](https://github.com/HakTak/onlybuns-social-platform-backend), jump directly to [Frontend Architecture & Technologies](#frontend-architecture--technologies).

---

## 📱 Project Overview

### OnlyBuns: High-Concurrency Social Platform | 2024

**Repository Links:** [Frontend](https://github.com/HakTak/onlybuns-social-platform-frontend) · [Backend](https://github.com/HakTak/onlybuns-social-platform-backend)

**Tech Stack:** `Java` `Spring Boot` `Angular` `PostgreSQL` `MongoDB` `RabbitMQ` `WebSockets` `Prometheus` `Grafana` `Docker`

OnlyBuns is a feature-complete social network built around **real distributed systems challenges**:

- **Bloom Filter** for O(1) username collision detection
- Database-level transaction handling for concurrent likes and follows
- Custom **rate limiter** and **load balancer** implemented from scratch
- Real-time group chat via WebSockets
- Location-based post discovery on interactive maps
- Fanout/direct message queues with RabbitMQ
- Full observability stack with Prometheus and Grafana

*Group project developed by 3 students.*

---

## Frontend Architecture & Technologies

### Core Stack
- **Framework:** Angular 16.2 with TypeScript
- **UI Components:** Angular Material 15 + Bootstrap 5
- **State Management:** RxJS 7.5
- **Real-time Communication:** STOMP (WebSocket protocol)
- **Maps:** Leaflet 1.9
- **Charting:** D3.js 7.9 + ngx-charts 21
- **Authentication:** JWT token handling
- **Build Tool:** Angular CLI 16.2

### Key Features

#### 🎨 User Interface
- **Responsive Design** - Mobile-first approach with Bootstrap and Angular Material
- **Interactive Maps** - Leaflet-based map view for location-based post discovery
- **Real-time Charts** - D3.js and ngx-charts for analytics visualization
- **Chat Interface** - Real-time messaging with WebSocket support

#### 💬 Real-Time Features
- **WebSocket Integration** - STOMP client for real-time group chats
- **Live Notifications** - Instant updates on likes, follows, comments
- **Presence Tracking** - Online/offline user status

#### 🔐 Security & Auth
- **JWT Authentication** - Secure token-based authentication
- **Route Guards** - Protected routes requiring authentication
- **Interceptors** - Automatic token injection and error handling
- **Refresh Token Handling** - Automatic token refresh on expiry

#### 📊 Analytics & Visualization
- **User Analytics** - Engagement tracking and statistics
- **Trending Content** - Real-time trend analysis
- **Performance Metrics** - System health visualization
- **Interactive Dashboards** - D3-based custom charts

#### 🗺️ Advanced Capabilities
- **Location-Based Discovery** - Find posts by geographic location
- **Dynamic Routing** - Feature-based module organization
- **Server-Side Rendering** - Angular Universal support for SSR
- **Offline Support** - Service Worker for offline functionality

### Project Structure

```
OnlyBuns/
├── src/
│   ├── app/
│   │   ├── advertise-posts/         # Featured/advertised content view
│   │   ├── all-chats/               # Chat list interface
│   │   ├── all-posts/               # Feed with all posts
│   │   ├── all-users/               # User discovery/directory
│   │   ├── analytics/               # Dashboard with charts
│   │   ├── card/                    # Reusable card component
│   │   ├── chat/                    # Real-time chat component (WebSocket)
│   │   ├── comment-form/            # Comment creation component
│   │   ├── confirm-delete-dialog/   # Delete confirmation modal
│   │   ├── guards/                  # Route guards (auth, role-based)
│   │   ├── header/                  # Navigation header
│   │   ├── home/                    # Landing/home page
│   │   ├── interceptor/             # HTTP interceptors (auth, error handling)
│   │   ├── login/                   # Login page
│   │   ├── map/                     # Main map component (Leaflet)
│   │   ├── map-post/                # Post view on map
│   │   ├── models/                  # TypeScript interfaces & types
│   │   ├── notification/            # Real-time notification service
│   │   ├── post-comments/           # Comments section for posts
│   │   ├── post-creation/           # Create new post component
│   │   ├── post-modification/       # Edit post component
│   │   ├── profile/                 # User profile view
│   │   ├── service/                 # Angular services (API calls)
│   │   ├── sign-up/                 # Registration page
│   │   ├── trends/                  # Trending topics view
│   │   ├── angular-material/        # Material configuration
│   │   ├── app-routing.module.ts    # Route definitions
│   │   └── app.module.ts            # Main module
│   ├── assets/                      # Static assets (images, fonts)
│   ├── environments/                # Environment configs (dev, prod)
│   └── styles.css                   # Global styles
├── public/                          # Static files (PWA, robots.txt)
├── angular.json                     # Angular CLI configuration
├── package.json                     # Dependencies & scripts
└── tsconfig.json                    # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 16+** and **npm 8+**
- **Angular CLI 16+**
- **Backend API** running on `http://localhost:8080`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HakTak/onlybuns-social-platform-frontend.git
   cd isa-OnlyBuns-fe-ra-2024/OnlyBuns
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   ```bash
   # Edit src/environments/environment.ts and environment.prod.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080'
   };
   ```

4. **Start development server**
   ```bash
   npm start
   # Or
   ng serve --open
   ```

5. **Access the application**
   - Application: `http://localhost:4200`
   - Hot reloading enabled for development

---

## 🏗️ Architecture Highlights

### Component-Based Architecture
- **Smart Components** - Container components handling data and logic
- **Dumb Components** - Presentational components for rendering
- **Lazy Loading** - Feature modules loaded on demand for better performance

### Service Layer
```
Components → Services → HTTP Interceptors → Backend API
```
- Centralized API calls in services
- Token injection via interceptors
- Error handling and retry logic
- Automatic JWT refresh

### Real-Time Communication
```
Angular Component → STOMP Client → WebSocket → Backend WebSocket Handler
```
- STOMP protocol for reliable message delivery
- Subscription management for different topics
- Auto-reconnection on connection loss

### State Management
- RxJS Observables for reactive data flow
- Subject-based event bus for cross-component communication
- Unsubscribe patterns for memory leak prevention

### Security Implementation
- JWT token storage (localStorage/sessionStorage)
- Automatic token refresh before expiry
- Guard-protected routes (canActivate)
- Role-based access control in templates

---

## 🎨 UI Features

### Responsive Design
- Mobile-first Bootstrap grid
- Angular Material responsive layout
- Adaptive navigation (drawer on mobile)

### Interactive Maps
```
Leaflet Map Layer → GeoJSON Post Markers → Click to View Post Details
```
- Real-time map updates via WebSocket
- Custom markers for different post types
- Geographic clustering for performance

### Real-Time Charts
- **D3.js** for custom visualizations
- **ngx-charts** for pre-built chart types
- Live data updates via RxJS Observables

### WebSocket Chat
- Channel-based chat rooms
- Real-time message delivery
- Typing indicators
- User presence

---

## 📊 API Integration

### Authentication Flow
```typescript
// Login
POST /auth/login
→ Returns: { token: JWT, refreshToken: ... }

// Automatic token injection in all requests
// Interceptor adds: Authorization: Bearer {token}

// Token refresh
POST /auth/refresh
→ Returns: { token: new_JWT }
```

### Key API Endpoints
```typescript
// Posts
GET    /posts                    // Get all posts
POST   /posts                    // Create post
GET    /posts/{id}               // Get post details
PUT    /posts/{id}               // Update post
DELETE /posts/{id}               // Delete post
POST   /posts/{id}/like          // Like/unlike post

// Users
GET    /users/{id}               // Get user profile
PUT    /users/{id}               // Update profile
GET    /users                    // Get all users
POST   /users/{id}/follow        // Follow/unfollow user

// Chat (WebSocket)
WS     /ws/chat?token={jwt}      // Connect to chat
TOPIC  /topic/chat/{chatId}      // Subscribe to room
SEND   /app/chat/message         // Send message

// Location
GET    /posts/location?lat=&lon=&radius=  // Get posts by location
```

---

## 🔧 Development

### Available Scripts

```bash
# Start development server with auto-reload
npm start

# Build for production
npm run build

# Run unit tests
npm test

# Watch mode for development
npm run watch
```

### Build Optimization
```bash
# Production build (optimized & minified)
ng build --configuration production
```

### Environment Configuration
- **Development:** `src/environments/environment.ts`
- **Production:** `src/environments/environment.prod.ts`

---

## 🧪 Testing

```bash
# Run unit tests with Karma
npm test

# Run with code coverage
ng test --code-coverage

# Run end-to-end tests (if configured)
ng e2e
```

---

## 📱 Progressive Web App (PWA)

- Service Worker for offline support
- Installable on mobile devices
- Offline-first strategy with cache-first approach

---

## 🐳 Docker Support

### Building Docker Image
```bash
# Build Angular application
ng build --configuration production

# Build Docker image
docker build -t onlybuns-frontend:latest .

# Run container
docker run -p 4200:4200 onlybuns-frontend:latest
```

---

## 🚀 Performance Optimization

### Code Splitting
- Lazy-loaded feature modules
- Route-based code splitting

### Change Detection
- OnPush strategy for components
- Reduces unnecessary change detection cycles

### Bundle Size
- Production build with tree-shaking
- Gzip compression
- Minification

---

## 🔗 Integration Points

### Backend Integration
- **API Base URL:** Configured in `environment.ts`
- **Authentication:** JWT tokens in headers
- **WebSocket:** STOMP protocol over SockJS

### Third-Party Services
- **Leaflet Maps:** Public tile server
- **Bootstrap CDN:** Optional, can be served locally
- **Material Icons:** Pre-bundled with Angular Material

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is part of an academic group assignment.

---

## 🔗 Links

- **Backend Repository:** [onlybuns-social-platform-backend](https://github.com/HakTak/onlybuns-social-platform-backend)
- **Development Server:** `http://localhost:4200`
- **Backend API:** `http://localhost:8080`
- **API Documentation:** `http://localhost:8080/swagger-ui.html` (from Backend)
- **Angular Documentation:** [angular.io](https://angular.io)
