# Gestock IMS
For further details, please refer to the individual branches


╔════════════════════════════════════════════════════════════════════╗
║                          GE STOCK v0.1.0                           ║
║              IMS Project – Development Release                     ║
╚════════════════════════════════════════════════════════════════════╝

┌────────────────────────────────────────────────────────────────────────┐
│                              OVERVIEW                                  │
├────────────────────────────────────────────────────────────────────────┤
│ GeStock is a stock management and monitoring solution designed to      │
│ streamline inventory control and data reporting. This early release    │
│ (v0.1.0) is split into two modules:                                    │
│                                                                      │
│   1. Stock Management API – RESTful endpoints for managing stock data. │
│   2. Stock Dashboard UI     – A web interface to visualize stock data.  │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                              MODULES                                   │
├────────────────────────────────────────────────────────────────────────┤
│ Module 1: Stock Management API                                         │
│   • Provides CRUD endpoints for stock items.                         │
│   • Planned integrations with third-party inventory systems.           │
│                                                                      │
│ Module 2: Stock Dashboard UI                                           │
│   • Web-based interface for data visualization and management.         │
│   • Features interactive charts, tables, and real-time updates.        │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                             INSTALLATION                               │
├────────────────────────────────────────────────────────────────────────┤
│ Prerequisites:                                                         │
│   • Node.js (v14.x or later)                                           │
│   • npm or yarn                                                        │
│                                                                      │
│ Step 1: Clone the Repository                                           │
│   $ git clone -b v0.1.0 https://github.com/gesttaltt/gestock.git         │
│   $ cd gestock                                                        │
│                                                                      │
│ Step 2: Install Dependencies                                           │
│   For the API module:                                                  │
│     $ cd api                                                          │
│     $ npm install     or      $ yarn install                           │
│                                                                      │
│   For the Dashboard UI module:                                         │
│     $ cd ../dashboard                                                  │
│     $ npm install     or      $ yarn install                           │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                              DEVELOPMENT                               │
├────────────────────────────────────────────────────────────────────────┤
│ • API Module:                                                        │
│     $ cd api                                                          │
│     $ npm run dev   →  Launches the API server (e.g., http://localhost:3000) │
│                                                                      │
│ • Dashboard UI Module:                                               │
│     $ cd ../dashboard                                                  │
│     $ npm start   →  Launches the UI (e.g., http://localhost:3001)        │
│                                                                      │
│ • Testing:                                                           │
│     For API:      $ npm test                                          │
│     For UI:       $ npm test                                          │
│                                                                      │
│ • Linting:                                                           │
│     $ npm run lint   →  Check code quality and formatting              │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                               USAGE                                    │
├────────────────────────────────────────────────────────────────────────┤
│ API Endpoints (v0.1.0):                                                │
│   • GET    /api/stocks  – Retrieve all stock items                     │
│   • POST   /api/stocks  – Add a new stock item                          │
│   • PUT    /api/stocks/:id  – Update an existing stock item              │
│   • DELETE /api/stocks/:id  – Delete a stock item                        │
│                                                                      │
│ Dashboard UI:                                                        │
│   • Visual overview of stock levels                                  │
│   • Detailed pages for individual stock items                         │
│   • Interactive charts & real-time updates                            │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                            CONTRIBUTING                                │
├────────────────────────────────────────────────────────────────────────┤
│ We welcome contributions! Please:                                    │
│   1. Fork the repository & create your feature/bug branch             │
│   2. Write tests for your changes                                     │
│   3. Follow our coding guidelines (see CONTRIBUTING.md)               │
│   4. Submit a pull request with clear descriptions                     │
│                                                                      │
│ Feedback on architecture and module separation is especially valued.  │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                               LICENSE                                  │
├────────────────────────────────────────────────────────────────────────┤
│ This project is licensed under the MIT License.                      │
│ See the LICENSE file for details.                                    │
└────────────────────────────────────────────────────────────────────────┘

           [ Note: Documentation is subject to change as development evolves ]

