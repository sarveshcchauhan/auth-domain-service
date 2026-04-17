📦 **Building Scalable Backend Auth Systems with Clean Architecture**

Here’s how we structure our **authentication system** for maintainability, performance, and scalability:

**Key Highlights from Our Architecture:**

* **Modular Design with Clean Architecture:**
  Each module follows **Clean Architecture principles**:

  * **Controllers** – handle HTTP requests and responses
  * **Services** – contain business logic
  * **Repositories / Interfaces** – abstract data access (MongoDB, Redis, etc.)
  * **Models / Types** – define domain entities
  * **Routes** – clearly define module endpoints
    This separation ensures **decoupling, testability, and scalability**.

* **Infrastructure Layer:**

  * Redis cache for **fast lookups**
  * MongoDB for **persistent storage**
  * Bloom Filters for **probabilistic existence checks**
  * Kafka + Retries + DLQ for **resilient event-driven flows**
  * SMTP for **email notifications**

* **Middleware:**
  Auth and rate-limiting middleware ensure **secure, performant request handling**.

* **Workers:**
  Background workers handle retries, emails, and dead-letter queues **without blocking main threads**.

* **Utils:**
  Centralized JWT and hashing utilities for **secure authentication and token management**.

✨ **Why it matters:**

* Scalability: Each component grows independently.
* Resilience: Failures in one service don’t crash the system.
* Security: Tokens, hashed credentials, and rate limits keep the system safe.
* Maintainability: Clear separation of concerns makes onboarding and debugging faster.

💡 **Takeaway:** Clean Architecture + modular design

# How Requests Reach Your Service

The full request flow should be:

```text
Client
   │
   ▼
Routes
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Database
```

Responsibilities:

| Layer      | Responsibility               |
| ---------- | ---------------------------- |
| Routes     | Define API endpoints         |
| Controller | Handle HTTP request/response |
| Service    | Business logic               |
| Repository | Database access              |


---

# Now the Full Request Flow

Registration example:

```
POST /auth/register
```

Flow:

```text
Client
   │
   ▼
Auth Routes
   │
   ▼
Auth Controller
   │
   ▼
Auth Service
   │
   ├ Bloom Filter check
   ├ Redis check
   ├ MongoDB insert
   └ Kafka event publish
```

## KAFKA Implemented Features:
```
✅ Event-driven design
✅ Kafka-based async processing
✅ Channel abstraction (email + slack)
✅ Retry strategy with backoff topics
✅ DLQ isolation per channel
✅ Idempotency (Redis)
✅ Observability hooks (traceId, logs)
```


# ✅ 1. SUCCESS FLOW (Happy Path)

```text id="flow1"
User Signup
   ↓
DB write
   ↓
Outbox (PENDING)
   ↓
Outbox Worker → Kafka
   ↓
Consumer
   ↓
Inbox (PENDING → DONE)
   ↓
processEvent
   ↓
sendEmail ✅
   ↓
DONE ✅
```


# ❌ 2. FAILURE FLOW (Email fails)

Example: SMTP is down

---

```text id="flow3"
User Signup
   ↓
Outbox
   ↓
Kafka
   ↓
Consumer
   ↓
Inbox
   ↓
processEvent
   ↓
sendEmail ❌
   ↓
Retry 1
   ↓
Retry 2
   ↓
Retry 3
   ↓
DLQ 💀
```

# How to run

1. Clone the repository
2. Go to docker folder 
3. Run docker compose up -d --build
4. Once this is done check if all the images are downloaded and containers are Up & running or not check for all the blocked ports and free them.
5. Once that is done run the rest.http client to check for if user are getting created all other features like redis cache, bloom filter, kafka & email notification, Check rate limiter and JWT session and refresh token

### UI Dashboards On Docker
1. MailHog -> For mails related service
2. Kafka -> For all kafka topics, producers and consumers details
3. Redis -> To track all the keys
4. Jager -> For tracking and observability
