import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-display font-bold gradient-text mb-3">Phoney</h3>
          <p className="text-sm text-muted-foreground">Your premium phone review & comparison platform. Find the perfect phone for you.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Explore</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/compare" className="hover:text-foreground transition-colors">Compare</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Account</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link to="/register" className="hover:text-foreground transition-colors">Register</Link>
            <Link to="/wishlist" className="hover:text-foreground transition-colors">Wishlist</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Info</h4>
          <p className="text-sm text-muted-foreground">Built with React, TypeScript & Tailwind CSS. All data is mock data for demo purposes.</p>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Phoney. All rights reserved. Demo project.
      </div>
    </div>
  </footer>
);

export default Footer;
