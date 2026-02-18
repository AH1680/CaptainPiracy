import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Command from './models/Command.js';

const commands = [
  // === Core / Gameplay ===
  // Treasure hunting
  {
    name: 'loot',
    category: 'core-treasure',
    description: 'Hunt for treasure once per hour.',
    usage: '/loot',
    cooldown: 3600,
  },
  {
    name: 'daily',
    category: 'core-treasure',
    description: 'Claim your daily reward.',
    usage: '/daily',
    cooldown: 86400,
  },
  {
    name: 'weekly',
    category: 'core-treasure',
    description: 'Claim your weekly reward.',
    usage: '/weekly',
    cooldown: 604800,
  },

  // Missions
  {
    name: 'mission',
    category: 'core-missions',
    description: 'Start an epic 6–48 hour pirate contract.',
    usage: '/mission',
    cooldown: 0,
  },
  {
    name: 'mission_complete',
    category: 'core-missions',
    description: 'Complete your active mission when its timer has finished.',
    usage: '/mission_complete',
    cooldown: 0,
  },

  // XP & profile
  {
    name: 'profile',
    category: 'core-leveling',
    description: 'View your pirate profile and achievements.',
    usage: '/profile',
    cooldown: 0,
  },
  {
    name: 'level',
    category: 'core-leveling',
    description: 'Check your current level, XP, and rank.',
    usage: '/level',
    cooldown: 0,
  },
  {
    name: 'levelup',
    category: 'core-leveling',
    description: 'Level up when you have enough XP.',
    usage: '/levelup',
    cooldown: 0,
  },
  {
    name: 'stats',
    category: 'core-leveling',
    description: 'View your gameplay statistics.',
    usage: '/stats',
    cooldown: 0,
  },
  {
    name: 'leaderboard',
    category: 'core-leveling',
    description: 'See the richest and highest-ranked pirates.',
    usage: '/leaderboard',
    cooldown: 0,
  },

  // Wealth & inventory
  {
    name: 'balance',
    category: 'core-wealth',
    description: 'Check your coins and overall wealth.',
    usage: '/balance',
    cooldown: 0,
  },
  {
    name: 'inventory',
    category: 'core-wealth',
    description: 'View your items and treasures.',
    usage: '/inventory',
    cooldown: 0,
  },

  // Economy & shop
  {
    name: 'shop',
    category: 'core-economy',
    description: 'Browse the pirate shop (51+ items).',
    usage: '/shop',
    cooldown: 0,
  },
  {
    name: 'buy',
    category: 'core-economy',
    description: 'Buy an item from the shop.',
    usage: '/buy <item> [quantity]',
    cooldown: 0,
  },
  {
    name: 'auction',
    category: 'core-economy',
    description: 'View or list items in 3‑minute auctions.',
    usage: '/auction',
    cooldown: 0,
  },
  {
    name: 'bid',
    category: 'core-economy',
    description: 'Bid on an active auction.',
    usage: '/bid <auction_id> <amount>',
    cooldown: 0,
  },
  {
    name: 'donate',
    category: 'core-economy',
    description: 'Donate coins to support the server or bot.',
    usage: '/donate <amount>',
    cooldown: 0,
  },

  // Combat & bounties
  {
    name: 'duel',
    category: 'core-combat',
    description: 'Challenge another pirate to a fair duel.',
    usage: '/duel @user',
    cooldown: 0,
  },
  {
    name: 'bounty',
    category: 'core-combat',
    description: 'Place or view bounties on pirates.',
    usage: '/bounty',
    cooldown: 0,
  },
  {
    name: 'hunt',
    category: 'core-combat',
    description: 'Hunt a bounty target (chance-based).',
    usage: '/hunt <target>',
    cooldown: 0,
  },
  {
    name: 'bounties',
    category: 'core-combat',
    description: 'List all active bounties.',
    usage: '/bounties',
    cooldown: 0,
  },
  {
    name: 'bounty_info',
    category: 'core-combat',
    description: 'View details for a specific bounty.',
    usage: '/bounty_info <id>',
    cooldown: 0,
  },
  {
    name: 'hunter_stats',
    category: 'core-combat',
    description: 'View your bounty hunting statistics.',
    usage: '/hunter_stats',
    cooldown: 0,
  },
  {
    name: 'sea_monster',
    category: 'core-combat',
    description: 'Battle dangerous sea monsters for big rewards.',
    usage: '/sea_monster',
    cooldown: 0,
  },
  {
    name: 'hunters_sm_stats',
    category: 'core-combat',
    description: 'View your sea monster hunting statistics.',
    usage: '/hunters_sm_stats',
    cooldown: 0,
  },

  // Crews & raids
  {
    name: 'crew',
    category: 'core-crews',
    description: 'Create, manage, or view your crew.',
    usage: '/crew',
    cooldown: 0,
  },
  {
    name: 'join_crew',
    category: 'core-crews',
    description: 'Join an existing crew.',
    usage: '/join_crew <crew_name>',
    cooldown: 0,
  },
  {
    name: 'crew_raid',
    category: 'core-crews',
    description: 'Launch a raid against rival crews.',
    usage: '/crew_raid',
    cooldown: 0,
  },
  {
    name: 'shipyard',
    category: 'core-crews',
    description: 'Manage ship upgrades and related features.',
    usage: '/shipyard',
    cooldown: 0,
  },

  // Adventure
  {
    name: 'monster_hall',
    category: 'core-adventure',
    description: 'Visit the hall of monsters and records.',
    usage: '/monster_hall',
    cooldown: 0,
  },
  {
    name: 'fish',
    category: 'core-adventure',
    description: 'Go fishing for aquatic treasures.',
    usage: '/fish',
    cooldown: 0,
  },
  {
    name: 'buybait',
    category: 'core-adventure',
    description: 'Purchase bait for fishing.',
    usage: '/buybait <type> [quantity]',
    cooldown: 0,
  },
  {
    name: 'fishingstats',
    category: 'core-adventure',
    description: 'View fishing statistics.',
    usage: '/fishingstats',
    cooldown: 0,
  },
  {
    name: 'cards',
    category: 'core-adventure',
    description: 'Open the card feature / mini-game.',
    usage: '/cards',
    cooldown: 0,
  },
  {
    name: 'cardguide',
    category: 'core-adventure',
    description: 'Learn how the card system works.',
    usage: '/cardguide',
    cooldown: 0,
  },
  {
    name: 'craft',
    category: 'core-adventure',
    description: 'Craft powerful items from materials.',
    usage: '/craft <recipe>',
    cooldown: 0,
  },
  {
    name: 'transmute',
    category: 'core-adventure',
    description: 'Transmute items into a new rarity.',
    usage: '/transmute <item>',
    cooldown: 0,
  },

  // Utility & social
  {
    name: 'help',
    category: 'core-utility',
    description: 'Show help and command information.',
    usage: '/help',
    cooldown: 0,
  },
  {
    name: 'ahoy',
    category: 'core-utility',
    description: 'Greet fellow pirates (optionally mention someone).',
    usage: '/ahoy [@user]',
    cooldown: 0,
  },
  {
    name: 'captain_word',
    category: 'core-utility',
    description: 'Receive a short message from the captain.',
    usage: '/captain_word',
    cooldown: 0,
  },
  {
    name: 'inquire',
    category: 'core-utility',
    description: 'Show the main Captain Bot overview / hub.',
    usage: '/inquire',
    cooldown: 0,
  },
  {
    name: 'pirateinquiry',
    category: 'core-utility',
    description: 'Alias of the inquiry hub.',
    usage: '/pirateinquiry',
    cooldown: 0,
  },

  // === Lore / Pirate Ledger ===
  // High-level lore tools
  {
    name: 'pirate_lore_help',
    category: 'lore-utility',
    description: 'Show the complete Pirate Lore Guide and categories.',
    usage: '/pirate_lore_help',
    cooldown: 0,
  },
  {
    name: 'ledger',
    category: 'lore-utility',
    description: 'Open the main lore ledger menu.',
    usage: '/ledger',
    cooldown: 0,
  },
  {
    name: 'portrait',
    category: 'lore-utility',
    description: 'Read the complete narrative portrait.',
    usage: '/portrait',
    cooldown: 0,
  },
  {
    name: 'search',
    category: 'lore-utility',
    description: 'Search all lore entries for a term.',
    usage: '/search <term>',
    cooldown: 0,
  },
  {
    name: 'lore_stats',
    category: 'lore-utility',
    description: 'View lore usage statistics.',
    usage: '/lore_stats',
    cooldown: 0,
  },
  {
    name: 'about',
    category: 'lore-utility',
    description: 'About the lore ledger and its purpose.',
    usage: '/about',
    cooldown: 0,
  },
  {
    name: 'pirate_history',
    category: 'lore-utility',
    description: 'Read real pirate history from Wikipedia.',
    usage: '/pirate_history',
    cooldown: 0,
  },
  {
    name: 'pirate_fact',
    category: 'lore-utility',
    description: 'Get a short, real-world pirate fact.',
    usage: '/pirate_fact',
    cooldown: 0,
  },
  {
    name: 'pirate_compendium',
    category: 'lore-utility',
    description: 'Open the pirate compendium of facts and stories.',
    usage: '/pirate_compendium',
    cooldown: 0,
  },

  // CODE category
  {
    name: 'code',
    category: 'lore-code',
    description: 'Overview of pirate democracy and the Code.',
    usage: '/code',
    cooldown: 0,
  },
  { name: 'code_ch1', category: 'lore-code', description: 'The Origin of Order.', usage: '/code_ch1', cooldown: 0 },
  {
    name: 'code_ch2',
    category: 'lore-code',
    description: 'Architecture of Equality.',
    usage: '/code_ch2',
    cooldown: 0,
  },
  {
    name: 'code_ch3',
    category: 'lore-code',
    description: 'Colour-Blind Covenant.',
    usage: '/code_ch3',
    cooldown: 0,
  },
  { name: 'code_ch4', category: 'lore-code', description: 'The Last Biscuit.', usage: '/code_ch4', cooldown: 0 },
  { name: 'code_ch5', category: 'lore-code', description: 'The Epitaph.', usage: '/code_ch5', cooldown: 0 },

  // MERCY category
  {
    name: 'mercy',
    category: 'lore-mercy',
    description: 'Overview of pirate mercy and fear.',
    usage: '/mercy',
    cooldown: 0,
  },
  {
    name: 'mercy_ch1',
    category: 'lore-mercy',
    description: 'The Flag as Diplomacy.',
    usage: '/mercy_ch1',
    cooldown: 0,
  },
  {
    name: 'mercy_ch2',
    category: 'lore-mercy',
    description: 'Theatre of Terror.',
    usage: '/mercy_ch2',
    cooldown: 0,
  },
  {
    name: 'mercy_ch3',
    category: 'lore-mercy',
    description: 'Treatment of Prisoners.',
    usage: '/mercy_ch3',
    cooldown: 0,
  },
  { name: 'mercy_ch4', category: 'lore-mercy', description: 'The Closing.', usage: '/mercy_ch4', cooldown: 0 },

  // SURGEON category
  {
    name: 'surgeon',
    category: 'lore-surgeon',
    description: "Overview of the ship's physician and medicine.",
    usage: '/surgeon',
    cooldown: 0,
  },
  {
    name: 'surgeon_ch1',
    category: 'lore-surgeon',
    description: "The Ship's Physician.",
    usage: '/surgeon_ch1',
    cooldown: 0,
  },
  {
    name: 'surgeon_ch2',
    category: 'lore-surgeon',
    description: 'The Medicine Chest.',
    usage: '/surgeon_ch2',
    cooldown: 0,
  },
  {
    name: 'surgeon_ch3',
    category: 'lore-surgeon',
    description: 'Democracy of Health.',
    usage: '/surgeon_ch3',
    cooldown: 0,
  },
  { name: 'surgeon_ch4', category: 'lore-surgeon', description: 'The Closing.', usage: '/surgeon_ch4', cooldown: 0 },

  // SANCTUARY category
  {
    name: 'sanctuary',
    category: 'lore-sanctuary',
    description: 'Overview of pirate sanctuary.',
    usage: '/sanctuary',
    cooldown: 0,
  },
  { name: 'sanctuary_ch1', category: 'lore-sanctuary', description: 'The Escape.', usage: '/sanctuary_ch1', cooldown: 0 },
  { name: 'sanctuary_ch2', category: 'lore-sanctuary', description: 'The Ranks.', usage: '/sanctuary_ch2', cooldown: 0 },
  {
    name: 'sanctuary_ch3',
    category: 'lore-sanctuary',
    description: 'The Covenant Renewed.',
    usage: '/sanctuary_ch3',
    cooldown: 0,
  },

  // LEGACY category
  {
    name: 'legacy',
    category: 'lore-legacy',
    description: 'Overview of pirate legacy.',
    usage: '/legacy',
    cooldown: 0,
  },
  {
    name: 'legacy_ch1',
    category: 'lore-legacy',
    description: 'Ships Return to Sand.',
    usage: '/legacy_ch1',
    cooldown: 0,
  },
  {
    name: 'legacy_ch2',
    category: 'lore-legacy',
    description: 'Echo in Institutions.',
    usage: '/legacy_ch2',
    cooldown: 0,
  },
  {
    name: 'legacy_ch3',
    category: 'lore-legacy',
    description: 'Treasure That Remains.',
    usage: '/legacy_ch3',
    cooldown: 0,
  },
  { name: 'legacy_ch4', category: 'lore-legacy', description: 'The Closing.', usage: '/legacy_ch4', cooldown: 0 },

  // Whispers
  {
    name: 'whisper_teach',
    category: 'lore-whispers',
    description: 'Education of Blackbeard.',
    usage: '/whisper_teach',
    cooldown: 0,
  },
  {
    name: 'whisper_julian',
    category: 'lore-whispers',
    description: "Quartermaster's Library.",
    usage: '/whisper_julian',
    cooldown: 0,
  },
  {
    name: 'whisper_maria',
    category: 'lore-whispers',
    description: 'Mistress Maria.',
    usage: '/whisper_maria',
    cooldown: 0,
  },
  {
    name: 'whisper_child',
    category: 'lore-whispers',
    description: 'Child of Whydah.',
    usage: '/whisper_child',
    cooldown: 0,
  },
  {
    name: 'whisper_fly',
    category: 'lore-whispers',
    description: 'William Fly.',
    usage: '/whisper_fly',
    cooldown: 0,
  },
  {
    name: 'whisper_ranger',
    category: 'lore-whispers',
    description: 'Colours of Ranger.',
    usage: '/whisper_ranger',
    cooldown: 0,
  },
  {
    name: 'whisper_bonny',
    category: 'lore-whispers',
    description: 'Anne Bonny.',
    usage: '/whisper_bonny',
    cooldown: 0,
  },
  {
    name: 'whisper_roberts',
    category: 'lore-whispers',
    description: 'Bartholomew Roberts.',
    usage: '/whisper_roberts',
    cooldown: 0,
  },
  {
    name: 'whisper_kosongo',
    category: 'lore-whispers',
    description: 'Benito Kosongo.',
    usage: '/whisper_kosongo',
    cooldown: 0,
  },
  {
    name: 'whisper_bounty',
    category: 'lore-whispers',
    description: 'Ship That Became Nation.',
    usage: '/whisper_bounty',
    cooldown: 0,
  },
  {
    name: 'whisper_plantain',
    category: 'lore-whispers',
    description: 'Poet of Port Royal.',
    usage: '/whisper_plantain',
    cooldown: 0,
  },
  {
    name: 'whisper_menendez',
    category: 'lore-whispers',
    description: 'The Last Pirate.',
    usage: '/whisper_menendez',
    cooldown: 0,
  },
  {
    name: 'whisper_random',
    category: 'lore-whispers',
    description: 'Get a random whispered truth.',
    usage: '/whisper_random',
    cooldown: 0,
  },

  // Navigation
  {
    name: 'chapter_first',
    category: 'lore-navigation',
    description: 'Jump to the first chapter in a category.',
    usage: '/chapter_first',
    cooldown: 0,
  },
  {
    name: 'chapter_prev',
    category: 'lore-navigation',
    description: 'Go to the previous chapter.',
    usage: '/chapter_prev',
    cooldown: 0,
  },
  {
    name: 'chapter_next',
    category: 'lore-navigation',
    description: 'Go to the next chapter.',
    usage: '/chapter_next',
    cooldown: 0,
  },
  {
    name: 'chapter_last',
    category: 'lore-navigation',
    description: 'Jump to the closing / last chapter.',
    usage: '/chapter_last',
    cooldown: 0,
  },
  {
    name: 'chapter_list',
    category: 'lore-navigation',
    description: 'List all chapters in the current category.',
    usage: '/chapter_list',
    cooldown: 0,
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('Seeding commands...');

    for (const cmd of commands) {
      await Command.findOneAndUpdate(
        { name: cmd.name },
        {
          name: cmd.name,
          category: cmd.category,
          description: cmd.description,
          usage: cmd.usage,
          cooldown: cmd.cooldown,
          enabled: true,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log(`Seeded ${commands.length} commands (upserted by name).`);
  } catch (err) {
    console.error('Error seeding commands:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();

