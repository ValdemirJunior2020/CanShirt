// C:\Users\User\Downloads\canwear-project-updated\CanWearProject\client\src\components\Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import logo from "../teePot-logo.png";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const firstName =
    user?.displayName?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "";

  return (
    <header className="cw-topbar">
      <div className="container">
        <nav className="cw-nav">
          <Link to="/" className="cw-brand">
            <img src={logo} alt="TeePop logo" className="cw-brand-logo" />
            <span className="cw-brand-text">TeePop</span>
          </Link>

          <div className="cw-nav-links">
            <NavLink
              to="/"
              className={({ isActive }) => `cw-nav-link ${isActive ? "active" : ""}`}
            >
              Home
            </NavLink>

            <a href="/#shop" className="cw-nav-link">
              Shop
            </a>

            <a href="/#community" className="cw-nav-link">
              Community
            </a>
          </div>

          <div className="cw-nav-actions">
            {user ? (
              <div className="cw-user-pill">
                <span className="cw-user-name">Hi, {firstName}</span>
                <button type="button" className="btn-secondary" onClick={logout}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn-secondary">
                Sign in
              </Link>
            )}

            <Link to="/cart" className="cw-cart-pill">
              Cart
              <span className="cw-cart-count">{cartCount}</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}