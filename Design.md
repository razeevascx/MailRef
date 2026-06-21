---
version: "alpha"
name: "Squish — Turn Your Ideas Into Stunning Visuals"
description: "Squish Turn Content Section is designed for structuring a full-width content block for modern web pages. Key features include reusable structure, responsive behavior, and production-ready presentation. It is suitable for component libraries and responsive product interfaces."
colors:
  primary: "#1A2440"
  secondary: "#0A3BBF"
  tertiary: "#EAB308"
  neutral: "#FFFFFF"
  background: "#FFFFFF"
  surface: "#FFFFFF"
  text-primary: "#FFFFFF"
  text-secondary: "#1A2440"
  border: "#FFFFFF"
  accent: "#1A2440"
typography:
  display-lg:
    fontFamily: "Newsreader"
    fontSize: "72px"
    fontWeight: 400
    lineHeight: "72px"
    letterSpacing: "-0.0056em"
  body-md:
    fontFamily: "Inter"
    fontSize: "18px"
    fontWeight: 300
    lineHeight: "28.8px"
  label-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
rounded:
  md: "12px"
spacing:
  base: "4px"
  sm: "4px"
  md: "6px"
  lg: "10px"
  xl: "16px"
  gap: "4px"
  section-padding: "24px"
components:
  button-primary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "10px"
  button-link:
    textColor: "{colors.neutral}"
    rounded: "0px"
    padding: "0px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Full Bleed
  - Framing: Open
  - Grid: Strong

## Colors

The color system uses dark mode with #1A2440 as the main accent and #FFFFFF as the neutral foundation.

- **Primary (#1A2440):** Main accent and emphasis color.
- **Secondary (#0A3BBF):** Supporting accent for secondary emphasis.
- **Tertiary (#EAB308):** Reserved accent for supporting contrast moments.
- **Neutral (#FFFFFF):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #FFFFFF; Surface: #FFFFFF; Text Primary: #FFFFFF; Text Secondary: #1A2440; Border: #FFFFFF; Accent: #1A2440

## Typography

Typography pairs Newsreader for display hierarchy with Inter for supporting content and interface copy.

- **Display (`display-lg`):** Newsreader, 72px, weight 400, line-height 72px, letter-spacing -0.0056em.
- **Body (`body-md`):** Inter, 18px, weight 300, line-height 28.8px.
- **Labels (`label-md`):** Inter, 14px, weight 600, line-height 20px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, full bleed structural frame before changing ornament or component styling. Use 4px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Full Bleed
- **Base unit:** 4px
- **Scale:** 4px, 6px, 10px, 16px, 24px, 28px, 36px, 56px
- **Section padding:** 24px, 48px
- **Gaps:** 4px, 8px, 12px, 36px

## Elevation & Depth

Depth is communicated through elevated, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as elevated first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Elevated
- **Borders:** 2px #FFFFFF
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 2px 3px -1px, rgba(25, 28, 33, 0.02) 0px 1px 0px 0px, rgba(25, 28, 33, 0.08) 0px 0px 0px 1px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 0px padding and a 0px radius. Drive the shell with radial-gradient(rgba(255, 255, 255, 0.35) 1px, rgba(0, 0, 0, 0) 1px) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 12px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 12px, 16px, 9999px
- **Icon treatment:** Bold
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles.

### Buttons
- **Primary:** background #FFFFFF, text #1A2440, radius 12px, padding 10px, border 0px solid rgb(229, 231, 235).
- **Links:** text #FFFFFF, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Iconography
- **Treatment:** Bold.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4px rhythm.
- Do reuse the Elevated surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 12px, 16px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected moderate motion intensity without a deliberate reason.

## Motion

Motion feels controlled and interface-led across text, layout, and section transitions. Timing clusters around 900ms and 150ms. Easing favors ease and 1). Hover behavior focuses on opacity and transform changes.

**Motion Level:** moderate

**Durations:** 900ms, 150ms, 1000ms

**Easings:** ease, 1), cubic-bezier(0.4, 0, 0.2, cubic-bezier(0.16

**Hover Patterns:** opacity, transform

## WebGL

Reconstruct the graphics as a full-bleed background field using webgl, dpr clamp, custom shaders. The effect should read as technical, meditative, and atmospheric: noise haze with blue and sparse spacing. Build it from shader field so the effect reads clearly. Animate it as slow breathing pulse. Interaction can react to the pointer, but only as a subtle drift. Preserve dom fallback.

**Id:** webgl

**Label:** WebGL

**Stack:** WebGL

**Insights:**
  - **Scene:**
    - **Value:** Full-bleed background field
  - **Effect:**
    - **Value:** Noise haze
  - **Primitives:**
    - **Value:** Shader field
  - **Motion:**
    - **Value:** Slow breathing pulse
  - **Interaction:**
    - **Value:** Pointer-reactive drift
  - **Render:**
    - **Value:** WebGL, DPR clamp, custom shaders

**Techniques:** Breathing pulse, Pointer parallax, Shader gradients, Noise fields, DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- Background WebGL canvas -->
      <canvas id="gl" class="fixed inset-0 w-full h-full -z-10" style="pointer-events:none;"></canvas>

      <!-- Dot grid overlay -->
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      el.style.transform = 'translateY(18px)';
          el.style.filter = 'blur(6px)';
          el.style.transition = 'opacity 0.9s ease, transform 0.9s ease, filter 0.9s ease';
          el.style.transitionDelay = (0.5 + i * 0.12) + 's';
        });
        requestAnimationFrame(function () {
      …
      ```
  - **Animation loop:**
    - **Language:** js
    - **Snippet:**
      ```
      el.style.filter = 'blur(6px)';
          el.style.transition = 'opacity 0.9s ease, transform 0.9s ease, filter 0.9s ease';
          el.style.transitionDelay = (0.5 + i * 0.12) + 's';
        });
        requestAnimationFrame(function () {
      …
      ```
