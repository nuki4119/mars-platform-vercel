// app/checkout/CheckoutPageWrapper.tsx
import { Suspense } from "react";
import CheckoutPage from "./CheckoutPage";

export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={<p className="text-white p-8">Loading checkout...</p>}>
      <CheckoutPage />
    </Suspense>
  );
}
