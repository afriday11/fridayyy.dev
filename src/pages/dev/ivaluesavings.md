---
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/ivaluesavings_thumb.jpg
header: /gallery/ivaluesavings_banner.jpg
title: "iValueSavings.com"
description: "A full-stack savings newsletter with built-in referral marketing"
categories: [full-stack, react, websites]
priority: 60
---

![iValueSavings Platform Screenshot](/gallery/ivaluesavings_banner.jpg)

# iValueSavings - Subscription Platform with Viral Referral Engine

A full-stack subscription platform built with React and Node.js, featuring a sophisticated referral system, Stripe integration, and a markdown-powered blog

- **Tech Stack:** React, Node.js, PostgreSQL, Stripe, Express, Vite
- **Key Features:** Referral tracking, subscription management, markdown blog, QR code sharing

Live Website: www.iValueSavings.com

## Motivation

I needed to build a newsletter subscription platform that could scale virally through user referrals while maintaining clean separation between business logic and presentation. The challenge was creating a system where users could earn free subscriptions by referring others, with proper tracking of both direct referrals and affiliate relationships.

## Architecture Overview

The project follows a clean separation between client and server, with the React frontend handling UI state and the Node.js backend managing business logic and database operations. The architecture is designed around three core systems:

- **Authentication & User Management:** JWT-based auth with cookie storage
- **Referral & Affiliate System:** Multi-level referral tracking with commission logic
- **Subscription Management:** Stripe integration with webhook handling

## Server Architecture

The server architecture demonstrates several interesting design patterns that make the codebase maintainable and scalable:

### Layered Architecture with Clear Separation

The server follows a clean layered architecture with distinct responsibilities:

```
┌─────────────────┐
│   Routes Layer  │  ← HTTP request/response handling
├─────────────────┤
│   API Layer     │  ← Business logic orchestration
├─────────────────┤
│ Database Layer  │  ← Data persistence
└─────────────────┘
```

**Routes Layer** (`/routes/`): Handles HTTP concerns like request parsing, response formatting, and middleware:

```js
// routes/member.js
router.post("/register", async (req, res) => {
  let newUser;
  try {
    newUser = await api.member.register(req.body);  // ← Delegates to API layer
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  // JWT generation and cookie setting
  const token = jwt.sign({...}, process.env.JWT_SECRET, {...});
  res.cookie("token", token, {...});

  res.status(201).json({...});
});
```

**API Layer** (`/api/`): Contains pure business logic without HTTP concerns:

```js
// api/member.js
const register = async ({
  email,
  password,
  firstName,
  lastName,
  referrerId,
  affiliateId,
  subscriptionId,
}) => {
  // Pure business logic - no HTTP concerns
  const hashedPassword = await bcrypt.hash(password, 10);
  const shortId = generateShortId("vs");

  // Database operations
  const newUser = await db.query(
    sql`INSERT INTO users (...) VALUES (...) RETURNING *`
  );

  // Business rule enforcement
  await updateReferrerFreeStatus(newUser.rows[0]);

  return newUser.rows[0];
};
```

**Database Layer** (`/db.js`): Abstracts database connection and provides a clean interface:

```js
// db.js
const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
```

## Centralized Authentication with Cookie-Based Sessions

The authentication system uses a centralized approach with JWT tokens stored in httpOnly cookies:

```js
// Main server endpoint for auth status
app.get("/", async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.json({ isLoggedIn: false, message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await api.member.getProfile(decoded.id);

    // Build additional data like SSO keys
    const DEALS_SSO_KEY = `${process.env.ACCESS_DEVELOPMENT_ORGANIZATION_ID}-${
      process.env.ACCESS_DEVELOPMENT_PROGRAM_ID
    }-${user.short_id.toUpperCase()}`;

    res.json({
      isLoggedIn: true,
      userId: user.id,
      // ... other user data
      dealsSSOKey: hashKey(DEALS_SSO_KEY),
    });
  } catch (error) {
    res.json({ isLoggedIn: false, error: error.message });
  }
});
```

