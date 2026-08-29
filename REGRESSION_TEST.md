# REGRESSION_TEST.md — Must-Never-Break Flows
## Companion to AI_BUILD_RULES.md (Rule 87)

HOW THIS FILE WORKS:
1. At the end of EVERY phase, add the new phase's critical flows
   to the table below (the AI does this — it is part of "done").
2. At the START of every new phase, the AI must re-verify ALL
   existing rows and report results BEFORE writing new code.
3. At the END of every new phase, re-verify ALL rows again
   (new code may have broken old flows).
4. A row has three states: ✅ VERIFIED (state HOW it was tested —
   concrete action + expected result, not "checked"),
   ❌ BROKEN (fix immediately, phase not complete),
   ⬜ NOT RE-VERIFIED THIS PHASE (phase not complete).
5. "Verified" without a described test method = not verified.
   AI_BUILD_RULES.md Rule 93 applies here with full force.

REPORT FORMAT (required in every phase's completion message):
"REGRESSION: N flows in registry, N verified ✅ (methods listed
below), 0 broken, 0 skipped." Any other result blocks phase
completion.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGISTRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| # | Phase | Flow | How to Test | Last Verified | Status |
|---|-------|------|-------------|---------------|--------|
| 1 | 0 | App loads, no console errors | Open app fresh, open devtools console | Phase 28 | ✅ |
| 2 | 0 | All navigation routes reachable | Click every sidebar/nav item | Phase 28 | ✅ |
| 3 | 1 | Auth Flow | Login, Logout, ensure token is set/cleared | Phase 28 | ✅ |
| 4 | 26 | Testimonials & Newsletter | Create testimonial, add subscriber, check dashboard | Phase 28 | ✅ |
| 5 | 27 | Backup & Restore | Export JSON backup, verify download | Phase 28 | ✅ |
| 6 | 28 | Error Boundaries | Trigger UI error, verify boundary catches it | Phase 28 | ✅ |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY ROWS FOR EVERY PROJECT (add from Phase 0, always)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
These apply regardless of project type. The AI must include them
in the registry by the end of the phase where they become
testable:

AUTH & ACCESS (as soon as auth exists):
✅ Signup → logout → login round-trip works
✅ Protected route redirects to login when logged out, and
  returns to intended page after login
✅ User A cannot access User B's data via direct API call
✅ Logout actually ends the session (back button ≠ logged in)
✅ Password reset email flow completes end-to-end

DATA (as soon as first write exists):
✅ Create → refresh → still there (persistence proof)
✅ Edit → refresh → change persisted
✅ Delete → confirmation appeared → item gone → undo works (if built)
✅ Concurrent edit: two tabs, edit same record, conflict handled
  per AI_BUILD_RULES.md rule 22

UI STATES (as soon as first list/screen exists):
✅ Loading state renders (throttle network to verify)
✅ Empty state renders on a fresh account
✅ Error state renders (kill backend/invalid route to verify)
✅ Search no-results state + clear-filters works

FORMS (as soon as first form exists):
✅ Submit empty → inline per-field errors, nothing saved
✅ Double-click submit → single record
✅ Dirty form + navigate away → unsaved-changes warning

SETTINGS (as soon as settings exist):
✅ Change setting → refresh → persists and takes effect
✅ All settings values actually consumed by the app
  (no dead toggles)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRE-LAUNCH GATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before launch/deployment, EVERY row in this registry must be
✅ with a test method. The AI must print the full table in its
final report. Any ⬜ or ❌ row = no launch.
