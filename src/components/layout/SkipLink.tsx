export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      Skip to content
    </a>
  );
}
