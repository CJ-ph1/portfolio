# Knowledge Journey Explorer

An interactive map of my engineering toolkit — the languages, frameworks, tools, and architectural patterns I work with, each rated against full mastery rather than surface-level use.

> **Live demo:** (https://christianjaymendez-w.netlify.app/)

---

## About this page

This is not a "here's everything I've ever touched" skills list. It's a reflective portfolio of what I actually know, anchored to an honest self-assessment. Every item on the page carries:

- A **mastery percentage** measured against the full capability surface of the tool
- A **knowledge breakdown** — the specific capabilities I've practiced in real work
- A **quick refresher** with concept reminders and practical snippets, sized to how much I still need to review

Click any card to expand and see the detail.

---

## Who I am as an engineer

I'm a Python-first backend engineer who thinks about software architecturally before syntactically. I care more about how modules communicate, how domains stay bounded, and how layers separate responsibilities than I do about squeezing out language tricks.

My primary stack is Python with **FastAPI**, **SQLAlchemy**, and **Alembic**, deployed behind **Nginx** on **Linode** VPS infrastructure. I'm most comfortable reasoning about data flow from the HTTP layer through validation, domain logic, and the ORM — and I can explain why each layer exists, not just how to call into it.

### The mirror stack — a mentoring philosophy

Alongside my Python work I maintain a parallel **JavaScript/TypeScript stack** used specifically for mentoring interns. Each tool on my Python side maps one-to-one to its JS/TS counterpart:

| Primary (Python) | Mirror (JS/TS) |
|---|---|
| FastAPI | **TSOA** (decorator-based auto-OpenAPI) |
| SQLAlchemy + Alembic | **Prisma** |
| FastAPI `Depends()` | **Tsyringe** |
| Ruff | **ESLint** |
| Pre-commit | **Husky** |
| Pydantic typing | **TypeScript** |

When interns learn one side, the concepts transfer cleanly to the other. The architecture is identical — only the syntax changes. This is how I scale teaching without fragmenting my mental model.

---

## At a glance

**Primary Stack** — Python 3.11+ · FastAPI · SQLAlchemy · Alembic · PostgreSQL · MySQL · Redis · Ruff · Mypy · Pre-commit

**Infrastructure & Tools** — Docker · Linode VPS · Nginx · GitHub · GitHub Actions · VS Code (Remote-SSH, Dev Containers) · DBeaver · Postman · Swagger

**Mirror Stack (JS/TS for mentoring)** — TypeScript · Node.js · Express · TSOA · Prisma · Tsyringe · ESLint · Husky

**System Design** — Modular Monolith · Event-Driven Architecture · Domain-Driven Design · Microservices

**AI-Assisted Development** — Claude Code power user: CLAUDE.md project memory, custom subagents, and reusable slash commands configured for my workflows

---

## My approach

### Honest self-assessment

Percentages on this page are anchored to **full mastery** of each tool, not "how well I use what I use." If a tool has ten major capability surfaces and I've mastered three, I sit around 30% — even if I use it daily. This keeps every number meaningful:

| Range | Meaning |
|---|---|
| **90-100%** | Deep mastery including internals and edge cases |
| **70-85%** | Strong working knowledge of most features |
| **40-65%** | Solid use of core features, limited exposure to advanced ones |
| **15-35%** | Narrow or basic use — know only a slice of what the tool can do |
| **Below 15%** | Surface-level awareness |

### Architectural strength over encyclopedic recall

On some items — Python itself, FastAPI, SQLAlchemy — I rate lower than a purely operational measure might suggest. That's deliberate. I understand **why** patterns like context managers, decorators, async/await, bounded contexts, and repository interfaces exist, and I apply them architecturally every day. But I don't claim deep language-internals mastery, and I'd rather be honest about the shape of my knowledge than inflate a number.

### The page as a personal refresher

Each expanded card shows a Quick Refresher — mental models plus practical snippets, sized to my knowledge level on that item. Lower-% items get fuller refreshers where I'd benefit from a review; higher-% items get minimal reminders. The page doubles as my own cheat-sheet when I need to context-switch across the stack.

### Continuously evolving

This is a living page. Percentages and capabilities are updated as my knowledge changes — it's a snapshot of where I am now, not a frozen claim.

---

## Connect

- **GitHub** — _[your-github-handle]_
- **LinkedIn** — _[your-linkedin-url]_
- **Email** — _[your-email]_
