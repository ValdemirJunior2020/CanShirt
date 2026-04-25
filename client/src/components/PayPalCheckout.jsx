// CanWearProject/client/src/components/PayPalCheckout.jsx

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useAuth } from "../context/AuthContext";
import { saveOrder } from "../lib/firestoreApi";

const apiBase = import.meta.env.VITE_API_BASE_URL;
const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export default function PayPalCheckout({
  cart,
  totals,
  shippingInfo,
  shippingReady,
  onPaid
}) {
  const { user } = useAuth();

  if (!clientId) {
    return (
      <div className="notice">
        Missing VITE_PAYPAL_CLIENT_ID. Add it to client/.env locally and Netlify
        environment variables in production.
      </div>
    );
  }

  if (!apiBase) {
    return (
      <div className="notice">
        Missing VITE_API_BASE_URL. Add your local server URL or Render server URL.
      </div>
    );
  }

  if (!shippingReady) {
    return <div className="notice">Complete the shipping form first.</div>;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture"
      }}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          shape: "pill",
          label: "paypal"
        }}
        disabled={!cart.length || !shippingReady}
        createOrder={async () => {
          const response = await fetch(`${apiBase}/api/paypal/create-order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              cart,
              total: totals.total,
              shippingInfo
            })
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Could not create PayPal order.");
          }

          return data.id;
        }}
        onApprove={async (data) => {
          const response = await fetch(`${apiBase}/api/paypal/capture-order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              orderID: data.orderID,
              cart,
              total: totals.total,
              email: shippingInfo.email || user?.email || "guest@canwear.co",
              shippingInfo
            })
          });

          const captureData = await response.json();

          if (!response.ok) {
            throw new Error(captureData.error || "Could not capture PayPal order.");
          }

          await saveOrder({
            paypalOrderId: data.orderID,
            capture: captureData,
            cart,
            total: totals.total,
            userId: user?.uid || null,
            email: shippingInfo.email || user?.email || null,
            shippingInfo,
            status: "Paid"
          });

          onPaid();
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          alert(
            "PayPal checkout failed. Check VITE_PAYPAL_CLIENT_ID, VITE_API_BASE_URL, and server PayPal credentials."
          );
        }}
      />
    </PayPalScriptProvider>
  );
}
