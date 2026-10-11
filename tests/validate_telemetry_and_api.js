/**
 * AURA Automated E-Commerce Telemetry & API Validation Test Suite
 * Tests REST API endpoints, MongoDB models, Auth, and GA4 event payloads
 */

import { validateGA4Payload, formatGA4Item } from "../frontend/src/utils/gtm.js";
import { SAMPLE_PRODUCTS } from "../frontend/src/data/products.js";

const API_BASE = "http://localhost:5000/api";

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: [],
};

const assert = (description, condition, details = "") => {
  results.total++;
  if (condition) {
    results.passed++;
    results.tests.push({ description, status: "PASS", details });
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${description}`);
  } else {
    results.failed++;
    results.tests.push({ description, status: "FAIL", details });
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${description} ${details ? `(${details})` : ""}`);
  }
};

async function runTests() {
  console.log("\n\x1b[35m========================================================\x1b[0m");
  console.log("\x1b[35m  ⚡ AURA E-COMMERCE END-TO-END VALIDATION TEST SUITE   \x1b[0m");
  console.log("\x1b[35m========================================================\x1b[0m\n");

  // SECTION 1: Backend Health & System Connectivity
  console.log("\x1b[36m[1/4] Testing System Health & Server Connectivity...\x1b[0m");
  try {
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    assert("API Health Check responds with HTTP 200", healthRes.status === 200);
    assert("Health status is 'ok'", healthData.status === "ok");
  } catch (err) {
    assert("Server is reachable on port 5000", false, err.message);
  }

  // SECTION 2: Products API & Database Validation
  console.log("\n\x1b[36m[2/4] Testing Products REST API & Catalog Queries...\x1b[0m");
  try {
    const prodsRes = await fetch(`${API_BASE}/products`);
    const prodsData = await prodsRes.json();
    assert("GET /api/products returns HTTP 200", prodsRes.status === 200);
    assert("Products count is greater than 0", prodsData.count > 0);
    assert("Products array contains valid schema items", Array.isArray(prodsData.products) && prodsData.products[0].name !== undefined);

    // Test single item lookup
    const singleRes = await fetch(`${API_BASE}/products/aura-h1-anc`);
    const singleData = await singleRes.json();
    assert("GET /api/products/:id finds product by slug", singleRes.status === 200 && singleData.name.includes("Aura"));
    assert("Product price is numeric and greater than 0", typeof singleData.price === "number" && singleData.price > 0);
  } catch (err) {
    assert("Products API query execution", false, err.message);
  }

  // SECTION 3: Auth & Order Creation Lifecycle
  console.log("\n\x1b[36m[3/4] Testing Authentication & Order Lifecycle...\x1b[0m");
  let authToken = "";
  try {
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@aura.store", password: "Admin@123456" }),
    });
    const loginData = await loginRes.json();
    assert("Admin login succeeds with HTTP 200", loginRes.status === 200);
    assert("Admin user receives valid JWT token", Boolean(loginData.token));
    assert("Admin user has isAdmin: true", loginData.isAdmin === true);
    authToken = loginData.token;

    // Test Order submission
    const orderPayload = {
      orderId: `VALIDATE-${Date.now()}`,
      orderItems: [
        {
          name: "Aura Studio Pro Wireless ANC",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
          price: 349.99,
          quantity: 1,
          selectedColor: "Space Black",
        },
      ],
      shippingAddress: {
        fullName: "Test QA Validator",
        email: "qa@aura.store",
        address: "100 Innovation Way",
        city: "Seattle",
        state: "WA",
        postalCode: "98101",
      },
      paymentMethod: "Credit Card",
      subtotal: 349.99,
      discount: 0,
      shipping: 0,
      tax: 28.00,
      grandTotal: 377.99,
    };

    const orderRes = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(orderPayload),
    });
    const orderData = await orderRes.json();
    assert("POST /api/orders creates new order with HTTP 201", orderRes.status === 201);
    assert("Created order has correct orderId", orderData.orderId === orderPayload.orderId);
    assert("Created order is marked as Paid", orderData.isPaid === true);
  } catch (err) {
    assert("Auth and Order lifecycle test", false, err.message);
  }

  // SECTION 4: GA4 E-Commerce Event Schema Validation
  console.log("\n\x1b[36m[4/4] Validating GA4 E-Commerce Telemetry Schemas...\x1b[0m");
  const sampleProd = SAMPLE_PRODUCTS[0];

  // 1. view_item_list
  const vList = validateGA4Payload("view_item_list", {
    item_list_name: "Catalog Grid",
    items: [formatGA4Item(sampleProd, 1)],
  });
  assert("Event 'view_item_list' passes GA4 schema validation", vList.isValid);

  // 2. select_item
  const selItem = validateGA4Payload("select_item", {
    item_list_name: "Catalog Grid",
    items: [formatGA4Item(sampleProd, 1)],
  });
  assert("Event 'select_item' passes GA4 schema validation", selItem.isValid);

  // 3. view_item
  const vItem = validateGA4Payload("view_item", {
    currency: "USD",
    value: sampleProd.price,
    items: [formatGA4Item(sampleProd, 1)],
  });
  assert("Event 'view_item' passes GA4 schema validation", vItem.isValid);

  // 4. add_to_cart
  const addCart = validateGA4Payload("add_to_cart", {
    currency: "USD",
    value: sampleProd.price,
    items: [formatGA4Item(sampleProd, 1)],
  });
  assert("Event 'add_to_cart' passes GA4 schema validation", addCart.isValid);

  // 5. remove_from_cart
  const remCart = validateGA4Payload("remove_from_cart", {
    currency: "USD",
    value: sampleProd.price,
    items: [formatGA4Item(sampleProd, 1)],
  });
  assert("Event 'remove_from_cart' passes GA4 schema validation", remCart.isValid);

  // 6. begin_checkout
  const bCheckout = validateGA4Payload("begin_checkout", {
    currency: "USD",
    value: sampleProd.price,
    items: [formatGA4Item(sampleProd, 1)],
  });
  assert("Event 'begin_checkout' passes GA4 schema validation", bCheckout.isValid);

  // 7. add_shipping_info
  const sInfo = validateGA4Payload("add_shipping_info", {
    currency: "USD",
    value: sampleProd.price,
    shipping_tier: "Express",
    items: [formatGA4Item(sampleProd, 1)],
  });
  assert("Event 'add_shipping_info' passes GA4 schema validation", sInfo.isValid);

  // 8. add_payment_info
  const pInfo = validateGA4Payload("add_payment_info", {
    currency: "USD",
    value: sampleProd.price,
    payment_type: "Credit Card",
    items: [formatGA4Item(sampleProd, 1)],
  });
  assert("Event 'add_payment_info' passes GA4 schema validation", pInfo.isValid);

  // 9. purchase
  const purch = validateGA4Payload("purchase", {
    transaction_id: "TEST-ORDER-1234",
    value: 349.99,
    tax: 28.00,
    shipping: 0,
    currency: "USD",
    items: [formatGA4Item(sampleProd, 1)],
  });
  assert("Event 'purchase' passes GA4 schema validation", purch.isValid);

  // 10. search
  const srch = validateGA4Payload("search", {}, { search_term: "headphones" });
  assert("Event 'search' passes GA4 schema validation", srch.isValid);

  // FINAL SUMMARY REPORT
  console.log("\n\x1b[35m========================================================\x1b[0m");
  console.log(`\x1b[32m✔ TESTS COMPLETED: ${results.passed} / ${results.total} PASSED (${Math.round((results.passed / results.total) * 100)}%)\x1b[0m`);
  if (results.failed === 0) {
    console.log("\x1b[32m✨ ALL TELEMETRY & API CHECKS PASSED WITH ZERO ERRORS!\x1b[0m");
  } else {
    console.log(`\x1b[31m✖ FAILED: ${results.failed} tests\x1b[0m`);
  }
  console.log("\x1b[35m========================================================\x1b[0m\n");
}

runTests();
