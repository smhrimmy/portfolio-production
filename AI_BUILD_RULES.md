# AI_BUILD_RULES.md — Non-Negotiable Rules for This Project
## Version 1.0 — Applies to EVERY phase, EVERY file, EVERY screen

These rules exist because AI-generated apps fail in predictable,
repeated ways. You (the AI) must follow every rule below. When a
rule conflicts with speed or simplicity, THE RULE WINS. If a rule
is genuinely impossible in this project, SAY SO explicitly —
never silently skip it.

At the end of every phase, run the SELF-AUDIT CHECKLIST at the
bottom and report the result before declaring the phase complete.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 1 — THE #1 MISTAKE: FAKE FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The single most common failure: UI that LOOKS complete but does
nothing. Forbidden, without exception:

1. NO placeholder buttons — every clickable element performs its
   real action or does not exist yet.
2. NO mock/hardcoded data shown as if real. Demo data allowed
   ONLY in a clearly labeled "Demo mode" that the user enables.
3. NO "coming soon" features visible in the UI. If not built,
   it is not rendered.
4. NO fake success — a form that "saves" must write to the real
   database and prove it (data survives refresh).
5. NO fake search, fake filters, fake sorting — all must operate
   on real data.
6. NO empty handlers (onClick={() => {}}), console.log-only
   handlers, or TODO functions in shipped code.
7. If a backend is required for a feature, build the backend
   FIRST or same-phase. Never ship frontend waiting on a
   "future endpoint."
8. EVERY external integration (email, payments, storage) must be
   actually wired, tested, and verified — or explicitly excluded
   from the UI.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 2 — SECURITY (the most-damaged area in AI apps)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. AUTHORIZATION ON EVERYTHING: Row-Level Security (or equivalent)
   on EVERY table — not just "user_id matching" in frontend
   queries. Assume ALL client code is public. Verify by calling
   the API directly as user B trying to read user A's data.
10. NEVER trust the client: all validation, price math, role
    checks, and permissions enforced server-side. Recalculate
    every amount on the server; ignore client-sent prices/roles.
11. NO SERVICE-ROLE / ADMIN KEYS in frontend code, .env exposed
    to client, or any VITE_/NEXT_PUBLIC_ secret. Secrets live in
    server-side environment only.
12. AUTH FLOW COMPLETE, not just login: proper logout (server
    session cleared), password reset (real email flow),
    session expiry handling, protected routes redirecting
    correctly, no data flash before auth check loads.
13. ROLE-BASED ACCESS: if roles exist (admin/user), the check is
    server-side on every sensitive operation — hiding a button
    in the UI is NOT security.
14. INPUT SANITIZATION everywhere: SQL injection (parameterized
    queries only), XSS (no dangerouslySetInnerHTML with user
    content; escape/sanitize), CSRF protection on state-changing
    endpoints.
15. RATE LIMITING on: login, signup, password reset, public
    API endpoints, search, and any expensive operation.
16. FILE UPLOADS: validate type (by content, not extension),
    size, store outside web root or in secured storage with
    access policies; never trust client filenames.
17. NO SECRETS IN CODE/LOGS: passwords, tokens, API keys never
    logged; error messages never leak stack traces or SQL to
    end users.
18. SECURITY HEADERS: HTTPS enforced, CSP configured, X-Frame-
    Options, HSTS, CORS restricted to real origins only
    (never '*' with credentials).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 3 — DATA INTEGRITY (silent data loss = dead product)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
19. EVERY FORM validates on submit AND shows inline per-field
    errors; validation mirrors server rules exactly.
20. NO SILENT FAILURES: every write operation has error handling
    with a user-visible message. A failed save NEVER looks like
    success.
21. DOUBLE-SUBMIT PROTECTION on every submit button (disable
    while pending + idempotency where money/orders involved).
22. CONFLICT HANDLING: concurrent edits handled (optimistic
    locking or last-write-wins WITH user notification — never
    silent overwrite).
23. DELETES ARE SAFE: confirmation dialog naming the item
    ("Delete 'Q3 Report'?"), soft-delete where data matters,
    undo where feasible.
24. PAGINATION REQUIRED on every list that can grow — never
    render unbounded data. Search/filtering works server-side
    on large datasets.
25. TIMEZONES: store all timestamps in UTC; convert for display
    using the user's timezone; date pickers handle this
    correctly. No "off by one day" bugs.
26. MONEY IS NEVER A FLOAT: use integer cents or decimal types.
27. SCHEMA MIGRATIONS: no manual DB edits; migrations versioned
    and reversible where possible.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 4 — EVERY PAGE NEEDS ALL ITS STATES (AI apps ship
only the happy path — this ends now)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVERY screen/list/view must implement and verify ALL of:
28. LOADING state (skeletons matching final layout, not a lone
    spinner — and never a page jump when content arrives).
29. EMPTY state (designed, explains why it's empty, offers the
    next action — never a blank area).
