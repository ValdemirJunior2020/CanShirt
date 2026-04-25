// C:\Users\User\Downloads\canwear-project-updated\CanWearProject\client\src\components\ProductCard.jsx
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(timer);
  }, [added]);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
  };

  return (
    <article className="card product-card">
      <img className="product-image" src={product.image} alt={product.name} />
      <div className="card-body">
        <div className="price-row">
          <strong>{product.name}</strong>
          <strong>${product.price}</strong>
        </div>

        <p className="muted">{product.description}</p>

        <div className="meta-row">
          <span className="stars">★★★★★</span>
          <span className="muted">Loved by customers</span>
        </div>

        <button
          type="button"
          className={`btn add-cart-btn ${added ? "added" : ""}`}
          onClick={handleAdd}
        >
          {added ? "Added to cart ✓" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}