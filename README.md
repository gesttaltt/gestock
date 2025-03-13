# GESTOCK IMS v0.2.0
**Development Release (In Progress)**

## Overview
GeStock is a comprehensive solution designed to streamline inventory control, data reporting, and secure user management. This release (**v0.2.0**) builds upon the initial prototype (v0.1.0) and introduces significant new features, improved security, and enhanced user experience.

### Key Highlights in v0.2.0
- **Frontend TypeScript Fixes:** Resolved various TypeScript prop type errors that previously blocked Vercel deployments.
- **Enhanced Password Security:** Implemented **Argon2id** as the primary hashing algorithm with **bcrypt** fallback, aligning with modern security standards.
- **Dashboard Visualization:** Added **Chart.js** charts (doughnut & bar) for product/category insights and top-stock products.
- **Improved UI & UX:** Cleaned up styling and responsiveness, introduced new UI components, and modularized the frontend code.

---

## Modules

### 1. Stock Management API
- **Purpose:** Exposes a RESTful service for managing inventory data (products, categories, etc.).
- **Current Features:**
  - CRUD operations for products and categories.
  - Secure user authentication (with Argon2id hashing).
  - Role-based authorization (e.g., admin).
- **Planned Enhancements:**
  - Integration with third-party inventory systems.
  - Real-time notifications for stock updates.

### 2. Stock Dashboard UI
- **Purpose:** A React + Vite frontend providing data visualization and inventory management tools.
- **Current Features:**
  - **Interactive Dashboard** with Chart.js (doughnut & bar charts).
  - **Secure Login/Registration** using Argon2id (with bcrypt fallback).
  - **Product & Category Management** (CRUD).
  - **Client/Customer Management** module with sortable UI.
  - **Responsive Design** and modular TypeScript-based components.
- **Planned Enhancements:**
  - More advanced charts & filters.
  - Real-time data updates via websockets.
  - Extended reporting for sales and analytics.

---

## Installation

### Prerequisites
- **Node.js** (v14.x or later recommended)
- **npm** or **yarn** package manager
- **MongoDB** Atlas or local MongoDB instance (if using the backend)

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/gesttaltt/gestock.git
   cd gestock
