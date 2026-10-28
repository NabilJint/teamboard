// AuthKit — Frosted Glass Cathedral at Midnight (dark theme)
// Single source of truth for design tokens. All colors, typography, spacing,
// radius, shadows, and surfaces are defined here and mirrored in
// src/app/globals.css as CSS custom properties so Tailwind v4 can consume them.

export const designTokens = {
  // Colors
  color: {
    midnightCanvas: "#05060f",
    steelPlate: "#2f343e",
    fogVeil: "#9da7ba",
    moonMist: "#c7d3ea",
    frostGlow: "#d1e4fa",
    iceHighlight: "#d8ecf8",
    pureWhite: "#ffffff",
    voidViolet: "#663af3",
    blueprintBlue: "#b6d9fc",
    emberGlow: "#e46d4c",
    signalBlue: "#027dea",
    deepTeal: "#269684",
    gridlineBlue: "#3f4959",
    glassEdge: "#bad7f71f",
    luminousFill: "#c7d3ea1f",
  },
  // Gradients
  gradient: {
    iceHighlight: "linear-gradient(0deg, #d8ecf8 0%, #98c0ef 100%)",
    frostHairline:
      "linear-gradient(to right, transparent, rgba(186, 215, 247, 0.12), transparent)",
    spotlight:
      "conic-gradient(at 50% -5%, transparent 45%, rgba(124, 145, 182, 0.3) 49%, rgba(124, 145, 182, 0.5) 50%, rgba(124, 145, 182, 0.3) 51%, transparent 55%)",
  },
  // Shadows
  shadow: {
    sm: "rgba(186, 207, 247, 0.32) 0px 0px 6px 0px",
    md: "rgba(238, 186, 247, 0.24) 0px 0px 12px 0px",
    subtle: "rgba(186, 215, 247, 0.12) 0px 0px 0px 1px inset",
    subtle2:
      "rgba(199, 211, 234, 0.12) -0.5px 0.5px 1px 0px inset, rgba(186, 215, 247, 0.08) 0px 0px 96px 0px inset",
    subtle3: "rgba(186, 214, 247, 0.06) 0px 0px 0px 1px inset",
    subtle4:
      "rgba(199, 211, 234, 0.12) 0px 1px 1px 0px inset, rgba(199, 211, 234, 0.05) 0px 24px 48px 0px inset, rgba(6, 6, 14, 0.7) 0px 24px 32px 0px",
    subtle5: "rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
    subtle6:
      "rgba(216, 236, 248, 0.2) 0px 1px 1px 0px inset, rgba(168, 216, 245, 0.06) 0px 24px 48px 0px inset, rgba(0, 0, 0, 0.3) 0px 16px 32px 0px",
    subtle7:
      "rgba(216, 236, 248, 0.2) 0px 1px 1px 0px inset, rgba(168, 216, 245, 0.06) 0px 24px 48px 0px inset",
    subtle8:
      "rgba(216, 236, 248, 0.2) 0px 1px 1px 0px inset, rgba(168, 216, 245, 0.06) 0px 24px 48px 0px inset, rgba(199, 211, 234, 0.08) 0px 0px 0px 1px inset",
    subtle9: "rgba(186, 214, 247, 0.24) 0px 0px 0px 1px inset",
  },
  // Surfaces
  surface: {
    midnightCanvas: "#05060f",
    steelPlate: "#2f343e",
    frostedGlass: "rgba(186, 214, 247, 0.03)",
    deepGlass: "rgba(5, 6, 15, 0.97)",
  },
  // Border radius
  radius: {
    cards: "16px",
    badges: "6px",
    inputs: "6px",
    modals: "16px",
    buttons: "999px",
    iconContainers: "9999px",
  },
  // Typography
  font: {
    untitledSans: "var(--font-untitled-sans)",
    aeonikpro: "var(--font-aeonikpro)",
    dotdigital: "var(--font-dotdigital)",
  },
  // Type scale
  text: {
    caption: { size: "12px", leading: "1.33", tracking: "0px" },
    bodySm: { size: "14px", leading: "1.43", tracking: "0px" },
    body: { size: "16px", leading: "1.5", tracking: "-0.16px" },
    subheading: { size: "18px", leading: "1.33", tracking: "0px" },
    headingSm: { size: "24px", leading: "1.17", tracking: "-0.24px" },
    heading: { size: "28px", leading: "1.14", tracking: "0px" },
    headingLg: { size: "44px", leading: "1.16", tracking: "0px" },
    display: { size: "48px", leading: "1.17", tracking: "0px" },
  },
  // Spacing (base unit 4px)
  spacing: {
    4: "4px", 8: "8px", 12: "12px", 16: "16px", 20: "20px", 24: "24px",
    28: "28px", 32: "32px", 36: "36px", 40: "40px", 48: "48px", 56: "56px",
    100: "100px", 120: "120px", 200: "200px",
  },
  // Layout
  layout: {
    pageMaxWidth: "1200px",
    sectionGap: "120px",
    cardPadding: "24px",
    elementGap: "16px",
  },
} as const;

export type DesignTokens = typeof designTokens;
