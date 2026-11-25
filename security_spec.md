# Firestore Security Specification (Phase 0 — Payload-First Security TDD)

## 1. Data Invariants

1. **Strict Private Ownership**: Every document under `/users/{userId}` (including `progress/{progressId}` and `quizItems/{itemId}`) is readable and writable **only** by the authenticated owner whose `request.auth.uid == userId`. No blanket `isSignedIn()` reads or lists exist.
2. **Verified Identity on All Writes**: All create/update/delete operations require `request.auth.token.email_verified == true`.
3. **Master Gate Relational Integrity**: No `progress/{progressId}` or `quizItems/{itemId}` document may be read (`get`), created, updated, or deleted unless its parent `/users/{userId}` document exists and its `uid` field equals `request.auth.uid`.
4. **Strict Schema & No Shadow Fields**: Every create checks `keys().hasAll(...) && keys().hasOnly(...)`; every update checks `isValid[Entity](incoming())` AND `incoming().diff(existing()).affectedKeys().hasOnly(...)`.
5. **Immutable Identity & Temporal Integrity**: `uid`, `userId`, `itemId`, and `createdAt` are immutable after creation. `createdAt == request.time` on create; `updatedAt == request.time` on create and update.
6. **Volumetric Bounds & Path Hardening**: All path IDs match `^[a-zA-Z0-9_\-]+$` with length `<= 128`. `displayName` is `<= 100` chars. `stageIndex` is an integer in `[0, 20]`. `completedCheckIds` is a list of `<= 50` strings (first element type-checked when non-empty). `rightCount` and `wrongCount` are integers in `[0, 10000]`. `lastResult` is `0` or `1`.
7. **Secure List Queries**: `/users` and `/users/{userId}/progress` disallow `list`. `/users/{userId}/quizItems` enforces `isSignedIn() && isOwner(userId) && resource.data.userId == request.auth.uid` with zero `get()`/`exists()` calls inside `allow list`.

## 2. The "Dirty Dozen" Adversarial Payloads (Must All Return `PERMISSION_DENIED`)

1. **Unauthenticated Read** — Anonymous request reads `/users/alice/progress/journey`.
2. **Cross-User PII / Profile Theft** — Authenticated `bob` attempts `get` on `/users/alice`.
3. **Unverified Email Write Spoofing** — User `alice` with `email_verified: false` attempts to create `/users/alice`.
4. **Shadow Field Injection on Profile Create** — `alice` creates `/users/alice` with extra ghost field `isAdmin: true`.
5. **UID Spoofing on Profile Create** — `alice` creates `/users/alice` with `{ uid: "bob", ... }`.
6. **Orphaned Progress Write (Master Gate Bypass)** — `alice` creates `/users/alice/progress/journey` before parent `/users/alice` exists.
7. **Invalid Path ID Poisoning** — `alice` writes `/users/alice/quizItems/bad:id$with*chars` or a 200-char ID.
8. **Backdated / Forged Timestamp** — `alice` creates `/users/alice/progress/journey` with a client-supplied `createdAt` not equal to `request.time`.
9. **Immutable `createdAt` Tampering on Update** — `alice` updates `/users/alice/progress/journey` and mutates `createdAt`.
10. **Value Poisoning & Bounds Overflow** — `alice` updates `/users/alice/progress/journey` with `stageIndex: 999` or `completedCheckIds` containing 51 elements or a non-string `[123]`.
11. **Quiz Counter / Enum Tampering** — `alice` creates `/users/alice/quizItems/01-Bayes__q0` with `lastResult: 2` or `rightCount: -5` or `itemId: "other"`.
12. **Blanket List Scraping** — `bob` attempts `list` on `/users/alice/quizItems` or `alice` attempts `list` on `/users`.
