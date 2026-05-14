const router = require('express').Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// public
router.get('/', async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json(projects);
});

router.get('/:id', async (req, res) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'not found' });
    res.json(p);
  } catch {
    res.status(400).json({ error: 'bad id' });
  }
});

// protected
router.post('/', auth, async (req, res) => {
  try {
    const p = await Project.create(req.body);
    res.status(201).json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const p = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ error: 'not found' });
    res.json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const p = await Project.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'bad id' });
  }
});

module.exports = router;
