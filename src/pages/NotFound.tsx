import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => (
  <div className="min-h-[80vh] flex items-center justify-center px-4">
    <div className="text-center animate-scale-in">
      <h1 className="text-8xl font-display font-bold gradient-text mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">This page doesn't exist</p>
      <Link to="/">
        <Button className="gradient-primary text-primary-foreground rounded-xl">
          <Home className="h-4 w-4 mr-2" /> Back to Home
        </Button>
      </Link>
    </div>
  </div>
);

export default NotFound;
