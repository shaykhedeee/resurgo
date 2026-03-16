import Link from 'next/link';
import { sanitizePaymentParams } from '@/lib/payment-params';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PaymentFailurePage({ searchParams }: PageProps) {
  const params = sanitizePaymentParams(await searchParams);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">Payment could not be completed</h1>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        No worries. Your account is still available. You can retry checkout or continue on your current plan.
      </p>

      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)]">
        {params.error && (
          <p>
            <span className="font-medium text-[var(--text-primary)]">Error:</span> {params.error}
          </p>
        )}
        {params.reason && (
          <p className="mt-1">
            <span className="font-medium text-[var(--text-primary)]">Reason:</span> {params.reason}
          </p>
        )}
        <p className="mt-1">
          <span className="font-medium text-[var(--text-primary)]">Status:</span> {params.status ?? 'failed'}
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/pricing" className="rounded-lg bg-ascend-500 px-4 py-2 text-sm font-medium text-white">
          Retry upgrade
        </Link>
        <Link href="/dashboard" className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-primary)]">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
