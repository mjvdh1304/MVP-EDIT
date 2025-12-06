import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      setLoading(false);
      if (res?.token) {
        nav("/products");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setLoading(false);
      setError("Login error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-card rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm block mb-1">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </div>
        <div>
          <label className="text-sm block mb-1">Password</label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
        {error && <div className="text-destructive text-sm">{error}</div>}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
