import Link from "next/link";

export default function PaymentErrorPage() {
  return (
    <div className="page-wrapper flex items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <p className="text-6xl mb-6">❌</p>
        <h1 className="font-bebas text-4xl text-white mb-4">
          Płatność nie powiodła się
        </h1>
        <p className="text-gray-300 text-lg mb-3">
          Niestety, nie udało się przetworzyć Twojej płatności.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Spróbuj ponownie lub wybierz inną metodę płatności.
        </p>
        <Link
          href="/ai-avatar"
          className="inline-block bg-accent hover:bg-[#e07e00] text-white font-bold py-3 px-8 rounded-lg transition-colors uppercase"
        >
          Spróbuj ponownie
        </Link>
      </div>
    </div>
  );
}
