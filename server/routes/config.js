const router = require('express').Router();
const SiteConfig = require('../models/SiteConfig');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  let cfg = await SiteConfig.findOne();
  if (!cfg) cfg = await SiteConfig.create({});
  res.json(cfg);
});

router.put('/', auth, async (req, res) => {
  try {
    const cfg = await SiteConfig.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    });
    res.json(cfg);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
