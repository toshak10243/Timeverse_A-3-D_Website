import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-4 text-center">
      <div>
        <p className="eyebrow text-[var(--accent)]">Temporal error</p>
        <h1 className="mt-3 font-display text-4xl font-bold">This era does not exist</h1>
        <Link href="/timeline" className="btn-primary mt-8">Back to the Time Machine</Link>
      </div>
    </main>
  );
}
