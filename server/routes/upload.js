const router = require('express').Router();
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const Image = require('../models/Image');

router.post('/', auth, (req, res) => {
  upload.array('images', 10)(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    try {
      const docs = await Image.insertMany(
        req.files.map((f) => ({ data: f.buffer, contentType: f.mimetype }))
      );
      const urls = docs.map((d) => `/api/images/${d._id}`);
      res.json({ urls });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
});

module.exports = router;
