**1. What did you ask the AI to help you with, and why did you choose to use AI for that specific task?**

I asked the AI to diagnose and fix a backend issue in the event planner app where `/api/events` was returning a 500 error and events were not showing up for anonymous users. I chose AI because the error involved multiple layers — environment config, database connection, and application routing — and I needed a quick way to identify the exact cause and correct the setup.

**2. How did you evaluate whether the AI's output was correct or useful before using it?**

I checked the error logs from the running Node server and compared them with the AI's diagnosis. When the AI identified the SSL requirement and the missing `events` table, I verified those conditions with actual server output and database behavior.

**3. How did what the AI produced differ from what you ultimately used, and what does that tell you about your own understanding of the problem?**

The AI output correctly pointed out the key issues: an incomplete production DB host, a missing SSL option for Render Postgres, and the absence of the `events` table in the seeded database. I ultimately used the exact fix steps for `server/db/pool.js` and `server/.env`, plus seeding the database from `server/db/seed.js`, which matches my understanding that the problem was both configuration and database setup.(Inside render)

**4. What did you learn from using AI in this way?**

I learned that AI can quickly narrow down complex multilayer faults and suggest targeted changes, especially when the system has clear error traces. It was helpful for confirming the right fix path and avoided blind edits to unrelated files.
