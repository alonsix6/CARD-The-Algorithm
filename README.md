# The Algorithm Card - NFC Landing Page

Interactive reflective card landing page for The Algorithm by Reset Agency & The Lab.

## Features

- **Reflective Card Effect**: Uses webcam feed with metallic/glass SVG filters
- **Glassmorphism Design**: Blur, noise, and sheen effects
- **Responsive Design**: Optimized for mobile and desktop
- **React + Vite**: Modern build setup

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Lucide React** - Icons
- **SVG Filters** - Metallic displacement and specular lighting effects

## Project Structure

```
/
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── netlify.toml            # Deployment config
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main app component
    ├── index.css           # Global styles
    └── components/
        ├── ReflectiveCard.jsx  # Main card component
        └── ReflectiveCard.css  # Card styles
```

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Webcam Permission

The reflective effect uses the device webcam as a background. Users will be prompted to allow camera access. The webcam feed is:
- Blurred and filtered
- Never recorded or transmitted
- Only used for the visual effect

## Deployment to Netlify

### Option 1: Git Integration (Recommended)
1. Push to GitHub/GitLab
2. Connect repository in Netlify
3. Build settings are configured in `netlify.toml`

### Option 2: Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## CTA Links

The three buttons link to:
1. **Leer el articulo** - Notion article
2. **Hacer el diagnostico** - Diagnostic tool
3. **Ver la demo** - Algorithm demo

## ReflectiveCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| blurStrength | number | 12 | Background blur intensity |
| metalness | number | 1 | Metallic sheen intensity |
| roughness | number | 0.4 | Noise texture opacity |
| overlayColor | string | rgba(255,255,255,0.1) | Content overlay color |
| displacementStrength | number | 20 | Distortion amount |
| noiseScale | number | 1 | Turbulence scale |
| specularConstant | number | 1.2 | Light reflection intensity |
| grayscale | number | 1 | Color saturation (0-1) |
| glassDistortion | number | 0 | Edge distortion effect |
| color | string | white | Text color |

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

---

Built by The Lab | Reset Agency
