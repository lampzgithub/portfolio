const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    color: { type: String, enum: ['purple', 'cyan', 'pink'], default: 'purple' }
  },
  { _id: false }
);

const sidebarItemSchema = new mongoose.Schema(
  {
    key: { type: String, default: '' },
    value: { type: String, default: '' }
  },
  { _id: false }
);

const stackItemSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    logo: { type: String, default: '' }
  },
  { _id: false }
);

const stackCategorySchema = new mongoose.Schema(
  {
    category: { type: String, default: '' },
    color: { type: String, enum: ['purple', 'cyan', 'pink', 'green'], default: 'purple' },
    // Mixed allows legacy string items to coexist with the new {name, logo} objects;
    // normalization is done in the config route on read.
    items: [{ type: mongoose.Schema.Types.Mixed }]
  },
  { _id: false }
);

module.exports.stackItemSchema = stackItemSchema;

const siteConfigSchema = new mongoose.Schema(
  {
    hero: {
      eyebrow: { type: String, default: 'SB — 01 / portfolio' },
      tagline: { type: String, default: 'Reverse-engineers problems until they give up.' },
      sub: { type: String, default: '' },
      badges: [badgeSchema]
    },
    about: {
      paragraphs: [{ type: String }],
      sidebar: [sidebarItemSchema]
    },
    stack: [stackCategorySchema],
    contact: {
      lead: { type: String, default: '' },
      email: { type: String, default: '' },
      github: { type: String, default: '' },
      phone: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
