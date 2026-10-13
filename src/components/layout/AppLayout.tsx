import { Outlet, ScrollRestoration } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { SkipLink } from "./SkipLink";

export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <SkipLink />
      <Header />
      {/* tabIndex lets the skip link move focus here. */}
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      {/* Bottom padding keeps the footer clear of the mobile tab bar. */}
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
      <MobileNav />
      <ScrollRestoration />
    </div>
  );
}
