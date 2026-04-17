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
