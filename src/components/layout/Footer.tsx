const linkClasses =
  "rounded-sm font-medium text-foreground underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          Recipe data from{" "}
          <a
            href="https://www.themealdb.com"
            target="_blank"
            rel="noreferrer"
            className={linkClasses}
          >
            TheMealDB
          </a>
          .
        </p>
        <p>
          A portfolio project.{" "}
          <a
            href="https://github.com/YOUR_USERNAME/pantry"
            target="_blank"
            rel="noreferrer"
            className={linkClasses}
          >
            View the code on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
