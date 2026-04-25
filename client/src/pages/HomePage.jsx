// C:\Users\Valdemir Goncalves\Desktop\tee-pot\CanShirt\client\src\pages\HomePage.jsx
import ProductCard from "../components/ProductCard";
import SocialFeed from "../components/SocialFeed";
import bg from "../bg.png";

const products = [
  {
    id: "cw-1",
    name: "Pastel Pop Can Tee",
    price: 35,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    description: "Soft cotton tee packed inside a collectible can with custom label."
  },
  {
    id: "cw-2",
    name: "Gift Drop Can Tee",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80",
    description: "Made for birthdays, surprises, and cute unboxing moments."
  },
  {
    id: "cw-3",
    name: "Limited Edition Can Tee",
    price: 65,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    description: "Premium cotton, collectible can, and limited-run artwork."
  }
];

const reviews = [
  {
    name: "Camila",
    text: "The can made it feel like a luxury gift. The shirt quality surprised me.",
    stars: "★★★★★"
  },
  {
    name: "Jayden",
    text: "Fast delivery, clean print, and the packaging is actually worth posting online.",
    stars: "★★★★★"
  },
  {
    name: "Beatriz",
    text: "I bought one as a gift and ended up ordering one for myself too.",
    stars: "★★★★★"
  }
];

const steps = [
  {
    title: "Choose your tee",
    text: "Pick a design you love and get it ready for a cute premium unboxing."
  },
  {
    title: "We print it",
    text: "Your design goes on a soft cotton shirt with a clean premium finish."
  },
  {
    title: "Packed in a can",
    text: "We fold it neatly, seal it inside the can, and make it gift-ready."
  },
  {
    title: "Delivered to your door",
    text: "Your order arrives ready to wear, post, gift, and enjoy."
  }
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div
            className="hero-card"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(35,28,46,.18), rgba(35,28,46,.48)), url(${bg})`
            }}
          >
            <div className="hero-content">
              <span className="kicker">Premium tees packed to surprise</span>

              <h1>Wear it. Pop it. Love it.</h1>

              <p>
                Premium cotton t-shirts packed inside collectible cans and shipped
                ready to gift, keep, and wear.
              </p>

              <div className="hero-actions">
                <a href="/#shop" className="btn">
                  Shop now
                </a>

                <a href="/#community" className="btn-secondary">
                  See customer posts
                </a>
              </div>

              <div className="hero-stats">
                <div className="stat">
                  <strong>★★★★★</strong>
                  <div>5-star customer love</div>
                </div>

                <div className="stat">
                  <strong>3–5 days</strong>
                  <div>Fast order prep</div>
                </div>

                <div className="stat">
                  <strong>Free shipping</strong>
                  <div>On orders over $80</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="shop">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Shop the can drops</h2>
              <p>Pick your favorite and add it to cart.</p>
            </div>
          </div>

          <div className="grid cards-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>How it works</h2>
              <p>Simple, cute, and ready for gifting.</p>
            </div>
          </div>

          <div className="grid cards-3">
            {steps.map((step) => (
              <article className="card review-card" key={step.title}>
                <div className="stars">✦ ✦ ✦</div>
                <h3 style={{ marginBottom: 8 }}>{step.title}</h3>
                <p className="muted" style={{ margin: 0 }}>
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>5-star reviews</h2>
              <p>What customers are saying after the unboxing.</p>
            </div>
          </div>

          <div className="grid cards-3">
            {reviews.map((review) => (
              <article className="card review-card" key={review.name}>
                <div className="stars">{review.stars}</div>
                <p>{review.text}</p>
                <strong>{review.name}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SocialFeed />
    </>
  );
}