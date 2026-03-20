# AI Study Assistant

## Current State
Previous builds encountered errors. Starting fresh with a focused, reliable MVP.

## Requested Changes (Diff)

### Add
- Multi-step onboarding (name, class, exam type, subjects, weak areas, study goals)
- Student dashboard with stats, study plan, AI suggestions
- AI Chat doubt solver (OpenAI via backend HTTP outcalls)
- Notes generator (topic input -> bullet notes)
- Quiz engine (MCQ by subject/difficulty, score tracking)
- Study planner (daily schedule, editable tasks)
- Progress & analytics (accuracy, study time, charts)
- History system (chat, notes, quizzes, sessions)
- Authorization (user profiles stored in canister)

### Modify
- Nothing (fresh build)

### Remove
- Nothing

## Implementation Plan
1. Select components: authorization, http-outcalls, blob-storage
2. Generate Motoko backend with user profiles, chat history, notes, quizzes, sessions, study plans
3. Build React frontend with sidebar nav, all 7 feature screens, mobile-first responsive design
