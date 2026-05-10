# System Design Awareness Guide

Use this **two ways**:
- **At the start of a session** — paste the prompt block as your first message, then describe your task.
- **Mid-conversation** — paste it anytime and say "use this from here on" or "check what I've been doing against this."

---

## The Prompt

```
From here on, whenever my code, architecture, or task touches one of the system design concepts below, briefly call it out — name the concept and explain it in 2–3 sentences in the context of what I'm doing. Don't interrupt the main task; just add it naturally as a short note inline or at the end of your response. This applies to everything in this session, including work already discussed.

## Fundamentals to watch for:

1. **System design** — The overall practice of defining the architecture, components, and data flow of a system to meet specific requirements.
2. **Horizontal vs vertical scaling** — Vertical adds more power to one machine; horizontal adds more machines. Triggered when thinking about traffic growth or resource limits.
3. **Load balancer** — Distributes incoming requests across multiple servers so no single one is overwhelmed.
4. **Caching** — Storing frequently accessed data in fast memory (like Redis) to reduce repeated computation or DB hits.
5. **CDN (Content Delivery Network)** — Serves static assets from servers geographically close to users, reducing latency.
6. **Database indexing** — Creating a data structure that speeds up queries on specific columns at the cost of extra write overhead.
7. **SQL vs NoSQL** — SQL for structured relational data with ACID guarantees; NoSQL for flexible schemas, high throughput, or document/key-value access patterns.
8. **Database replication** — Copying data across multiple DB nodes (primary → replicas) for redundancy and read scaling.
9. **Sharding** — Splitting a database horizontally across multiple machines by a shard key, so each node holds a subset of the data.
10. **CAP theorem** — A distributed system can only guarantee two of three: Consistency, Availability, Partition tolerance.
11. **Eventual consistency** — Replicas may be temporarily out of sync but will converge to the same state given enough time.
12. **Idempotency** — An operation that produces the same result no matter how many times it's called; critical for retries and APIs.
13. **Rate limiting** — Controlling how many requests a client can make in a time window to prevent abuse and protect resources.
14. **Load balancing strategies** — Algorithms like round-robin, least connections, or IP hashing that decide which server handles each request.
15. **API gateway** — A single entry point that handles routing, auth, rate limiting, and protocol translation for backend services.
16. **Message queue** — A buffer (like RabbitMQ or Kafka) that decouples producers from consumers, enabling async processing.
17. **Synchronous vs asynchronous communication** — Sync waits for a response before continuing; async sends a message and moves on, processing the result later.
18. **Failover** — Automatically switching to a backup system or node when the primary one fails.
19. **Health checking** — Periodic pings to services to detect failures and remove unhealthy nodes from rotation.
20. **Observability** — The ability to understand a system's internal state through logs, metrics, and traces.

## Intermediate (applied design):

1. **URL shortener design** — Mapping short codes to URLs using a key-value store, with concerns around collision, redirection speed, and analytics.
2. **Rate limiter design** — Implementing token bucket or sliding window algorithms, often backed by Redis for distributed state.
3. **Notification system design** — Fan-out architecture that pushes events to push/email/SMS channels, often via queues and worker services.
4. **File upload service design** — Handling multipart uploads, storing to object storage (S3), and generating access URLs securely.
5. **Search autocomplete design** — Prefix trie or inverted index served from low-latency storage, often with caching for popular queries.
6. **Consistent hashing** — A technique to distribute load across nodes where adding/removing a node only remaps a small fraction of keys.
7. **Chat system design** — WebSocket connections for real-time delivery, message persistence, and fan-out to multiple recipients.
8. **Database read/write splitting** — Routing writes to a primary DB and reads to replicas to reduce primary load and improve read throughput.

Only mention a concept when it's genuinely relevant to what I'm working on. Keep the callout short — 2 to 3 sentences max. Format each one like:

💡 **[Concept name]** — explanation here in context of what I'm doing.
```

---

## How to use

**Option A — Start of session:**
1. Copy the prompt block above.
2. Paste it as your first message in a new chat.
3. Describe your task or paste your code right after.

**Option B — Mid-conversation:**
1. Copy the prompt block above.
2. Paste it at any point in an ongoing session.
3. Add: *"apply this to what we've been doing and going forward."*
   Claude will look back at what you've already been working on, call out any concepts already in play, then continue doing so for the rest of the session.

---

## What it looks like in practice

You're building an Express API with Redis caching:

> 💡 **Caching** — You're using Redis to store query results so the database isn't hit on every request. This reduces latency and DB load for repeated reads, at the cost of needing an invalidation strategy when data changes.

You add retry logic to an endpoint:

> 💡 **Idempotency** — Your retry logic assumes the endpoint is idempotent — calling it multiple times won't cause duplicate side effects. This is critical for safe retries in distributed systems.

You paste it mid-session after already building a queue worker:

> 💡 **Message queue** — The worker you built earlier is consuming from a queue, which decouples your job producer from the processor. This means the producer doesn't wait for the job to finish and the worker can scale independently.
