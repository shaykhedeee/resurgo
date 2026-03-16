import Link from 'next/link';
import { sanitizePaymentParams } from '@/lib/payment-params';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const params = sanitizePaymentParams(await searchParams);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">Payment successful</h1>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        Your billing update was received. Your plan access should be available shortly.
      </p>

      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)]">
        <p>
          <span className="font-medium text-[var(--text-primary)]">Plan:</span> {params.plan ?? 'Not provided'}
        </p>
        <p className="mt-1">
          <span className="font-medium text-[var(--text-primary)]">Status:</span> {params.status ?? 'received'}
        </p>
        {params.sessionId && (
          <p className="mt-1 break-all">
            <span className="font-medium text-[var(--text-primary)]">Session:</span> {params.sessionId}
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/billing" className="rounded-lg bg-ascend-500 px-4 py-2 text-sm font-medium text-white">
          Go to billing
        </Link>
        <Link href="/dashboard" className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-primary)]">
          Open dashboard
        </Link>
      </div>
    </main>
  );
}
