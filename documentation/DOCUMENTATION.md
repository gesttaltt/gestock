# Gestock - Stock Management System Documentation

## Project Overview

Gestock is a full-stack stock management system built with modern web technologies. It consists of a Node.js/Express backend and a React/TypeScript frontend.

## Technical Stack

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Argon2 and bcrypt for password hashing
- **Development**: Nodemon for hot-reloading

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 6.1
- **Language**: TypeScript
- **Styling**: TailwindCSS 4.0
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Data Visualization**: Chart.js with react-chartjs-2
- **Drag and Drop**: @dnd-kit library
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Notifications**: React Toastify

## Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── server.js           # Main application entry point
│   ├── controllers/        # Business logic handlers
│   │   ├── categoryController.js
│   │   ├── customerController.js
│   │   ├── dashboardController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/        # Custom middleware functions
│   │   └── authMiddleware.js
│   ├── models/           # Mongoose data models
│   │   ├── Category.js
│   │   ├── Customer.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/           # API route definitions
│   │   ├── apiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── productRoutes.js
│   └── utils/           # Utility functions
│       └── passwordHasher.js
```

### Frontend Structure
```
frontend/
├── src/
│   ├── api/             # API integration layer
│   │   ├── authApi.ts
│   │   ├── axiosInstance.ts
│   │   ├── categoryApi.ts
│   │   ├── customersApi.ts
│   │   └── productApi.ts
│   ├── components/      # Reusable UI components
│   │   └── ui/
│   │       ├── Alert.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Form.tsx
│   │       ├── Input.tsx
│   │       ├── Loader.tsx
│   │       ├── Modal.tsx
│   │       ├── SortableCustomerItem.tsx
│   │       └── Table.tsx
│   ├── contexts/       # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── AuthRedirector.tsx
│   │   └── ProtectedRoute.tsx
│   ├── layout/        # Page layout components
│   │   └── Layout.tsx
│   └── pages/         # Main application pages
│       ├── AuthPage.tsx
│       ├── Categories.tsx
│       ├── CategoriesHeader.tsx
│       ├── Customers.tsx
│       ├── Dashboard.tsx
│       ├── DashboardHeader.tsx
│       ├── LandingPage.tsx
│       ├── Products.tsx
│       ├── ProductsHeader.tsx
│       ├── Profile.tsx
│       └── ProfileHeader.tsx
```

## Configuration

### Backend Configuration
- Environment variables required:
  - `MONGO_URI`: MongoDB connection string
  - `JWT_SECRET`: Secret key for JWT token generation
  - `PORT`: Server port (defaults to 5000)
  - `CLIENT_URL`: Frontend application URL

### Frontend Configuration
- Uses Vite as the build tool
- TypeScript configuration in `tsconfig.json`
- Environment variables can be set in `.env` files
- ESLint configuration for code quality

## Deployment

### Backend Deployment
- Supports Node.js 18.x
- No build step required
- Start command: `node src/server.js`
- Development mode: `npm run dev`

### Frontend Deployment
- Build command: `npm run build`
- Preview command: `npm run preview`
- Development mode: `npm run dev`

## Security Features
1. CORS configuration with origin validation
2. JWT-based authentication
3. Password hashing with Argon2 and bcrypt
4. Protected routes with middleware
5. Environment variable validation

## Key Features
1. User authentication and authorization
2. Product management
3. Category management
4. Customer management
5. Dashboard with analytics
6. Drag-and-drop functionality
7. Real-time form validation
8. Responsive design

## API Routes

The application exposes several API endpoints:
- Authentication routes (`/auth`)
- Product routes (`/api/products`)
- Category routes (`/api/categories`)
- Customer routes (`/api/customers`)
- Dashboard routes (`/api/dashboard`)

Each route is protected by authentication middleware except for the initial auth routes.

## State Management

The application uses React Context API for state management, with separate contexts for:
- Authentication state
- User session management
- Protected route handling

## Styling and UI

The frontend uses:
- TailwindCSS for styling
- Custom UI components
- Responsive design principles
- Chart.js for data visualization
- React Toastify for notifications

## Development Setup

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Set up environment variables
5. Start development servers:
   - Backend: `npm run dev`
   - Frontend: `npm run dev`

## Contributing

When contributing to this project:
1. Follow the existing code structure
2. Use TypeScript for frontend development
3. Maintain consistent code formatting
4. Write meaningful commit messages
5. Test thoroughly before submitting PRs
