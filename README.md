# The Algorithm Card - NFC Landing Page

Interactive 3D card landing page for The Algorithm by Reset Agency & The Lab.

## Features

- **3D Interactive Card**: Tilt effect using Atropos.js
- **Flip Animation**: Drag/swipe to flip with resistance and auto-return
- **Entry Animation**: Spectacular GSAP-powered entrance animation
- **Particle Background**: Neural network-style particles with tsParticles
- **Responsive Design**: Optimized for mobile and desktop
- **Accessibility**: Keyboard navigation and reduced motion support

## Tech Stack

- **GSAP 3.12** - Entry animations
- **Atropos.js** - 3D tilt effect
- **tsParticles** - Animated background
- **Vanilla JS** - No framework dependencies

## Project Structure

```
/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles
├── js/
│   └── main.js         # JavaScript logic
├── assets/
│   ├── logo-reset.png  # Reset logo (to add)
│   └── logo-wanted.png # Wanted logo (to add)
└── netlify.toml        # Deployment config
```

## Adding Logos

Replace the placeholder logos in `index.html`:

1. **Reset Logo**: Place `logo-reset.png` in `/assets/`
2. **Wanted Logo**: Place `logo-wanted.png` in `/assets/`

Then update the HTML in `index.html`, replacing:

```html
<!-- Current placeholder -->
<div class="logo-placeholder reset-logo">
  <span>RESET</span>
</div>

<!-- Replace with -->
<img src="assets/logo-reset.png" alt="Reset" width="120">
```

Same for Wanted logo.

**Recommended logo specs:**
- Format: PNG with transparent background
- Color: White (#FFFFFF)
- Width: ~120px (will scale down on mobile)

## Local Development

Simply open `index.html` in a browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using PHP
php -S localhost:8000
```

## Deployment to Netlify

### Option 1: Drag & Drop
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire project folder

### Option 2: Git Integration
1. Push to GitHub/GitLab
2. Connect repository in Netlify
3. Deploy settings are already configured in `netlify.toml`

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## CTA Links

The three buttons link to:
1. **Leer el articulo** → Notion article
2. **Hacer el diagnostico** → Diagnostic tool
3. **Ver la demo** → Algorithm demo

Update these URLs in `index.html` if needed.

## Keyboard Shortcuts

- **Space / Arrow Keys**: Flip the card
- **Tab**: Navigate between CTA buttons

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Notes

- Particles are reduced on mobile (30 vs 60)
- Respects `prefers-reduced-motion` for accessibility
- Assets loaded via CDN with preconnect hints

---

Built by The Lab | Reset Agency
