# xHero Marketplace - Issue Remediation Phases

This plan organizes the identified risks so they can be implemented one by one in priority order.

## Phase 1 (High Priority)

### 1. Prevent stale chat data after logout/session change
- Severity: High
- Risk: Previous user's messages can remain visible in client state when auth drops or account switches.
- Affected file: `src/hooks/useChatMessages.ts`
- Evidence: early return without state reset around user resolution (`src/hooks/useChatMessages.ts:42`)
- Implementation goal:
  - Reset `messages`, `conversationId`, and `activeUserId` when no valid authenticated user exists.
  - Ensure cleanup path runs on logout and user switch.
- Validation:
  - Login as user A, open chat, logout, login as user B.
  - Confirm no user A messages are visible before user B chat loads.

### 2. Harden typing indicator channel against spoofed events
- Severity: High
- Risk: Any client that can broadcast to the topic may trigger false typing indicators.
- Affected file: `src/hooks/useTypingIndicator.ts`
- Evidence: payload accepted with only self-check (`src/hooks/useTypingIndicator.ts:25`, `src/hooks/useTypingIndicator.ts:27`)
- Implementation goal:
  - Validate payload structure and sender identity.
  - Accept typing events only from authorized conversation participants.
  - Align with strict Supabase Realtime authorization/policies.
- Validation:
  - Attempt broadcast from non-participant client.
  - Confirm indicator does not show for unauthorized events.

## Phase 2 (Medium Priority)

### 3. Add pagination/limits for chat history loading
- Severity: Medium
- Risk: Unbounded message fetch increases latency and memory usage as conversations grow.
- Affected file: `src/hooks/useChatMessages.ts`
- Evidence: unbounded fetch with `.select("*")` and ascending order (`src/hooks/useChatMessages.ts:131`, `src/hooks/useChatMessages.ts:133`)
- Implementation goal:
  - Introduce page size and incremental loading (initial window + older history load).
  - Select only required columns.
- Validation:
  - Seed large conversation.
  - Confirm first render stays responsive and network payload is bounded.

### 4. Fix support status time logic for timezone + overnight schedules
- Severity: Medium
- Risk: Incorrect online/offline status for cross-midnight windows and timezone assumptions.
- Affected file: `src/hooks/useSupportStatus.ts`
- Evidence: local time string compare (`src/hooks/useSupportStatus.ts:61`, `src/hooks/useSupportStatus.ts:74`)
- Implementation goal:
  - Replace string comparison with robust time interval logic.
  - Explicitly define support timezone and conversion strategy.
  - Correctly handle intervals such as `22:00` to `02:00`.
- Validation:
  - Test standard daytime and overnight schedules across timezone boundaries.

### 5. Refresh support schedule without page reload
- Severity: Medium
- Risk: Admin schedule changes do not propagate to active clients promptly.
- Affected file: `src/hooks/useSupportStatus.ts`
- Evidence: schedule fetched once on mount (`src/hooks/useSupportStatus.ts:141`) while interval only recalculates cached data (`src/hooks/useSupportStatus.ts:151`)
- Implementation goal:
  - Add periodic refetch or Realtime subscription on `support_schedule`.
- Validation:
  - Update schedule in admin flow.
  - Confirm chat header status updates in active client session.

### 6. Remove redundant cart reload triggers
- Severity: Medium
- Risk: Repeated `loadCart` calls can cause avoidable localStorage parse/reset churn.
- Affected files: `src/layouts/Header.tsx`, `src/components/Cart.tsx`
- Evidence: cart loads in both components (`src/layouts/Header.tsx:64`, `src/components/Cart.tsx:28`), broader dependency in header (`src/layouts/Header.tsx:66`)
- Implementation goal:
  - Consolidate cart hydration strategy.
  - Use stable dependency (`user?.id`) where applicable.
- Validation:
  - Navigate across pages and monitor cart stability + rerender frequency.

### 7. Implement dynamic homepage banner management per backend requirements
- Severity: Medium
- Risk: Current static slider does not satisfy admin-managed upload constraints.
- Affected file: `src/components/home/HeroSlider.tsx`
- Evidence: hardcoded slides/images (`src/components/home/HeroSlider.tsx:21`, `src/components/home/HeroSlider.tsx:56`, `src/components/home/HeroSlider.tsx:91`)
- Implementation goal:
  - Source banners from admin-managed backend data.
  - Enforce allowed types (`jpg`, `jpeg`, `png`, `webp`) and max file size (2MB).
- Validation:
  - Upload and publish banners from admin flow.
  - Verify rendering, dimensions, and load performance.

## Phase 3 (Audit/Verification Gaps)

### 8. Verify and document Supabase RLS/Realtime policies in repo
- Severity: Medium (governance/security assurance)
- Risk: Security claims cannot be validated from source control without SQL migrations/policy definitions.
- Evidence: No migration SQL found; current script prints SQL for manual run (`scripts/print-migration.js:100`)
- Implementation goal:
  - Add versioned SQL migrations for chat/support policy changes.
  - Document expected RLS + Realtime authorization behavior.
- Validation:
  - Run policy verification checklist and negative-access tests.

## Suggested Execution Order
1. Phase 1 item 1
2. Phase 1 item 2
3. Phase 2 item 3
4. Phase 2 item 4
5. Phase 2 item 5
6. Phase 2 item 6
7. Phase 2 item 7
8. Phase 3 item 8

## Definition of Done (per item)
- Security checks pass for unauthorized access attempts.
- Regression checks pass for login/logout, chat, and cart workflows.
- Performance impact measured for chat load paths.
- Changes linked to commit + test evidence.
