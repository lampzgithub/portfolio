const router = require('express').Router();
const mongoose = require('mongoose');
const Image = require('../models/Image');

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'bad id' });
  }
  try {
    const img = await Image.findById(req.params.id).lean();
    if (!img) return res.status(404).json({ error: 'not found' });
    res.set('Content-Type', img.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(img.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
