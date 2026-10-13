import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { MainNav } from "./MainNav";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur md:sticky md:top-0 md:z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg font-display text-2xl font-bold text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-5" aria-hidden="true" />
          </span>
          Pantry
        </Link>
        <MainNav className="hidden md:flex" />
      </div>
    </header>
  );
}
