import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Password reset
        </p>
        <h1 className="text-2xl font-semibold text-stone-950">
          Password reset is being set up
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Password recovery is not available yet. Please contact support or return to the login page to continue.
        </p>

        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-amber-700 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
