# CoSchedule Coding Challenge – Reddit Proxy App

## Overview
This is my submission for the **CoSchedule Coding Challenge**.  
The challenge was to build a full-stack application that connects to a third-party data source (Reddit) and extends it with features like:
- Searching posts
- A star-based rating system (CRUD)
- A comment system (CRUD)
- Plus, designing everything so it would be straightforward to add authentication later

My focus was on writing clean, maintainable code that follows solid architecture patterns, with security best practices from the ground up.

---

## Live Frontend
You can see the deployed app here:  
[https://coschedule-client.vercel.app/](https://coschedule-client.vercel.app/)

---

## What it does
- Lets you search Reddit posts by keyword. The backend handles all OAuth and securely talks to Reddit, so the frontend never needs to know about API keys.
- Adds a simple rating system. You can give posts a 1 to 5 star rating, which is stored in PostgreSQL.
- Supports comments on posts — you can create, edit, and delete comments tied to specific Reddit posts.
- The whole system is built with the idea that adding user accounts later (to tie ratings/comments to real users) would be straightforward, thanks to how responsibilities are split.

---

## Why I chose this stack
| Layer    | Tech                                  | Reason |
|----------|---------------------------------------|--------|
| **Backend** | ASP.NET Core (.NET 8), EF Core, PostgreSQL, Docker | I wanted strong typing, performance, and a clean way to organize services, repositories, and controllers. Docker ensures it runs the same locally or in production. |
| **Frontend** | Next.js (App Router) with TypeScript | Started with the older Pages Router, but decided to migrate to App Router for better support of nested layouts and future scalability. |
| **Secrets** | AWS IAM & Secrets Manager          | Didn’t want to ever hardcode Reddit API credentials or even stick them in .env files. Secrets Manager + IAM keeps them secure and easy to rotate. |
| **Database** | PostgreSQL via EF Core            | Production-grade database, with migrations and relational power. Using EF Core makes it easy to swap or evolve the schema later.|

---

## How it’s structured
On the backend, I used a **layered architecture**:
- Controllers only handle HTTP requests and responses.
- Services take care of business logic, like talking to Reddit or managing ratings.
- Repositories handle all direct database work.

Everything follows **SOLID principles**, with interfaces in place so it’s easy to swap out implementations or test in isolation. Dependency injection is wired through ASP.NET Core’s built-in container.

On the frontend, I chose to switch to **Next.js App Router** because it’s where the framework is heading. It makes layouts and data fetching cleaner, which is useful if the app grows (for example, adding dashboards or user profiles later).

---

## Running it locally

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/)
- Node 18+
- PostgreSQL up and running (update your `appsettings.Development.json` or connection string accordingly)
- AWS IAM access keys with permission to read from Secrets Manager (for Reddit credentials)

### Backend
```bash
git clone https://github.com/keonwoo-kim/CoScheduleOA
cd CoScheduleOA
# Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your environment
dotnet ef database update
dotnet run
```

### Frontend
```bash
git clone https://github.com/keonwoo-kim/coschedule-client
cd coschedule-client
npm install
# Make sure your .env.local has something like:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
npm run dev
```
Then go to [http://localhost:3000](http://localhost:3000).

---

## A few final thoughts
I built this roughly a week, trying to balance adding features with keeping the codebase clean and extensible.
It’s set up so adding more features (eamil based, more verification, favorites, history, etc.).
If you’d like to look deeper at how it’s structured or have any questions, I’d be happy to walk through the design choices in more detail.
