// client/src/components/Layout.jsx
import { Link, NavLink, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  return (
    <>
      <header className="topbar">
        <div className="container nav">
          <Link to="/" className="brand">Can<span>Wear</span></Link>
          <nav className="nav-links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <a href="#reviews">Reviews</a>
            <a href="#community">Community</a>
          </nav>
          <div className="nav-actions">
            <Link className="badge-btn" to="/cart">Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</Link>
            {user ? (
              <button className="btn-secondary" onClick={logout}>Logout</button>
            ) : (
              <Link className="btn" to="/auth">Sign up</Link>
            )}
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-box">
          <strong>CanWear</strong>
          <p>Custom tees in cans. Cute drops, simple shopping, soft pastel vibes, and mobile-first checkout.</p>
          <p>Instagram-ready unboxing. TikTok-friendly gift energy. Built to grow with Firebase + PayPal.</p>
        </div>
      </footer>
    </>
  );
}
