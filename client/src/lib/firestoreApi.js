// CanWearProject/client/src/lib/firestoreApi.js

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

export async function saveOrder(order) {
  return addDoc(collection(db, "orders"), {
    ...order,
    createdAt: serverTimestamp()
  });
}

export async function getCollectionDocs(collectionName) {
  const snap = await getDocs(collection(db, collectionName));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function createReview(review) {
  return addDoc(collection(db, "reviews"), {
    ...review,
    createdAt: serverTimestamp()
  });
}

export async function createPost(post) {
  return addDoc(collection(db, "posts"), {
    ...post,
    likes: post.likes || [],
    commentsCount: 0,
    createdAt: serverTimestamp()
  });
}

export async function getComments(postId) {
  const commentsQuery = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(commentsQuery);
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export function countLikes(post) {
  return Array.isArray(post?.likes) ? post.likes.length : 0;
}

export async function createComment(postId, user, text) {
  return addComment(postId, user, text);
}

export async function seedPostsIfEmpty() {
  const existing = await getDocs(query(collection(db, "posts"), limit(1)));
  if (!existing.empty) return;

  const seed = [
    {
      username: "Luna",
      caption: "My can arrived and the tee is so soft. The unboxing was perfect.",
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      likes: [],
      commentsCount: 0,
      rating: 5
    },
    {
      username: "Mateo",
      caption: "Ordered one for a gift and now I want one too.",
      image:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
      likes: [],
      commentsCount: 0,
      rating: 5
    },
    {
      username: "Sofia",
      caption: "Cute can, clean print, fast shipping. This is actually fun to open.",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
      likes: [],
      commentsCount: 0,
      rating: 5
    }
  ];

  for (const post of seed) {
    await addDoc(collection(db, "posts"), {
      ...post,
      createdAt: serverTimestamp()
    });
  }
}

export function subscribeToPosts(callback) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, async (snapshot) => {
    const posts = await Promise.all(
      snapshot.docs.map(async (postDoc) => {
        const post = { id: postDoc.id, ...postDoc.data() };
        const commentsQuery = query(
          collection(db, "posts", postDoc.id, "comments"),
          orderBy("createdAt", "asc")
        );
        const commentsSnap = await getDocs(commentsQuery);
        return {
          ...post,
          comments: commentsSnap.docs.map((comment) => ({
            id: comment.id,
            ...comment.data()
          }))
        };
      })
    );
    callback(posts);
  });
}

export async function toggleLike(postId, uid) {
  if (!uid) throw new Error("You must be signed in to like.");

  const postRef = doc(db, "posts", postId);
  const snap = await getDocs(query(collection(db, "posts"), limit(100)));
  const current = snap.docs.find((item) => item.id === postId);
  const likes = current?.data()?.likes || [];
  const alreadyLiked = likes.includes(uid);

  await updateDoc(postRef, {
    likes: alreadyLiked ? arrayRemove(uid) : arrayUnion(uid)
  });
}

export async function addComment(postId, user, text) {
  if (!user?.uid) throw new Error("You must be signed in to comment.");

  const clean = String(text || "").trim();
  if (!clean) throw new Error("Comment cannot be empty.");

  await addDoc(collection(db, "posts", postId, "comments"), {
    uid: user.uid,
    username: user.displayName || user.email?.split("@")[0] || "Guest",
    text: clean,
    createdAt: serverTimestamp()
  });

  const postRef = doc(db, "posts", postId);
  const postSnap = await getDocs(query(collection(db, "posts"), limit(100)));
  const current = postSnap.docs.find((item) => item.id === postId);
  const count = Number(current?.data()?.commentsCount || 0) + 1;

  await updateDoc(postRef, {
    commentsCount: count
  });
}

export async function createUserProfile(user) {
  if (!user?.uid) return;

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      createdAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function deleteComment(postId, commentId) {
  await deleteDoc(doc(db, "posts", postId, "comments", commentId));
}
