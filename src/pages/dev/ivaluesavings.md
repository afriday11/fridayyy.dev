---
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/ivaluesavings_thumb.jpg
title: "iValueSavings.com"
description: "A full-stack savings newsletter with built-in referral marketing"
categories: [websites, wip]
---

![Basic.js Hero](/gallery/ivaluesavings_banner.jpg)

# iValueSavings.com

_A full-stack subscription platform with advanced referral marketing_

iValueSavings.com is a modern, production-ready web application that I designed and built from the ground up to support a subscription-based discount club. It combines seamless user experience, robust security, and sophisticated referral economics to drive user acquisition and retention.

**Live Website:** www.iValueSavings.com

## Tech Stack & Architecture

- **Frontend**: React 18 powered by Vite for ultra-fast development and optimized builds
- **Backend**: Node.js with Express.js REST API
- **Database**: PostgreSQL with efficient query optimization and connection pooling
- **Styling**: Emotion (CSS-in-JS) for dynamic theming and animations
- **Deployment**:

  - Frontend hosted on **Netlify**, configured for SPA routing
  - Environment-specific backend setup with secure API endpoints

## Subscription & Payment System

- Full **subscription lifecycle management** (create, pause, resume, cancel)
- Seamless **Stripe integration** with secure webhook handling
- Support for **coupon codes**, **promotional offers**, and **referral-based discounts**
- Real-time subscription updates and **dynamic pricing based on referral status**

## Advanced Referral & Affiliate Program

Built for viral growth:

- **Multi-level referral tracking** with unique short IDs
- **QR code generation** for easy mobile and offline sharing
- **Print-ready coupon templates** for in-person distribution
- **Automatic rewards**: 3 successful referrals = free membership
- **Cookie-based tracking** with 30-day attribution window
- Dual-layered **referrer vs affiliate** system for granular commission attribution

## Content Management System

- Markdown-powered blog engine with **frontmatter parsing**
- Dynamically imports content from the filesystem
- Pagination support and **SEO-friendly URLs** for content visibility

## Security & Authentication

- **JWT authentication** via httpOnly cookies
- **bcrypt password hashing**
- Force password reset workflows
- **Input validation** and sanitization to protect user data
- Proper **CORS** and origin handling for cross-platform safety

## User Experience Highlights

- Fully responsive, **mobile-first design**
- **PWA (Progressive Web App)** support with installability
- Clean modal-based flows for login and subscriptions
- Real-time validation with helpful error feedback
- Smooth transitions and thoughtful animations
- Materials like referral coupons are **print-optimized**

## External Integrations

- **SSO integration** with an external deals platform
- Transactional email via **Mailgun**
- QR code generation for user sharing and print distribution
- Third-party **payment processing** via Stripe

## Business Logic Complexity

- Sophisticated, automated **referral economics**
- Dual tracking for **affiliates vs direct referrers**
- Auto-attribution of commissions based on referral chains
- **Dynamic subscription pricing** tied to referral performance

## Development Best Practices

- Modular React architecture using **custom hooks**
- Comprehensive **error handling** and edge-case coverage
- Code quality ensured via **ESLint**
- Clean separation of logic and UI
- Secure management of environment configs

## Outcome

iValueSavings.com is more than a subscription website — it's a marketing engine built for scale. The referral and affiliate system alone reflects a deep understanding of user acquisition, retention, and incentive alignment.

This project highlights my ability to:

- Build and deploy end-to-end production-grade systems
- Design and implement complex business logic
- Prioritize UX, security, and performance simultaneously
- Operate with a modern, efficient development workflow
