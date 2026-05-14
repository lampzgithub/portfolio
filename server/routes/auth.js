const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'missing fields' });

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
  res.json({ token, username: user.username });
});

router.get('/me', (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ ok: false });
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ ok: true, user: decoded });
  } catch {
    res.status(401).json({ ok: false });
  }
});

module.exports = router;
