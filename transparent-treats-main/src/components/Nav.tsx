import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function isLoggedIn() {
  try {
    return !!localStorage.getItem("tt_token");
  } catch {
    return false;
  }
}

const Nav: React.FC = () => {
  const nav = useNavigate();
  const [loggedIn, setLoggedIn] = React.useState<boolean>(isLoggedIn());

  React.useEffect(() => {
    const handler = () => setLoggedIn(isLoggedIn());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  function handleLogout() {
    try {
      localStorage.removeItem("tt_token");
      localStorage.removeItem("tt_refreshToken");
    } catch {}
    setLoggedIn(false);
    nav("/");
  }

  return (
    <header className="w-full border-b border-muted/40 bg-background">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-lg font-semibold">
            Transparent Treats
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/products" className="text-sm text-muted-foreground hover:underline">
              Products
            </Link>
            <Link to="/scan" className="text-sm text-muted-foreground hover:underline">
              Scan
            </Link>
            <Link to="/submit" className="text-sm text-muted-foreground hover:underline">
              Submit
            </Link>
          </nav>
        </div>

        <div>
          {loggedIn ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Nav;
