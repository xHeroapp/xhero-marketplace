# xHero Marketplace - Implementation Log

This file documents all backend and feature implementations for the xHero Employee Marketplace.

---

## 2026-01-15: Chat Online/Offline Status

### Overview
Implemented dynamic Online/Offline status for the chat support page based on configurable business hours.

### Database Changes

**New Table: `support_schedule`**

Stores configurable support availability hours, controlled by Super Admin.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `day_of_week` | INTEGER | 0 = Sunday, 1 = Monday, ..., 6 = Saturday |
| `start_time` | TIME | Start of support hours (default: 09:00:00) |
| `end_time` | TIME | End of support hours (default: 17:00:00) |
| `is_enabled` | BOOLEAN | Whether support is available this day |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Default Schedule:**

| Day | Hours | Status |
|-----|-------|--------|
| Sunday | 9am - 5pm | ✅ Enabled |
| Monday | 9am - 5pm | ✅ Enabled |
| Tuesday | 9am - 5pm | ✅ Enabled |
| Wednesday | 9am - 5pm | ✅ Enabled |
| Thursday | 9am - 5pm | ✅ Enabled |
| Friday | 9am - 5pm | ✅ Enabled |
| Saturday | 9am - 5pm | ❌ Disabled |

**RLS Policies:**
- `SELECT`: Public (anyone can read the schedule)
- `INSERT/UPDATE/DELETE`: Super admin only

### Frontend Changes

**New File: `src/hooks/useSupportStatus.ts`**

Custom React hook that:
- Fetches schedule from `support_schedule` table
- Calculates if current time falls within enabled hours
- Returns `{ isOnline: boolean, isLoading: boolean }`
- Updates automatically every minute to catch status changes

**Modified: `src/components/Message.tsx`**

- Integrated `useSupportStatus` hook
- Dynamic status indicator (green dot = online, gray dot = offline)
- Dynamic status text ("Online" or "Offline")
- Smooth color transitions with CSS

### Super Admin Control

The schedule is stored in the `support_schedule` table. Super Admin can:
- Change hours for any day (`start_time`, `end_time`)
- Enable/disable specific days (`is_enabled`)

**Example SQL to modify schedule:**
```sql
-- Disable Wednesday support
UPDATE support_schedule SET is_enabled = false WHERE day_of_week = 3;

-- Change Friday hours to 10am-4pm
UPDATE support_schedule SET start_time = '10:00:00', end_time = '16:00:00' WHERE day_of_week = 5;
```

### Testing

- Navigate to `/message` during business hours → shows "Online" with green indicator
- Navigate to `/message` outside business hours → shows "Offline" with gray indicator
- Status updates in real-time without page refresh

---

## 2026-01-15: Cart Persistence & Skeleton Loading

### Overview
Fixed two issues with the cart page:
1. Cart items disappearing on page refresh
2. Flash of unstyled/empty content (FOUC) during page load

### Changes

**Modified: `src/components/Cart.tsx`**

1. **Cart Persistence Fix:**
   - Added `useEffect` to call `loadCart(user.id)` when user becomes available
   - Fixes hydration race condition where cart appeared empty on refresh

2. **Skeleton Loading State:**
   - Added `isHydrated` state to track client-side hydration
   - Shows styled skeleton UI while hydrating (header, tabs, card placeholders)
   - Prevents flash of unstyled content

### Technical Details

The issue occurred because:
- `authStore` uses Zustand's `persist` middleware (hydrates from localStorage)
- `cartStore` doesn't persist automatically—relies on `loadCart(userId)` being called
- On refresh, `Header.tsx` called `loadCart` in `useEffect` depending on `user`
- But `user` was still `null` during initial render, so cart remained empty

The fix ensures the Cart component independently loads cart data when user is available.

---

## 2026-01-15: Real-time Chat System

### Overview
Implemented a real-time chat system with support for live messaging and typing indicators between marketplace users and super admins.

### Database Changes

**New Table: `chat_conversations`**

