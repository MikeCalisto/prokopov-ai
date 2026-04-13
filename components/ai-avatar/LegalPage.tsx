import Link from "next/link";

interface LegalPageProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalPage({ title, children }: LegalPageProps) {
  return (
    <div className="page-wrapper">
      <div className="px-4 py-8">
        <Link
          href="/ai-avatar"
          className="text-accent text-sm hover:underline inline-flex items-center gap-1 mb-6"
        >
          ← Wróć na stronę
        </Link>
        <h1 className="font-bebas text-3xl text-white uppercase mb-8">
          {title}
        </h1>
        <div className="prose-legal text-gray-300 text-sm leading-relaxed space-y-4">
          {children}
        </div>
        <div className="mt-10 pt-6 border-t border-gray-800">
          <Link
            href="/ai-avatar"
            className="text-accent text-sm hover:underline inline-flex items-center gap-1"
          >
            ← Wróć na stronę główną
          </Link>
        </div>
      </div>
    </div>
  );
}