30. ERROR state (human-readable message + retry button; the
    user can always recover).
31. NO-RESULTS state for every search/filter (with a "clear
    filters" action).
32. PERMISSION-DENIED state (if a user reaches something they
    can't access, show a designed message, not a raw error).
33. OFFLINE/slow-network behavior: actions queue or fail
    gracefully with clear messaging; no infinite spinners.
34. LONG CONTENT handling: what happens with a 500-character
    title, 100 items, a 10MB file? Every layout must hold.
35. CONCURRENT-USER states: what the page shows when data
    changes under you (real-time update or refetch — not stale
    ghost data).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 5 — NAVIGATION & STRUCTURE (AI apps build pages but
not a product)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
36. COMPLETE APP SHELL before features: navigation, active-
    state highlighting, breadcrumbs where depth > 2, consistent
    header/footer, logo → home.
37. 404 PAGE: designed, helpful, links to home/search. Also
    403 and 500 pages where applicable.
38. BACK BUTTON BEHAVIOR: browser back always works sensibly;
    modals close on back; filters reflected in URL so back
    restores them.
39. DEEP LINKS: every meaningful view has a shareable URL.
    State that matters lives in the URL (tab, filter, page).
40. NO ORPHAN PAGES: every page reachable via navigation; no
    dead routes; no broken links (audit at end of every phase).
41. REDIRECTS AFTER ACTIONS: login → intended destination
    (preserve the original URL), form submit → sensible place,
    logout → safe page.
42. SCROLL POSITION preserved when navigating back to a list;
    reset on forward navigation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 6 — SETTINGS, POPUPS, MODALS, DIALOGS (consistently
the sloppiest parts of AI apps)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
43. SETTINGS PAGE COMPLETE: profile fields save individually
    with per-field feedback; every setting actually persists
    and takes effect on reload (verify by refreshing).
44. DANGEROUS SETTINGS protected: account deletion requires
    typed confirmation; email/password changes require current
    password; destructive toggles warn about consequences.
45. MODALS MUST: trap focus, close on Escape AND overlay click
    (except destructive confirmations — those require explicit
    choice), restore focus to trigger on close, be scrollable
    when content is tall, and work on small screens.
46. NO alert()/confirm()/prompt() EVER — all dialogs are styled
    components consistent with the design system.
47. TOASTS: every background action result gives feedback
    (success AND failure); toasts auto-dismiss but errors stay
    longer and are dismissible; no toast spam (deduplicate).
48. UNSAVED-CHANGES GUARD: any form/dirty editor warns before
    navigation away or close — no silent loss of user input.
49. CONFIRMATION DIALOGS name the object and the consequence,
    and default to the SAFE option.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 7 — FORMS (the most-used, least-tested UI)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
50. Correct input types (email, tel, number, date), proper
    keyboards on mobile, autofill attributes (name, email).
51. Labels are real <label> elements tied to inputs — placeholder
    is NOT a label.
52. Real-time validation only AFTER first blur (never yell at
    users while typing); errors state WHAT is wrong and HOW to
    fix it.
53. Character counters where limits exist; enforce limits
    server-side too.
54. File inputs: show selected file name/size, validate before
    upload, show upload progress for large files.
55. MULTI-STEP FORMS: progress indicator, per-step validation,
    back preserves data, refresh mid-flow warns or persists.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 8 — PERFORMANCE (AI apps are slow by default)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
56. IMAGES: lazy-loaded below the fold, properly sized,
    modern formats, explicit dimensions (no layout shift).
57. NO N+1 QUERIES: related data fetched in joins/batches.
    Audit list views specifically.
58. DEBOUNCE search inputs (300ms); no request spam on typing.
59. BUNDLE DISCIPLINE: code-split routes; heavy libs (charts,
    editors) lazy-loaded; no unused dependencies.
60. N+1 RE-RENDERS in frontend: memoize where lists are large;
    virtualize lists > 100 rows.
61. TARGET: Lighthouse ≥ 90 performance on key pages; verify,
    don't assume.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 9 — RESPONSIVE & CROSS-BROWSER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
62. MOBILE-FIRST VERIFIED: every screen tested at 375px, 768px,
    1280px, 1920px. No horizontal scroll at any size; tables
    get mobile patterns (cards or horizontal scroll with hint).
63. TOUCH TARGETS ≥ 44×44px; hover-only information has a touch
    equivalent.
64. SAFE AREAS respected on notched devices; sticky footers
    don't cover content.
65. TESTED IN REAL BEHAVIOR, not just width: keyboard opens and
    doesn't cover the focused input; orientation change holds.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 10 — ACCESSIBILITY (almost always missing in AI apps)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
66. FULL KEYBOARD OPERATION of every feature: logical tab order,
    visible focus indicators (never outline:none without a
    replacement), Enter/Space activate controls.
67. SEMANTIC HTML: real buttons/links/inputs (not divs with
    onClick), headings in order, landmarks used.
68. IMAGES have alt text (meaningful, or empty for decorative);
    ICON-ONLY buttons have aria-labels.
69. COLOR CONTRAST ≥ 4.5:1 for text; information NEVER conveyed
    by color alone (add icon/text).
70. FORMS: errors announced (aria-live), required fields marked,
    error summary linked to fields.
71. prefers-reduced-motion respected: animations reduced, never
    essential functionality lost.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 11 — ERRORS, LOGGING & OBSERVABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
72. GLOBAL ERROR BOUNDARY in frontend (designed crash screen
    with reload action) — a component error must never white-
    screen the whole app.
73. SERVER ERRORS: structured logging with request context;
    user-facing messages are human and actionable; internal
    details logged, never shown.
74. MONITORING WIRED before launch: error tracking (e.g.,
    Sentry or platform equivalent) captures real exceptions —
    verified by triggering one test error.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 12 — CODE QUALITY & PROJECT HYGIENE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
75. NO DEAD CODE: unused imports, commented-out blocks,
    console.logs, and duplicate component copies are removed
    in the same phase they're created.
76. CONSISTENT PATTERNS: one way to fetch data, one toast
    system, one modal system, one form pattern. DRY enforced.
77. TYPES COMPLETE: no `any` escape hatches in TypeScript
    projects; API responses typed.
78. NAMING & STRUCTURE: feature-based folders; components
    single-responsibility; files < ~300 lines — split beyond.
79. ENVIRONMENT CONFIG: all config via env vars with a
    documented .env.example; different values per environment;
    the app fails loudly with a clear message if required vars
    are missing (never silently defaults in production).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 13 — LAUNCH READINESS (the things everyone forgets)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
80. SEO BASICS (public pages): unique title + meta description
    per page, OG/Twitter cards, canonical URLs, sitemap.xml,
    robots.txt, structured data where relevant.
81. FAVICON + manifest + apple-touch-icon; no default titles
    anywhere ("Home | AppName" pattern minimum).
82. LEGAL PAGES present and linked: privacy policy, terms;
    cookie consent ONLY if actually required (don't fake it).
83. EMAILS THAT THE APP SENDS are all real and styled: signup,
    reset, notification — verified received, not assumed.
84. NO DEV ARTIFACTS IN PRODUCTION: no lorem ipsum, no test
    users visible, no debug panels, no verbose logging, no
    "generated by AI" placeholders, no TODOs in UI text.
85. BACKUP/RESTORE story documented: what happens if the DB is
    lost today? (Platform backups configured or export feature.)
86. DEPLOYMENT VERIFIED on the real target: env vars set,
    domain + SSL live, redirect rules work, SPA fallback
    configured (deep links don't 404 on refresh).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY 14 — AI-SPECIFIC FAILURE MODES (your own weaknesses —
guard against yourself)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
87. REGRESSION GUARD: when editing a file, do not break other
    features. Re-verify previously completed flows after each
    phase (keep and maintain a REGRESSION_TEST.md listing them).
88. NO SILENT SCOPE CUTS: if a requirement can't be fully
    implemented, STOP and say so. Partial implementation without
    disclosure is a failure even if it looks done.
89. NO INVENTED APIS: never call an endpoint/library method you
    haven't verified exists in this project's dependencies.
    Check package.json / existing code first.
90. DON'T RE-ARCHITECT MID-PROJECT: follow the established
    patterns of earlier phases; refactors are explicit and
    announced, never accidental side effects.
91. ONE PLACE FOR TRUTH: shared logic (validation, constants,
    formatting) centralized — the same rule defined in two
    files WILL diverge.
92. FINISH THE LAST 10%: AI habitually completes the easy 90%
    and abandons edge cases. Every phase ends with its edge
    cases done, not deferred. "Almost done" is not done.
93. VERIFY BY EXECUTION, not by reading your own code: state
    how each feature was/will be tested. If you cannot test
    it, mark it UNVERIFIED — never claim it works.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELF-AUDIT CHECKLIST — run at the END of every phase,
report results explicitly:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Every button/link/input in this phase does its real function
  (list each one and its verified behavior)
□ All new data flows: validated server-side, RLS/permissions
  verified with a cross-user test
□ All new screens: loading + empty + error + no-results states
  implemented
□ All new modals: Escape/overlay close, focus trap, scroll,
  mobile check
□ All new forms: inline errors, double-submit guard, unsaved-
  changes guard, correct input types
□ Responsive verified at 375/768/1280/1920 for new screens
□ Keyboard-only pass on new features; alt text/aria on new
  elements; contrast checked
□ No console.logs, dead code, TODOs, or placeholder text added
□ No secrets in client code; no new unbounded queries
□ Regression check: previous phases' key flows still work
□ Anything NOT verified is explicitly listed as UNVERIFIED

Report format: "SELF-AUDIT: X rules checked, Y passed,
Z failed — [list of failures + fix plan]." Fix all failures
BEFORE the phase is considered complete.
