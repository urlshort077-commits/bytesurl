# BytesURL — Backend

> A production-ready URL shortener API with analytics, subscription plans, and payment integration.

---

## 🌐 Live URLs

| | Link |
|---|---|
| 🌐 Backend Live | [https://bytesurl.onrender.com](https://bytesurl.onrender.com) |
| 🖥️ Frontend Live | [https://bytesurl.vercel.app](https://bytesurl.vercel.app) |

---

## 📦 Repositories

| | Link |
|---|---|
| 📦 Backend Repo | [github.com/refatalhasankaif/bytesurl-backend](https://github.com/refatalhasankaif/bytesurl-backend) |
| 🎨 Frontend Repo | [github.com/refatalhasankaif/bytesurl-frontend](https://github.com/refatalhasankaif/bytesurl-frontend) |

---

## 📖 Overview

BytesURL is a full-stack URL shortener platform that allows users to shorten URLs, track click analytics, and manage subscription plans. The backend is built with a modular architecture using Node.js and Express, backed by PostgreSQL via Prisma ORM, and secured with Firebase Authentication.

Key capabilities include real-time click analytics (device, browser, OS, geolocation), role-based access control for admin operations, and Stripe-powered subscription upgrades.

---

## 🗂️ Entity Relationship Diagram

![ERD Diagram](https://i.ibb.co.com/Z6krRVGp/Untitled-Diagram.webp)

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL (NeonDB) |
| ORM | Prisma |
| Authentication | Firebase |
| Payments | Stripe |
| Backend Deployment | Render |
| Frontend Deployment | Vercel |

---

## 📦 Libraries & Packages

| Package | Purpose |
|---|---|
| `express` | Core HTTP server and routing framework |
| `prisma` + `@prisma/client` | Type-safe database ORM and query builder |
| `@prisma/adapter-pg` | PostgreSQL adapter for Prisma |
| `firebase-admin` | Server-side Firebase token verification and user management |
| `stripe` | Stripe payment processing and webhook handling |
| `nanoid` | Generates unique, URL-safe short codes for shortened URLs |
| `zod` | Runtime schema validation for all API request bodies |
| `ua-parser-js` | Parses user-agent strings to extract device, browser, and OS info |
| `geoip-lite` | Maps IP addresses to country and city for click analytics |
| `helmet` | Sets secure HTTP response headers to protect against common attacks |
| `cors` | Configures Cross-Origin Resource Sharing for frontend access |
| `express-rate-limit` | Prevents brute-force and abuse with request rate limiting |
| `compression` | Compresses HTTP responses for faster data transfer |
| `morgan` | HTTP request logger for development debugging |
| `dotenv` | Loads environment variables from `.env` file |
| `http-status` | Provides readable HTTP status code constants |
| `pg` | PostgreSQL client driver for Node.js |
| `tsx` | Runs TypeScript files directly without compilation |

---

## 🚀 Features

- **URL Shortening** — Generate short URLs with optional custom aliases
- **Click Analytics** — Track device, browser, OS, country, city, and referer per click
- **Firebase Auth** — Email/password and Google OAuth authentication
- **Role-Based Access** — Admin and User roles with protected routes
- **Subscription Plans** — FREE (10 URLs), PRO (500 URLs/month), ULTIMATE (Unlimited)
- **Stripe Payments** — One-time payment to upgrade subscription plan
- **Admin Dashboard** — Manage users, URLs, analytics, payments, and platform stats
- **Security** — Helmet, CORS, rate limiting, input validation

---

---

## 💳 Subscription Plans

| Plan | Price | URL Limit | Reset |
|---|---|---|---|
| FREE | Free | 10 URLs | Lifetime total |
| PRO | 29 BDT once | 500 URLs | Monthly auto-reset |
| ULTIMATE | 199 BDT once | Unlimited | No limit |

---
