# Design System Strategy: Tactile Urgency

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"Tactile Urgency."** 

In emergency situations, cognitive load is at its peak. This system rejects the cluttered, "dashboard-heavy" aesthetics of legacy emergency software in favor of high-end editorial precision. We are merging the high-stakes clarity of Formula 1 telemetry with the sophisticated layering of modern glassmorphism. By utilizing intentional asymmetry and radical contrast, we guide the user’s eye to critical actions without creating visual panic. We don't just show data; we prioritize survival through a premium, authoritative interface that feels both calm and hyper-responsive.

## 2. Colors
Our palette is rooted in a deep, nocturnal foundation to ensure that Alert Red and Emerald Green occupy the highest possible rung of the visual hierarchy.

*   **The Foundation:** Use `surface` (#0b1326) as the canvas. This deep navy provides a more sophisticated, "high-end" feel than pure black while maintaining extreme contrast for the primary status colors.
*   **The "No-Line" Rule:** To achieve a premium, custom look, **1px solid borders are strictly prohibited for sectioning.** Do not use lines to separate content. Boundaries must be defined through tonal shifts. For example, a telemetry module should be a `surface_container_high` block sitting on a `surface` background. The difference in luminance is your divider.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers.
    *   Base: `surface`
    *   Sectioning: `surface_container_low`
    *   Interactive Cards: `surface_container_high`
    *   Critical Overlays: `surface_bright`
*   **The "Glass & Gradient" Rule:** Telemetry and secondary data cards must use glassmorphism. Use the `surface_variant` token at 60% opacity with a `20px` to `40px` backdrop blur. 
*   **Signature Textures:** For the primary "SOS" state, do not use a flat red. Use a subtle linear gradient from `primary` (#ffb3ad) to `primary_container` (#ff5451) at a 45-degree angle. This adds a "lithic" depth that feels high-end and intentional rather than a generic app button.

## 3. Typography
We use a dual-typeface system to balance authority with utility.

*   **Public Sans (Display & Headlines):** This is our "Urgency" font. It must be used for all critical status updates and headers. The bold weights of `display-lg` and `headline-lg` convey a sense of institutional trust and immediate command. Use tight letter-spacing (-0.02em) on headlines to increase the "impact" of the message.
*   **Inter (Title, Body, Labels):** Inter handles the "Telemetry." Its high x-height and neutral character make it perfect for reading coordinates, vehicle stats, and emergency instructions under duress. 
*   **Hierarchy as Identity:** Use `display-sm` for primary status ("CRASH DETECTED") and `label-md` in all-caps with 0.1em tracking for metadata. This contrast between massive headings and tiny, precise labels is a hallmark of editorial design.

## 4. Elevation & Depth
In this design system, depth is a functional tool, not a decoration. We move away from the "shadow-drop" look toward **Tonal Layering.**

*   **The Layering Principle:** Achieve lift by stacking. Place a `surface_container_highest` element on top of a `surface_container` background. The eye perceives the brighter container as closer to the user.
*   **Ambient Shadows:** If a floating element (like a critical modal) requires a shadow, it must be an "Ambient Glow." Use a large blur (32px+) with a low-opacity (8%) shadow tinted by the `on_surface` color. Avoid grey or black shadows; they muddy the high-contrast aesthetic.
*   **The "Ghost Border" Fallback:** If a boundary is required for accessibility (e.g., in high-sunlight outdoor environments), use a "Ghost Border": the `outline_variant` token at 15% opacity. It should be felt, not seen.
*   **Glassmorphism Depth:** When using glassmorphism for telemetry cards, the background `surface` must bleed through. This creates a "heads-up display" (HUD) effect that feels integrated into the user's environment rather than a heavy, opaque box.

## 5. Components

### Buttons
*   **Primary (SOS):** Use `primary_container`. High-gloss, `xl` (0.75rem) roundedness. Typography must be `title-lg` / Public Sans Bold.
*   **Secondary (Safe):** Use `secondary_container`. This represents the "All Clear." 
*   **Tertiary:** No background. Use `on_surface` text with `label-md` styling.

### Telemetry Cards
*   **Styling:** Forbid dividers. Use `surface_container_highest` for the header of the card and `surface_container_low` for the body. 
*   **Glassmorphism:** Apply to floating telemetry like "Speed" or "G-Force" indicators using `surface_variant` with blur.

### Input Fields
*   **Visual State:** Instead of a border, use `surface_container_highest` as the fill. On focus, transition the background to `surface_bright` and add a 2px `primary` bottom-bar only.

### Chips & Badges
*   **Selection:** Use `secondary` for "Active" states. 
*   **Urgency:** Use `primary` for "Critical" badges. Roundedness must be `full` for a pill-shaped, premium look.

### Emergency Lists
*   **Rule:** Forbid the use of divider lines. Separate list items using a 12px vertical gap. Use `surface_container_low` for every second item to create a subtle zebra-striping that guides the eye without adding visual noise.

## 6. Do's and Don'ts

*   **DO:** Use asymmetrical layouts for telemetry to create a modern, non-linear feel.
*   **DO:** Use `display-lg` typography for the most critical number (e.g., a countdown or a distance).
*   **DO:** Ensure all touch targets for emergency actions are at least 64px tall.
*   **DON'T:** Use standard "Grey" for disabled states. Use `surface_variant` with 30% opacity to maintain the deep color story.
*   **DON'T:** Use 1px borders to separate content. Use the Spacing Scale or Tonal Layering.
*   **DON'T:** Mix the glassmorphism effect with heavy shadows. Let the blur and transparency provide the depth.
*   **DON'T:** Use `primary` (#ffb3ad) for body text; use it only for accents and critical UI states to maintain its "Alert" psychological value.