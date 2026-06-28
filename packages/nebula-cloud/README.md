# Nebula Cloud

NestJS service for:

- multi-user registration and login
- JWT authentication
- mini-app creation and membership
- version upload
- review workflow
- version distribution

## Setup

1. Copy `.env.example` to `.env`
2. Set `DATABASE_URL` to your PostgreSQL instance
3. Run `npm install`
4. Run `npm run --workspace=@nebula-rn/cloud prisma:generate`
5. Run `npm run --workspace=@nebula-rn/cloud db:push`
6. Run `npm run --workspace=@nebula-rn/cloud db:seed`
7. Run `npm run cloud:dev`

Default seed admin:

- email: `admin@nebula.local`
- password: `password123`

## CLI upload

After the server is running:

```bash
nebula config server http://localhost:3001/api
nebula auth login
cd packages/sample-miniapp
npm run build
nebula miniapp upload --changelog "initial release"
```
