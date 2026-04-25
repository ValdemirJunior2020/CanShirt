// C:\Users\User\Desktop\CanWearProject-FIXED\server\server.js

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const paypalApiBase =
  process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

const supabase =
  supabaseUrl && supabaseSecretKey
    ? createClient(supabaseUrl, supabaseSecretKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      })
    : null;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (!allowedOrigins.length || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    }
  })
);

app.use(express.json({ limit: "1mb" }));

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function normalizeMoney(value) {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    throw new Error("Invalid order total.");
  }

  return number.toFixed(2);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function getPayPalAccessToken() {
  const clientId = requireEnv("PAYPAL_CLIENT_ID");
  const secret = requireEnv("PAYPAL_CLIENT_SECRET");
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const response = await fetch(`${paypalApiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error_description ||
        data.error ||
        "Could not get PayPal access token."
    );
  }

  return data.access_token;
}

async function sendOrderEmail({ to, subject, html }) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass || !to) {
    console.warn("SMTP not configured. Email skipped.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || smtpUser,
    to,
    subject,
    html
  });
}

function buildShippingHtml(shippingInfo = {}) {
  return `
    <h3>Shipping details</h3>
    <p>
      <strong>Name:</strong> ${escapeHtml(shippingInfo.fullName || "-")}<br />
      <strong>Email:</strong> ${escapeHtml(shippingInfo.email || "-")}<br />
      <strong>Phone:</strong> ${escapeHtml(shippingInfo.phone || "-")}<br />
      <strong>Address 1:</strong> ${escapeHtml(shippingInfo.address1 || "-")}<br />
      <strong>Address 2:</strong> ${escapeHtml(shippingInfo.address2 || "-")}<br />
      <strong>City:</strong> ${escapeHtml(shippingInfo.city || "-")}<br />
      <strong>State:</strong> ${escapeHtml(shippingInfo.state || "-")}<br />
      <strong>ZIP:</strong> ${escapeHtml(shippingInfo.postalCode || "-")}<br />
      <strong>Country:</strong> ${escapeHtml(shippingInfo.country || "-")}
    </p>
  `;
}

async function saveOrderToSupabase({
  paypalOrderId,
  captureData,
  cart,
  total,
  email,
  shippingInfo
}) {
  if (!supabase) {
    console.warn("Supabase is not configured. Order was not saved.");
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      paypal_order_id: paypalOrderId,
      customer_email: email || null,
      total: Number(total),
      status: "paid",
      cart,
      shipping_info: shippingInfo,
      paypal_capture: captureData
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase order insert error:", error);
    return null;
  }

  return data;
}

app.get("/", (_, res) => {
  res.json({
    ok: true,
    service: "CanWear server",
    routes: ["/api/health", "/api/supabase/health"]
  });
});

app.get("/api/health", (_, res) => {
  res.json({
    ok: true,
    service: "CanWear server",
    paypalMode: paypalApiBase.includes("sandbox") ? "sandbox" : "live",
    supabaseConfigured: Boolean(supabase),
    clientUrl: process.env.CLIENT_URL || null
  });
});

app.get("/api/supabase/health", async (_, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        ok: false,
        error:
          "Supabase is not configured. Check SUPABASE_URL and SUPABASE_SECRET_KEY."
      });
    }

    const { error } = await supabase.from("orders").select("id").limit(1);

    if (error) {
      return res.status(500).json({
        ok: false,
        error: error.message
      });
    }

    return res.json({
      ok: true,
      message: "Supabase connection works."
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || "Supabase health check failed."
    });
  }
});

app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const accessToken = await getPayPalAccessToken();
    const shippingInfo = req.body.shippingInfo || {};
    const total = normalizeMoney(req.body.total);

    if (!Array.isArray(req.body.cart) || req.body.cart.length === 0) {
      return res.status(400).json({
        error: "Cart is empty."
      });
    }

    const response = await fetch(`${paypalApiBase}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: total
            },
            shipping: {
              name: {
                full_name: shippingInfo.fullName || "CanWear Customer"
              },
              address: {
                address_line_1: shippingInfo.address1 || "",
                address_line_2: shippingInfo.address2 || "",
                admin_area_2: shippingInfo.city || "",
                admin_area_1: shippingInfo.state || "",
                postal_code: shippingInfo.postalCode || "",
                country_code: "US"
              }
            }
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: data.message || data.error || "Could not create PayPal order.",
        details: data
      });
    }

    return res.json(data);
  } catch (error) {
    console.error("Create PayPal order error:", error);
    return res.status(500).json({
      error: error.message || "Server error while creating PayPal order."
    });
  }
});

app.post("/api/paypal/capture-order", async (req, res) => {
  try {
    const accessToken = await getPayPalAccessToken();
    const orderID = req.body.orderID;

    if (!orderID) {
      return res.status(400).json({
        error: "Missing PayPal orderID."
      });
    }

    const response = await fetch(
      `${paypalApiBase}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const captureData = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error:
          captureData.message ||
          captureData.error ||
          "Could not capture PayPal order.",
        details: captureData
      });
    }

    const shippingInfo = req.body.shippingInfo || {};
    const total = normalizeMoney(req.body.total || 0);
    const email = req.body.email || shippingInfo.email || null;
    const cart = Array.isArray(req.body.cart) ? req.body.cart : [];

    const savedOrder = await saveOrderToSupabase({
      paypalOrderId: orderID,
      captureData,
      cart,
      total,
      email,
      shippingInfo
    });

    const itemsHtml = cart
      .map((item) => {
        const name = escapeHtml(item.name || "Item");
        const quantity = escapeHtml(item.quantity || 1);
        return `<li>${name} x ${quantity}</li>`;
      })
      .join("");

    const shippingHtml = buildShippingHtml(shippingInfo);

    await sendOrderEmail({
      to: email,
      subject: "Your CanWear order is confirmed",
      html: `
        <h2>Thanks for your order.</h2>
        <p>Your payment was captured successfully.</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Total:</strong> $${total}</p>
        ${shippingHtml}
      `
    });

    if (process.env.ORDER_ALERT_EMAIL) {
      await sendOrderEmail({
        to: process.env.ORDER_ALERT_EMAIL,
        subject: "New CanWear order received",
        html: `
          <p>A new order was completed.</p>
          <p><strong>PayPal Order:</strong> ${escapeHtml(orderID)}</p>
          <ul>${itemsHtml}</ul>
          <p><strong>Total:</strong> $${total}</p>
          ${shippingHtml}
        `
      });
    }

    return res.json({
      ok: true,
      paypal: captureData,
      supabaseOrder: savedOrder
    });
  } catch (error) {
    console.error("Capture PayPal order error:", error);
    return res.status(500).json({
      error: error.message || "Server error while capturing PayPal order."
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
    availableRoutes: ["/", "/api/health", "/api/supabase/health"]
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`CanWear server running on port ${port}`);
});