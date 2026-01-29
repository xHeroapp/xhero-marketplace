# Reward Fulfillment & Delivery Logic Proposal

## Overview
This document outlines the proposed logic for handling **Location-Based Delivery Fees** within the Reward/Gift system. The goal is to ensure a frictionless "Free" redemption experience for the employee while accounting for variable delivery costs across different regions.

## The Proposed Model: "Max Delivery Fee Buffer"

### Core Logic
To prevent "Insufficient Funds" errors during redemption, the system will **over-collateralize** the transaction at the point of sending.

**Formula:**
`Total Admin Charge = Reward Item Price + Max(Vendor Delivery Fees)`

**Example:**
- **Item Price:** ₦30,000
- **Vendor Delivery Zones:**
  - Zone A: ₦3,000
  - Zone B: ₦4,000
  - Zone C: ₦6,000 (Highest)
- **Admin Pays:** ₦30,000 + ₦6,000 = **₦36,000**

### value Proposition
1.  **Guaranteed Fulfillment:** The employee can redeem the item to *any* serviceable location without hitting a funding block.
2.  **Simplified UX:** The Admin does not need to know the employee's location beforehand.

---

## Reconciliation & Refunds (The Settlement Flow)

Since the Admin pays for the "Worst Case Scenario" (Highest Fee), there will often be a surplus when an employee selects a cheaper location.

**Scenario:**
- **Paid:** ₦36,000
- **Employee Selects:** Zone A (₦3,000)
- **Actual Cost:** ₦33,000
- **Surplus:** ₦3,000

### Recommended Strategy: Budget Re-Credit
Instead of a complex external refund process, the system should strictly perform an internal **Budget Re-Credit**.

1.  **Debit:** Initially deduct ₦36,000 from the Department/Program Budget.
2.  **Redemption:** Employee redeems.
3.  **Calculation:** Backend calculates `Surplus = Reserved_Fee - Actual_Fee`.
4.  **Credit:** The Surplus (₦3,000) is automatically credited back to the originating **Department/Program Budget**.

This ensures "Exact Billing" for the client company while maintaining the safety buffer.

---

## Edge Case: Price Drift (Time Risk)
**Risk:** A Vendor increases their delivery fees between the time the reward is sent (January) and redeemed (March).
- *Old Max Fee:* ₦6,000
- *New Max Fee:* ₦8,000

**Mitigation:**
The system must have a failsafe policy.
- **Option A (Recommended):** The Platform (Aggregator) absorbs the minor difference if it fits within a tolerance margin (e.g., < 10%).
- **Option B (Strict):** If the new fee exceeds the buffer, the specific location becomes unavailable, or the request flags for manual Admin review (high friction).

---

## Implementation Checklist

### 1. Admin Portal (Sender Side)
- [ ] **Query Delivery Areas:** Fetch all delivery zones for the selected vendor.
- [ ] **Calculate Buffer:** Identify `Max(fee)` from the list.
- [ ] **Adjust Total:** Update the final chargeable amount to include this buffer.

### 2. Marketplace (Employee Side)
- [ ] **Location Selection:** Enable the Delivery Location selector on the Gift Checkout page (`/checkout-reward`).
- [ ] **Validation:** Ensure the user selects a valid zone provided by the vendor.
- [ ] **Visuals:** Display the delivery cost as **~~₦3,000~~ Free** to reinforce the value.

### 3. Backend (Settlement)
- [ ] **Logic Update:** On successful order creation, trigger the "Re-Credit" logic to return unused delivery funds to the source budget.
