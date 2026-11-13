// app/test/page.tsx
import { Suspense } from "react";
import { getTest } from "@/api";
import { isApiError } from "@/lib/api";

export default function TestPage() {
  return (
    <div>
      <h1>Test</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <TestContent />
      </Suspense>
    </div>
  );
}

async function TestContent() {
  try {
    const res = await getTest();

    return (
      <div>
        <p>{res.message}</p>
        <p>Service: {res.data.service}</p>
        <p>Status: {res.data.status}</p>
        <p>Uptime: {res.data.uptime}</p>
      </div>
    );
  } catch (err) {
    return <p>Error: {isApiError(err) ? err.message : "Terjadi kesalahan"}</p>;
  }
}
