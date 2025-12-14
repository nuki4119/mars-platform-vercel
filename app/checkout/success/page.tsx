// app/checkout/success/page.tsx

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-green-400">✅ Boost Successful</h1>
        <p className="text-gray-300">
          Your post has been boosted successfully. Your support fuels visibility and growth 🚀
        </p>
        <Link
          href="/feed"
          className="inline-block px-4 py-2 bg-marsRed text-white rounded hover:bg-red-600 transition"
        >
          🔙 Return to Feed
        </Link>
      </div>
    </div>
  );
}
