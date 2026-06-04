# ScholarWeb Futuristic UI Design System

## 1. Theme and Color System

### CSS Variables (OKLCH)
- `--cyber-bg`: oklch(0.07 0.08 257)
- `--cyber-surface`: oklch(0.11 0.06 255 / 0.70)
- `--cyber-surface-strong`: oklch(0.13 0.08 252 / 0.92)
- `--cyber-border`: rgba(0, 240, 255, 0.18)
- `--cyber-cyan`: oklch(0.75 0.22 180)
- `--cyber-purple`: oklch(0.70 0.18 280)
- `--cyber-amber`: oklch(0.82 0.24 95)
- `--cyber-gray`: oklch(0.74 0.03 255 / 0.72)
- `--cyber-white`: oklch(0.98 0.01 260)

This palette is built for a dark, neon, glassmorphic interface with crisp contrast and futuristic glow softness.

## 2. Utility Classes and Effects

### Glassmorphism
- `.glass-card`: base glass panel with blurred surface, border, and deep shadow.
- `.glass-panel`: panel variant for layout grouping.
- `.glass-card-overlay`: soft gradient bloom and ambient lighting.
- `.glass-card-content`: content wrapper with z-index.

### Glows
- `.glow-border-cyan`, `.glow-border-purple`, `.glow-border-amber`
- `.glow-text-cyan`, `.glow-text-purple`, `.glow-text-amber`
- `.shadow-glow`

### Patterns
- `.pattern-grid`: subtle cyber grid.
- `.pattern-dots`: fine noise pattern.
- `.frosted-grid`: frosted glass grid background.

### Buttons and Badges
- `.btn-glow`: glass button with glow hover.
- `.badge-pill`: compact status pill with border and blur.

### Animation utilities
- `.fade-in-up`
- `.slide-in-left`
- `.pulse-glow`
- `.float-up`
- `.reveal-gradient`

## 3. Reusable Components

### `GlassCard`
- Reusable panel wrapper with hover and glow.
- Accepts `glowColor`, `hoverScale`, `onClick`, and `className`.
- Adds layered ambience with background bloom.

### `StatCard`
- Data card for metrics, growth deltas, and icon-driven highlights.
- Uses `GlassCard` internally.

### `ProgressRing`
- SVG ring component for completion states.
- Accepts `progress`, `radius`, `stroke`, and `label`.

### `AIBadge`
- Compact badge for AI insights, status, and telemetry.
- Supports `variant` colours and optional icon.

## 4. Layout Components

### `Sidebar`
- Collapsible navigation dock with active route indicators.
- Contains micro telemetry, active DNA summary, and action buttons.
- Uses `GlassCard` for the footer panel.

### `TopBar`
- Status bar with cognitive sync progress, alerts, clock, and AI badge.
- Designed to stay visible across pages.

### `DashboardLayout`
- Wrapper with background grid and content canvas.
- Composes `Sidebar` and `TopBar`.
- Uses page transition animation via `framer-motion`.

## 5. Animation Patterns

### Entry animations
- `motion.div` fades and moves content into place.
- Page-level transitions use opacity and vertical movement.

### Hover effects
- Panels scale slightly when hovered.
- Buttons and nav items highlight with glowing borders.

### Loading and state transitions
- `.loader-ring` uses `spin` keyframes.
- `ProgressRing` animates stroke offset.

### Layout transitions
- Sidebar width animates when collapsed.
- Top bar and content area keep the interface feeling fluid.

## 6. Page-by-Page Implementation Guide

### Dashboard
- Use `StatCard` for KPIs: mastery, active topics, analysis score.
- Add `ProgressRing` for overall completion, learning momentum, and debate readiness.
- Use `AIBadge` for AI insight, recommendation, and confidence level.
- Leverage `glass-card`, `pattern-grid`, and `pulse-glow` to make content feel alive.

### DNA Upload
- Build an upload canvas with large glass panel and drag/drop state.
- Use `.reveal-gradient` on file cards.
- Show parsing status with `ProgressRing` and AI badge guidance.

### Knowledge Graph
- Use `react-flow-renderer` for nodes and edges.
- Wrap each graph info panel in `GlassCard`.
- Add `glow-text-purple` to selected node titles and `glow-border-purple` to active detail cards.

### Search
- Build a search control area with `.btn-glow` and `.glass-panel` fields.
- Present results as cards with status badges and gradient reveal hover.
- Add `scan-effect` to query containers.

### Video Hub
- Display video thumbnails in glass cards with `.float-up` entrance.
- Use AI badges to surface auto-generated summaries and accuracy levels.
- Add `pattern-dots` overlay behind the media grid.

### Exam Tracker
- Use `StatCard` and `ProgressRing` for target mastery, time spent, and predicted score.
- Show schedule cards in `glass-panel` rows with subtle `.pulse-glow` progress indicators.

## 7. Integration Instructions for Vite + React

1. Keep `client/src/index.css` as the single source of the visual theme.
2. Import custom components from `client/src/components/common` and `client/src/layouts`.
3. Keep backend logic untouched in `server/`; the UI layer should consume API endpoints using existing services.
4. Preserve `ScholarDNAContext` state logic and pass `activeDNA` into `Sidebar` and `TopBar`.
5. Use `framer-motion` for page transitions in `App.jsx`, as already configured.
6. Keep `tailwind.config.js` synced with extended theme colors and motion utilities.

## 8. Checklist

- [x] Add OKLCH-based CSS variables in `client/src/index.css`
- [x] Add glassmorphism utility classes and glow styles
- [x] Add reusable components: `GlassCard`, `StatCard`, `ProgressRing`, `AIBadge`
- [x] Add layout components: `Sidebar`, `TopBar`, `DashboardLayout`
- [x] Add animation utilities and common UI patterns
- [x] Add page-specific guidance for Dashboard, DNA Upload, Knowledge Graph, Search, Video Hub, Exam Tracker
- [x] Ensure Vite/React integration instructions are clear
- [ ] Validate with `npm run build` in `client`
- [ ] Review page components and apply the design system consistently

## 9. Notes

- Keep component content inside `glass-card-content` to preserve layered visual depth.
- Use `text-gradient-cyber` for hero titles and active section headings.
- Prefer ambient gradients and subtle noise over saturated wallpapers to keep the interface readable.
