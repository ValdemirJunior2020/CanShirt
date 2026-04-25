// client/src/components/ShopPreview.jsx
import ProductCard from "./ProductCard";

export default function ShopPreview({ products }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2>Simple drop shop</h2>
            <p>Clean product cards, 5-star feel, and quick mobile add-to-cart flow.</p>
          </div>
        </div>
        <div className="grid cards-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
