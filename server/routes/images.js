const router = require('express').Router();
const mongoose = require('mongoose');
const Image = require('../models/Image');

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'bad id' });
  }
  try {
    const img = await Image.findById(req.params.id);
    if (!img) return res.status(404).json({ error: 'not found' });
    const buf = Buffer.isBuffer(img.data) ? img.data : Buffer.from(img.data?.buffer || img.data);
    res.set('Content-Type', img.contentType || 'application/octet-stream');
    res.set('Content-Length', buf.length);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(buf);
  } catch (e) {
    console.error('image fetch error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
