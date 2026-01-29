# Implementation Brief: Location-Based Delivery Fees (Marketplace App)

## Overview
We have updated the backend to support two types of delivery fees: **Fixed** (legacy) and **Location Based** (new).
The marketplace frontend needs to be updated to handle vendors who use location-based fees, allowing customers to select their delivery area during checkout.

---

## 1. Backend Context (What Changed)

### Database Schema (`vendors` table)
- `delivery_fee_type`: Enum `fixed` or `location`.
- `delivery_areas`: JSONB array of supported areas.
  - Structure: `[{ "id": "123", "location": "Lekki Phase 1", "fee": "1500" }, ...]`

### New RPC Signatures
The order processing functions have been updated to accept a **delivery location ID**.

#### `process_vendor_order` & `process_flash_sale_order`
Both RPCs now accept an optional `p_delivery_location_id`.

```typescript
// Example RPC Call Interface
interface ProcessOrderParams {
  p_vendor_id: string;
  p_items: Json;
  p_payment_method: string;
  p_reference: string;
  p_delivery_location_id?: string; // <--- NEW PARAMETER
}
```

---

## 2. Frontend Implementation Checklist

### Step 1: Update Vendor Fetching
Ensure your query for fetching vendor details includes the new columns:
- `delivery_fee_type`
- `delivery_areas`

### Step 2: Checkout UI Logic
In the Checkout/Cart component, check the vendor's `delivery_fee_type`.

**Scenario A: Type is 'fixed' (or null)**
- *Behavior*: No change. Use existing `delivery_fee` logic.
- *RPC Param*: `p_delivery_location_id` can be null/undefined.

**Scenario B: Type is 'location'**
- *Behavior*:
  1. **Hide** the default fixed delivery fee.
  2. **Show** a dropdown/selector populated from `vendor.delivery_areas`.
  3. **Required**: User MUST select a location to proceed.
  4. **Display**: When a location is selected, show its specific `fee` as the delivery cost.
  5. **Total**: Update cart total to include this specific location's fee.

### Step 3: Order Submission
When calling the backend to place the order:
- If `type === 'location'`, you **MUST** pass the selected area's `id` as `p_delivery_location_id`.

```typescript
// Conceptual Implementation
const submitOrder = async () => {
  const deliveryLocationId = vendor.delivery_fee_type === 'location' 
    ? selectedArea.id 
    : null;

  await supabase.rpc('process_vendor_order', {
    ...otherParams,
    p_delivery_location_id: deliveryLocationId
  });
}
```

---

## 3. Data Integrity & UX (CRITICAL)

### The Stale Cart Problem
**Issue:** Carts often "snapshot" prices when items are added. If a vendor updates their delivery fee (e.g., from 5000 to 4500) while a user has items in their cart, the user might see the old price indefinitely, leading to trust issues and under/overcharging.

### Required Solution: Real-Time Revalidation
To match the Admin Panel's immediate updates, the Marketplace **MUST** validate prices at the point of checkout.

1.  **On Checkout Page Mount:**
    *   Do NOT rely solely on the price stored in the local cart state/context.
    *   **Action:** Trigger a background fetch for the vendor's *current* `delivery_fee_type` `delivery_fee`, and `delivery_areas`.
    *   **Comparison:** Compare the fetched values with what is currently applied in the cart.
    *   **Auto-Correction:** If they differ, update the cart's delivery fee immediately and display a toast: *"Delivery fees have been updated by the vendor."*

2.  **Why this is non-negotiable:**
    *   The Admin Panel and Marketplace share the **same database**. There is no sync delay.
    *   User experience relies on trust; showing a different price at checkout vs what they actually pay (or what the vendor expects) is a critical failure.

---

## 4. Verification
1. Find a vendor set to "Location Based" (e.g., "Cakes and Cream").
2. Verify checkout asks for a location.
3. Verify changing location updates the total price.
4. **Test Stale Data:** Add item to cart -> Change fee in Admin Panel -> Refresh Marketplace Checkout. **Price MUST update automatically.**
5. Place order and verify it succeeds.
