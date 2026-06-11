"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";

import { getDb } from "./client";

/**
 * Firestore data access. Collections (see firestore.rules):
 *
 *   users/{uid}                          profile + newsletter preferences
 *   users/{uid}/bookmarks/{articleSlug}  saved articles
 *   articles/{articleSlug}/comments/{id} public discussion
 *   newsletterSubscribers/{id}           lead-gen subscriptions
 */

export interface CommentDoc {
  id: string;
  uid: string;
  displayName: string;
  photoURL: string | null;
  body: string;
  createdAt: { seconds: number } | null;
}

export async function toggleBookmark(
  uid: string,
  article: { slug: string; title: string; category: string; url: string },
  bookmarked: boolean,
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured");
  const ref = doc(db, "users", uid, "bookmarks", article.slug);
  if (bookmarked) {
    await deleteDoc(ref);
  } else {
    await setDoc(ref, { ...article, createdAt: serverTimestamp() });
  }
}

export function listenToBookmark(
  uid: string,
  slug: string,
  callback: (bookmarked: boolean) => void,
): Unsubscribe {
  const db = getDb();
  if (!db) return () => undefined;
  return onSnapshot(doc(db, "users", uid, "bookmarks", slug), (snap) =>
    callback(snap.exists()),
  );
}

export function listenToComments(
  slug: string,
  callback: (comments: CommentDoc[]) => void,
): Unsubscribe {
  const db = getDb();
  if (!db) return () => undefined;
  const q = query(
    collection(db, "articles", slug, "comments"),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CommentDoc, "id">) })),
    );
  });
}

export async function addComment(
  slug: string,
  user: { uid: string; displayName: string | null; photoURL: string | null },
  body: string,
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured");
  await addDoc(collection(db, "articles", slug, "comments"), {
    uid: user.uid,
    displayName: user.displayName ?? "Guest Engineer",
    photoURL: user.photoURL ?? null,
    body: body.trim().slice(0, 2000),
    createdAt: serverTimestamp(),
  });
}

export async function subscribeToNewsletter(input: {
  uid: string;
  email: string;
  firstName?: string;
  topics: string[];
}): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured");
  const id = input.email.trim().toLowerCase();
  await setDoc(
    doc(db, "newsletterSubscribers", id),
    {
      uid: input.uid,
      email: id,
      firstName: input.firstName ?? "",
      topics: input.topics,
      consent: true,
      source: "site",
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
}
