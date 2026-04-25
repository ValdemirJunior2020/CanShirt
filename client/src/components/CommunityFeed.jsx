// client/src/components/CommunityFeed.jsx
import { useEffect, useState } from "react";
import { createComment, createPost, getCollectionDocs, getComments, toggleLike, countLikes } from "../lib/firestoreApi";
import { useAuth } from "../context/AuthContext";

export default function CommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [commentMap, setCommentMap] = useState({});
  const [drafts, setDrafts] = useState({});

  const fallbackPosts = [
    { id: "p1", name: "Ava", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80", caption: "Opened my CanWear drop and I am obsessed." },
    { id: "p2", name: "Noah", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80", caption: "This packaging is the whole vibe." }
  ];

  const loadPosts = async () => {
    try {
      const data = await getCollectionDocs("posts");
      const resolved = data.length ? data : fallbackPosts;
      setPosts(resolved);
      const bundle = {};
      for (const post of resolved) {
        bundle[post.id] = {
          comments: await getComments(post.id),
          likes: await countLikes(post.id)
        };
      }
      setCommentMap(bundle);
    } catch {
      setPosts(fallbackPosts);
      setCommentMap({
        p1: { comments: [{ id: "c1", name: "Mia", text: "So cute." }], likes: 12 },
        p2: { comments: [{ id: "c2", name: "Leo", text: "Need this for gifting." }], likes: 8 }
      });
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const submitPost = async (e) => {
    e.preventDefault();
    if (!user || !caption.trim()) return;
    await createPost({
      userId: user.uid,
      name: user.displayName || user.email,
      caption,
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"
    });
    setCaption("");
    loadPosts();
  };

  const onLike = async (postId) => {
    if (!user) return;
    await toggleLike({ postId, userId: user.uid });
    loadPosts();
  };

  const onComment = async (postId) => {
    const text = drafts[postId]?.trim();
    if (!user || !text) return;
    await createComment({
      postId,
      userId: user.uid,
      name: user.displayName || user.email,
      text
    });
    setDrafts((prev) => ({ ...prev, [postId]: "" }));
    loadPosts();
  };

  return (
    <section id="community" className="section">
      <div className="container inline-grid">
        <div>
          <div className="section-header">
            <div>
              <h2>Community feed</h2>
              <p>Sign up to like and comment like a simple Instagram-style wall.</p>
            </div>
          </div>
          <div className="grid">
            {posts.map((post) => (
              <article key={post.id} className="card feed-card">
                <div className="ig-header">
                  <div className="avatar">{String(post.name || "C").charAt(0).toUpperCase()}</div>
                  <div>
                    <strong>{post.name || "CanWear"}</strong>
                    <div className="muted">@canwear.drop</div>
                  </div>
                </div>
                <img className="product-image" src={post.image} alt={post.caption} style={{ marginTop: 12, borderRadius: 20 }} />
                <p>{post.caption}</p>
                <div className="feed-actions">
                  <button className="like-btn" onClick={() => onLike(post.id)}>♡ {commentMap[post.id]?.likes || 0}</button>
                  <span className="muted">{(commentMap[post.id]?.comments || []).length} comments</span>
                </div>
                <div style={{ marginTop: 12 }}>
                  {(commentMap[post.id]?.comments || []).slice(0, 3).map((comment) => (
                    <div className="comment-row" key={comment.id} style={{ marginBottom: 8 }}>
                      <strong>{comment.name}:</strong>
                      <span className="muted">{comment.text}</span>
                    </div>
                  ))}
                </div>
                <div className="comment-form" style={{ marginTop: 12 }}>
                  <input
                    className="input"
                    placeholder={user ? "Write a comment" : "Sign up to comment"}
                    value={drafts[post.id] || ""}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    disabled={!user}
                  />
                  <button className="btn-secondary" onClick={() => onComment(post.id)} disabled={!user}>Add comment</button>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="card auth-card">
          <form className="auth-form" onSubmit={submitPost}>
            <strong>Share your unboxing</strong>
            <p className="muted">Keep it simple for now. Users can post a caption and join the community feel.</p>
            <textarea
              className="textarea"
              placeholder={user ? "My can arrived and the shirt looked amazing..." : "Sign up to post."}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={!user}
            />
            <button className="btn" disabled={!user}>Post to feed</button>
            <div className="notice">If you want real image uploads next, add Firebase Storage and a simple upload field.</div>
          </form>
        </aside>
      </div>
    </section>
  );
}
