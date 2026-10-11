# ⚡ AURA - Fullstack E-Commerce Platform with GTM & GA4 Telemetry

[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS v3](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?logo=mongodb&logoColor=white)](https://mongoosejs.com)
[![Google Tag Manager](https://img.shields.io/badge/Google_Tag_Manager-GTM--5NVCVF96-246FDB?logo=google-tag-manager&logoColor=white)](https://tagmanager.google.com)
[![Google Analytics 4](https://img.shields.io/badge/Google_Analytics_4-GA4_Ecommerce-EA4335?logo=google-analytics&logoColor=white)](https://analytics.google.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker&logoColor=white)](https://docker.com)
[![Tests Passing](https://img.shields.io/badge/Tests-23%2F23%20Passed%20(100%25)-34d399)](tests/validate_telemetry_and_api.js)

An enterprise-grade, fullstack e-commerce web platform engineered with **React 19**, **Vite**, **Tailwind CSS v3**, **Express.js**, and **MongoDB**. Featuring an end-to-end **Google Tag Manager (GTM)** and **Google Analytics 4 (GA4) dataLayer telemetry engine** verified via **Google Tag Assistant Preview** and **GA4 DebugView**.

---

## 📑 Table of Contents
- [4-Week Roadmap Deliverables](#-4-week-roadmap-deliverables)
- [System Architecture](#-system-architecture)
- [Quick Start & Installation](#-quick-start--installation)
- [REST API Reference](#-rest-api-reference)
- [GTM & GA4 Telemetry Tracking Plan](#-gtm--ga4-telemetry-tracking-plan)
- [Admin Studio & Demo Accounts](#-admin-studio--demo-accounts)
- [Automated Test Suite](#-automated-test-suite)
- [Production Deployment](#-production-deployment)
- [Project Directory Structure](#-project-directory-structure)

---

## 🗓️ 4-Week Roadmap Deliverables

- [x] **Week 1 (Days 1–7): Frontend UI & Catalog**
  - High-performance React 19 + Vite + Tailwind CSS v3 architecture.
  - Curated luxury dark aesthetic (`#070a13`), typography, and glassmorphism.
  - Responsive Navbar, Hero flagship banner, CategoryBar, Product Listing, and Product Details.
  - Predictive search matching, category pills, price ceiling slider, 4.0+ rating filter, and sorting.
  - Slide-out Cart Drawer with dynamic coupon engine (`AURA20` for 20% off) and free shipping progress.
  - Two-step simulated checkout with order confirmation and toast feedback.

- [x] **Week 2 (Days 8–14): Backend Express REST APIs**
  - Modular Express server with CORS, JSON body parser, and Morgan logging.
  - Robust Mongoose database connection supporting external MongoDB or zero-config in-memory fallback (`mongodb-memory-server`).
  - Four Mongoose schemas: `Product`, `User`, `Cart`, and `Order` with indexes and validations.
  - JWT token authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/profile`).
  - Administrative Product Management Studio with full CRUD (`GET`, `POST`, `PUT`, `DELETE /api/products`).
  - Connected React frontend to live backend APIs with live `api:online` indicator.

- [x] **Week 3 (Days 15–21): GTM & GA4 Telemetry Integration**
  - Official GTM container snippets in `frontend/index.html` (head script + body noscript).
  - Configured GTM Container ID (`GTM-5NVCVF96`) and GA4 Measurement ID (`G-AURA99TEST`).
  - 1-Click Importable GTM Container Export file ([`gtm_container_export.json`](gtm_container_export.json)) with Google Tag and 11 GA4 e-commerce tags.
  - Asynchronous `dataLayer` event system with schema validation: `view_item_list`, `select_item`, `view_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`, `search`.
  - In-app **GTM & GA4 Debug Hub** widget with real-time GA4 DebugView stream and test buttons.
  - Verified live in **Google Tag Assistant Preview**!

- [x] **Week 4 (Days 22–28): Test, Deploy & Document**
  - Automated end-to-end telemetry and API test suite ([`tests/validate_telemetry_and_api.js`](tests/validate_telemetry_and_api.js)) passing 23/23 assertions (100%).
  - Multi-stage production `Dockerfile` and `docker-compose.yml` for 1-command startup.
  - Deployment blueprints for Vercel ([`vercel.json`](vercel.json)) and Render ([`render.yaml`](render.yaml)).
  - Express production static asset serving with SPA routing fallback.
  - Comprehensive documentation, tracking plan ([`tracking_plan.md`](tracking_plan.md)), and milestone reports.

---

## 🏛️ System Architecture

```mermaid
graph TD
    User([User Browser]) -->|HTTP / React UI| Frontend[React 19 + Vite + Tailwind CSS]
    Frontend -->|window.dataLayer.push| GTM[Google Tag Manager (GTM-5NVCVF96)]
    GTM -->|Enhanced E-Commerce Tags| GA4[Google Analytics 4 (GA4 DebugView)]
    Frontend -->|Fetch /api/* REST| Backend[Express.js Server :5000]
    Backend -->|JWT Protect & Admin Guard| AuthMiddleware[Auth Middleware]
    AuthMiddleware -->|Mongoose ODM| Mongo[(MongoDB Database)]
    Backend -->|Serves Static Bundle| FrontendDist[frontend/dist SPA Build]
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher)
- npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/your-username/aura-ecommerce.git
cd aura-ecommerce
npm install
npm --prefix frontend install
npm --prefix backend install
```

### 2. Run in Development Mode
Start both frontend and backend concurrently:
```bash
# Terminal 1: Launch Backend Server (Port 5000)
npm run server

# Terminal 2: Launch Frontend Dev Server (Port 5173)
npm run client
```
- Open your browser at: **`http://localhost:5173/`**
- API health check: **`http://localhost:5000/api/health`**

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System status and service health check |
| `POST` | `/api/auth/register` | Public | Create new customer account and return JWT |
| `POST` | `/api/auth/login` | Public | Authenticate user and return JWT profile |
| `GET` | `/api/auth/profile` | Private | Retrieve current user profile (`Bearer <token>`) |
| `GET` | `/api/auth/users` | Admin | Retrieve list of all registered accounts |
| `GET` | `/api/products` | Public | Query catalog with search, category, maxPrice, sort |
| `GET` | `/api/products/:id` | Public | Retrieve single product details by slug or ObjectId |
| `POST` | `/api/products` | Admin | Create a new product in MongoDB |
| `PUT` | `/api/products/:id` | Admin | Update product details and inventory |
| `DELETE`| `/api/products/:id` | Admin | Delete product from database |
| `GET` | `/api/cart` | Private | Retrieve active authenticated cart |
| `POST` | `/api/cart` | Private | Synchronize cart items and coupon discount |
| `POST` | `/api/orders` | Public/Private | Submit new order and record transaction |
| `GET` | `/api/orders/:id` | Public | Fetch order receipt by Order ID |
| `GET` | `/api/orders/myorders` | Private | Fetch logged-in user order history |

---

## 📊 GTM & GA4 Telemetry Tracking Plan

All tracking is orchestrated via **`window.dataLayer`** following official Google Analytics 4 Recommended E-Commerce Specifications.

### GA4 E-Commerce Event Matrix
| GA4 Event Name | Trigger Location | Mandatory Payload Parameters |
|---|---|---|
| `view_item_list` | Browsing catalog & switching categories | `item_list_name`, `items[]` |
| `select_item` | Clicking a product card | `item_list_name`, `items[]` |
| `view_item` | Visiting product details view | `currency: "USD"`, `value`, `items[]` |
| `add_to_cart` | Adding item or variant to bag | `currency`, `value`, `items[]` |
| `remove_from_cart` | Deleting item from cart drawer | `currency`, `value`, `items[]` |
| `view_cart` | Opening cart drawer | `currency`, `value`, `items[]` |
| `begin_checkout` | Clicking "Proceed to Checkout" | `currency`, `value`, `coupon`, `items[]` |
| `add_shipping_info` | Submitting shipping address form | `currency`, `value`, `shipping_tier`, `items[]` |
| `add_payment_info` | Selecting payment method | `currency`, `value`, `payment_type`, `items[]` |
| `purchase` | Authorizing simulated payment | `transaction_id`, `value`, `tax`, `shipping`, `coupon`, `items[]` |
| `search` | Entering query in search bar | `search_term` |

> 📖 **Full Specification**: Read the complete [GTM Tracking Plan Documentation](tracking_plan.md) and import [gtm_container_export.json](gtm_container_export.json) into your GTM container.

---

## 🔐 Admin Studio & Demo Accounts

The store includes pre-configured demo credentials with 1-click autofill in the **Sign In** modal:

| Role | Email | Password | Privileges |
|---|---|---|---|
| **System Admin** | `admin@aura.store` | `Admin@123456` | Full CRUD access to Admin Studio product management |
| **Customer Demo** | `customer@aura.store` | `Customer@123456` | Saved cart, order history, and customer checkout |

---

## 🧪 Automated Test Suite

Run the full end-to-end integration and telemetry test suite:
```bash
npm test
```

### Output:
```text
========================================================
  ⚡ AURA E-COMMERCE END-TO-END VALIDATION TEST SUITE   
========================================================

[1/4] Testing System Health & Server Connectivity...
  ✔ PASS: API Health Check responds with HTTP 200
  ✔ PASS: Health status is 'ok'

[2/4] Testing Products REST API & Catalog Queries...
  ✔ PASS: GET /api/products returns HTTP 200
  ✔ PASS: Products count is greater than 0
  ✔ PASS: Products array contains valid schema items
  ✔ PASS: GET /api/products/:id finds product by slug
  ✔ PASS: Product price is numeric and greater than 0

[3/4] Testing Authentication & Order Lifecycle...
  ✔ PASS: Admin login succeeds with HTTP 200
  ✔ PASS: Admin user receives valid JWT token
  ✔ PASS: Admin user has isAdmin: true
  ✔ PASS: POST /api/orders creates new order with HTTP 201
  ✔ PASS: Created order has correct orderId
  ✔ PASS: Created order is marked as Paid

[4/4] Validating GA4 E-Commerce Telemetry Schemas...
  ✔ PASS: Event 'view_item_list' passes GA4 schema validation
  ✔ PASS: Event 'select_item' passes GA4 schema validation
  ✔ PASS: Event 'view_item' passes GA4 schema validation
  ✔ PASS: Event 'add_to_cart' passes GA4 schema validation
  ✔ PASS: Event 'remove_from_cart' passes GA4 schema validation
  ✔ PASS: Event 'begin_checkout' passes GA4 schema validation
  ✔ PASS: Event 'add_shipping_info' passes GA4 schema validation
  ✔ PASS: Event 'add_payment_info' passes GA4 schema validation
  ✔ PASS: Event 'purchase' passes GA4 schema validation
  ✔ PASS: Event 'search' passes GA4 schema validation

========================================================
✔ TESTS COMPLETED: 23 / 23 PASSED (100%)
✨ ALL TELEMETRY & API CHECKS PASSED WITH ZERO ERRORS!
========================================================
```

---

## 🚢 Production Deployment

### Option 1: Docker (1-Command Containerized Deployment)
```bash
docker compose up --build
```
This builds the multi-stage `Dockerfile`, starts MongoDB, and runs the production Express server on port `5000` with the pre-compiled frontend assets served directly!

### Option 2: Render / Railway Deployment
1. Connect this GitHub repository to [Render](https://render.com).
2. Render will automatically detect [`render.yaml`](render.yaml) and configure the Node web service.
3. Add your MongoDB Atlas connection string to `MONGO_URI`.

### Option 3: Vercel Deployment (Frontend Only)
1. Import repository on [Vercel](https://vercel.com).
2. Vercel automatically reads [`vercel.json`](vercel.json) to build the Vite static assets.

---

## 📁 Project Directory Structure

```text
Ecomers Website/
├── frontend/                     # React 19 + Vite Client
│   ├── src/
│   │   ├── components/           # Navbar, Footer, Hero, Home, ProductListing, ProductDetails,
│   │   │                         # CartDrawer, CheckoutModal, AdminProductModal, GTMDebugHub...
│   │   ├── context/              # CartContext, AuthContext
│   │   ├── data/                 # Sample Products Catalogue
│   │   ├── services/             # REST API Client (api.js)
│   │   └── utils/                # GTM & GA4 Telemetry Helper (gtm.js)
│   ├── index.html                # Google Tag Manager Head & Body Snippets
│   ├── tailwind.config.js        # Design System Tokens & Brand Palette
│   └── package.json
│
├── backend/                      # Express REST API Server
│   ├── config/                   # Mongoose Database Connection (db.js)
│   ├── controllers/              # Auth, Product, Cart, and Order Controllers
│   ├── middleware/               # JWT Auth & Error Handling
│   ├── models/                   # Product, User, Cart, and Order Schemas
│   ├── routes/                   # Modular REST Routing
│   ├── seeder.js                 # Automatic Database Populator
│   ├── server.js                 # Express Entry Point (with Static Production Serving)
│   └── package.json
│
├── tests/
│   └── validate_telemetry_and_api.js  # 23-Assertion Automated Test Suite
│
├── Dockerfile                    # Multi-Stage Production Container Build
├── docker-compose.yml            # Fullstack Docker Orchestration
├── vercel.json                   # Vercel Deployment Blueprint
├── render.yaml                   # Render Cloud Blueprint
├── gtm_container_export.json     # 1-Click Importable GTM Container
├── tracking_plan.md              # Complete GTM & GA4 Tracking Plan
└── package.json                  # Root Monorepo Scripts
```

---

## 📜 License
This project is open-source and released under the MIT License.
