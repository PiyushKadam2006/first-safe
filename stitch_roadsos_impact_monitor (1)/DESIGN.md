# Design System Document: The Kinetic Nerve Center

## 1. Overview & Creative North Star
**Creative North Star: The Kinetic Nerve Center**
In high-stakes emergency response, interface friction costs lives. This design system moves away from the static, "boxy" nature of traditional dashboards toward a living, breathing command center. We are creating a "Kinetic Nerve Center"—an aesthetic that balances the cold precision of aerospace telemetry with the intuitive fluidity of modern editorial design.

The system breaks the "template" look by utilizing extreme typographic scale, intentional asymmetry, and a depth-first layout strategy. We avoid the rigid grid in favor of a layered hierarchy where information "floats" in a pressurized dark environment, allowing the most critical data to oscillate to the foreground through luminance and blur rather than physical borders.

## 2. Colors & Surface Logic
The palette is rooted in an ultra-deep charcoal (`#131313`), providing a void-like canvas where neon accents function as light sources rather than just decorative colors.

### The "No-Line" Rule
**Strict Mandate:** Traditional 1px solid borders are prohibited for sectioning or containment. 
Boundaries must be defined solely through:
*   **Background Shifts:** Distinguish sections by moving from `surface` to `surface_container_low`.
*   **Tonal Transitions:** Use the `surface_container` tiers to denote hierarchy. An inner module should live on `surface_container_high` if it sits atop a `surface_container` base.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
*   **Base:** `surface` (#131313) for the global background.
*   **Primary Containers:** `surface_container` (#201f1f) for main content blocks.
*   **Interactive Elements:** `surface_container_highest` (#353534) for elements that require immediate tactile recognition.

### The "Glass & Gradient" Rule
To achieve the "Command Center" aesthetic, use Glassmorphism for sidebars and floating overlays.
*   **Style:** Apply `surface_container_low` at 60% opacity with a `24px` to `40px` backdrop-blur. 
*   **Signature Textures:** For high-priority status indicators, use a subtle linear gradient from `primary` (#e1fdff) to `primary_fixed_dim` (#00dbe7) at a 45-degree angle. This adds "soul" and depth to critical data points.

## 3. Typography
The typography strategy utilizes a "High-Contrast Pairing" to ensure both atmospheric character and tactical legibility.

*   **Display & Headlines (Space Grotesk):** This is our "Tech Voice." The geometric, slightly futuristic apertures of Space Grotesk are reserved for high-level metrics, countdowns, and section headers. Use `display-lg` (3.5rem) for critical numbers (e.g., active incidents) to create an editorial impact.
*   **Body & Labels (Inter):** This is our "Functional Voice." Inter is optimized for the high-density data required in emergency logs. Use `label-sm` (0.6875rem) for metadata—it remains legible even at small scales due to its tall x-height.

**Hierarchy Tip:** Never use "Medium" weight when "Bold" or "Light" can better define the contrast. The goal is to avoid the "grey middle" where data becomes a blur.

## 4. Elevation & Depth
In this design system, depth is a functional tool for rapid decision-making, not just an aesthetic choice.

*   **The Layering Principle:** Stack `surface-container-lowest` cards on top of `surface-container-low` sections. This "negative lift" creates a sense of recessed panels, mimicking physical hardware consoles.
*   **Ambient Shadows:** For floating modals, use a "Glow Shadow" instead of a dark shadow. Use the `primary` or `secondary` token at 8% opacity with a `48px` blur. This mimics the way a high-intensity screen glows in a dark room.
*   **The "Ghost Border" Fallback:** If containment is absolutely necessary for accessibility, use the `outline_variant` (#3a494b) at 15% opacity. It should be felt, not seen.
*   **Kinetic Glass:** Apply a 1px inner-stroke of `on_surface_variant` at 10% opacity to glassmorphic elements to simulate the "edge" of a glass pane.

## 5. Components

### Buttons
*   **Primary:** Solid `on_primary_container` (#006a71) with `primary_container` (#00f2ff) text. Apply a subtle outer glow using the `primary` color.
*   **Secondary:** Ghost style. No background, `outline` (#849495) ghost border (20% opacity), and `primary` text.
*   **Shape:** `DEFAULT` (0.25rem) for a precise, "instrumental" feel.

### Data Chips
*   **Status High:** `error_container` background with `error` text.
*   **Status Medium:** `tertiary_container` background with `on_tertiary_container` text.
*   **Interaction:** Chips should use `full` (9999px) roundedness to contrast against the sharp-edged layout.

### Input Fields
*   **Styling:** Forgo the traditional box. Use a `surface_container_highest` bottom-border only (2px) or a fully recessed `surface_container_lowest` background. 
*   **Active State:** The bottom border transforms into a `primary` glow.

### Critical Alerts (Custom Component)
*   **The "Pulse":** For emergency-level alerts, use a `secondary_container` (#fe00fe) background with a 2px keyline of `secondary` (#ffabf3). Add a CSS animation "pulse" effect using a box-shadow of the `secondary` color.

### Cards & Lists
*   **Strict Rule:** No dividers. Separate list items using `spacing-md` (0.375rem) vertical gaps and alternating `surface_container_low` and `surface_container_lowest` backgrounds (Zebra-striping but more subtle).

## 6. Do's and Don'ts

### Do
*   **DO** use extreme typographic contrast. A 12px label next to a 56px metric creates immediate visual hierarchy.
*   **DO** utilize "Negative Space as a Divider." Let the `background` (#131313) act as the primary separator between large modules.
*   **DO** use neon accents (Cyan, Magenta, Amber) sparingly. If everything glows, nothing is important.

### Don't
*   **DON'T** use pure white (#FFFFFF). Always use `on_surface` (#e5e2e1) to reduce eye strain in dark environments.
*   **DON'T** use standard 1px borders. They clutter the high-density data and make the UI look like a spreadsheet.
*   **DON'T** use heavy drop shadows. Rely on tonal shifts and glassmorphism for depth.
*   **DON'T** over-round corners. Stick to the `DEFAULT` (4px) or `sm` (2px) for a professional, technical aesthetic.