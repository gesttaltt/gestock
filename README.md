# GESTOCK IMS

**Version:** v0.2.0 (Development Release)  
**Status:** In Progress

A modern inventory management system designed to streamline inventory control, enhance data reporting, and ensure secure user management. GESTOCK IMS builds upon its initial prototype (v0.1.0) by introducing significant new features, improved security measures, and a refined user experience.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & Modules](#architecture--modules)
  - [Stock Management API](#stock-management-api)
  - [Stock Dashboard UI](#stock-dashboard-ui)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Roadmap & Future Enhancements](#roadmap--future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact Information](#contact-information)

---

## Overview

GESTOCK IMS is a comprehensive solution aimed at simplifying and optimizing inventory management. By integrating advanced security protocols, modern UI/UX, and dynamic data visualization, the platform provides businesses with the tools they need to manage products, categories, and customer data efficiently.

This release (v0.2.0) focuses on refining core functionalities while introducing innovative features to enhance both backend performance and frontend usability.

---

## Key Features

- **TypeScript Enhancements:** Resolved various TypeScript prop type errors, ensuring smooth Vercel deployments and robust code quality.
- **Enhanced Password Security:** Utilizes **Argon2id** as the primary password hashing algorithm with **bcrypt** as a fallback, meeting modern security standards.
- **Interactive Dashboard Visualization:** Incorporates **Chart.js** for dynamic doughnut and bar charts that provide insights into products, categories, and top-stock items.
- **Improved UI & UX:** Overhauled styling and responsiveness, introduced new UI components, and modularized the frontend code for enhanced maintainability.

---

## Architecture & Modules

GESTOCK IMS is divided into two primary modules that work in tandem to deliver a seamless inventory management experience.

### Stock Management API

**Purpose:**  
Provides a RESTful service to manage all aspects of inventory data including products, categories, and user authentication.

**Current Features:**
- **CRUD Operations:** Full support for creating, reading, updating, and deleting products and categories.
- **Secure Authentication:** User authentication is secured using Argon2id hashing, with bcrypt as a fallback option.
- **Role-Based Authorization:** Implements role-based access controls (e.g., admin-level privileges) to safeguard sensitive operations.

**Planned Enhancements:**
- **Third-Party Integrations:** Future plans include integration with external inventory systems.
- **Real-Time Notifications:** Implementation of real-time notifications for stock updates and other critical events.

---

### Stock Dashboard UI

**Purpose:**  
A modern, React + Vite-powered frontend that delivers data visualization tools and comprehensive inventory management capabilities.

**Current Features:**
- **Interactive Dashboard:** Features interactive Chart.js visualizations (doughnut & bar charts) to display inventory insights.
- **User Authentication:** Secure login and registration processes employing Argon2id (with bcrypt fallback).
- **Inventory Management:** Comprehensive CRUD functionality for managing products and categories.
- **Client Management:** Dedicated module for managing clients/customers with a sortable and user-friendly interface.
- **Responsive Design:** Built with modular, TypeScript-based components to ensure responsiveness across devices.

**Planned Enhancements:**
- **Advanced Charting & Filtering:** More sophisticated visualizations and filtering options for in-depth analytics.
- **Real-Time Data Updates:** Integration of websockets for live data updates.
- **Extended Reporting:** Enhanced reporting capabilities for sales analytics and performance metrics.

---

## Installation & Setup

### Prerequisites

- **Node.js:** Version 14 or higher
- **Package Manager:** npm or yarn
- **Vercel Account:** For deployment (optional, but recommended)

### Installation Steps

1. **Clone the repo:**
   ```bash
   git clone https://github.com/gesttaltt/gestock.git
   cd gestock
   ```
2. **Install dependencies:**
```bash
npm install
# or using yarn
yarn install
  ```
3. **Set Up Environment Variables:** 
Create a .env file in the root directory and configure necessary environment variables (e.g., API keys, database connections).

4. **Run the Development Server:**
```bash
npm run dev
# or using yarn
yarn dev
  ```

## Usage

After setting up the project, you can:

 - **Manage Inventory:** Use the Stock Management API endpoints to handle products and categories.

 - **Visualize Data:** Interact with the dashboard to view real-time inventory insights via charts.

 - **Secure Operations:** Register and log in securely to access administrative functionalities.

## Roadmap & Future Enhancements

**GESTOCK IMS is continuously evolving. The near-term roadmap includes:**

 -   Integration with third-party inventory systems.

 -   Implementation of real-time notifications and data updates.

 -   Expansion of reporting features to include comprehensive sales analytics.

 -   Ongoing UI/UX refinements based on user feedback and performance metrics.

## Contributing

Contributions are welcome! To contribute:

 -   Fork the repository.

 -   Create a new branch (git checkout -b feature/your-feature).

 -   Commit your changes and push to your branch.

-  Open a pull request detailing your enhancements or fixes.

Please review the future updates CONTRIBUTING.md file for detailed guidelines.

    Project Website: gestock-orpin.vercel.app
