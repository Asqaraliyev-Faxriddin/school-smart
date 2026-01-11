import { useState } from "react";
import { School, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple demo login - in production, use proper authentication
    if (username === "direktor" && password === "123456") {
      onLogin();
    } else {
      setError("Login yoki parol noto'g'ri");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-lg">
            <School className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">E-Maktab</h1>
          <p className="mt-2 text-muted-foreground">Maktab boshqaruv tizimi</p>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl bg-card p-8 shadow-card">
          <h2 className="mb-6 text-center text-xl font-semibold text-card-foreground">
            Tizimga kirish
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Login</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Login kiriting"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Parol kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full gradient-primary">
              Kirish
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-muted p-4">
            <p className="text-center text-sm text-muted-foreground">
              Demo uchun: <br />
              Login: <span className="font-medium text-foreground">direktor</span> <br />
              Parol: <span className="font-medium text-foreground">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
