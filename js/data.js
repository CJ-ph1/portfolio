// ============================================================================
//  STACK_DATA — All tech stack items organized by category
//  Each item: { name, tag, level (0-100), desc, knows: [], refresher: {concepts, snippets}, mirror?, mirrorOf? }
// ============================================================================

const STACK_DATA = {
  'tools-db': [
    { name: 'DBeaver', tag: 'GUI Database Client', level: 55, desc: 'Multi-platform SQL GUI for browsing and querying databases across many engines.', knows: [
      'Multi-engine connections (MySQL, PostgreSQL, MongoDB)',
      'SQL editor with autocomplete and formatting',
      'ER diagram generation from existing schemas',
      'Data export/import (CSV, JSON, SQL dumps)',
      'Query performance analysis via EXPLAIN',
      'Ad-hoc connections with credentials (no saved profiles)',
      'Data injection via SQL scripts for testing and seeding'
    ], refresher: {
      concepts: [
        'DBeaver = one universal GUI, many engines via JDBC drivers',
        'Saved connection profiles let you skip re-typing credentials every session'
      ],
      snippets: [
        'Ctrl+Enter — execute current SQL statement\nAlt+X — execute entire script'
      ]
    }},
    { name: 'MongoDB Compass', tag: 'NoSQL GUI', level: 15, desc: 'Visual exploration tool for MongoDB collections — used mostly for viewing data.', knows: [
      'Collection browsing and document viewing',
      'Surface-level navigation of MongoDB data',
      'Haven\'t explored aggregation builder, indexing, or schema analysis yet'
    ], refresher: {
      concepts: [
        'Compass visualizes collections like a flexible-schema table browser',
        'Documents in one collection can have different shapes — no rigid columns',
        'Aggregation pipelines = multi-stage data transforms ($match → $group → $project)'
      ],
      snippets: [
        'Filter bar:  { "status": "active", "age": { "$gt": 18 } }',
        'Aggregation stage:  { "$group": { "_id": "$category", "count": { "$sum": 1 } } }'
      ]
    }}
  ],
  'tools-saas': [
    { name: 'TiDB', tag: 'SaaS Database', level: 30, desc: 'MySQL-compatible distributed HTAP database — operated in practice via their cloud.', knows: [
      'HTAP workloads (transactional + analytics in one DB)',
      'Cluster setup and provisioning on their cloud',
      'Monitoring dashboards for cluster health',
      'Practical experience operating and scaling clusters'
    ], refresher: {
      concepts: [
        'Architecture: TiDB (SQL layer) + TiKV (storage) + PD (placement driver)',
        'HTAP = OLTP + OLAP in one DB, no ETL to a warehouse needed',
        'Scales horizontally by adding TiKV nodes'
      ],
      snippets: [
        'Connect via any MySQL client:\nmysql -h gateway.tidbcloud.com -P 4000 -u user -p'
      ]
    }},
    { name: 'Neon', tag: 'Serverless Postgres', level: 12, desc: 'Serverless Postgres platform — treated as the Postgres counterpart to TiDB for basic ops.', knows: [
      'Check monitoring dashboards for DB health',
      'Manage connection credentials',
      'Basic operational parity with TiDB (surface-level use)'
    ], refresher: {
      concepts: [
        'Neon separates compute from storage — compute scales to zero when idle',
        'Branching = copy-on-write DB clone in seconds (great for testing migrations)',
        'Connection pooling built-in via pgbouncer (use pooled endpoint for serverless apps)'
      ],
      snippets: [
        'Connection string:\npostgresql://user:pass@ep-xxx.region.neon.tech/dbname'
      ]
    }}
  ],
  'tools-api': [
    { name: 'Postman', tag: 'API Client', level: 15, desc: 'Used primarily for testing API endpoints — similar to how I use Swagger.', knows: [
      'Test API endpoints to verify they work',
      'Basic request/response inspection',
      'Interchangeable with Swagger for quick endpoint checks'
    ], refresher: {
      concepts: [
        'Postman\'s real power: Collections + Environments + Tests (you\'re using it as a fancy curl)',
        'Environments let you swap baseURL/auth per stage with {{variableName}}',
        'Tests tab turns it into automated integration tests'
      ],
      snippets: [
        'Test example:\npm.test("status 200", () => {\n  pm.response.to.have.status(200);\n});',
        'Variable syntax in requests:\n{{baseUrl}}/users/{{userId}}'
      ]
    }},
    { name: 'Swagger', tag: 'API Docs (OpenAPI)', level: 50, desc: 'Primary tool for testing endpoints and serving as API documentation for the projects I build.', knows: [
      'Read OpenAPI spec files to understand an API',
      'Auto-generated UI from FastAPI output',
      'Request/response schema exploration',
      '"Try it out" interactive endpoint testing',
      'Primary dev-time tool for verifying endpoint behavior',
      'Use as the canonical API documentation reference'
    ], refresher: {
      concepts: [
        'OpenAPI = the spec format; Swagger = the toolchain (UI, Editor, Codegen)',
        'FastAPI\'s /docs is Swagger UI auto-generated from your Pydantic models',
        'Authoring a spec from scratch unlocks contract-first API design'
      ],
      snippets: [
        'Minimal spec skeleton:\nopenapi: 3.0.0\ninfo:\n  title: My API\n  version: 1.0.0\npaths:\n  /users:\n    get:\n      responses:\n        "200": { description: OK }'
      ]
    }}
  ],
  'tools-devops': [
    { name: 'Docker', tag: 'Containerization', level: 18, desc: 'Basic containerization — comfortable authoring Dockerfiles and running images.', knows: [
      'Dockerfile authoring for basic image builds',
      'Fundamental docker commands (build, run, ps, exec, logs)',
      'Haven\'t gone deep into multi-stage, compose, volumes, or orchestration'
    ], refresher: {
      concepts: [
        'Image = blueprint; Container = running instance of an image',
        'Dockerfile layers cache from top down — put slow/stable steps first, fast-changing last',
        'Multi-stage builds = build in one image, copy only the artifacts to a slimmer final image',
        'docker-compose.yml = define multi-service stack in one file (app + DB + cache)'
      ],
      snippets: [
        'Build + run:\ndocker build -t myapp .\ndocker run -p 8000:8000 myapp',
        'Compose:\ndocker-compose up -d\ndocker-compose logs -f app\ndocker-compose down',
        'Debug a running container:\ndocker exec -it <name> bash'
      ]
    }},
    { name: 'Linode', tag: 'Cloud VPS', level: 45, desc: 'End-to-end VPS workflow — provisioning, security hardening, and app deployment.', knows: [
      'DNS management (pointing domains at servers)',
      'Nginx reverse proxy setup',
      'StackScripts for auto-configuring new servers',
      'VPS provisioning and full navigation of the Linode console',
      'SSH-based security: user creation and key-based auth',
      'Application deployment workflow end-to-end',
      'GitHub-to-Linode connection via SSH deploy keys'
    ], refresher: {
      concepts: [
        'VPS = root access on a Linux box; you own everything above the kernel',
        'Nginx reverse proxy routes domain → app port (e.g., example.com → 127.0.0.1:8000)',
        'Firewall rules block/allow ports — always restrict SSH to your IP'
      ],
      snippets: [
        'SSH into server:\nssh -i ~/.ssh/key user@ip',
        'Nginx reverse proxy block:\nlocation / {\n  proxy_pass http://127.0.0.1:8000;\n  proxy_set_header Host $host;\n}'
      ]
    }}
  ],
  'tools-vcs': [
    { name: 'GitHub', tag: 'Hosting / Collaboration', level: 65, desc: 'Strong operational use — PRs, Actions, branch protection, secrets, releases.', knows: [
      'Pull request workflows and code review',
      'Issues, Projects, and Discussions for task tracking',
      'GitHub Actions workflows on push/PR',
      'Branch protection rules (require reviews, passing tests)',
      'Secrets management for automations',
      'Releases and version tagging',
      'Haven\'t set up CODEOWNERS, OIDC, or reusable workflows yet'
    ], refresher: {
      concepts: [
        'CODEOWNERS auto-assigns reviewers based on file paths (next step for you)',
        'Reusable workflows = DRY workflows shared across repos via `uses:`'
      ],
      snippets: [
        'CODEOWNERS example (in .github/):\n*.py    @py-team\n/docs/  @docs-team',
        'gh CLI shortcuts:\ngh pr create --fill\ngh pr checkout 123'
      ]
    }},
    { name: 'Git Bash', tag: 'Shell on Windows', level: 55, desc: 'Daily driver for Unix-style commands and git on Windows.', knows: [
      'Unix commands (grep, ssh, chmod) on Windows',
      'POSIX-style paths instead of Windows paths',
      'Shell scripting for local automation',
      'SSH key generation and management',
      'Folder navigation and file ops',
      'Haven\'t used piping/redirection much'
    ], refresher: {
      concepts: [
        'Pipe (|) sends output of one command as input to another',
        'Redirect (>, >>, <) writes to / reads from files'
      ],
      snippets: [
        'Pipe chain:\ncat file.log | grep ERROR | head -20',
        'Redirects:\ncmd > file.txt      # overwrite\ncmd >> file.txt     # append\ncmd < input.txt     # use file as stdin'
      ]
    }}
  ],
  'tools-editors': [
    { name: 'VS Code', tag: 'Code Editor', level: 75, desc: 'Deep practical use including Remote-SSH and Dev Containers.', knows: [
      'Extension ecosystem (Python, Docker, Git)',
      'Integrated terminal and debugger with breakpoints',
      'Remote-SSH for editing code on remote servers',
      'Dev Containers — developing inside Docker',
      'Multi-root workspaces (multiple project folders in one window)',
      'Tasks and launch configs for running/debugging',
      'Custom snippets and keybindings',
      'Don\'t use settings sync'
    ], refresher: {
      concepts: [
        'Command Palette (Ctrl+Shift+P) reaches every command and setting',
        'settings.json (user + workspace level) is the source of truth for config'
      ],
      snippets: [
        'Enable Settings Sync: gear icon ⚙ → "Turn on Settings Sync" → pick GitHub/Microsoft'
      ]
    }}
  ],
  'tools-ai': [
    { name: 'Claude Code', tag: 'AI Coding CLI', level: 45, desc: 'Power-user setup — CLAUDE.md memory, custom agents, and reusable slash commands configured.', knows: [
      'Code generation via terminal',
      'Code review assistance',
      'Documentation drafting',
      'Terminal setup and invocation',
      'Create CLAUDE.md files to give the agent persistent project memory',
      'Configure custom subagents for specialized workflows',
      'Set up reusable slash commands for repeated tasks',
      'Haven\'t fully leveraged auto-shell/test/git execution yet'
    ], refresher: {
      concepts: [
        'CLAUDE.md lives at project root and loads on every session — your persistent context',
        'Subagents = specialized workers the main agent delegates to',
        'Slash commands = reusable prompt templates stored in .claude/commands/'
      ],
      snippets: [
        'Common commands:\n/agents       # manage subagents\n/compact      # summarize history to save context\n/clear        # reset the session'
      ]
    }},
    { name: 'Claude Cowork', tag: 'AI Desktop Automation', level: 15, desc: 'Narrow use case — mostly for rapid UI screen/mockup generation.', knows: [
      'Generate UI screens and visual mockups faster',
      'Haven\'t explored file operations, multi-step automation, MCPs, or specialized skills'
    ], refresher: {
      concepts: [
        'Cowork has file tools (Read/Write/Edit) + a Linux sandbox — not just chat',
        'Built-in skills for Word/Excel/PowerPoint/PDF creation with polished output',
        'MCP connectors plug in external services (Slack, GitHub, Asana, etc.)',
        'Scheduled tasks run prompts on a cron schedule — automation without code'
      ],
      snippets: [
        'Try:\n"Read this folder and organize files by type"\n"Create a monthly expense report from these CSVs" (uses xlsx skill)'
      ]
    }},
    { name: 'Claude Chat', tag: 'AI Conversation', level: 10, desc: 'Surface-level use for basic info lookup.', knows: [
      'Ask basic questions to get information',
      'Haven\'t leveraged brainstorming, artifacts, prompt engineering, or project instructions'
    ], refresher: {
      concepts: [
        'Artifacts = runnable inline React/HTML or downloadable docs/code',
        'Projects = workspace with shared files + custom instructions shaping replies',
        'Upload PDFs, images, code for direct analysis — not just text chat'
      ],
      snippets: [
        'Prompt patterns:\n"Explain like I\'m a senior eng"\n"Give me 3 approaches with tradeoffs"\n"Produce this as an artifact"'
      ]
    }}
  ],
  'stack-lang': [
    { name: 'Python 3.11+', tag: 'Primary Language', level: 35, desc: 'Conceptual and architectural understanding — stronger on "why" and "what" than on code-level specifics.', knows: [
      'Understand the purpose of __init__ and OOP concepts',
      'Understand async/await behavior (non-blocking execution)',
      'Understand decorators and their role in adding behavior',
      'Apply separation of concerns and clean layered architecture',
      'Stronger at architectural reasoning than low-level code details'
    ], refresher: {
      concepts: [
        '__init__ runs AFTER object creation; __new__ runs BEFORE to create it',
        'async def needs an event loop — asyncio.run(coro) or a framework (FastAPI)',
        'Decorators are sugar: @deco above def f equals f = deco(f)',
        'Context managers (with blocks) auto-cleanup via __enter__/__exit__ or @contextmanager'
      ],
      snippets: [
        'async basic:\nasync def fetch():\n    result = await some_io()\n    return result',
        'decorator basic:\ndef timed(fn):\n    def wrapper(*a, **kw):\n        start = time.time()\n        r = fn(*a, **kw)\n        print(f"{time.time()-start}s")\n        return r\n    return wrapper'
      ]
    }},
    { name: 'TypeScript', tag: 'Language', level: 65, mirror: true, mirrorOf: 'Python type hints', desc: 'Typed superset of JavaScript — the JS/TS mirror of my Python+typing setup.', knows: [
      'Interface and type declarations',
      'Generics and utility types',
      'Mapped and conditional types basics',
      'tsconfig strict options'
    ], refresher: {
      concepts: [
        'Structural typing — if it has the shape, it\'s the type (static duck typing)',
        'Utility types: Partial<T>, Pick<T,K>, Omit<T,K>, Record<K,V>'
      ],
      snippets: [
        'interface User { id: number; name: string; }\ntype PartialUser = Partial<User>;\nfunction getUser<T extends User>(u: T): T { return u; }'
      ]
    }},
    { name: 'Node.js', tag: 'JS Runtime', level: 60, mirror: true, mirrorOf: 'Python runtime + asyncio', desc: 'JavaScript runtime — parallel to the Python interpreter for the intern stack.', knows: [
      'Event loop and non-blocking I/O',
      'Module resolution (CommonJS vs ESM)',
      'Stream API and async iterators'
    ], refresher: {
      concepts: [
        'Single-threaded event loop — never block it with sync CPU work',
        'async/await for I/O; worker_threads for CPU-heavy work'
      ],
      snippets: [
        'CommonJS vs ESM:\nconst fs = require(\'fs\');       // CJS\nimport fs from \'fs\';             // ESM'
      ]
    }}
  ],
  'stack-fw': [
    { name: 'FastAPI', tag: 'Web Framework', level: 15, desc: 'Surface-level familiarity — aware of Pydantic validation and CORS.', knows: [
      'Basic awareness of Pydantic request/response validation',
      'Know about CORS middleware',
      'Haven\'t gone deep into Depends, async routes, background tasks, auth, or APIRouter'
    ], refresher: {
      concepts: [
        'Pydantic models = type-driven request/response validation + auto OpenAPI',
        'Depends() = DI — injected per-request (DB session, current user, etc.)',
        'Use async def for routes that await I/O; def for CPU-bound',
        'APIRouter lets you split routes into modules and mount them'
      ],
      snippets: [
        'Basic endpoint + validation:\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\nclass Item(BaseModel):\n    name: str\n    price: float\n\n@app.post("/items")\nasync def create(item: Item):\n    return {"ok": True, "item": item}',
        'CORS:\nfrom fastapi.middleware.cors import CORSMiddleware\napp.add_middleware(CORSMiddleware, allow_origins=["*"])'
      ]
    }},
    { name: 'SQLAlchemy', tag: 'ORM', level: 30, desc: 'Conceptual understanding of ORM architecture and how it fits with schemas, models, and repositories.', knows: [
      'Understand how ORMs work at a conceptual level',
      'Aware of ORM security considerations',
      'Understand how schemas, models, and repository pattern fit together',
      'Architectural understanding more than hands-on feature use'
    ], refresher: {
      concepts: [
        'Model = Python class mapped to a table (subclasses Base)',
        'Session = unit of work — add, commit, rollback, close',
        'Lazy loading hits DB on attribute access (risk of N+1); eager (selectinload/joinedload) fetches upfront',
        'Always parameterize queries — ORM auto-protects, raw SQL does not'
      ],
      snippets: [
        'Declarative model:\nclass User(Base):\n    __tablename__ = "users"\n    id = Column(Integer, primary_key=True)\n    email = Column(String, unique=True)',
        'Query + commit:\nuser = session.query(User).filter(User.email == e).first()\nsession.add(new_user)\nsession.commit()'
      ]
    }},
    { name: 'Alembic', tag: 'Migrations', level: 70, desc: 'Claimed near-mastery of Alembic workflow — minus offline migrations.', knows: [
      'Auto-generate migrations from model changes',
      'Hand-write migrations for data transforms',
      'Handle branching migrations and merge points',
      'Downgrade paths for rolling back migrations',
      'Haven\'t used offline migration generation'
    ], refresher: {
      concepts: [
        'Autogenerate compares models vs DB — always review the diff before applying',
        'Offline mode emits SQL without connecting (useful for CI/prod review gates)'
      ],
      snippets: [
        'Core workflow:\nalembic revision --autogenerate -m "add users table"\nalembic upgrade head\nalembic downgrade -1',
        'Offline SQL generation:\nalembic upgrade head --sql > migration.sql'
      ]
    }},
    { name: 'Express.js', tag: 'Web Framework', level: 65, mirror: true, mirrorOf: 'FastAPI', desc: 'Minimal Node.js web framework — routing + middleware chain mirrors FastAPI ergonomics.', knows: [
      'Routing and middleware chains',
      'Error handling middleware patterns',
      'Request/response lifecycle'
    ], refresher: {
      concepts: [
        'Middleware chain: req → mw → mw → handler → res',
        'Error middleware has 4 args: (err, req, res, next)'
      ],
      snippets: [
        'app.use(express.json());\napp.get(\'/users/:id\', (req, res) => res.json({ id: req.params.id }));\napp.use((err, req, res, next) => res.status(500).json({ error: err.message }));'
      ]
    }},
    { name: 'TSOA', tag: 'API + OpenAPI Gen', level: 70, mirror: true, mirrorOf: 'FastAPI\'s auto-OpenAPI', desc: 'Decorator-driven controllers that auto-generate OpenAPI from TypeScript types — direct FastAPI equivalent.', knows: [
      'Decorator-based controllers',
      'Automatic OpenAPI spec generation from types',
      'Route definition + schema in one place',
      'Mirrors FastAPI\'s auto-docs workflow'
    ], refresher: {
      concepts: [
        'TS equivalent of FastAPI\'s auto-docs — decorators + types → OpenAPI',
        'Build step (tsoa spec-and-routes) generates spec + route file'
      ],
      snippets: [
        '@Route("users")\nexport class UsersController extends Controller {\n  @Get()\n  public async getAll(): Promise<User[]> { return users; }\n}'
      ]
    }},
    { name: 'Prisma', tag: 'ORM', level: 65, mirror: true, mirrorOf: 'SQLAlchemy + Alembic', desc: 'Type-safe ORM for Node/TS — covers both modeling (SQLAlchemy) and migrations (Alembic) in one tool.', knows: [
      'Schema file syntax (schema.prisma)',
      'Migration workflow (migrate dev/deploy)',
      'Prisma Client type-safe queries'
    ], refresher: {
      concepts: [
        'schema.prisma = SQLAlchemy models + Alembic config in one file',
        'prisma generate creates a type-safe client from your schema'
      ],
      snippets: [
        'prisma migrate dev --name init\nprisma generate\n\n// Type-safe query\nawait prisma.user.findMany({ where: { email } });'
      ]
    }},
    { name: 'Tsyringe', tag: 'DI Container', level: 55, mirror: true, mirrorOf: 'FastAPI Depends()', desc: 'Lightweight DI container for TypeScript — same principles as FastAPI\'s Depends().', knows: [
      'Container registration with decorators',
      'Injection tokens and scopes',
      'Mirrors FastAPI Depends() pattern'
    ], refresher: {
      concepts: [
        'Register with @injectable, inject with @inject — mirrors FastAPI Depends() mental model'
      ],
      snippets: [
        '@injectable()\nclass UserService { }\n\nclass Controller {\n  constructor(@inject(UserService) private svc: UserService) {}\n}'
      ]
    }}
  ],
  'stack-db': [
    { name: 'MySQL', tag: 'Relational DB', level: 85, desc: 'Widely-used open-source relational database.', knows: [
      'InnoDB engine tuning and indexing',
      'Joins, subqueries, and window functions',
      'User privileges and access control',
      'Backup/restore with mysqldump'
    ], refresher: {
      concepts: [
        'InnoDB = default engine, supports transactions + row-level locking',
        'EXPLAIN reveals query plan — "type: ALL" = full table scan (usually bad)'
      ],
      snippets: [
        'mysqldump -u user -p dbname > backup.sql',
        'EXPLAIN SELECT * FROM users WHERE email = "x";'
      ]
    }},
    { name: 'PostgreSQL', tag: 'Relational DB', level: 85, desc: 'Feature-rich relational database with strong SQL compliance.', knows: [
      'Advanced types: JSONB, arrays, enums',
      'Full-text search with tsvector',
      'CTEs and window functions',
      'Extensions (pgcrypto, uuid-ossp)'
    ], refresher: {
      concepts: [
        'JSONB is indexed/queryable; JSON is plain text',
        'CTE (WITH clauses) make multi-step queries readable, also support recursion'
      ],
      snippets: [
        'JSONB query:\nSELECT * FROM users WHERE profile->>\'city\' = \'Tokyo\';',
        'CTE:\nWITH active AS (SELECT * FROM users WHERE active)\nSELECT count(*) FROM active;'
      ]
    }},
    { name: 'MongoDB / NoSQL', tag: 'Document DB', level: 70, desc: 'Document-oriented database for flexible schema designs.', knows: [
      'Document modeling: embedded vs referenced',
      'Aggregation framework ($match, $group, $lookup)',
      'Indexes (compound, multikey, text)'
    ], refresher: {
      concepts: [
        'Embed for read-heavy 1:many; reference for many:many or unbounded arrays',
        'Aggregation pipeline stages compose like Unix pipes'
      ],
      snippets: [
        'Aggregation example:\ndb.orders.aggregate([\n  { $match: { status: "paid" } },\n  { $group: { _id: "$userId", total: { $sum: "$amount" } } }\n])'
      ]
    }}
  ],
  'stack-cache': [
    { name: 'Redis', tag: 'In-Memory Store', level: 75, desc: 'Cache, queues, pub/sub, and fast key-value storage.', knows: [
      'Key-value operations and data types (lists, sets, hashes)',
      'Pub/sub for event broadcasting',
      'Caching with TTL and eviction policies',
      'Redis as a task queue backend'
    ], refresher: {
      concepts: [
        'Data types: strings, lists (LPUSH/RPOP), sets (SADD), hashes (HSET), sorted sets (ZADD)',
        'TTL + eviction policy controls how cached values expire'
      ],
      snippets: [
        'Cache with TTL:\nSET session:abc "data" EX 3600',
        'Pub/sub:\nPUBLISH channel "hello"\nSUBSCRIBE channel'
      ]
    }}
  ],
  'stack-env': [
    { name: 'venv', tag: 'Python Env', level: 90, desc: 'Built-in Python virtual environment isolation.', knows: [
      'Environment isolation per project',
      'Activation scripts across platforms',
      'Freezing and reconstructing dependencies'
    ], refresher: {
      concepts: [
        'venv = a directory with its own Python binary + site-packages'
      ],
      snippets: [
        'Create and activate:\npython -m venv .venv\nsource .venv/bin/activate        # Unix\n.venv\\Scripts\\activate          # Windows'
      ]
    }},
    { name: 'Docker', tag: 'Containers', level: 80, desc: 'Reproducible containerized development and deployment.', knows: [
      'Multi-stage Dockerfiles for slim images',
      'docker-compose for local dev stacks',
      'Bind mounts and named volumes'
    ], refresher: {
      concepts: [
        'Bind mount = your folder (dev); Named volume = Docker-managed (prod data)'
      ],
      snippets: [
        'docker-compose up -d\ndocker-compose logs -f api'
      ]
    }},
    { name: 'pip', tag: 'Package Manager', level: 95, desc: 'Default Python package installer.', knows: [
      'requirements.txt and constraint files',
      'Editable installs for local development',
      'Private index configuration'
    ], refresher: {
      snippets: [
        'pip install -r requirements.txt\npip install -e .                 # editable install'
      ]
    }},
    { name: 'Poetry', tag: 'Python Dep Mgmt', level: 75, desc: 'Modern dependency management and packaging for Python projects.', knows: [
      'pyproject.toml dependency declarations',
      'Lock files for reproducible installs',
      'Script entry points and build system'
    ], refresher: {
      concepts: [
        'Poetry manages deps + venv + packaging in one tool via pyproject.toml'
      ],
      snippets: [
        'poetry add fastapi\npoetry install\npoetry run python app.py'
      ]
    }},
    { name: 'npm', tag: 'JS Package Manager', level: 70, desc: 'Node.js package manager for JS/TS dependencies.', knows: [
      'package.json scripts and dependencies',
      'Semantic versioning and lockfiles',
      'Workspaces for monorepos'
    ], refresher: {
      concepts: [
        'package-lock.json pins exact versions; package.json uses semver ranges (^, ~)'
      ],
      snippets: [
        'npm install\nnpm run <script>\nnpx <package>    # run without installing'
      ]
    }}
  ],
  'stack-quality': [
    { name: 'Ruff', tag: 'Linter / Formatter', level: 85, desc: 'Extremely fast Python linter and formatter written in Rust.', knows: [
      'Lint rule configuration',
      'Auto-fix for import sorting and formatting',
      'Integration with pre-commit'
    ], refresher: {
      concepts: [
        'Replaces black + isort + flake8 + pylint in one Rust-fast tool'
      ],
      snippets: [
        'ruff check . --fix\nruff format .'
      ]
    }},
    { name: 'Mypy', tag: 'Static Type Checker', level: 80, desc: 'Static type checking for Python code.', knows: [
      'Strict mode and gradual typing',
      'Type narrowing with isinstance/Protocol',
      'Plugin configuration for SQLAlchemy/Pydantic'
    ], refresher: {
      concepts: [
        'Gradual typing: untyped code allowed; strict mode enforces types everywhere'
      ],
      snippets: [
        'mypy src/ --strict'
      ]
    }},
    { name: 'Pre-commit', tag: 'Git Hooks', level: 80, desc: 'Framework for managing pre-commit hooks across the team.', knows: [
      'Hook configuration in .pre-commit-config.yaml',
      'Running Ruff, Mypy, and formatters',
      'Local and CI hook parity'
    ], refresher: {
      snippets: [
        'Install:\npip install pre-commit\npre-commit install\npre-commit run --all-files'
      ]
    }},
    { name: 'ESLint', tag: 'Linter', level: 70, mirror: true, mirrorOf: 'Ruff', desc: 'JavaScript/TypeScript linter — rule-based linting with shared configs, mirrors the Ruff workflow.', knows: [
      'Rule configuration and shared configs',
      'Plugin ecosystem (TypeScript, React)',
      'Integration with Prettier'
    ], refresher: {
      concepts: [
        'Extends a shared config, then overrides specific rules per project'
      ],
      snippets: [
        '.eslintrc.js:\nmodule.exports = {\n  extends: [\'plugin:@typescript-eslint/recommended\'],\n  rules: { \'no-console\': \'warn\' }\n};'
      ]
    }},
    { name: 'Husky', tag: 'Git Hooks', level: 65, mirror: true, mirrorOf: 'Pre-commit', desc: 'Git hook manager for Node projects — paired with lint-staged to mirror the Pre-commit workflow.', knows: [
      'Git hook management via npm scripts',
      'Pairing with lint-staged for incremental checks',
      'Pre-commit and commit-msg hooks'
    ], refresher: {
      concepts: [
        'Hooks live in .husky/; paired with lint-staged to run linters only on changed files'
      ],
      snippets: [
        'npx husky install\nnpx husky add .husky/pre-commit "npx lint-staged"'
      ]
    }}
  ],
  'stack-cicd': [
    { name: 'Git', tag: 'Version Control', level: 90, desc: 'Distributed version control for source code.', knows: [
      'Branching strategies (trunk-based, GitFlow)',
      'Rebase, cherry-pick, and merge conflicts',
      'Interactive rebase and history cleanup',
      'Submodules and worktrees'
    ], refresher: {
      concepts: [
        'Rebase rewrites history (clean); merge preserves it (context). Rebase feature → main'
      ],
      snippets: [
        'git rebase -i HEAD~3       # squash/reorder recent commits\ngit stash / git stash pop\ngit bisect start          # binary-search for bad commit'
      ]
    }},
    { name: 'GitHub Actions', tag: 'CI/CD', level: 80, desc: 'Automated build, test, and deploy pipelines directly in GitHub.', knows: [
      'YAML workflow authoring',
      'Matrix builds and reusable workflows',
      'Secrets, environments, and OIDC',
      'Deployment pipelines'
    ], refresher: {
      concepts: [
        'Triggers → Jobs (parallel) → Steps (sequential in a job)'
      ],
      snippets: [
        'Minimal workflow:\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: { python-version: "3.11" }\n      - run: pytest'
      ]
    }}
  ],
  'design': [
    { name: 'Modular Monolith', tag: 'Architecture', level: 80, desc: 'Single deployable app organized into well-bounded modules for clarity and speed.', knows: [
      'Bounded module design within one codebase',
      'Clear module APIs vs internal implementation',
      'Single deployment, multiple logical modules',
      'Evolution path to microservices'
    ], refresher: {
      concepts: [
        'One deployment, many internal modules with enforced boundaries',
        'Easier than microservices to refactor; can split out later if needed'
      ]
    }},
    { name: 'Event-Driven Architecture (EDA)', tag: 'Paradigm', level: 70, desc: 'Services communicate via events, enabling decoupling and scalability.', knows: [
      'Pub/sub vs event streaming patterns',
      'Event schemas and versioning',
      'Eventual consistency tradeoffs'
    ], refresher: {
      concepts: [
        'Publishers don\'t know subscribers → strong decoupling',
        'Eventual consistency: no distributed 2PC; use Saga for multi-step ops'
      ]
    }},
    { name: 'Domain-Driven Design (DDD)', tag: 'Methodology', level: 75, desc: 'Model software around business domains, bounded contexts, and ubiquitous language.', knows: [
      'Bounded contexts and context mapping',
      'Aggregates, entities, value objects',
      'Ubiquitous language with domain experts',
      'CQRS and event sourcing touchpoints'
    ], refresher: {
      concepts: [
        'Bounded contexts = different models for different parts of the business',
        'Aggregates = consistency boundary; one transaction never spans aggregates'
      ]
    }},
    { name: 'Microservices', tag: 'Architecture', level: 70, desc: 'Independently deployable services each owning a small business capability.', knows: [
      'Service decomposition by domain',
      'Inter-service communication (sync vs async)',
      'Distributed data challenges',
      'Observability and tracing'
    ], refresher: {
      concepts: [
        'Split by business capability, not by technical layer',
        'Each service owns its data; share via APIs or events, never shared DBs'
      ]
    }}
  ]
};

// Category key → visual category (for card coloring)
const CATEGORY_MAP = {
  'tools-db': 'tools', 'tools-saas': 'tools', 'tools-api': 'tools', 'tools-devops': 'tools',
  'tools-vcs': 'tools', 'tools-editors': 'tools', 'tools-ai': 'tools',
  'stack-lang': 'stack', 'stack-fw': 'stack', 'stack-db': 'stack', 'stack-cache': 'stack',
  'stack-env': 'stack', 'stack-quality': 'stack', 'stack-cicd': 'stack',
  'design': 'design'
};
