// C:\Users\User\Downloads\canwear-project-updated\CanWearProject\client\src\pages\CartPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PayPalCheckout from "../components/PayPalCheckout";

const requiredFields = [
  "fullName",
  "email",
  "phone",
  "address1",
  "city",
  "state",
  "postalCode",
  "country"
];

export default function CartPage() {
  const {
    cart,
    totals,
    updateQuantity,
    removeFromCart,
    clearCart,
    shippingInfo,
    updateShippingInfo,
    resetShippingInfo
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    updateShippingInfo({
      email: shippingInfo.email || user.email || "",
      fullName: shippingInfo.fullName || user.displayName || ""
    });
  }, [user]);

  const shippingReady = requiredFields.every((field) =>
    String(shippingInfo[field] || "").trim()
  );

  return (
    <section className="section">
      <div className="container cart-layout">
        <div className="grid">
          {cart.length === 0 ? (
            <div className="card empty-state">
              <h2>Your cart is empty</h2>
              <p className="muted">Add a can to start your order.</p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <article className="card cart-card" key={item.id}>
                  <div className="cart-row cart-item-row" style={{ alignItems: "flex-start" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 96,
                        height: 96,
                        objectFit: "cover",
                        borderRadius: 18
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div className="price-row">
                        <strong>{item.name}</strong>
                        <strong>${item.price}</strong>
                      </div>

                      <p className="muted">{item.description}</p>

                      <div className="cart-row quantity-row">
                        <button
                          className="badge-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          className="badge-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>

                        <button
                          className="btn-secondary"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <article className="card auth-card">
                <div className="section-header" style={{ marginBottom: 8 }}>
                  <div>
                    <h2 style={{ marginBottom: 4 }}>Shipping details</h2>
                    <p>Enter the address and phone number for delivery.</p>
                  </div>
                </div>

                <div className="shipping-grid">
                  <input
                    className="input"
                    placeholder="Full name"
                    value={shippingInfo.fullName}
                    onChange={(e) => updateShippingInfo({ fullName: e.target.value })}
                  />

                  <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={shippingInfo.email}
                    onChange={(e) => updateShippingInfo({ email: e.target.value })}
                  />

                  <input
                    className="input"
                    placeholder="Phone number"
                    value={shippingInfo.phone}
                    onChange={(e) => updateShippingInfo({ phone: e.target.value })}
                  />

                  <input
                    className="input"
                    placeholder="Address line 1"
                    value={shippingInfo.address1}
                    onChange={(e) => updateShippingInfo({ address1: e.target.value })}
                  />

                  <input
                    className="input"
                    placeholder="Apartment, suite, etc."
                    value={shippingInfo.address2}
                    onChange={(e) => updateShippingInfo({ address2: e.target.value })}
                  />

                  <div className="shipping-row-3">
                    <input
                      className="input"
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={(e) => updateShippingInfo({ city: e.target.value })}
                    />

                    <input
                      className="input"
                      placeholder="State"
                      value={shippingInfo.state}
                      onChange={(e) => updateShippingInfo({ state: e.target.value })}
                    />

                    <input
                      className="input"
                      placeholder="ZIP code"
                      value={shippingInfo.postalCode}
                      onChange={(e) => updateShippingInfo({ postalCode: e.target.value })}
                    />
                  </div>

                  <input
                    className="input"
                    placeholder="Country"
                    value={shippingInfo.country}
                    onChange={(e) => updateShippingInfo({ country: e.target.value })}
                  />
                </div>

                {!shippingReady && (
                  <div className="notice" style={{ marginTop: 14 }}>
                    Please fill in full name, email, phone number, address, city, state, ZIP code,
                    and country before paying.
                  </div>
                )}
              </article>
            </>
          )}
        </div>

        <aside className="summary-box sticky-summary">
          <h3>Order summary</h3>

          <div className="price-row">
            <span>Subtotal</span>
            <strong>${totals.subtotal.toFixed(2)}</strong>
          </div>

          <div className="price-row">
            <span>Shipping</span>
            <strong>${totals.shipping.toFixed(2)}</strong>
          </div>

          <div className="price-row" style={{ marginTop: 10 }}>
            <span>Total</span>
            <strong>${totals.total.toFixed(2)}</strong>
          </div>

          <div className="notice" style={{ marginTop: 14 }}>
            Ship to: {shippingInfo.fullName || "Your name"}
            <br />
            {shippingInfo.address1 || "Address line 1"}
            {shippingInfo.address2 ? `, ${shippingInfo.address2}` : ""}
            <br />
            {(shippingInfo.city || "City")}, {shippingInfo.state || "State"}{" "}
            {shippingInfo.postalCode || "ZIP"}
            <br />
            {shippingInfo.country || "Country"}
            <br />
            {shippingInfo.phone || "Phone number"}
          </div>

          <div style={{ marginTop: 16 }}>
            <PayPalCheckout
              cart={cart}
              totals={totals}
              shippingInfo={shippingInfo}
              shippingReady={shippingReady}
              onPaid={() => {
                clearCart();
                resetShippingInfo();
                navigate("/success");
              }}
            />
          </div>
        </aside>
      </div>
    </section>
  );
}