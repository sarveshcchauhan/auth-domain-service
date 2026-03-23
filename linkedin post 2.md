Here’s a **LinkedIn carousel–optimized image generation prompt** (clean, slide-by-slide, highly shareable, and visually consistent):

---

# 🎨 LinkedIn Carousel Image Prompt (Kafka System Design)

Create a **5-slide LinkedIn carousel** explaining an **event-driven authentication system using Kafka**.
Style must be consistent across all slides: **modern, minimal, clean system design diagrams (senior backend engineer style).**

Use **blue + purple gradient theme**, soft shadows, white background, and minimal text.

---

## 🟦 Slide 1 — “The Problem”

Visual:

* Simple box diagram of:

  * User → Auth API → Database → Email Service (blocked flow)

Text:

* “Traditional auth systems block on side effects”
* “Slow, tightly coupled, not scalable”

Style:

* Highlight bottleneck at Email Service

---

## 🟦 Slide 2 — “The Shift”

Visual:

* Auth Service → Kafka (center) → broken decoupled services

Text:

* “We move from request-driven → event-driven architecture”
* “API no longer handles side effects”

Highlight:

* Kafka as the central event bus

---

## 🟦 Slide 3 — “Producer Flow”

Visual:

* User → Auth Service → Kafka Topic: `user-events`

Text:

* “Auth service only publishes events”
* “Example: USER_REGISTERED”

Highlight:

* Clean single responsibility

---

## 🟦 Slide 4 — “Consumers + Retry System”

Visual:

* Kafka → Email Consumer → Email Service
* Failure path branching into:

  * email-retry-1
  * email-retry-2

Text:

* “Failures are retried, not lost”
* “Built-in resilience with retry topics”

Highlight:

* Retry flow arrows looping forward

---

## 🟦 Slide 5 — “DLQ + Final Architecture”

Visual:

* Kafka ecosystem full flow:

  * user-events
  * email consumer
  * retry topics
  * email-dead-letter (DLQ)

Text:

* “Every failure has a destination”
* “Nothing is lost in the system”

Footer:

* “Scalable. Reliable. Event-driven.”

Highlight:

* DLQ visually separated as “final stop”

---

# 🎯 Global Style Instructions (Important)

* Clean system design diagram style (like Big Tech whiteboard)
* Flat design, minimal icons
* Blue / purple gradient accents
* Soft glow arrows for data flow
* No characters, no cartoon style
* No heavy paragraphs inside images
* Keep text minimal (max 1–2 lines per slide)
* Focus on clarity + storytelling

---

# 🚀 Output Goal

A **highly shareable LinkedIn carousel** that explains:
👉 Kafka architecture
👉 Event-driven design
👉 Retry + DLQ system
👉 Real-world backend scalability

---

If you want next level, I can also:
🔥 Turn this into actual **LinkedIn post captions per slide**
🔥 Or design a **“Netflix-style system design story” carousel**
🔥 Or simplify it into a viral one-image infographic version
