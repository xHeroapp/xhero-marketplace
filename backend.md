# Backend Implementation Requirements

## 1. Flash Sale Timers Logic

**Concept:**
The Flash Sale system allows different products to have their own unique countdown timers. This reflects the reality that different vendors may run flash sales for different durations (e.g., Vendor A for 2 days, Vendor B for 14 days).

**Implementation Details:**
-   **Database:** The `active_flash_sale_products` view (or underlying table) currently provides an `end_time` field for each product.
-   **Logic:**
    -   When a vendor creates a flash sale campaign, they set a specific `end_time`.
    -   All products added to that specific campaign inherit that `end_time`.
    -   The API serving the flash sale products must ensure specifically that the `end_time` field is populated for every item.
-   **Frontend Handling:**
    -   The frontend `FlashSaleTimer` component is already configured to accept an `endTime` prop.
    -   It renders a countdown specific to that distinct timestamp, allowing multiple products side-by-side to show different remaining times.

## 2. Homepage Banner Dimensions

**Component:** `HeroSlider` (Homepage)

**Context:**
The homepage features a slider/banner section immediately after the search bar. These images are critical for the first impression and need to be uploaded via the Super Admin panel.

**Dimension Requirements:**
Based on the current CSS responsiveness and container constraints (max-width ~650px on desktop view simulating mobile app interface):

-   **Recommended Resolution:** `1300px` (width) x `460px` (height).
    -   *Rationale:* This provides 2x pixel density for the maximum container width (650px) and height (230px) defined in the CSS, ensuring sharp images on high-resolution/Retina displays.
-   **Aspect Ratio:** Approximately **2.83:1**.
-   **CSS Behavior:** The images are set as `background-image` with `background-size: cover`.
    -   *Note:* `cover` ensures the container is filled, but edges may be cropped if the uploaded aspect ratio differs significantly from the container's. Maintaining the 2.83:1 ratio minimizes this.

**Additional Admin Panel Requirements:**
-   **File Types:** Support `.jpg`, `.jpeg`, `.png`, `.webp`.
-   **Max File Size:** Recommended limit of **2MB** to ensure fast page loads (LCP metrics).
-   **Input Fields:**
    -   Image File (Upload)
    -   Title/Heading (Text, e.g., "Amazon Echo")
    -   Sub-text/Description (Text, e.g., "3rd Generation, Charcoal")
    -   Button Text (Text, e.g., "Buy Now") - *Optional*
    -   Target URL (Link for the button) - *Optional*

