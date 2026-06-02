import { NavLink, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import Home from "./pages/Home";
import Library from "./pages/Library";
import PodcastPlayer from "./pages/PodcastPlayer";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <header className="border-b border-neutral-200 bg-neutral-50/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <NavLink to="/" className="text-base font-semibold tracking-wide">
            Island Lingua Lite
          </NavLink>
          <nav className="flex items-center gap-2 text-sm text-neutral-600">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/library">Library</NavItem>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/podcasts/:id" element={<PodcastPlayer />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </main>
    </div>
  );
}

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }: { isActive: boolean }) =>
        [
          "rounded-md px-3 py-2 transition-colors",
          isActive ? "bg-neutral-900 text-white" : "hover:bg-neutral-200",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}
