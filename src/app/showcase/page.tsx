import Link from "next/link";
import ShowcaseContent from "./showcase-content";

const IS_DEV = process.env.NODE_ENV === "development";

export const metadata = {
  title: "Design System Showcase — AuthKit",
  description: "Dev-only AuthKit design system component showcase",
};

// Dev-only guard: this route only renders in development.
export default function ShowcasePage() {
  if (!IS_DEV) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--surface-midnight-canvas)] font-sans text-[var(--color-frost-glow)]">
      <nav className="border-b border-[var(--color-glass-edge)] bg-[var(--surface-midnight-canvas)]/90 backdrop-blur sticky top-0 z-40 px-6 py-4">
        <Link
          href="/"
          className="text-sm font-medium text-[var(--color-frost-glow)] hover:text-[var(--color-ice-highlight)] transition-colors"
        >
          ← Back to home
        </Link>
      </nav>
      <ShowcaseContent />
    </div>
  );
}
