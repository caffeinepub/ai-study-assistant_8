# AI Study Assistant

## Current State
All 8 screens exist (Onboarding, Dashboard, Chat, Notes, Quiz, Planner, Progress, Scanner). Backend Motoko canister has full APIs for user profiles, chat history, notes, quiz attempts, and study sessions. Authorization component is integrated.

## Requested Changes (Diff)

### Add
- Fully wired backend calls on all screens (use `useQueries` hooks for all read/write)
- Dashboard: show real stats from `getStats`, real chat history count, notes count
- Chat: load `getChatHistory` on mount, `addChatMessage` on send with simulated AI response
- Notes: load `getNotes` on mount, `addNote`, `deleteNote`, `updateNote` wired
- Quiz: `addQuizAttempt` on completion, load past attempts from `getQuizAttempts`
- Planner: local planner with `addStudySession` when a session is logged
- Progress: load `getStudySessions`, `getQuizAttempts`, `getStats` for real charts
- Onboarding: save profile via `saveCallerUserProfile`
- Friends/Collaboration tab in sidebar (UI-only, no backend yet)

### Modify
- All screens: replace any mock/static data with backend-driven state
- Dashboard: real greeting, real stats cards
- Scanner: keep as-is (image-based, UI only)

### Remove
- Hardcoded static demo data across screens

## Implementation Plan
1. Audit all screens for missing backend wiring
2. Fix hooks/queries to cover all needed endpoints
3. Update each screen to use real data from canister
4. Ensure loading states and error handling on each screen
5. Validate and build
