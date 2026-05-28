---
name: Forest-Edge Precision
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#424842'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#727972'
  outline-variant: '#c2c8c0'
  surface-tint: '#46654f'
  primary: '#001809'
  on-primary: '#ffffff'
  primary-container: '#0f2e1b'
  on-primary-container: '#76977e'
  inverse-primary: '#accfb3'
  secondary: '#416900'
  on-secondary: '#ffffff'
  secondary-container: '#b7f569'
  on-secondary-container: '#457000'
  tertiary: '#031427'
  on-tertiary: '#ffffff'
  tertiary-container: '#19293d'
  on-tertiary-container: '#8090a8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c8ebce'
  primary-fixed-dim: '#accfb3'
  on-primary-fixed: '#02210f'
  on-primary-fixed-variant: '#2f4d38'
  secondary-fixed: '#b7f569'
  secondary-fixed-dim: '#9dd850'
  on-secondary-fixed: '#102000'
  on-secondary-fixed-variant: '#304f00'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  sidebar-width: 280px
---

## Brand & Style

This design system is engineered for the high-performance individual managing both cognitive load and capital. The brand personality is **precise, tranquil, and authoritative**. It balances the organic growth associated with finance (Forest Green) with the urgent clarity of productivity (Lime).

The design style is **Modern Minimalism with Tactile Precision**. It draws inspiration from the utility of developer tools and the spatial breathing room of editorial layouts. The emotional goal is to evoke a sense of "organized calm"—reducing the anxiety of financial tracking through rigorous order and high-contrast legibility.

- **Minimalism:** Use expansive whitespace to separate distinct financial data sets.
- **Corporate / Modern:** Follow a structured hierarchy where utility is never sacrificed for decoration.
- **High-Legibility:** Prioritize ink-to-paper clarity with stark neutrals and purposeful accentuation.

## Colors

The palette is anchored by **Deep Forest Green (#0F2E1B)**, used for primary navigation and high-level structural elements to provide a sense of stability. The **Vibrant Lime (#C1FF72)** acts as a "success" and "action" accent, reserved for progress indicators and primary calls-to-action to ensure they pop against the dark green.

- **Primary:** Deep Forest. Used for headers, sidebars, and primary buttons.
- **Secondary:** Lime. Used for active states, growth trends, and focus points.
- **Neutral:** A scale of Slate Grays (from #F8FAFC to #64748B) used for borders, secondary text, and background surfaces.
- **Functional:** Pure White (#FFFFFF) is the base for all content cards to maintain a "paper" feel.

## Typography

The typography system utilizes a dual-sans approach to maximize readability in data-heavy environments. 

1.  **Hanken Grotesk** is used for headlines and display text, offering a sharp, contemporary geometric feel that communicates modern SaaS precision.
2.  **Inter** is the workhorse for body copy and UI elements, chosen for its exceptional legibility and neutral tone.
3.  **JetBrains Mono** is introduced for financial figures, data tables, and labels. The monospaced nature ensures that currency values align vertically, making balance sheets and transaction lists easier to scan.

**Scale Strategy:** Headlines use tight letter-spacing and aggressive weight to anchor pages. Body text uses generous line heights to prevent fatigue during long planning sessions.

## Layout & Spacing

The design system employs a **12-column fixed-fluid hybrid grid**. 
- **Desktop:** A fixed 280px sidebar on the left with a fluid main content area that caps at 1440px width.
- **Rhythm:** An 8px linear scale is used for all padding and margins. Use `16px (md)` for internal card padding and `24px (lg)` for gaps between modules.
- **Modular Layout:** Content should be grouped into "cells" or cards. These cards should span 3, 4, 6, or 12 columns depending on the data density (e.g., small KPIs span 3 columns, large charts span 6 or 12).
- **Mobile:** Reflows to a single column with 16px side margins. The sidebar collapses into a bottom navigation bar or a hamburger menu.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** supplemented by **Ambient Shadows**. This avoids the "flatness" of pure minimalism while maintaining a clean profile.

- **Level 0 (Background):** Soft Slate (#F8FAFC). This is the canvas.
- **Level 1 (Cards/Modules):** Pure White (#FFFFFF). Cards use a very soft, diffused shadow (0px 4px 20px rgba(0,0,0,0.04)) to lift them slightly from the background.
- **Level 2 (Dropdowns/Modals):** Pure White with a more pronounced shadow and a thin 1px Slate border (#E2E8F0) to define edges against other white surfaces.
- **Outlines:** Use thin 1px borders (#F1F5F9) for all input fields and table dividers to maintain structural rigor without adding visual weight.

## Shapes

The shape language is **distinctly rounded** to soften the professional tone and make the application feel approachable.

- **Standard Elements:** Buttons, input fields, and small UI components use a **0.5rem (8px)** radius.
- **Modular Cards:** Main content containers use a **1rem (16px)** radius to create a soft, friendly "island" effect on the dashboard.
- **Interactive States:** Hover states on list items should use a subtle **4px** radius to indicate selection without overwhelming the list's vertical rhythm.

## Components

### Sidebar Navigation
The sidebar uses the **Deep Forest Green** background with white text. Active states are indicated by a **Lime** vertical bar (4px wide) on the left edge of the menu item and a low-opacity white background tint.

### Modular Cards
Every card must have a 16px corner radius and a 1px soft border. Titles within cards should use `label-caps` in Slate Gray to categorize the data, with the primary value in `headline-md`.

### Data Tables
Tables should avoid vertical borders. Use 1px horizontal dividers (#F1F5F9). The header row uses `label-caps` typography. Row hovering should trigger a subtle Slate-50 background tint.

### Progress Bars
The track should be a light Slate (#F1F5F9). The fill should be the **Lime Accent**. For financial goals that are "at risk," the fill can transition to a muted amber, but primary productivity progress remains Lime.

### Custom Charting
- **Line Charts:** Use a 2px stroke width in Forest Green or Lime.
- **Area Charts:** Use a Forest Green stroke with a 5% opacity Forest Green fill gradient.
- **Grid Lines:** Use dashed lines in the lightest Slate gray to minimize visual noise.

### Buttons
- **Primary:** Forest Green background, White text, 8px radius.
- **Secondary:** White background, 1px Forest Green border, Forest Green text.
- **Ghost:** No background or border, Slate Gray text that turns Forest Green on hover.