Tracks support conversations. One per user.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Marketplace user (FK to employees) |
| `status` | TEXT | 'active', 'closed', 'archived' |
| `last_message_at` | TIMESTAMPTZ | Timestamp of last activity |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

**New Table: `chat_messages`**

Stores individual messages.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `conversation_id` | UUID | Message belongs to this conversation |
| `sender_type` | TEXT | 'user' or 'admin' |
| `sender_id` | UUID | user_id or super_admin id |
| `content` | TEXT | Message body |
| `is_read` | BOOLEAN | Read receipt |
| `created_at` | TIMESTAMPTZ | Sent timestamp |

**Realtime & Security:**
- Enabled Supabase Realtime for `chat_messages` table via `supabase_realtime` publication
- RLS enabled on both tables
- Users can only access their own conversation and messages
- Super Admins have full access

### Frontend Changes

**New Hook: `src/hooks/useChatMessages.ts`**
- Manages conversation state and message history
- Auto-creates conversation on first load if missing
- Subscribes to `INSERT` events on `chat_messages` for live updates
- Handles sending messages

**New Hook: `src/hooks/useTypingIndicator.ts`**
- Uses Supabase Realtime Broadcast channel (`typing:conversation_id`)
- Broadcasts typing events when user types
- Listens for typing events from valid participants (e.g., admin)
- Auto-clears typing status after 3s debounce

**Modified: `src/components/Message.tsx`**
- Replaced mock data with `useChatMessages`
- Integrated typing indicators
- Auto-scroll to bottom behavior on new message or typing event
- Secure integration with `useAuthStore`

### Technical Details

**Data Flow:**
1. User loads chat → `useChatMessages` fetches/creates conversation
2. Subscribe to `chat:conversation_id` via Supabase Realtime
3. Sending message inserts to DB → Trigger `postgres_changes` event
4. Typing inputs send ephemeral `broadcast` events (not stored in DB)

**Verification:**
- Verified sending messages works and persists
- Verified real-time updates appear instantly
- Verified typing indicators show/hide correctly

### Auto-linking Logic (Added Fix)

**RPC Function: `link_employee_identity`**
- Purpose: Links an authenticated user's `auth.uid()` to their corresponding `employees` record based on email.
- Logic: `UPDATE employees SET user_id = auth.uid() WHERE email = auth.email()`
- Trigger: Called by frontend hook if employee verification fails initially.

---

## 2026-01-28: Location-Based Delivery Fees

### Overview
Implemented support for location-based delivery fees in the checkout flow. Vendors can now set variable delivery fees based on delivery areas, and employees select their location during checkout.

### Backend Context (Pre-existing)
The backend already supports this feature via:
- `vendors.delivery_fee_type`: Enum (`fixed` or `location`)
- `vendors.delivery_areas`: JSONB array of `{ id, location, fee }`
- RPCs `process_vendor_order` and `process_flash_sale_order` accept optional `p_delivery_location_id`

### Frontend Changes

**Modified File: `src/store/cartStore.ts`**
| Change | Description |
|--------|-------------|
| `selectedDeliveryLocation` | New state to track selected location per vendor |
| `setDeliveryLocation()` | Action to set/persist selected location |
| `updateVendorInCart()` | Action for revalidation updates |
| `getVendorTotal()` | Modified to use location fee when `delivery_fee_type === 'location'` |

**Modified File: `src/components/Checkout.tsx`**
| Change | Description |
|--------|-------------|
| Revalidation on mount | Fetches fresh vendor data to fix stale cart problem |
| Location list UI | Radio-style list for selecting delivery location |
| Disabled button | Payment blocked until location selected (when required) |
| Dark mode styles | Full dark mode support for location selector |

**Modified File: `src/hooks/useHandlePayment.ts`**
| Change | Description |
|--------|-------------|
| `p_delivery_location_id` | Added to order payload when vendor uses location-based fees |

### Technical Notes
- Frontend fee calculation is for **display only** - backend recalculates during RPC
- Selected location persisted to localStorage alongside cart data
- Toast notification shown if vendor fees change between cart add and checkout
