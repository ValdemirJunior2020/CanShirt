// C:\Users\User\Downloads\canwear-project-updated\CanWearProject\client\src\components\SocialFeed.jsx
import { useEffect, useState } from "react";
import { addComment, seedPostsIfEmpty, subscribeToPosts, toggleLike } from "../lib/firestoreApi";
import { useAuth } from "../context/AuthContext";

export default function SocialFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    seedPostsIfEmpty().catch(() => null);
    const unsub = subscribeToPosts(setPosts);
    return () => unsub && unsub();
  }, []);

  const handleLike = async (postId) => {
    try {
      setError("");
      await toggleLike(postId, user?.uid);
    } catch (err) {
      setError(err.message || "Could not like this post.");
    }
  };

  const handleComment = async (postId) => {
    try {
      setError("");
      await addComment(postId, user, drafts[postId] || "");
      setDrafts((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      setError(err.message || "Could not post comment.");
    }
  };

  return (
    <section className="section" id="community">
      <div className="container">
        <div className="section-header">
          <div>
            <h2>Community love</h2>
            <p>See what customers are posting after their can arrives.</p>
          </div>
        </div>

        {error ? <div className="notice">{error}</div> : null}

        <div className="grid">
          {posts.map((post) => {
            const liked = Boolean(user?.uid && (post.likes || []).includes(user.uid));

            return (
              <article className="card feed-card" key={post.id}>
                <div className="ig-header">
                  <div className="avatar">{String(post.username || "C").slice(0, 1)}</div>
                  <div>
                    <strong>{post.username}</strong>
                    <div className="stars">★★★★★</div>
                  </div>
                </div>

                <img
                  src={post.image}
                  alt={post.caption}
                  style={{ width: "100%", borderRadius: 20, marginTop: 14, aspectRatio: "4 / 5", objectFit: "cover" }}
                />

                <p style={{ marginTop: 14 }}>{post.caption}</p>

                <div className="feed-actions">
                  <button
                    type="button"
                    className={`like-btn ${liked ? "liked" : ""}`}
                    onClick={() => handleLike(post.id)}
                  >
                    {liked ? "♥ Liked" : "♡ Like"} ({post.likes?.length || 0})
                  </button>

                  <span className="muted">{post.comments?.length || post.commentsCount || 0} comments</span>
                </div>

                <div style={{ marginTop: 12 }}>
                  {(post.comments || []).map((comment) => (
                    <div key={comment.id} className="comment-row" style={{ alignItems: "flex-start", marginTop: 10 }}>
                      <div className="avatar" style={{ width: 30, height: 30, fontSize: 12 }}>
                        {String(comment.username || "U").slice(0, 1)}
                      </div>
                      <div>
                        <strong>{comment.username}</strong>
                        <div className="muted">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="comment-form" style={{ marginTop: 14 }}>
                  <input
                    className="input"
                    placeholder={user ? "Write a comment..." : "Sign in to comment"}
                    disabled={!user}
                    value={drafts[post.id] || ""}
                    onChange={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [post.id]: e.target.value
                      }))
                    }
                  />
                  <button type="button" className="btn-secondary" disabled={!user} onClick={() => handleComment(post.id)}>
                    Post comment
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}