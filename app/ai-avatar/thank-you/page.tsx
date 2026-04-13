import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="page-wrapper flex items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <p className="text-6xl mb-6">🎉</p>
        <h1 className="font-bebas text-4xl text-white mb-4">
          Dziękujemy za zakup!
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Dostęp do kursu zostanie wysłany na Twój adres e-mail.
        </p>
        <Link
          href="/ai-avatar"
          className="inline-block bg-accent hover:bg-[#e07e00] text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Wróć na stronę
        </Link>
      </div>
    </div>
  );
}
