# 05 — Firebase: Auth, Engagement & Lead Generation

Firebase replaces the v1 email-provider subscription stack with one
identity system powering newsletter capture, bookmarks and comments.

## Principles

- **Client-side islands.** All Firebase work happens in client components;
  pages stay static. Nothing blocks paint on auth state.
- **Zero-config degradation.** `isFirebaseConfigured()` guards everything;
  without env vars the auth button, bookmark button, comments and
  newsletter form hide or show a fallback. The build never requires
  Firebase.
- **Guest-first friction.** Anonymous auth is provisioned silently on first
  engagement (bookmark tap, newsletter submit) — nobody fills a login form
  to save an article. Google sign-in upgrades the experience (name/avatar
  on comments). Firebase's `linkWithPopup` account-upgrade flow is a
  roadmap item.

## Setup (one-time)

1. Create a Firebase project (region `europe-west2` to match the UK
   audience).
2. **Authentication** → enable **Google** and **Anonymous** providers; add
   `fluensys.co.uk` and the Vercel preview domain to Authorized domains.
3. **Firestore** → create database (production mode).
4. Deploy rules (the repo ships `firebase.json` but no `.firebaserc`, so
   bind your project once):

   ```bash
   npm i -g firebase-tools
   firebase login
   firebase use --add          # select the project, alias it "default"
   firebase deploy --only firestore:rules
   ```

   `firebase use --add` writes `.firebaserc` — commit it (the project id is
   not a secret; it ships in the NEXT_PUBLIC_* vars anyway). The Firestore
   database (step 3) must exist before rules can deploy.
5. Copy the web-app config into the `NEXT_PUBLIC_FIREBASE_*` vars
   (`.env.example`) locally and on Vercel.

## Data model

```
users/{uid}
  └── bookmarks/{articleSlug}     { slug, title, category, url, createdAt }

articles/{articleSlug}
  └── comments/{autoId}           { uid, displayName, photoURL, body≤2000, createdAt }

newsletterSubscribers/{email}     { uid, email, firstName, topics[], consent, source, createdAt }
```

Notes:

- Bookmarks are keyed by slug → idempotent toggles, trivial "is saved?"
  lookups, and a future "My library" page reads one subcollection.
- Comments are stored under the article slug; `createdAt desc` listener in
  `src/lib/firebase/db.ts`. Display name is denormalised at write time.
- Newsletter docs are keyed by lowercased email → resubmission is an
  upsert, no duplicates. `topics[]` uses category ids, enabling segmented
  digests later. The list is **not readable from the client**
  (rules: `read: false`) — export via console/Admin SDK only.

## Security rules (firestore.rules)

Default-deny; users read/write only their own profile and bookmarks;
comments publicly readable, create requires auth + shape/size checks
(`hasOnly` key allowlist), delete own only, edits forbidden (delete &
repost — keeps threads honest); newsletter create/update requires auth,
email-as-id match, regex check and `consent == true`. **Any Firestore
change in app code must be reviewed against these rules in the same PR.**

## Moderation & abuse posture (v1 of the feature)

- Anonymous users can comment as "Guest Engineer" — acceptable while
  volume is low; tighten to `!isAnonymous` in rules if abused.
- Moderation is manual via Firebase console (delete doc). Roadmap:
  moderation queue (status field + admin API with
  `FIREBASE_SERVICE_ACCOUNT_KEY`), rate limiting via App Check.
- Enable **App Check** (reCAPTCHA Enterprise) before traffic scales.

## Newsletter sending (Phase 2)

Capture is live; sending is deliberately deferred. Plan: weekly digest via
Resend (`RESEND_API_KEY`), rendered from the same content lake (new
articles since last digest, filtered by subscriber `topics[]`), triggered
by a GitHub scheduled workflow using the Admin SDK to read subscribers.
Include one-click unsubscribe (signed token link → deletes the doc).
