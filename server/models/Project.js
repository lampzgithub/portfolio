const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['text', 'image'], required: true },
    content: { type: String, default: '' },
    size: { type: String, enum: ['small', 'medium', 'large', 'full'], default: 'medium' }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    stack: [{ type: String }],
    period: { type: String, default: '' },
    role: { type: String, default: '' },
    highlights: [{ type: String }],
    images: [{ type: String }],
    blocks: [blockSchema],
    link: { type: String, default: '' },
    github: { type: String, default: '' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
