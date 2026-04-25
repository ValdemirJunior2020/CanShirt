// C:\Users\User\Downloads\canwear-project-updated\CanWearProject\client\src\components\Footer.jsx
import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok, FaFacebookF, FaEnvelope } from "react-icons/fa";
import "./footer.css";

const socialLinks = {
  instagram: "https://instagram.com/YOUR_INSTAGRAM_HANDLE",
  tiktok: "https://www.tiktok.com/@YOUR_TIKTOK_HANDLE",
  facebook: "https://www.facebook.com/YOUR_PAGE_NAME",
  email: "mailto:YOUR_EMAIL@example.com"
};

export default function Footer() {
  return (
    <footer className="cw-footer">
      <div className="container">
        <div className="cw-footer-box">
          <div className="cw-footer-grid">
            <div className="cw-footer-brand-block">
              <Link to="/" className="cw-footer-brand">
                <span>Can</span>Wear
              </Link>

              <p className="cw-footer-copy">
                Premium cotton tees packed inside collectible cans and shipped ready
                to gift, post, and wear.
              </p>

              <div className="cw-footer-socials">
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="cw-social-link cw-social-instagram"
                  title="Replace with your Instagram link later"
                >
                  <FaInstagram size={20} />
                </a>

                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="cw-social-link cw-social-tiktok"
                  title="Replace with your TikTok link later"
                >
                  <FaTiktok size={20} />
                </a>

                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="cw-social-link cw-social-facebook"
                  title="Replace with your Facebook link later"
                >
                  <FaFacebookF size={20} />
                </a>

                <a
                  href={socialLinks.email}
                  aria-label="Email"
                  className="cw-social-link cw-social-email"
                  title="Replace with your email link later"
                >
                  <FaEnvelope size={20} />
                </a>
              </div>

              <p className="cw-footer-note">
                Placeholder links ready for later:
                <br />
                Instagram, TikTok, Facebook, and Email.
              </p>
            </div>

            <div className="cw-footer-links">
              <h4>Shop</h4>
              <a href="/#shop">Shop tees</a>
              <Link to="/cart">Cart</Link>
              <Link to="/auth">Account</Link>
            </div>

            <div className="cw-footer-links">
              <h4>Company</h4>
              <a href="/#community">Community</a>
              <a href="mailto:YOUR_EMAIL@example.com">Contact</a>
              <a href="/#shop">Shipping</a>
            </div>

            <div className="cw-footer-links">
              <h4>Follow</h4>
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={socialLinks.tiktok} target="_blank" rel="noreferrer">
                TikTok
              </a>
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="cw-footer-bottom">
          © {new Date().getFullYear()} CanWear. All rights reserved.
        </div>
      </div>
    </footer>
  );
}