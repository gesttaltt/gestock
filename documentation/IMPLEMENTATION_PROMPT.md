# Implementation Prompt for Testing and CI/CD Setup

Please implement a testing infrastructure and CI/CD pipeline for the Gestock project following these specifications:

1. First, set up the testing infrastructure:

## Backend Testing Setup
1. Create test directory structure in backend folder
2. Install required testing dependencies:
   - jest
   - supertest
   - mongodb-memory-server
3. Configure Jest for backend
4. Create test database setup file
5. Add sample test for ProductController

## Frontend Testing Setup
1. Create test directory structure in frontend folder
2. Install required testing dependencies:
   - @testing-library/react
   - @testing-library/jest-dom
   - @testing-library/user-event
3. Configure Jest for frontend
4. Create test utilities setup
5. Add sample test for Button component

## CI/CD Pipeline Setup
1. Create .github/workflows directory
2. Implement main.yml with:
   - Test job for both frontend and backend
   - Linting job
   - Deploy job (configured for production branch)
3. Update package.json scripts in both frontend and backend
4. Set up branch protection rules

## Required Files to Create/Modify:

```
├── .github/
│   └── workflows/
│       └── main.yml
├── backend/
│   ├── jest.config.js
│   ├── package.json (update)
│   └── __tests__/
│       ├── setup/
│       │   └── testDb.js
│       └── unit/
│           └── controllers/
│               └── productController.test.js
└── frontend/
    ├── jest.config.js
    ├── package.json (update)
    └── __tests__/
        ├── setup/
        │   └── testUtils.tsx
        └── components/
            └── ui/
                └── Button.test.tsx
```

## Success Criteria
- All test files properly configured
- GitHub Actions workflow running successfully
- Test coverage reporting enabled
- Linting integrated into CI pipeline
- Sample tests passing

Please proceed with the implementation following the detailed specifications in TESTING_CICD_PLAN.md.
