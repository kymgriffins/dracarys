# Design System Documentation

## 🎨 Dracarys Design System

Complete design system documentation for the Dracarys trading education platform.

## 📁 Design System Structure

```
design-system/
├── README.md (This file)
├── overview.md (System overview & principles)
├── colors.md (Color palette & usage)
├── typography.md (Font scales & text styles)
├── components.md (Component library)
├── spacing.md (Spacing scales & grid system)
├── tokens.md (Design tokens)
├── icons.md (Icon library)
├── accessibility.md (A11Y guidelines)
└── implementation.md (How to use the system)
```

## 🎯 Design Principles

### Core Philosophy
- **Progressive Enhancement** - Core trading education accessible to all skill levels
- **Performance First** - Fast, responsive interfaces that don't hinder learning
- **Trust Building** - Professional appearance inspires confidence in education quality
- **Gami-fication** - Engaging elements create motivation and retention

### User Experience Focus
- **Clear Information Hierarchy** - Important content stands out, secondary content supports
- **Consistent Patterns** - Familiar interfaces reduce cognitive load during learning
- **Feedback Systems** - Clear success/failure indicators guide user progress
- **Mobile-First Responsive** - Trading education accessible anywhere

---

## 📋 Key Design Documents

| Document | Description | Purpose |
|----------|-------------|---------|
| [Design Tokens](./tokens.md) | CSS variables, colors, spacing | Implementation reference |
| [Color Palette](./colors.md) | Brand colors, meanings, usage | Visual consistency guide |
| [Typography](./typography.md) | Font scales, text styles | Readability & hierarchy |
| [Component Library](./components.md) | UI components, usage | Development reference |
| [Spacing System](./spacing.md) | Spacing scales, grids | Layout consistency |
| [Accessibility](./accessibility.md) | WCAG compliance, best practices | Inclusive design |

## 🎨 Color Philosophy

### Primary Colors
```css
/* Professional Blue - Trust & Learning */
--primary: rgb(59 130 246);       /* Blue-500 */
--primary-hover: rgb(37 99 235);  /* Blue-600 */

/* Success Green - Achievement & Progress */
--success: rgb(34 197 94);        /* Emerald-500 */
--success-light: rgb(209 250 229); /* Emerald-50 */

/* Warning Yellow - Attention & XP */
--warning: rgb(245 158 11);       /* Amber-500 */

/* Danger Red - Errors & Stop Loss */
--danger: rgb(239 68 68);         /* Red-500 */
```

### Neutral Palette
- **Slate Grays**: Modern, professional, readable
- **Warm Whites**: Soft backgrounds reduce eye strain
- **Dark Mode**: Full dark theme support for night trading

### Semantic Color Usage
- **Primary**: Main actions, progress indicators, level progression
- **Success**: Completed lessons, achievement unlocks, correct answers
- **Warning**: Time limits, low progress, attention needed
- **Danger**: Errors, failures, critical stop actions

## 📝 Typography System

### Font Family
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Trading-specific fonts available */
--font-chart: var(--font-mono);
--font-display: 'Georgia', serif;
```

### Text Hierarchy
- **Display**: Level titles, major headings (2rem - 4rem)
- **Headline**: Section headers, lesson titles (1.5rem - 2rem)
- **Body**: Content, explanations (1rem - 1.25rem)
- **Caption**: Metadata, scores, timestamps (0.875rem)
- **Label**: Form inputs, buttons, badges (0.75rem - 0.875rem)

### Readability Standards
- **Line Height**: 1.5 minimum, 1.7 optimal for body text
- **Letter Spacing**: -0.01em for optimal reading flow
- **Contrast Ratio**: 4.5:1 minimum, 7:1 preferred

## 🔧 Component Architecture

### Atomic Design Pattern
```
Atoms (Basic Elements)
├── Button, Input, Badge
├── Tooltip, Avatar, Icon
└── Color swatches, Typography

Molecules (Compound Elements)
├── Progress Bar + Progress Text
├── Lesson Card + Level Badge
├── XP Indicator + Coin Icon
└── Search Input + Filter Dropdown

