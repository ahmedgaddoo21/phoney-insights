import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your Phoney account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 rounded-xl" />
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground rounded-xl h-11">
            <LogIn className="h-4 w-4 mr-2" /> Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign Up</Link>
        </p>

        <div className="mt-6 p-4 rounded-xl bg-muted/50 text-xs text-muted-foreground">
          <p className="font-medium mb-1">Demo accounts:</p>
          <p>Admin: admin@phoney.com / Admin123!</p>
          <p>User: demo@phoney.com / Demo123!</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
