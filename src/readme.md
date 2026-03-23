---

# 1️⃣ How Requests Reach Your Service

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

# 6️⃣ Now the Full Request Flow

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

Then:

```
Kafka
   │
   ▼
Email Worker
   │
   ▼
SMTP email
```

# How to run

1. Clone the repository
2. Go to docker folder 
3. Run docker compose up -d --build
4. Once this is done check if all the images are downloaded and containers are Up & running or not check for all the blocked ports and free them.
5. Once that is done run the rest.http client to check for if user are getting created all other features like redis cache, bloom filter, kafka & email notification, Check rate limiter and JWT session and refresh token