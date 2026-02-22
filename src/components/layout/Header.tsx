import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCompare } from "@/contexts/CompareContext";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Heart, GitCompareArrows, Menu, X, LogOut, Shield, User } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { compareList } = useCompare();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    ...(user ? [{ to: "/wishlist", label: "Wishlist" }] : []),
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold gradient-text">Phoney</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(l.to) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/compare" className="relative">
            <Button variant="ghost" size="icon">
              <GitCompareArrows className="h-5 w-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-accent text-[10px] font-bold flex items-center justify-center text-accent-foreground">
                  {compareList.length}
                </span>
              )}
            </Button>
          </Link>

          {user && (
            <Link to="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <ThemeToggle />

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                {isAdmin ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                {user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/register"><Button size="sm" className="gradient-primary text-primary-foreground">Sign Up</Button></Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-strong border-t border-border animate-slide-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted" onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ))}
            {user ? (
              <Button variant="ghost" size="sm" onClick={() => { logout(); setMenuOpen(false); }}>
                <LogOut className="h-4 w-4 mr-1" /> Logout ({user.name})
              </Button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Login</Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full gradient-primary text-primary-foreground">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