Organisms (Complex Interfaces)
├── Lesson Interface (Header + Content + Assessment)
├── Progress Dashboard (Stats + Charts + Goals)
├── Community Feed (Posts + Comments + Votes)
└── Trading Simulator (Charts + Controls + Metrics)
```

### Component States
- **Default**: Normal interaction state
- **Hover**: Optimized for discoverability
- **Active/Focus**: Clear current selection
- **Disabled**: Reduced opacity, no interaction
- **Loading**: Skeleton states, progress indicators
- **Error**: Clear error messaging and recovery actions

### Component Libraries Used
- **Radix UI**: Unstyled, accessible primitives
- **Lucide Icons**: Consistent iconography
- **Tailwind CSS**: Utility classes for rapid development
- **Custom Components**: Trading-specific elements

## 📏 Spacing & Layout System

### Spacing Scale
```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-24: 6rem;      /* 96px */
```

### Layout Patterns
- **Container**: Max-width 1200px, centered content
- **Grid System**: 12-column responsive grid
- **Card Based**: Content organized in card containers
- **Progressive Disclosure**: Content revealed as user progresses
- **Mobile-First**: Design for mobile, enhance for larger screens

## ⚡ Performance Optimizations

### CSS Strategies
- **Atomic CSS**: Tailwind utility classes for minimal bundle size
- **Critical CSS**: Above-the-fold styling inlined
- **Font Loading**: Optimized font loading with fallbacks
- **Image Optimization**: Next.js Image component with WebP/AVIF

### Interaction Performance
- **GPU Accelerated**: Transform3d for smooth animations
- **Debounced Inputs**: Optimized search and form interactions
- **Virtual Scrolling**: Large lists use virtualization
- **Lazy Loading**: Components load on demand

---

## 🛠️ Implementation Guide

### CSS Architecture
```css
/* Design tokens - variables for consistency */
:root {
  --color-primary: hsl(var(--primary));
  --spacing-unit: 0.25rem;
  --border-radius: 0.5rem;
}

/* Component styles - class-based organization */
.btn-primary { /* ... */ }
.card-with-shadow { /* ... */ }
.text-gradient { /* ... */ }
```

### Component Usage
```tsx
// ✅ Correct usage
<Button variant="primary" size="lg">
  Continue Learning
</Button>

// ❌ Avoid custom styling
<Button style={{backgroundColor: '#manual-color'}}>
  Click Here
</Button>
```

### Responsive Design
```tsx
// Mobile-first approach
<div className="
  grid grid-cols-1           /* Mobile: 1 column */
  md:grid-cols-2            /* Tablet: 2 columns */
  lg:grid-cols-3            /* Desktop: 3 columns */
  xl:grid-cols-4            /* Large: 4 columns */
">
  {/* Content */}
</div>
```

## 🔍 Quality Assurance

### Design QA Checklist
- ✅ **Accessibility**: WCAG 2.1 AA compliance
- ✅ **Cross-browser**: Chrome, Firefox, Safari, Edge
- ✅ **Mobile Responsive**: iOS Safari, Chrome Mobile
- ✅ **Performance**: Lighthouse score >90 overall
- ✅ **SEO**: Semantic HTML, proper headings hierarchy
- ✅ **Print Ready**: Readable print styles

### Automated Testing
- **Visual Regression**: Chromatic or Percy for UI consistency
- **Performance Budget**: Bundle size monitoring
- **Accessibility**: axe-core automated scanning
- **Color Contrast**: Automated contrast ratio checking

---

## 📞 Design System Support

**For Designers:**
- Review [Component Library](./components.md) for available elements
- Check [Color Usage](./colors.md) for brand consistency
- Follow [Responsive Guidelines](./implementation.md) for mobile-first design

**For Developers:**
- Implement components from [Component Library](./components.md)
- Use design tokens from [Tokens](./tokens.md)
- Follow [Accessibility Guidelines](./accessibility.md)

**For Product Team:**
- Reference [UX Patterns](./overview.md) for consistent experiences
- Use [Implementation Guide](./implementation.md) for technical requirements

---

*Design system maintained by design + development teams. Last updated: November 24, 2025*