This approach provides several benefits:

- **Security:** httpOnly cookies prevent XSS attacks
- **Simplicity:** Single endpoint for auth status
- **Flexibility:** Can add additional computed fields like SSO keys
- **Performance:** Reduces redundant API calls

## Novel Referral System Design

The most interesting aspect of this project is the sophisticated referral system that tracks both direct referrals and affiliate relationships. Users can refer others through a unique short ID, and the system maintains a clear hierarchy of who referred whom.

### Short ID Generation

Rather than using UUIDs or sequential IDs, I implemented a custom short ID system that's both human-readable and collision-resistant:

```js
function generateShortId(prefix, length = 6) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = prefix;
  const charactersLength = characters.length;
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % charactersLength;
    result += characters.charAt(randomIndex);
  }

  return result.toLowerCase();
}
```

This generates IDs like `vs8k2m9` - short enough to be shareable but with enough entropy to avoid collisions. The system includes collision detection and retry logic to ensure uniqueness.

### Multi-Level Referral Tracking

The referral system tracks two types of relationships:

1. **Direct Referrals:** When someone uses your referral link (`?ref=vs8k2m9`)
2. **Affiliate Relationships:** When a marketer promotes the platform (`?aff=marketer123`)

The system ensures that affiliate relationships cascade through referrals - if you refer someone, they inherit your affiliate relationship, ensuring proper commission tracking:

```js
// If the referrer is not null, find that user and get their affiliate id
if (referrerId && affiliateId === null) {
  const referrerUser = await db.query(
    "SELECT * FROM users WHERE short_id = $1",
    [referrerId]
  );
  if (referrerUser.rows.length > 0) {
    // Copy the affiliate id of the found referrer user
    // This ensures all customers who refer customers ultimately
    // get credited to the original affiliate
    affiliateId = referrerUser.rows[0].affiliate_id;
  }
}
```

### Free Subscription Logic

Users can earn free subscriptions by referring 3 active members. The system tracks this through a combination of database queries and real-time updates:

```js
const updateReferrerFreeStatus = async (user) => {
  if (!user.referrer_id) return;

  const referrer = await db.query("SELECT * FROM users WHERE short_id = $1", [
    user.referrer_id,
  ]);

  if (referrer.rows.length === 0) return;

  const activeReferrals = await db.query(
    "SELECT COUNT(*) FROM users WHERE referrer_id = $1 AND is_subscribed = true",
    [user.referrer_id]
  );

  const shouldBeFree = activeReferrals.rows[0].count >= 3;

  if (shouldBeFree !== referrer.rows[0].is_free_member) {
    await db.query("UPDATE users SET is_free_member = $1 WHERE short_id = $2", [
      shouldBeFree,
      user.referrer_id,
    ]);
  }
};
```

## Cookie-Based State Management

Instead of relying on URL parameters or localStorage, I implemented a custom cookie management system for tracking referral and affiliate relationships:

```js
function useCookie(name) {
  const [value, setValue] = useState(() => {
    return getCookie(name);
  });

  const updateCookie = useCallback(
    (newValue, options = {}) => {
      setCookie(name, newValue, options);
      setValue(newValue);
    },
    [name]
  );

  const deleteCookie = useCallback(() => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setValue(null);
  }, [name]);

  return [value, updateCookie, deleteCookie];
}
```

This approach provides several benefits:

- **Persistence across sessions:** Referral relationships survive browser restarts
- **Automatic cleanup:** Cookies can be set with expiration dates
- **Server-side access:** The backend can read referral cookies for analytics

## Stripe Integration with Webhook Handling

The Stripe integration is particularly interesting because it solves several complex business logic challenges that most subscription platforms don't handle:

### 1. Pre-Registration Subscription Validation

The most novel aspect is handling subscriptions that are created before user registration. This happens when someone subscribes through a referral link but hasn't created an account yet:

