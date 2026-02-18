import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Pirate from './models/Pirate.js';
import Ship from './models/Ship.js';
import CrewMember from './models/CrewMember.js';
import InventoryItem from './models/InventoryItem.js';
import Command from './models/Command.js';
import LootLog from './models/LootLog.js';
import AdminSetting from './models/AdminSetting.js';

await connectDB();

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  })
);
app.use(express.json());

const toObj = (doc) => (doc ? doc.toJSON() : null);

// Simple health/status endpoint for uptime checks and dashboards
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : dbState === 0 ? 'disconnected' : 'disconnecting';

  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db: dbStatus,
  });
});

// Static bot metadata to power the marketing site / "about" sections
app.get('/api/bot-info', (req, res) => {
  const {
    BOT_NAME,
    BOT_TAGLINE,
    BOT_INVITE_URL,
    BOT_SUPPORT_SERVER_URL,
    BOT_WEBSITE_URL,
    BOT_AVATAR_URL,
  } = process.env;

  res.json({
    name: BOT_NAME || 'Captain Piracy',
    tagline:
      BOT_TAGLINE ||
      'The ultimate pirate looting adventure on Discord – treasure hunting, missions, duels, crews, and lore.',
    invite_url: BOT_INVITE_URL || null,
    support_server_url: BOT_SUPPORT_SERVER_URL || null,
    website_url: BOT_WEBSITE_URL || null,
    avatar_url: BOT_AVATAR_URL || null,
  });
});

// GET pirate by discord_id
app.get('/api/pirates/:discordId', async (req, res) => {
  try {
    const pirate = await Pirate.findOne({ discord_id: req.params.discordId });
    res.json(toObj(pirate));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH pirate profile (limited, player-facing fields)
app.patch('/api/pirates/:id', async (req, res) => {
  try {
    const allowed = ['island_name', 'title', 'bio'];
    const update = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        update[key] = req.body[key];
      }
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'No editable profile fields provided' });
    }

    const pirate = await Pirate.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!pirate) {
      return res.status(404).json({ error: 'Pirate not found' });
    }
    res.json(toObj(pirate));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET ship by id
app.get('/api/ships/:id', async (req, res) => {
  try {
    const ship = await Ship.findById(req.params.id);
    res.json(toObj(ship));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET crew members by pirate_id
app.get('/api/crew/:pirateId', async (req, res) => {
  try {
    const crew = await CrewMember.find({ pirate_id: req.params.pirateId }).sort({ createdAt: 1 });
    res.json(crew.map(toObj));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET inventory by pirate_id
app.get('/api/inventory/:pirateId', async (req, res) => {
  try {
    const items = await InventoryItem.find({ pirate_id: req.params.pirateId }).sort({ createdAt: -1 });
    res.json(items.map(toObj));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET all commands
app.get('/api/commands', async (req, res) => {
  try {
    const list = await Command.find().sort({ category: 1, name: 1 });
    res.json(list.map(toObj));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET commands grouped by category to match website sections
app.get('/api/commands/grouped', async (req, res) => {
  try {
    const list = await Command.find().sort({ category: 1, name: 1 });
    const grouped = {};
    for (const cmd of list) {
      const obj = toObj(cmd);
      const cat = obj.category || 'uncategorised';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(obj);
    }
    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET loot log by pirate_id
app.get('/api/loot-log/:pirateId', async (req, res) => {
  try {
    const log = await LootLog.find({ pirate_id: req.params.pirateId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(log.map(toObj));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET admin settings
app.get('/api/admin-settings', async (req, res) => {
  try {
    const list = await AdminSetting.find().sort({ setting_key: 1 });
    res.json(list.map(toObj));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH admin setting
app.patch('/api/admin-settings/:key', async (req, res) => {
  try {
    const updated = await AdminSetting.findOneAndUpdate(
      { setting_key: req.params.key },
      { setting_value: req.body.setting_value ?? req.body.value, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Setting not found' });
    res.json(toObj(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Discord OAuth: exchange code for pirate
app.get('/api/auth/discord/client-id', (req, res) => {
  res.json({ client_id: process.env.DISCORD_CLIENT_ID || null });
});

app.post('/api/auth/discord', async (req, res) => {
  try {
    const { code, redirect_uri } = req.body;
    if (!code || !redirect_uri) {
      return res.status(400).json({ error: 'Missing code or redirect_uri' });
    }
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.status(503).json({ error: 'Discord auth not configured' });
    }
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri,
      }),
    });
    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      return res.status(400).json({ error: 'Discord token exchange failed', details: err });
    }
    const tokenData = await tokenRes.json();
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!userRes.ok) return res.status(400).json({ error: 'Failed to fetch Discord user' });
    const discordUser = await userRes.json();
    const discordId = discordUser.id;
    const username = discordUser.username || 'Pirate';
    let pirate = await Pirate.findOne({ discord_id: discordId });
    if (!pirate) {
      pirate = await Pirate.create({
        discord_id: discordId,
        username,
        level: 1,
        experience: 0,
        gold: 100,
        ship_id: null,
        island_name: 'Tortuga',
        avatar_url: discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordId}/${discordUser.avatar}.png`
          : null,
      });
    }
    let isServerAdmin = false;
    try {
      const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      if (guildsRes.ok) {
        const guilds = await guildsRes.json();
        const ADMINISTRATOR = 0x8;
        isServerAdmin = guilds.some(
          (g) => g.owner === true || (Number(g.permissions) & ADMINISTRATOR) === ADMINISTRATOR
        );
      }
    } catch (_) {}
    res.json({ pirate: toObj(pirate), isServerAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Fallback 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
