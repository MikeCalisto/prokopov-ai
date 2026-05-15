import Link from "next/link";

const TELEGRAM_BOT_URL =
  "https://t.me/prokopovroman_bot?start=ogJAzMbx8YsVPje7";

export default function ThankYouPage() {
  return (
    <div className="page-wrapper flex items-center justify-center min-h-screen px-4 py-10">
      <div className="text-center max-w-md w-full">
        <p className="text-6xl mb-6">🎉</p>
        <h1 className="font-bebas text-4xl text-white mb-4">
          Dziękujemy za zakup!
        </h1>
        <p className="text-gray-300 text-lg mb-6">
          Twoja płatność została przyjęta.
        </p>

        {/* Telegram access block */}
        <div className="bg-dark-card rounded-xl p-5 border border-accent/40 mb-6 text-left">
          <p className="text-white font-bold text-base mb-3 text-center">
            📲 Jak uzyskać dostęp do kursu
          </p>
          <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside mb-4">
            <li>
              Zainstaluj aplikację <strong>Telegram</strong> na swoim
              telefonie lub komputerze (jeśli jeszcze jej nie masz).
            </li>
            <li>
              Kliknij poniższy przycisk — przeniesie Cię on do naszego
              bota, który prześle Ci materiały kursu.
            </li>
            <li>
              W otwartym chacie naciśnij <strong>„Start"</strong> —
              dostęp zostanie udostępniony automatycznie.
            </li>
          </ol>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-accent hover:bg-[#e07e00] text-white font-bold py-4 rounded-lg text-base transition-colors uppercase tracking-wide text-center"
          >
            Otwórz bota w Telegramie →
          </a>
          <p className="text-gray-500 text-xs text-center mt-3">
            Nie masz Telegrama?{" "}
            <a
              href="https://telegram.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-300"
            >
              Pobierz aplikację
            </a>
          </p>
        </div>

        <p className="text-gray-500 text-xs mb-6">
          Potwierdzenie zakupu wyślemy również na Twój adres e-mail.
          W razie problemów napisz na{" "}
          <a
            href="mailto:Roman.prockopov@gmail.com"
            className="text-accent hover:underline"
          >
            Roman.prockopov@gmail.com
          </a>
          .
        </p>

        <Link
          href="/ai-avatar"
          className="inline-block text-gray-400 text-sm underline hover:text-white transition-colors"
        >
          ← Wróć na stronę kursu
        </Link>
      </div>
    </div>
  );
}
