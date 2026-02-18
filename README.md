# Pirate Bot API (MongoDB)

Backend for the Pirate Bot dashboard. Uses **MongoDB** with Mongoose.

## Setup

1. Install dependencies from project root: `npm install`
2. Set `MONGODB_URI` in `.env` (default: `mongodb://localhost:27017/pirate-bot`)
3. Run MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and set `MONGODB_URI` to your connection string

## Clean backend-only deploy (server folder only)

You can deploy **only** the `server/` folder as a standalone Node.js app.

1. Upload the contents of `server/` to your host (so `index.js` is at the deployment root)
2. Install dependencies:
   - `npm install`
3. Set environment variables on the host (do **not** upload `.env`):
   - `MONGODB_URI`
   - `DISCORD_CLIENT_ID`
   - `DISCORD_CLIENT_SECRET`
   - `ALLOWED_ORIGINS` (your frontend domain; comma-separated if multiple)
   - `PORT` (usually provided by the host)
4. Start:
   - `npm start`

### Discord login (optional)

To enable "Login with Discord" on the homepage:

1. Create an application at [Discord Developer Portal](https://discord.com/developers/applications).
2. In OAuth2, add redirect URL: `http://localhost:5173/` (or your frontend origin).
3. In project root `.env` add:
   - `DISCORD_CLIENT_ID` = your application's client id
   - `DISCORD_CLIENT_SECRET` = your application's client secret
4. In frontend (same `.env`) add:
   - `VITE_DISCORD_CLIENT_ID` = same client id (used to build the login URL)

## Run

- **API only:** `npm run server` (listens on port 3001)
- **API + frontend:** `npm run dev:all`

Collections are created automatically when you first insert data (pirates, ships, crew_members, inventoryitems, commands, lootlogs, adminsettings).
