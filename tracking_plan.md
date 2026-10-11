# 📊 Google Tag Manager (GTM) & Google Analytics 4 (GA4) Tracking Plan

## 1. Executive Summary
This document specifies the end-to-end e-commerce telemetry architecture for **AURA E-Commerce Platform**. The tracking infrastructure implements standard **Google Analytics 4 Recommended E-Commerce Events** through an asynchronous **`window.dataLayer`** push architecture managed by **Google Tag Manager**.

---

## 2. Tracking Architecture Overview

```
┌────────────────────────────────┐
│   AURA React 19 Application   │
│   (Vite, Tailwind, Context)   │
└───────────────┬────────────────┘
                │
         window.dataLayer.push({ event, ecommerce: { ... } })
                │
                ▼
┌────────────────────────────────┐
│    Google Tag Manager (GTM)    │
│    Container: GTM-AURA99X      │
├────────────────────────────────┤
│ • Custom Event Triggers        │
│ • DataLayer Variables (DLVs)   │
│ • Google Tag (GA4 Config)      │
│ • GA4 E-Commerce Event Tags    │
└───────────────┬────────────────┘
                │
     GA4 Enhanced Measurement & Measurement Protocol
                │
                ▼
┌────────────────────────────────┐
│    Google Analytics 4 (GA4)    │
│    Measurement ID: G-XXXXXXXXXX │
├────────────────────────────────┤
│ • Realtime Reports             │
│ • GA4 DebugView Timeline       │
│ • Monetization & Funnel Rpts   │
└────────────────────────────────┘
```

---

## 3. GA4 Recommended E-Commerce Event Matrix

All events follow Google's official event schemas with `currency: "USD"`:

| Event Name | User Interaction | Trigger Condition | Mandatory Parameters | dataLayer Helper Function |
|---|---|---|---|---|
| **`view_item_list`** | Viewing catalog / category page | Products grid renders | `item_list_name`, `items[]` | `trackViewItemList(items, category)` |
| **`select_item`** | Clicking a product card | User clicks to inspect item | `item_list_name`, `items[]` | `trackSelectItem(product, category)` |
| **`view_item`** | Viewing Product Details screen | ProductDetails component loads | `currency`, `value`, `items[]` | `trackViewItem(product)` |
| **`add_to_cart`** | Adding product to bag | Click "Add to Cart" or Quick Buy | `currency`, `value`, `items[]` | `trackAddToCart(product, qty, variant)` |
| **`remove_from_cart`** | Deleting item from cart | Click trash icon in Cart Drawer | `currency`, `value`, `items[]` | `trackRemoveFromCart(product, qty)` |
| **`view_cart`** | Opening slide-out Cart | User clicks Cart button | `currency`, `value`, `items[]` | `trackViewCart(items, total)` |
| **`begin_checkout`** | Initiating checkout | Click "Proceed to Checkout" | `currency`, `value`, `items[]` | `trackBeginCheckout(items, total)` |
| **`add_shipping_info`**| Submitting shipping address | Click "Continue to Payment" | `currency`, `value`, `shipping_tier`, `items[]` | `trackAddShippingInfo(items, total, tier)` |
| **`add_payment_info`** | Selecting payment method | Authorizing card/Apple pay | `currency`, `value`, `payment_type`, `items[]` | `trackAddPaymentInfo(items, total, type)` |
| **`purchase`** | Order confirmed & placed | Payment authorization passes | `transaction_id`, `value`, `tax`, `shipping`, `items[]` | `trackPurchase(orderId, items, total, tax, ship, coupon)` |
| **`search`** | Submitting search term | Enter keyword in Navbar search | `search_term` | `trackSearch(query)` |

---

## 4. Item Object Specification (`items[]`)

Every item inside `items[]` adheres to GA4 standard parameters:

