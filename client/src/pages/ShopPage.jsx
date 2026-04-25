// client/src/pages/ShopPage.jsx
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/products.json").then((res) => res.json()).then(setProducts);
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2>Shop CanWear</h2>
            <p>Choose a can drop and add it to the cart.</p>
          </div>
        </div>
        <div className="grid cards-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
