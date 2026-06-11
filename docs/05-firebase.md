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
4. Deploy rules & indexes. **Normal path: automatic.** The
   `firestore-deploy` workflow deploys `firestore.rules` +
   `firestore.indexes.json` whenever they change on `main` (or via manual
   workflow dispatch). It needs the `FIREBASE_SERVICE_ACCOUNT_KEY` **repo
   secret** (same single-line JSON as the Vercel variable) and the service
   account needs the **Firebase Admin** role (`roles/firebase.admin`) —
   the auto-generated `firebase-adminsdk` account from the console
   qualifies once granted that role in IAM. Manual fallback from any
   clone (`.firebaserc` pins the project):

   ```bash
   npm i -g firebase-tools
   firebase login
   firebase deploy --only firestore
   ```

   The Firestore database (step 3) must exist before the first deploy.
   Obsolete index deletion is deliberately manual (console) — CI only
   adds.
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

### Resend domain setup (one-time, prerequisite for sending)

`journal@fluensys.co.uk` can only send once the domain is verified —
until then Resend is sandboxed to `onboarding@resend.dev` and your own
inbox.

1. Resend dashboard → **Domains → Add Domain** → `fluensys.co.uk`,
   region **EU (Ireland)** to match the UK audience.
2. Add the DNS records Resend displays — a DKIM TXT
   (`resend._domainkey…`) plus SPF TXT + MX on the `send.` subdomain
   (custom return-path) — at whichever DNS host serves fluensys.co.uk
   (the registrar's panel unless nameservers were moved).
3. Wait for the dashboard to show **Verified** (usually minutes).
4. Recommended: add DMARC — TXT `_dmarc.fluensys.co.uk` →
   `v=DMARC1; p=none; rua=mailto:info@fluensys.co.uk` — monitor first,
   tighten to `quarantine` once reports look clean. DKIM+SPF+DMARC
   together satisfy Gmail/Yahoo bulk-sender requirements.
5. `journal@` needs no mailbox to send. Create an alias/forward only if
   replies matter, or set `reply_to: info@fluensys.co.uk` in the digest
   sender when it's built.
6. Mind the plan limits (free tier: 100 emails/day, 3,000/month) when
   the subscriber list grows; digests batch per-topic, so size the plan
   to list length × send frequency.