```js
if (subscriptionId) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const validProductId = process.env.STRIPE_PRODUCT_ID;

    const hasValidProduct = subscription.items.data.some(
      (item) => item.price.product === validProductId
    );

    if (!hasValidProduct) {
      throw new Error("Invalid subscription: does not contain a valid product");
    }

    // Check if the subscription is active
    if (subscription.status !== "active") {
      throw new Error("Subscription is not active");
    }

    stripeCustomerId = subscription.customer;
    validatedSubscriptionId = subscriptionId;
  } catch (error) {
    throw new Error(`Subscription validation failed: ${error.message}`);
  }
}
```

This validation ensures that users can't register with invalid or expired subscription IDs, preventing fraud while allowing legitimate pre-registration subscriptions.

### 2. Dynamic Coupon Application Based on Referral Status

The checkout system intelligently applies coupons based on referral relationships:

```js
// only apply coupon if referrerId or affiliateId is present
let coupon = null;
if (referrerId || affiliateId) {
  coupon = "aD2iPcvt";
}

// if affiliate is "debug", we should apply a different coupon
if (affiliateId === "debug") {
  coupon = "debug";
}
```

This creates a sophisticated discount system where referral relationships automatically trigger appropriate pricing, without requiring manual coupon code entry.

### 3. Metadata-Driven Webhook Processing

The webhook system uses subscription metadata to maintain referrer/affiliate relationships through the payment flow:

```js
subscription_data: {
  metadata: {
    user_id,
    referrerId,
    affiliateId,
  },
},
```

This ensures that referral relationships persist even when users complete payment through Stripe's hosted checkout, which is crucial for accurate commission tracking.

This Stripe integration demonstrates how to build a robust subscription system that handles complex business requirements like referral tracking, pre-registration subscriptions, and dynamic pricing - all while maintaining data integrity and preventing common edge cases that could lead to revenue loss or user confusion.

## Markdown Blog System

The blog system uses a file-based approach with automatic markdown processing:

```js
function importMarkdownPosts() {
  const postsDirectory = path.join(__dirname, "..", "..", "posts");
  const files = fs.readdirSync(postsDirectory);

  const posts = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(postsDirectory, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      return {
        ...data,
        content,
        slug: file.replace(".md", ""),
      };
    });

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}
```

This approach provides several advantages:

- **Version control friendly:** Blog posts are tracked in git
- **No database complexity:** Simple file system for content
- **Front matter support:** Metadata like title, date, author in YAML
- **Automatic slug generation:** URLs based on filenames

### Content Classification and Premium Gating

The blog implements sophisticated content classification through front matter metadata that enables advanced features:

```js
// Premium content gating
premium: true; // Restricts access to subscribers only

// Content type classification
type: "deal"; // Special styling and flagging for deal posts

// Rich metadata support
id: 1;
title: "Welcome to iValueSavings";
subtitle: "Your Path to Financial Independence and Fun Savings";
date: "2024-10-12";
author: "Dan Fessler";
image: "https://images.unsplash.com/photo-...";
```

This classification system enables **premium content gating** with automatic paywall overlays, **deal post highlighting** with special visual indicators, and **author attribution** with rich metadata display.

### Subscription-Gated Content with Graceful Degradation

The system implements sophisticated content gating that provides a smooth user experience for both subscribers and non-subscribers:

```js
// Premium content handling with graceful degradation
let isAuthorized = true;
if (post.premium && !user?.isSubscriber) {
  isAuthorized = false;
}

// Graceful content truncation with overlay
<div
  className={css`
    max-height: ${isAuthorized ? "auto" : "512px"};
    overflow: ${isAuthorized ? "visible" : "hidden"};
    position: relative;
    margin-bottom: 2rem;
  `}
>
  <div dangerouslySetInnerHTML={{ __html: marked(post.content) }} />
  {!isAuthorized && <LoginOverlay setModalState={setModalState} />}
</div>;
```

This creates a **freemium content model** where non-subscribers see truncated content with a call-to-action overlay, allowing them to preview the post structure before deciding to subscribe, rather than being blocked entirely.
