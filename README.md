<div align="center">
  <img src="public/logo.png" alt="Feedbase" width="84" height="64" />
  <h1>Feedbase</h1>
  <p>Open-source, self-hosted feedback boards for your users and team.</p>

  <p>
    <a href="https://github.com/breadddevv/feedbase/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-pink?style=flat-square" alt="MIT License" /></a>
    <a href="https://github.com/breadddevv/feedbase/stargazers"><img src="https://img.shields.io/github/stars/breadddevv/feedbase?style=flat-square&color=pink" alt="Stars" /></a>
    <a href="https://github.com/breadddevv/feedbase/issues"><img src="https://img.shields.io/github/issues/breadddevv/feedbase?style=flat-square&color=pink" alt="Issues" /></a>
    <a href="https://github.com/breadddevv/feedbase/releases"><img src="https://img.shields.io/github/v/release/breadddevv/feedbase?style=flat-square&color=pink" alt="Latest release" /></a>
  </p>

  <p>
    <a href="https://feedbase.app">Website</a> ·
    <a href="https://docs.feedbase.app">Docs</a> ·
    <a href="https://discord.gg/aYYFyfJSJC">Discord</a> ·
    <a href="https://github.com/breadddevv/feedbase/releases">Changelog</a>
  </p>

  <br />

  <img src="public/og.png" alt="Feedbase screenshot" width="100%" />
</div>

> [!WARNING]
> Feedbase is a work in progress. By the time you're reading this, some features listed here may not yet be available — or new ones may have shipped that aren't documented yet. Have a suggestion or found something off? Open an [issue](https://github.com/breadddevv/feedbase/issues) or join us on [Discord](https://discord.gg/aYYFyfJSJC).

---

## What is Feedbase?

Feedbase is a self-hosted, open-source feedback management tool. Give your users a place to submit ideas, report bugs, and upvote what matters — all on your own infrastructure.

No SaaS subscriptions. No vendor lock-in. Your data stays yours.

> Inspired by tools like Canny, Fider, and Productboard — but free, open, and self-hosted.

---

## Features

- **Feedback boards** — public or private boards per project, with upvotes and threaded comments
- **Suggestion statuses** — customisable statuses (Under Review, Planned, In Progress, Done, Won't Do)
- **Public roadmap** — kanban-style roadmap view your users can follow
- **Changelog** — publish release notes tied to resolved suggestions
- **Discord integration** — webhooks on new posts, slash commands to update statuses from Discord
- **Email notifications** — notify voters when a suggestion status changes
- **Roles & permissions** — Owner, Admin, Member, Viewer
- **Admin panel** — manage users, projects, and instance settings at `/admin`
- **Update notifications** — get notified in the admin panel when a new release is available
- **Self-update aware** — baked-in version tracking via Docker build args
- **MIT licensed** — fork it, modify it, ship it

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js (App Router) |
| Auth | better-auth |
| Database | PostgreSQL + Prisma |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Deployment | Docker / docker-compose |

---

## Getting started

### Prerequisites

- Node.js 22+
- PostgreSQL 15+
- Docker (recommended)

### Option 1 — Docker (recommended)

```bash
git clone https://github.com/breadddevv/feedbase.git
cd feedbase
cp .env.example .env
# Fill in your .env values
docker compose up -d
```

Feedbase will be available at `http://localhost:3000`.

### Option 2 — Manual

```bash
git clone https://github.com/breadddevv/feedbase.git
cd feedbase
cp .env.example .env
# Fill in your .env values
npm install
npx prisma migrate deploy
npm run build
npm start
```

### One-click deploys

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/feedbase)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/breadddevv/feedbase&project-name=feedbase&root-directory=apps/web&framework=nextjs&env=DATABASE_URL,BETTER_AUTH_URL,DISCORD_CLIENT_ID,DISCORD_CLIENT_SECRET,DISCORD_BOT_TOKEN,DISCORD_WEBHOOK_URL,DISCORD_GUILD_ID,ROBLOX_CLIENT_ID,ROBLOX_CLIENT_SECRET)

---

## Configuration

Copy `.env.example` to `.env` and fill in the required values:

```env
DATABASE_URL=postgresql://host:password@localhost:5432/feedbase
BETTER_AUTH_URL=http://localhost:3000 # no trailing slash

DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_BOT_TOKEN=
DISCORD_WEBHOOK_URL=
DISCORD_GUILD_ID=

ROBLOX_CLIENT_ID=
ROBLOX_CLIENT_SECRET=
```

---

## Upgrading

Feedbase checks for updates automatically against the [GitHub releases page](https://github.com/breadddevv/feedbase/releases). When a new version is available, you'll see a banner in the admin panel.

To upgrade with Docker:

```bash
docker compose pull
docker compose up -d
```

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

```bash
# Run locally in dev mode
npm run dev

# Run database migrations
npx prisma migrate dev

# Lint
npm run lint
```

---

## Roadmap

- [ ] Slack integration
- [ ] GitHub Issues sync
- [ ] REST API + API keys
- [ ] Import from Canny / Fider
- [ ] AI duplicate detection

---

## License

Feedbase is open-source software released under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with 🩷 by <a href="https://github.com/breadddevv">@breadddevv</a></p>
  <p>
    <a href="https://feedbase.breaddevv.cc/privacy">Privacy policy</a> ·
    <a href="https://feedbase.breaddevv.cc/terms">Terms of service</a>
  </p>
</div>
