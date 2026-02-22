import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Check, X } from "lucide-react";

const RegisterPage = () => {
  const { register, users } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailTaken = users.some((u) => u.email === email);

  const passwordChecks = useMemo(() => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }), [password]);
  const passwordStrong = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = name && emailValid && !emailTaken && passwordStrong && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit && register(email, password, name)) {
      navigate("/");
    }
  };

  const Check_ = ({ ok }: { ok: boolean }) => ok ? <Check className="h-3 w-3 text-success" /> : <X className="h-3 w-3 text-destructive" />;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join Phoney and start reviewing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 rounded-xl" />
            {email && (
              <div className="mt-1 text-xs flex items-center gap-1">
                {!emailValid ? <><X className="h-3 w-3 text-destructive" /> Invalid email format</> :
                  emailTaken ? <><X className="h-3 w-3 text-destructive" /> Email already registered</> :
                  <><Check className="h-3 w-3 text-success" /> Available</>}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 rounded-xl" />
            {password && (
              <div className="mt-2 space-y-1 text-xs">
                {[
                  { ok: passwordChecks.length, text: "8+ characters" },
                  { ok: passwordChecks.upper, text: "Uppercase letter" },
                  { ok: passwordChecks.lower, text: "Lowercase letter" },
                  { ok: passwordChecks.number, text: "Number" },
                  { ok: passwordChecks.special, text: "Special character" },
                ].map((c) => (
                  <div key={c.text} className="flex items-center gap-1"><Check_ ok={c.ok} /> {c.text}</div>
                ))}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 rounded-xl" />
            {confirmPassword && (
              <div className="mt-1 text-xs flex items-center gap-1">
                <Check_ ok={passwordsMatch} /> {passwordsMatch ? "Passwords match" : "Passwords don't match"}
              </div>
            )}
          </div>

          <Button type="submit" disabled={!canSubmit} className="w-full gradient-primary text-primary-foreground rounded-xl h-11">
            <UserPlus className="h-4 w-4 mr-2" /> Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
