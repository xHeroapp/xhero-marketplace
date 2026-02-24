# Chat Feature Bug Report & Implementation Plan

## Bug Inventory

### Critical Bugs

---

**BUG-01 — No optimistic send fallback (messages disappear on slow/dropped connection)**
- **File:** [src/hooks/useChatMessages.ts:176-179](src/hooks/useChatMessages.ts#L176-L179)
- **Impact:** High — if Supabase Realtime is slow or disconnected, the user's own sent message never appears in the list. There is no optimistic UI update; the message only renders when the real-time INSERT event fires.
- **Root cause:** `sendMessage` inserts to DB then waits for the real-time subscription to echo the message back. No local state update on send.

---

**BUG-02 — Race condition: messages missed between initial fetch and subscription setup**
- **Files:** [src/hooks/useChatMessages.ts:133-144](src/hooks/useChatMessages.ts#L133-L144) (fetch) vs [src/hooks/useChatMessages.ts:157-190](src/hooks/useChatMessages.ts#L157-L190) (subscribe)
- **Impact:** High — any message inserted in the window between `setConversationId()` being called and the channel subscription going live is silently dropped.
- **Root cause:** Initial fetch and subscription setup live in two separate `useEffect`s. The subscription is async and not coordinated with the fetch completion.

---

**BUG-03 — No `is_typing: false` broadcast — stop-typing handler is dead code**
- **Files:** [src/hooks/useTypingIndicator.ts:59-65](src/hooks/useTypingIndicator.ts#L59-L65) (handler), [src/hooks/useTypingIndicator.ts:80-88](src/hooks/useTypingIndicator.ts#L80-L88) (broadcaster), [src/components/Message.tsx:37-39](src/components/Message.tsx#L37-L39) (send handler)
- **Impact:** High — the admin side sees the typing indicator for 3 extra seconds after the user sends a message or clears the input. The `is_typing: false` branch in the receiver is unreachable with the current implementation.
- **Root cause:** `broadcastTyping` only ever sends `is_typing: true`. No `broadcastStopTyping` function exists or is called on message send / input clear.

---

**BUG-04 — No send-in-progress guard — duplicate messages possible**
- **File:** [src/components/Message.tsx:34-40](src/components/Message.tsx#L34-L40)
- **Impact:** High — the send button is only disabled when `inputText` is empty or during initial `isChatLoading`. A fast double-tap fires two inserts with identical content.
- **Root cause:** Missing `isSending` local state. `handleSubmit` is async but has no guard against concurrent invocations.

---

**BUG-05 — Date divider hardcoded to "Today"**
- **File:** [src/components/Message.tsx:131-133](src/components/Message.tsx#L131-L133)
- **Impact:** Medium — conversations with history from previous days all appear under one "Today" label, making the timeline confusing.
- **Root cause:** Static string, no dynamic date grouping logic.

---

**BUG-06 — Overnight support schedule silently broken**
- **File:** [src/hooks/useSupportStatus.ts:74](src/hooks/useSupportStatus.ts#L74)
- **Impact:** Medium — any support schedule where `end_time < start_time` (e.g. 22:00–02:00) will always evaluate as offline during that shift.
- **Root cause:** String comparison `currentTime >= start_time && currentTime < end_time` fails when the window wraps past midnight.

---

**BUG-07 — Empty schedule table causes support to always show offline**
- **File:** [src/hooks/useSupportStatus.ts:44-46](src/hooks/useSupportStatus.ts#L44-L46) and [src/hooks/useSupportStatus.ts:57](src/hooks/useSupportStatus.ts#L57)
- **Impact:** Medium — if the `support_schedule` table exists but has no rows, `setSchedule([])` is called. `calculateStatus` returns early on `schedule.length === 0`, leaving `isOnline` as `false` permanently.
- **Root cause:** No fallback to default schedule when DB returns an empty result set (only falls back on error).

---

**BUG-08 — `broadcastTyping` fires on every keystroke — no debounce**
- **File:** [src/components/Message.tsx:50-52](src/components/Message.tsx#L50-L52)
- **Impact:** Medium — one Supabase Realtime broadcast per keystroke. High-frequency events for fast typers; wasteful and can hit rate limits.
- **Root cause:** `broadcastTyping()` called directly in `handleChange` with no debounce.

---

**BUG-09 — `supabase` client recreated on every render**
- **Files:** [src/hooks/useChatMessages.ts:25](src/hooks/useChatMessages.ts#L25), [src/hooks/useTypingIndicator.ts:27](src/hooks/useTypingIndicator.ts#L27)
- **Impact:** Low — unnecessary client instantiation on every render; potential stale closures in callbacks that capture `supabase`.
- **Root cause:** `createClient()` called in hook body instead of inside a `useRef`.

---

**BUG-10 — Support schedule never refreshes for active sessions**
- **File:** [src/hooks/useSupportStatus.ts:140-142](src/hooks/useSupportStatus.ts#L140-L142)
- **Impact:** Low — admin changes to the support schedule are not reflected until the user reloads the page.
- **Root cause:** No Supabase Realtime subscription on `support_schedule`. Schedule fetched once on mount only.

---

**BUG-11 — TypeScript type mismatch in `handleKeyDown`**
- **File:** [src/components/Message.tsx:42-47](src/components/Message.tsx#L42-L47)
- **Impact:** Low — `React.KeyboardEvent` passed to `handleSubmit` which expects `React.FormEvent`. No runtime crash but violates type safety.
- **Root cause:** `handleSubmit(e)` called from `handleKeyDown` without event adapter.

---

**BUG-12 — `channelRef.current` not nulled after cleanup**
- **File:** [src/hooks/useTypingIndicator.ts:71-76](src/hooks/useTypingIndicator.ts#L71-L76)
- **Impact:** Low — after channel removal, `channelRef.current` still references the dead channel. A `broadcastTyping` call during the re-render cycle between cleanup and re-subscribe sends on a removed channel.
- **Root cause:** Cleanup function removes the channel but does not set `channelRef.current = null`.

---

## Implementation Plan

### Phase 1 — Critical UX & Data Integrity (Fix First)

> Fixes BUG-01, BUG-03, BUG-04

These three bugs are directly visible to the user and can cause silent data loss or confusing UI state. Fix them together since they all touch `sendMessage` / the send flow.

#### 1.1 — BUG-04: Add `isSending` guard to prevent duplicate sends

In `Message.tsx`:
- Add `const [isSending, setIsSending] = useState(false)` local state.
- Wrap `handleSubmit` body: set `isSending(true)` before `sendMessage`, set `isSending(false)` in a `finally` block.
- Add `isSending` to the send button's `disabled` condition and to the textarea's `disabled` condition.

#### 1.2 — BUG-01: Optimistic message update on send

In `useChatMessages.ts` → `sendMessage`:
- After validation, immediately append an optimistic message to `messages` state with a temporary `id` (e.g. `crypto.randomUUID()`) and `created_at: new Date().toISOString()`.
- On successful DB insert, replace the optimistic message with the real one from the real-time event (match by content + sender + approximate timestamp, or use a temp ID tracking ref).
- On error, remove the optimistic message and show the toast.
- The real-time subscription handler must deduplicate: skip appending if a matching message already exists in state.

#### 1.3 — BUG-03: Broadcast stop-typing on send and input clear

In `useTypingIndicator.ts`:
- Add a `broadcastStopTyping` function that sends `{ user_id: userId, is_typing: false }`.
- Export `broadcastStopTyping` from the hook.

In `Message.tsx`:
- After `sendMessage` succeeds (in `handleSubmit`), call `broadcastStopTyping()`.
- In `handleChange`, detect when `e.target.value === ""` and call `broadcastStopTyping()`.

---

### Phase 2 — Race Condition & Subscription Reliability

> Fixes BUG-02, BUG-09, BUG-12

These bugs affect message delivery reliability and resource management.

#### 2.1 — BUG-02: Close the fetch/subscribe race window

In `useChatMessages.ts`:
- Consolidate the fetch and subscribe into a single `useEffect` (or at minimum set up the subscription before fetching messages).
- Sequence: (1) subscribe to the channel, (2) wait for subscription to be active (`channel.subscribe()` returns a promise or use the status callback), (3) then fetch historical messages.
- In the real-time handler, deduplicate by checking if `msg.id` already exists in `messages` before appending (handles the overlap between fetch results and live events).

#### 2.2 — BUG-09: Stabilize the Supabase client with `useRef`

In `useChatMessages.ts` and `useTypingIndicator.ts`:
- Replace `const supabase = createClient()` at hook body level with:
  ```ts
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  ```
- This ensures the same client instance is used across re-renders and captured correctly in closures.

#### 2.3 — BUG-12: Null out `channelRef` after cleanup

In `useTypingIndicator.ts` cleanup function:
- After `supabase.removeChannel(channel)`, add `channelRef.current = null`.
- In `broadcastTyping`, the existing `if (!channelRef.current)` guard already handles this correctly.

---

### Phase 3 — UI Correctness

> Fixes BUG-05, BUG-11

Visual and type-safety fixes with no backend changes required.

#### 3.1 — BUG-05: Dynamic date dividers

In `Message.tsx`:
- Group messages by calendar date before rendering.
- Before the map, build a sorted list of unique dates from `messages`.
- Render a date divider before the first message of each day using a label like `"Today"`, `"Yesterday"`, or `"Mon, Jan 12"`.
- Utility: compare `new Date(msg.created_at).toDateString()` to `new Date().toDateString()` for today/yesterday detection.

#### 3.2 — BUG-11: Fix `handleKeyDown` type mismatch

In `Message.tsx`:
- Change `handleSubmit` signature to accept `React.FormEvent | React.KeyboardEvent` (union type), or
- Call `handleSubmit` without passing the event from `handleKeyDown` (since the event is only used for `preventDefault`, which is already called before the `handleSubmit` call).

---

### Phase 4 — Performance & Network Efficiency

> Fixes BUG-08

#### 4.1 — BUG-08: Debounce typing broadcasts

In `useTypingIndicator.ts`:
- Add a `broadcastTimeoutRef = useRef<NodeJS.Timeout | null>(null)`.
- In `broadcastTyping`, clear the previous timeout and set a new one that fires after 300ms (or send immediately on first call and then throttle subsequent calls).
- Alternatively, implement throttle: track `lastBroadcastRef`, only broadcast if `Date.now() - lastBroadcastRef.current > 300`.

In `Message.tsx`:
- No changes needed once the hook handles debouncing internally.

---

### Phase 5 — Support Status Reliability

> Fixes BUG-06, BUG-07, BUG-10

Backend-touching fixes for the support schedule logic.

#### 5.1 — BUG-06: Fix overnight schedule comparison

In `useSupportStatus.ts` → `calculateStatus`:
- Replace the string comparison with a numeric minute-of-day comparison:
  ```ts
  function timeToMinutes(t: string): number {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }
  ```
- For overnight schedules (`end < start`), check:
  ```ts
  const withinHours = end > start
    ? current >= start && current < end
    : current >= start || current < end;
  ```

#### 5.2 — BUG-07: Fall back to default schedule on empty DB result

In `useSupportStatus.ts` → `fetchSchedule`:
- Change the condition from `else if (data)` to `else if (data && data.length > 0)`.
- Add an `else` branch that calls `setSchedule(getDefaultSchedule())` when `data` is an empty array.

#### 5.3 — BUG-10: Subscribe to schedule changes via Supabase Realtime

In `useSupportStatus.ts`:
- After `fetchSchedule()`, set up a Supabase Realtime subscription on `support_schedule` for `INSERT`, `UPDATE`, and `DELETE` events.
- On any change event, call `fetchSchedule()` to re-fetch the latest schedule.
- Clean up the subscription on unmount.

---

## Fix Priority Matrix

| Phase | Bugs Fixed | Effort | Risk | Priority |
|-------|-----------|--------|------|----------|
| 1 | BUG-01, BUG-03, BUG-04 | Medium | Low | **Do first** |
| 2 | BUG-02, BUG-09, BUG-12 | Medium | Low | **Do second** |
| 3 | BUG-05, BUG-11 | Low | Low | Do third |
| 4 | BUG-08 | Low | Low | Do fourth |
| 5 | BUG-06, BUG-07, BUG-10 | Medium | Low | Do fifth |

---

## Files to be Modified

| File | Phases |
|------|--------|
| [src/hooks/useChatMessages.ts](src/hooks/useChatMessages.ts) | 1, 2 |
| [src/hooks/useTypingIndicator.ts](src/hooks/useTypingIndicator.ts) | 1, 2, 4 |
| [src/hooks/useSupportStatus.ts](src/hooks/useSupportStatus.ts) | 5 |
| [src/components/Message.tsx](src/components/Message.tsx) | 1, 3 |
