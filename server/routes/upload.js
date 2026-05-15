const router = require('express').Router();
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.post('/', auth, (req, res) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const urls = req.files.map((f) => `/uploads/${f.filename}`);
    res.json({ urls });
  });
});

module.exports = router;
