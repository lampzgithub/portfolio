require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'shrikant';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme123';

const seedProjects = [
  {
    title: 'AI Image Generator Bot',
    tagline: 'Discord bot for stable diffusion, ridden during the midjourney wave',
    description:
      'Built a Discord bot that generated images on demand. Started with locally hosted Stable Diffusion models, then moved to hosted APIs once usage scaled. Handled queueing, rate limits, and payments end to end.',
    stack: ['Python', 'discord.py', 'Stable Diffusion', 'Firebase'],
    period: '2022 – 2023',
    role: 'Solo dev + community ops',
    highlights: [
      'Grew the Discord server past 13k members, with 800+ daily active bot users',
      'Ran 32 paid subscriptions across Discord and Telegram',
      'Migrated from local GPU inference to API-backed generation without downtime'
    ],
    link: '',
    github: '',
    order: 1
  },
  {
    title: 'PayCode',
    tagline: 'A small dev agency I built and later exited',
    description:
      'Ran a development agency that delivered client work at volume. Hired three developers on a per-project basis and handled scoping, delivery, and client comms myself. Eventually sold it to another developer.',
    stack: ['Ops', 'Client work', 'Hiring'],
    period: '2023 – 2024',
    role: 'Founder, sold',
    highlights: [
      'Delivered 600+ projects with consistent positive reviews',
      'Five-figure revenue run rate',
      'Exited via sale to a fellow developer'
    ],
    link: '',
    github: '',
    order: 2
  }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ username: ADMIN_USERNAME });
  if (!existing) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({ username: ADMIN_USERNAME, passwordHash });
    console.log(`admin user "${ADMIN_USERNAME}" created`);
  } else {
    console.log('admin user already exists, skipping');
  }

  const count = await Project.countDocuments();
  if (count === 0) {
    await Project.insertMany(seedProjects);
    console.log(`seeded ${seedProjects.length} projects`);
  } else {
    console.log('projects already exist, skipping');
  }

  await mongoose.disconnect();
  console.log('done');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
