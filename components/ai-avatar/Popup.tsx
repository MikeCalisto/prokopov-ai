"use client";

import { useState, useEffect, useCallback } from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Popup({ isOpen, onClose }: PopupProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(600);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Podaj prawidłowy adres e-mail";
    }
    if (!phone || phone.replace(/\D/g, "").length < 7) {
      errs.phone = "Podaj prawidłowy numer telefonu";
    }
    if (!accepted) {
      errs.accepted = "Musisz zaakceptować regulamin";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [email, phone, accepted]);

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setErrors({ form: data.error || "Wystąpił błąd. Spróbuj ponownie." });
      }
    } catch {
      setErrors({ form: "Wystąpił błąd połączenia. Spróbuj ponownie." });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#2a2a2a] rounded-2xl w-full max-w-md p-6 overflow-y-auto max-h-[95vh]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl leading-none"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="font-bebas text-2xl text-white text-center uppercase mb-5 pr-6">
          Do końca specjalnej oferty pozostało
        </h2>

        {/* Timer */}
        <div className="flex justify-center gap-6 mb-5">
          {[
            { value: hours, label: "Godzin" },
            { value: minutes, label: "Minut" },
            { value: seconds, label: "Sekund" },
          ].map((t) => (
            <div key={t.label} className="text-center">
              <p className="font-bebas text-4xl text-white">
                {String(t.value).padStart(2, "0")}
              </p>
              <p className="text-gray-400 text-xs">{t.label}</p>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <span className="font-bebas text-4xl text-accent">79 zł</span>
          <span className="text-gray-500 line-through text-xl ml-2">340 zł</span>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm mb-1.5">
              Twój e-mail*
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Twój e-mail"
              className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none transition-colors"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm mb-1.5">
              Twój numer telefonu*
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Twój numer telefonu"
              className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none transition-colors"
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-600 bg-[#1a1a1a] text-accent focus:ring-accent cursor-pointer shrink-0"
            />
            <label htmlFor="terms" className="text-gray-300 text-sm cursor-pointer">
              Akceptuję{" "}
              <a href="/ai-avatar/regulamin" target="_blank" className="underline text-white hover:text-accent">
                Regulamin
              </a>{" "}
              oraz{" "}
              <a href="/ai-avatar/polityka-prywatnosci" target="_blank" className="underline text-white hover:text-accent">
                Politykę Prywatności
              </a>
              *
            </label>
          </div>
          {errors.accepted && (
            <p className="text-red-400 text-xs">{errors.accepted}</p>
          )}

          {errors.form && (
            <p className="text-red-400 text-sm text-center">{errors.form}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-accent hover:bg-[#e07e00] disabled:opacity-60 text-white font-bold py-4 rounded-lg text-lg transition-colors uppercase tracking-wide"
          >
            {loading ? "Przetwarzanie..." : "Uzyskaj dostęp"}
          </button>
        </div>

        {/* Bottom text */}
        <p className="text-gray-400 text-xs text-center mt-4 leading-relaxed">
          <span className="text-white font-bold">Nie ryzykujesz niczym!</span>{" "}
          W ciągu 14 dni, bez podania przyczyny, możesz otrzymać zwrot
          pieniędzy, jeśli kurs nie spełni Twoich oczekiwań
        </p>
      </div>
    </div>
  );
}
