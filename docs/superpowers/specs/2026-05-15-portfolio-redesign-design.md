# Portfolio Redesign — Design Spec
_2026-05-15_

## Overview

Full redesign of the portfolio site from a minimalist white editorial aesthetic to a dark futuristic "Cyber Pastel" theme. Includes new features: project image galleries, full admin content editing, and brute-force login protection.

---

## Color System

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0a0f` | Page background |
| `--surface` | `#0d0d18` | Card / section backgrounds |
| `--border` | `rgba(200,180,255,0.1)` | Dividers, card borders |
| `--purple` | `#c8b4ff` | Primary accent (headings, active states, labels) |
| `--cyan` | `#b4f0ff` | Secondary accent (links, eyebrows, code hints) |
| `--pink` | `#ffb4e6` | Tertiary accent (badges, highlights) |
| `--green` | `#b4ffda` | Quaternary (stack category) |
| `--text` | `#ffffff` | Headings, names |
| `--body` | `#c8c4e0` | Body / description text (lavender-white, NOT grey) |
| `--muted` | `#6b6b8a` | Secondary labels, indexes |

Fonts: keep `Fraunces` (display) and `JetBrains Mono` (mono).

---

## Animation System: Glitch & Scanlines

All animations are pure CSS — no JS animation libraries.

- **Scanlines overlay**: `repeating-linear-gradient` pseudo-element on hero and nav, `rgba(200,180,255,0.015)` every 4px, subtle flicker keyframe at ~8s interval.
- **Hero name glitch**: CSS `::before`/`::after` pseudo-elements with `#c8b4ff` and `#b4f0ff` color splits, `clip-path` on different horizontal bands, triggered on a 3s loop with sharp `transform: translate` jumps.
- **Grid background**: `background-image` linear-gradients forming a grid on the hero section, animated `background-position` to create slow drift.
- **Section reveal**: `IntersectionObserver` in JS adds `.visible` class; CSS transitions `opacity 0` → `1` and `translateY(20px)` → `0` over 0.5s. Applied to all `section.block` elements.
- **Project card hover**: Left border `linear-gradient(--purple, --cyan)` fades in (`opacity` transition), subtle `padding-left` shift.
- **Nav scanlines**: Same repeating-gradient pseudo-element as hero, lower opacity.

---

## Page Structure

### Nav
- Dark bar, scanlines overlay
- Brand: `SB — portfolio` with `SB` in `--purple`
- Links: monospace, muted by default, `--purple` + `·` prefix when active

### Hero Section
- Moving grid background (slow drift animation)
- Scanlines overlay
- Eyebrow: `> SB — 01 / portfolio` in `--cyan`
- H1: Glitch effect on first name, last name in `--purple`
- **Tagline**: _"Reverse-engineers problems until they give up."_ (italic, `--muted`)
- **Sub text**: _"Ran a Discord community of 13k people before I could drive. Built and sold a dev agency by 20. Now going deep on systems, security, and the fundamentals I skipped the first time."_ — monospace, `--body` color
- Meta badges: `DELHI INDIA` (purple), `BCA · GGSIPU` (cyan), `OPEN TO WORK` (pink) — small bordered pills

### About Section
- Two-column grid: sidebar (monospace keys in `--purple`, values in `--body`) + body text
- **Body copy**:
  - _"Started with a stupid Discord bot idea. It scaled to 13k members before I had a plan — which meant learning systems design by fire, not by book. I shipped, it broke, I fixed it. Repeat until good."_
  - _"Pivoted that into PayCode — a dev agency that delivered 600+ projects in a year. What I actually learned: writing specs, managing scope creep, and that most technical problems are just communication problems in disguise."_
  - _"These days I'm going deeper into the stack. Networks, security, the guts of systems. The stuff that makes the difference between someone who can code and someone who understands what's actually happening."_
- Drop-cap first letter in `--purple`

### Stack Section
- 4-cell grid; each header in a different pastel: Languages (`--purple`), Libraries (`--cyan`), Infra (`--pink`), Security (`--green`)
- Grid lines use `--border`; cell background `--surface`; list items in `--body`

### Projects List (Homepage)
- Card rows with `1px solid --border`; left accent bar fade-in on hover
- Index in `--muted`; title in `--text`; tagline italic in `--muted`
- Arrow `→ view` in `--purple`, opacity 0 → 1 on hover; links to `/work`

### Work Page — Project Detail
- Dark theme, existing layout
- New: **Image gallery** below description — CSS grid, 3 columns, `aspect-ratio: 16/9`
- Thumbnail: `--border` border, `--purple` border on hover
- Clicking thumbnail opens **lightbox modal** — custom implementation (no library):
  - Full-screen dark overlay (`rgba(0,0,0,0.9)`)
  - Centered `<img>` with `max-height: 90vh; max-width: 90vw`
  - Close: `Esc` key or click outside image
  - Prev/Next: arrow buttons if `images.length > 1`
  - State in `Work.jsx`: `lightboxOpen: bool`, `lightboxIndex: number`

### Contact Section
- Same structure, dark theme; links in `--cyan`

### Footer
- Monospace, `--muted`, border-top `--border`

---

## New Features

### 1. Project Image Support

**Backend — `Project` model**: Add `images: [{ type: String }]` field (default `[]`).