```json
{
  "item_id": "aura-h1-anc",
  "item_name": "Aura Studio Pro Wireless ANC",
  "affiliation": "AURA Online Store",
  "item_brand": "Aura Soundworks",
  "item_category": "Audio",
  "item_variant": "Space Black",
  "price": 349.99,
  "quantity": 1,
  "index": 1,
  "discount": 80.00
}
```

---

## 5. Google Tag Manager Container Setup

### 5.1 One-Click Import (Recommended)
This repository includes a ready-to-import GTM container export file:
📁 **[`gtm_container_export.json`](file:///c:/Users/chetu/Desktop/Ecomers%20Website/gtm_container_export.json)**

1. Open **[tagmanager.google.com](https://tagmanager.google.com)**.
2. Select or create your GTM Web Container.
3. Navigate to **Admin > Import Container**.
4. Select `gtm_container_export.json`.
5. Choose **Merge > Overwrite conflicting tags**.
6. Update the variable `Constant - GA4 Measurement ID` with your real GA4 ID (e.g. `G-XXXXXXXXXX`).
7. Click **Submit** to publish your container.

---

### 5.2 Manual Setup Reference

#### A. Google Tag (GA4 Configuration)
- **Tag Type**: Google Tag
- **Tag ID**: `{{Constant - GA4 Measurement ID}}`
- **Configuration Settings**:
  - `debug_mode`: `true`
  - `send_page_view`: `true`
- **Trigger**: `All Pages` (Initialization)

#### B. GA4 E-Commerce Event Tags
For each e-commerce event (`view_item_list`, `view_item`, `add_to_cart`, `purchase`, etc.):
- **Tag Type**: Google Analytics: GA4 Event
- **Measurement ID**: `{{Constant - GA4 Measurement ID}}`
- **Event Name**: `{{_event}}` (or static event name e.g. `purchase`)
- **More Settings > Send E-commerce data**: `Checked` (Read from dataLayer)
- **Trigger**: Custom Event matching event name (e.g. `event equals purchase`)

---

## 6. How to Validate in GTM Preview & GA4 DebugView

### 6.1 GTM Preview Validation (Tag Assistant)
1. In Google Tag Manager, click **Preview** in the top-right header.
2. Enter your local or deployed URL (e.g., `http://localhost:5173/`).
3. Click **Connect**. Tag Assistant will launch a companion tab.
4. Browse the website, click a product, add to cart, and complete checkout.
5. In the Tag Assistant tab, verify that:
   - `view_item_list` fires the **GA4 Event - view_item_list** tag.
   - `add_to_cart` fires the **GA4 Event - add_to_cart** tag.
   - `purchase` fires the **GA4 Event - purchase** tag.
   - Under the **Data Layer** tab, verify the `ecommerce` payload is populated with correct pricing and items.

### 6.2 GA4 DebugView Verification
1. Open **[analytics.google.com](https://analytics.google.com)**.
2. Navigate to **Admin > DebugView** (under Data display).
3. The application automatically sends `debug_mode: true` with all events.
4. In DebugView, observe the live chronological event stream:
   - Green icons indicate successful ingestion.
   - Click on `purchase` to view `value`, `tax`, `shipping`, and item cards.
   - Click on `items` to inspect `item_id`, `item_name`, `item_category`, and `price`.

---

## 7. In-App Telemetry & Debug Hub
The AURA store includes an integrated **GTM & GA4 Debug Hub** widget accessible from the floating pill at the bottom-left of the screen:
- **GA4 DebugView Tab**: Real-time stream of all dispatched dataLayer events with schema validation indicators (`GA4 Valid`).
- **GTM Preview Tab**: Assistant with quick test simulation buttons (`+ view_item`, `+ add_to_cart`, `+ purchase`).
- **ID Settings Tab**: Allows updating your `GTM-XXXXXXX` and `G-XXXXXXXXXX` IDs live with automatic persistence in localStorage.
- **Export dataLayer**: Download all recorded session telemetry directly to JSON for QA sign-off.
