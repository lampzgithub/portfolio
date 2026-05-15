const router = require('express').Router();
const SiteConfig = require('../models/SiteConfig');
const auth = require('../middleware/auth');

const DEFAULTS = {
  hero: {
    eyebrow: 'SB — 01 / portfolio',
    tagline: 'Reverse-engineers problems until they give up.',
    sub: 'Ran a Discord community of 13k people before I could drive. Built and sold a dev agency by 20. Now going deep on systems, security, and the fundamentals I skipped the first time.',
    badges: [
      { label: 'Delhi, India', color: 'purple' },
      { label: 'BCA · GGSIPU', color: 'cyan' },
      { label: 'Open to work', color: 'pink' }
    ]
  },
  about: {
    paragraphs: [
      "Started with a Discord bot idea. It scaled to 13k members before I had a plan — which meant learning systems design by fire, not by book. I shipped, it broke, I fixed it. Repeat until good.",
      "Pivoted that into PayCode — a dev agency that delivered 600+ projects in a year. What I actually learned: writing specs, managing scope creep, and that most technical problems are just communication problems in disguise.",
      "These days I'm going deeper into the stack. Networks, security, the guts of systems. The stuff that makes the difference between someone who can code and someone who understands what's actually happening."
    ],
    sidebar: [
      { key: 'Currently', value: 'BCA, final year' },
      { key: 'Previously', value: 'Founder, PayCode' },
      { key: 'Reading', value: 'Networks & security' },
      { key: 'Tools', value: 'Python, Linux, Docker' }
    ]
  },
  stack: [
    { category: 'Languages', color: 'purple', items: ['Python', 'JavaScript', 'HTML & CSS', 'C'] },
    { category: 'Libraries', color: 'cyan', items: ['pandas, numpy', 'matplotlib', 'requests, pillow', 'opencv'] },
    { category: 'Infra & tools', color: 'pink', items: ['Git, Docker', 'SQL, SQLite', 'NoSQL', 'GitHub Actions'] },
    { category: 'Security & net', color: 'green', items: ['Wireshark', 'Burp Suite', 'Postman', 'REST APIs'] }
  ],
  contact: {
    lead: "If you're working on something interesting or just want to chat about bots, security, or running small businesses — the inbox is open.",
    email: 'shreekantbhama5@gmail.com',
    github: 'https://github.com/cheemzboi',
    phone: '+91 85729 97389'
  }
};

// Returns the SiteConfig, backfilling any empty section with defaults so the admin
// always loads with editable text rather than blank inputs.
function mergeWithDefaults(doc) {
  const d = doc?.toObject ? doc.toObject() : (doc || {});
  return {
    ...d,
    hero: {
      eyebrow: d.hero?.eyebrow || DEFAULTS.hero.eyebrow,
      tagline: d.hero?.tagline || DEFAULTS.hero.tagline,
      sub: d.hero?.sub || DEFAULTS.hero.sub,
      badges: d.hero?.badges?.length ? d.hero.badges : DEFAULTS.hero.badges
    },
    about: {
      paragraphs: d.about?.paragraphs?.length ? d.about.paragraphs : DEFAULTS.about.paragraphs,
      sidebar: d.about?.sidebar?.length ? d.about.sidebar : DEFAULTS.about.sidebar
    },
    stack: d.stack?.length ? d.stack : DEFAULTS.stack,
    contact: {
      lead: d.contact?.lead || DEFAULTS.contact.lead,
      email: d.contact?.email || DEFAULTS.contact.email,
      github: d.contact?.github || DEFAULTS.contact.github,
      phone: d.contact?.phone || DEFAULTS.contact.phone
    }
  };
}

router.get('/', async (req, res) => {
  let cfg = await SiteConfig.findOne();
  if (!cfg) cfg = await SiteConfig.create({});
  res.json(mergeWithDefaults(cfg));
});

router.put('/', auth, async (req, res) => {
  try {
    const cfg = await SiteConfig.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    });
    res.json(mergeWithDefaults(cfg));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