**Backend — Upload middleware** (`server/middleware/upload.js`):
- `multer` with `diskStorage`
- Destination: `server/uploads/`
- Filename: `<uuid-v4>.<original-extension>` (use `uuid` package to avoid collisions)
- Accepted MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Max file size: **5 MB** per file
- Max files per request: **10**
- On type/size rejection: return `400 { error: 'Invalid file. Max 5MB, images only.' }`

**Backend — Upload route** (`server/routes/upload.js`):
- `POST /api/upload` — **protected** (auth middleware applied)
- Accepts `multipart/form-data` with field name `images`
- Returns `{ urls: ['/uploads/filename1.jpg', ...] }`

**Backend — Static serving**: `server/index.js` serves `server/uploads/` at `/uploads` via `express.static`.

**Frontend — Work page**: Render `images[]` as gallery grid. Lightbox modal (local React state).

**Frontend — Admin image upload**:
- **URL paste**: text input → add to `images[]` array on save
- **File upload**: `<input type="file" multiple accept="image/*">` → `POST /api/upload` as `FormData` → append returned URLs to `images[]` array
- Existing images shown as removable chips

### 2. Full Admin Content Editing

**Backend — `SiteConfig` model** (`server/models/SiteConfig.js`):

```js
{
  hero: {
    eyebrow:  { type: String, default: 'SB — 01 / portfolio' },
    tagline:  { type: String, default: 'Reverse-engineers problems until they give up.' },
    sub:      { type: String, default: '' },
    badges:   [{ label: String, color: { type: String, enum: ['purple','cyan','pink'] } }]
  },
  about: {
    paragraphs: [{ type: String }],   // ordered array of paragraph strings
    sidebar:    [{ key: String, value: String }]  // e.g. [{key:'Currently', value:'BCA'}]
  },
  stack: [{
    category: String,
    color:    { type: String, enum: ['purple','cyan','pink','green'] },
    items:    [{ type: String }]
  }],
  contact: {
    lead:   { type: String, default: '' },
    email:  { type: String, default: '' },
    github: { type: String, default: '' },
    phone:  { type: String, default: '' }
  }
}
```

Singleton pattern: `SiteConfig.findOneAndUpdate({}, data, { upsert: true, new: true })`.

**Backend routes** (`server/routes/config.js`):
- `GET /api/config` — public, returns the single SiteConfig document (or empty defaults if none exists)
- `PUT /api/config` — **protected** (auth middleware), upserts document, returns updated doc

**Frontend — Home page**:
- Fetch `GET /api/config` on mount alongside projects
- All hero, about, stack, contact sections driven by config response
- Fallback to hardcoded default strings if config returns empty/null for a field

**Frontend — Admin panel** (`Admin.jsx`) — tabbed interface:
- **Tab: Projects** — existing project list + editor; editor gains image upload field (URL paste + file picker)
- **Tab: Site Content** — form fields for `hero.eyebrow`, `hero.tagline`, `hero.sub`, `hero.badges` (add/remove badges with label + color select)
- **Tab: Stack** — list of skill categories; each category has name, color picker (4 options), and items (textarea, one per line); add/remove categories
- **Tab: Contact** — fields for `contact.lead`, `contact.email`, `contact.github`, `contact.phone`
- All tabs: single "Save" button that `PUT /api/config` with full updated config

### 3. Brute Force Login Protection

**Package**: `express-rate-limit` (install via npm).

**Config** (applied directly in `server/index.js` before route registration, scoped to the login route):
```js
rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' }
})
```

Applied as: `app.use('/api/auth/login', loginLimiter)` — only the login route, not all auth routes.

**Frontend — `Login.jsx` behavior on 429**:
- Display the `error` string from the response body using the existing `.error` CSS class
- Form inputs and submit button remain enabled (user can try again after the window expires)
- No countdown timer

---

## API Method Additions to `client/src/api.js`

```js
getConfig()               // GET /api/config → returns SiteConfig object
updateConfig(data)        // PUT /api/config, body: partial SiteConfig → returns updated doc
uploadImages(formData)    // POST /api/upload, body: FormData with field 'images' → { urls: [] }
```

All three follow the existing pattern in `api.js` (fetch + throw on non-ok).

---

## File Changes Summary

### New files
- `server/models/SiteConfig.js`
- `server/routes/config.js`
- `server/middleware/upload.js` (multer config)
- `server/routes/upload.js`
- `server/uploads/` directory (created at startup if not exists via `fs.mkdirSync`)

### Modified files
- `server/models/Project.js` — add `images: [String]`
- `server/index.js` — register `/api/config`, `/api/upload` routes; serve `/uploads` static; add login rate limiter; ensure `uploads/` dir exists
- `server/package.json` — add `express-rate-limit`, `multer`, `uuid`
- `client/src/styles.css` — full rewrite (dark theme + animations)
- `client/src/pages/Home.jsx` — fetch config, render dynamic content, section reveal observer
- `client/src/pages/Work.jsx` — image gallery + lightbox modal
- `client/src/pages/Admin.jsx` — tabbed interface, image upload, config editing
- `client/src/pages/Login.jsx` — dark theme input styles; display 429 error
- `client/src/components/Nav.jsx` — dark theme, scanlines
- `client/src/components/Footer.jsx` — dark theme
- `client/src/api.js` — add `getConfig`, `updateConfig`, `uploadImages`

---

## Out of Scope
- Multiple admin users
- Blog / writing section
- CDN or cloud storage (Railway disk + URL paste covers the use case)
- Image compression or resizing
