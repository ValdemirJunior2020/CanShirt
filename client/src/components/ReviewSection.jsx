// client/src/components/ReviewSection.jsx
import { useEffect, useState } from "react";
import { createReview, getCollectionDocs } from "../lib/firestoreApi";
import { useAuth } from "../context/AuthContext";

export default function ReviewSection() {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadReviews = async () => {
    try {
      const data = await getCollectionDocs("reviews");
      setReviews(data);
    } catch {
      setReviews([
        { id: "1", name: "Mia", text: "The can made the gift feel premium and fun." },
        { id: "2", name: "Jo", text: "Super cute concept and the shirt felt soft right away." },
        { id: "3", name: "Lena", text: "Way more memorable than normal merch packaging." }
      ]);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setLoading(true);
    await createReview({
      userId: user.uid,
      name: user.displayName || user.email,
      rating: 5,
      text
    });
    setText("");
    setLoading(false);
    loadReviews();
  };

  return (
    <section id="reviews" className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2>5-star reviews only</h2>
            <p>Make the can part of the gift. Make the unboxing the memory.</p>
          </div>
        </div>
        <div className="grid cards-3">
          {reviews.slice(0, 6).map((review) => (
            <article key={review.id} className="card review-card">
              <div className="ig-header">
                <div className="avatar">{String(review.name || "C").charAt(0).toUpperCase()}</div>
                <div>
                  <strong>{review.name}</strong>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <p className="muted">{review.text}</p>
            </article>
          ))}
        </div>
        <div className="card auth-card" style={{ marginTop: 14 }}>
          <form className="auth-form" onSubmit={handleSubmit}>
            <strong>Leave a 5-star review</strong>
            <textarea
              className="textarea"
              placeholder={user ? "Tell people how cute the can was..." : "Sign up first to review."}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={!user}
            />
            <button className="btn" disabled={!user || loading}>{loading ? "Posting..." : "Post review"}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
