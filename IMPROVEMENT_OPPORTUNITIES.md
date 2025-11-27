# Dracarys: Improvement Opportunities

This document outlines potential improvements, refactoring, and enhancements that can be made to the *existing* codebase and features.

## 🎨 UI/UX Refinement
*Elevating the aesthetic to a world-class standard.*
- [x] **Visual Polish**: Implement "Glassmorphism" and high-end animations (Framer Motion) to match the "Apple-style" aesthetic goals.
- [x] **Micro-interactions**: Add subtle hover states, loading skeletons, and transition effects to make the app feel "alive".
- [ ] **Responsive Tuning**: Ensure all dashboards and complex charts work flawlessly on mobile devices.
- [ ] **Theme Consistency**: Audit all components to ensure strict adherence to the design system tokens.

## 🛠️ Code Quality & Architecture
*Strengthening the foundation.*
- [x] **Test Coverage**: Increase unit and integration test coverage (currently a TODO item). Focus on critical paths like the Journaling Engine.
- [x] **Error Boundaries**: Implement global and component-level error boundaries to prevent white-screen crashes.
- [ ] **Type Safety**: Stricter TypeScript checks and comprehensive interfaces for all Supabase responses.
- [ ] **Performance Optimization**:
    - Implement code-splitting for heavy chart components.
    - Optimize database queries with proper indexing (review `SUPABASE_SCHEMA.sql`).

## 🔐 Security & Reliability
- [x] **Row Level Security (RLS)**: Audit and harden all Supabase RLS policies to ensure strict data isolation.
- [ ] **Input Validation**: Enhance Zod schemas for all form inputs to prevent invalid data entry.
- [ ] **Edge Functions**: Move sensitive logic (e.g., complex calculations or third-party API calls) to Supabase Edge Functions.

## 🧩 Feature Enhancements (Quick Wins)
*Improving what is already there.*
- [ ] **Journaling**:
    - Add drag-and-drop support for trade screenshots.
    - Implement "Quick Log" mode for rapid entry during active trading.
- [ ] **Dashboard**:
    - Allow users to customize the layout of their stats cards.
    - Add a "Focus Mode" that hides distractions during trading hours.
- [ ] **Onboarding**:
    - Create an interactive "Tour" for new users to explain the Psychology Engine features.
