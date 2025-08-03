# Testing and CI/CD Implementation Plan

## Phase 1: Testing Setup

### 1. Backend Testing Infrastructure
```bash
# Directory Structure
backend/
├── __tests__/
│   ├── unit/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth/
│   │   ├── products/
│   │   └── categories/
│   └── setup/
│       └── testDb.js
```

#### Steps:
1. Install testing dependencies:
```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "mongodb-memory-server": "^9.1.1"
  }
}
```

2. Create Jest configuration (backend/jest.config.js):
```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  setupFilesAfterEnv: ['./__tests__/setup/testDb.js']
};
```

3. Sample test setup (backend/__tests__/setup/testDb.js):
```javascript
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
```

### 2. Frontend Testing Infrastructure
```bash
# Directory Structure
frontend/
├── __tests__/
│   ├── components/
│   │   └── ui/
│   ├── pages/
│   ├── utils/
│   └── setup/
│       └── testUtils.tsx
```

#### Steps:
1. Install testing dependencies:
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.4.3",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

2. Create Jest configuration (frontend/jest.config.js):
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/testUtils.tsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};
```

## Phase 2: CI/CD Pipeline

### 1. GitHub Actions Configuration
Create `.github/workflows/main.yml`:
```yaml
name: Gestock CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '18.x'
  MONGODB_VERSION: '6.0'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install Backend Dependencies
      working-directory: ./backend
      run: npm ci

    - name: Install Frontend Dependencies
      working-directory: ./frontend
      run: npm ci

    - name: Run Backend Tests
      working-directory: ./backend
      run: npm test -- --coverage
      env:
        JWT_SECRET: ${{ secrets.JWT_SECRET }}
        NODE_ENV: test

    - name: Run Frontend Tests
      working-directory: ./frontend
      run: npm test -- --coverage

    - name: Upload Coverage Reports
      uses: actions/upload-artifact@v3
      with:
        name: coverage-reports
        path: |
          backend/coverage
          frontend/coverage

  lint:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}

    - name: Install Dependencies
      run: |
        cd backend && npm ci
        cd ../frontend && npm ci

    - name: Run ESLint
      run: |
        cd backend && npm run lint
        cd ../frontend && npm run lint

  deploy:
    needs: [test, lint]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to Production
      run: echo "Add your deployment steps here"
      # Add actual deployment steps based on your hosting platform
```

### 2. Package.json Updates

Backend package.json scripts:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.js"
  }
}
```

Frontend package.json scripts:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.{ts,tsx}"
  }
}
```

## Sample Test Cases

### Backend Unit Test Example (backend/__tests__/unit/controllers/productController.test.js):
```javascript
import { getProducts } from '../../../src/controllers/productController';
import Product from '../../../src/models/Product';

jest.mock('../../../src/models/Product');

describe('Product Controller', () => {
  it('should return all products', async () => {
    const mockProducts = [
      { _id: '1', name: 'Product 1', price: 100 },
      { _id: '2', name: 'Product 2', price: 200 }
    ];
    
    Product.find.mockResolvedValue(mockProducts);
    
    const mockReq = {};
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    
    await getProducts(mockReq, mockRes);
    
    expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
  });
});
```

### Frontend Component Test Example (frontend/__tests__/components/ui/Button.test.tsx):
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../../src/components/ui/Button';

describe('Button Component', () => {
  it('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Implementation Steps

1. Create test directories and configuration files
2. Set up GitHub Actions workflow
3. Add initial test cases for critical components
4. Configure coverage reporting
5. Add test scripts to package.json files
6. Update README with testing instructions
7. Add pre-commit hooks for testing
8. Configure branch protection rules

## Success Criteria

1. All tests pass in CI pipeline
2. Minimum 70% test coverage
3. No deployment with failing tests
4. Linting passes for all code
5. Pre-commit hooks prevent commits with failing tests
