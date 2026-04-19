# Design System: The Cinematic Codex

## 1. Overview & Creative North Star
The creative North Star for this design system is **"The Cinematic Codex."** 

We are not building a standard SaaS dashboard; we are building an immersive environment for high-end storytelling. This system draws inspiration from "Obsidian-like" productivity tools—where focus is paramount—but injects it with a high-end, editorial soul. 

To move beyond the "template" look, we utilize **Intentional Asymmetry** and **Tonal Depth**. By avoiding rigid grids and standard containers, we allow the content (the story) to breathe. Elements should feel like they are floating in a dark, infinite space, layered with the precision of a high-end film UI.

---

## 2. Colors: Tonal Atmosphere
The palette is rooted in a "Deep Dark" aesthetic. We are moving away from flat black to a sophisticated `#131315` charcoal base that allows for rich layering.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts or subtle tonal transitions.
*   Use `surface_container_low` (`#1c1b1d`) for secondary sections sitting on the `surface` (`#131315`) background. 
*   This creates a soft "carved-out" look rather than a boxed-in look.

### Surface Hierarchy & Nesting
Treat the UI as physical layers. 
*   **Base:** `surface` (`#131315`)
*   **Sections/Navigation:** `surface_container_low` (`#1c1b1d`)
*   **Cards/Interactive Elements:** `surface_container_high` (`#2a2a2c`)
*   **Active/Elevated Elements:** `surface_container_highest` (`#353437`)

### The "Glass & Gradient" Rule
To add "soul" to the interface, Primary CTAs must use a linear gradient from `primary` (`#d0bcff`) to `primary_container` (`#a078ff`). For floating modals or navigation bars, utilize `surface_bright` at 60% opacity with a `20px` backdrop-blur to create a "frosted obsidian" effect.

---

## 3. Typography: The Editorial Balance
We utilize a high-contrast pairing to distinguish between "The Interface" and "The Narrative."

*   **The Narrative (Serif):** `newsreader` is our heart. All `body` and `title` tokens use this serif to mimic the tactile feel of fine paper. It demands readability and signals "literary quality."
*   **The Interface (Sans-Serif):** `spaceGrotesk` is used for `display` and `headline` levels. Its futuristic, wide proportions provide the "Sleek/Modern" counter-balance to the classic serif body text.
*   **The Utility (Sans-Serif):** `inter` is reserved for `label` tokens—metadata, tags, and micro-copy—keeping the UI functional and grounded.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than structural lines.

*   **The Layering Principle:** To lift a card, do not add a shadow immediately. Instead, move it from `surface_container_low` to `surface_container_high`.
*   **Ambient Shadows:** When a "floating" effect is required (e.g., a dropdown), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow should feel like a soft mist, not a hard edge.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` (`#494454`) at **15% opacity**. It should be felt, not seen.
*   **Signature Glows:** Interactive states for primary elements should emit a subtle `0 0 15px` glow using the `primary` token color to simulate light emitting from within the "Obsidian" surface.

---

## 5. Components

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. White text (`on_primary`). No border. On hover: Increase glow spread and scale by 2%.
*   **Secondary:** Ghost style. No background. `Ghost Border` (outline-variant at 20%). On hover: Background shifts to `surface_container_high`.
*   **Tertiary:** `label-md` uppercase. Subtle underline in `primary` that expands on hover.

### Cards (The Story Block)
*   **Structure:** No borders. Background: `surface_container_low`. 
*   **Interaction:** On hover, the background shifts to `surface_container_high`, and the element scales `1.02x` with a `transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1)`.
*   **Content:** Use `vertical white space` (from the spacing scale) to separate the title from the metadata instead of divider lines.

### Inputs
*   **Style:** Minimalist underline style or "inset" tonal style. 
*   **State:** When focused, the bottom border glows with a 2px `primary` line, and the background subtly shifts to `surface_container_highest`.

### Chips & Tags
*   **Selection Chips:** Use `secondary_container` background with `on_secondary_container` text. 
*   **Shape:** `full` (pill-shaped) to contrast against the sharp `DEFAULT` (0.25rem) corners of the main containers.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. Let a title sit 40px further left than the body text to create editorial tension.
*   **Do** use `Newsreader` for any long-form text to reduce eye strain and increase the "Storyverse" premium feel.
*   **Do** apply `backdrop-filter: blur(12px)` to any element that overlaps another.

### Don't:
*   **Don't** use 100% opaque `outline` colors for borders. It breaks the immersive dark atmosphere.
*   **Don't** use pure black `#000000`. It kills the depth of the `surface` tokens.
*   **Don't** use "Drop Shadows" on cards. Use background color shifts (Tonal Layering) instead.
*   **Don't** use standard "system" fonts. Stick strictly to the `spaceGrotesk` / `newsreader` / `inter` hierarchy.