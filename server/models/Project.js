const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    stack: [{ type: String }],
    period: { type: String, default: '' },
    role: { type: String, default: '' },
    highlights: [{ type: String }],
    link: { type: String, default: '' },
    github: { type: String, default: '' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
