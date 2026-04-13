"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Popup from "@/components/ai-avatar/Popup";

function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day = tomorrow.getDate();
  const months = [
    "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
    "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
  ];
  return `${day} ${months[tomorrow.getMonth()]}`;
}

const checkItems = [
  {
    emoji: "🎬",
    accent: "chcesz regularnie publikować",
    text: "Reels i TikToka,",
    accent2: "ale nie masz zasobów,",
    text2: "aby stale nagrywać wideo",
  },
  {
    emoji: "💡",
    accent: "odkładasz tworzenie treści",
    text: "z powodu braku idealnego światła, tła lub studia",
  },
  {
    emoji: "😶",
    accent: "trudno Ci nagrywać siebie w kadrze",
    text: "albo nie chcesz ciągle pokazywać twarzy i emocji",
  },
  {
    emoji: "📈",
    accent: "chcesz większych zasięgów i więcej obserwujących,",
    text: "ale nie chcesz żyć z kamerą 24/7",
  },
  {
    emoji: "🧠",
    accent: "jesteś zmęczony(a) wymyślaniem pomysłów",
    text: "i przygotowywaniem się do każdego nagrania",
  },
  {
    emoji: "⚙️",
    accent: "chcesz stworzyć system treści, który działa stabilnie,",
    text: 'a nie „kiedy masz nastrój"',
  },
];

const programItems = [
  {
    title: "Lekcja №1",
    subtitle: "Tworzenie cyfrowego avatara na bazie Twoich wideo",
    result: [
      "Masz własnego cyfrowego avatara stworzonego na podstawie wideo, który wygląda realistycznie i naturalnie.",
      "Potrafisz udźwiękawiać wideo zarówno głosem AI, jak i swoim prawdziwym głosem — bez ponownych nagrań.",
    ],
    videoId: "3hirtdC3CrM",
  },
  {
    title: "Lekcja №2",
    subtitle:
      "Tworzenie avatara na bazie zdjęć. Jak zmieniać tło, ubrania, fryzurę i makijaż",
    result: [
      "Stworzyłeś(-aś) pełnoprawnego cyfrowego avatara nawet bez nagrań wideo. Możesz łatwo zmieniać wygląd oraz otoczenie pod różne formaty i potrzeby.",
    ],
    videoId: "E6TP5JfVrUk",
  },
  {
    title: "Lekcja №3",
    subtitle: "Korekta wyglądu avatara",
    result: [
      "Możesz usuwać dowolne niedoskonałości twarzy lub ciała. Możesz elastycznie dopasowywać wygląd do celów i zadań treści.",
    ],
    videoId: "zbiqI6nsCYA",
  },
  {
    title: "Lekcja bonusowa №4",
    subtitle:
      "Powielanie trendów, dowolnych wideo i ruchów za pomocą avatara",
    result: [
      "Twój avatar może odtwarzać aktualne trendy bez Twojej obecności. Regularnie publikujesz wideo, które trafiają do rekomendacji.",
    ],
    videoId: "ld2T2pRe_Bw",
  },
];

const faqItems = [
  {
    q: "CZY TEN KURS JEST DLA MNIE, JEŚLI JESTEM POCZĄTKUJĄCY(-A) W AI?",
    a: "Tak. Kurs został stworzony tak, abyś mógł(-a) zacząć od zera — nawet jeśli wcześniej nie pracowałeś(-aś) z AI, wideo ani treściami. Wszystkie kroki są pokazane krok po kroku: co zrobić, gdzie kliknąć i jak uzyskać rezultat.",
  },
  {
    q: "CZY NIE SPADNIE ZAUFANIE DO BLOGA, JEŚLI KORZYSTAM Z AI-AVATARA?",
    a: "Nie. Wręcz przeciwnie — regularność i jakość treści zazwyczaj zwiększają zaufanie. AI-avatar to narzędzie optymalizacji procesu, a nie oszukiwanie odbiorców.",
  },
  {
    q: "CZY KURS JEST ODPOWIEDNI, JEŚLI JESZCZE NIE PROWADZĘ BLOGA?",
    a: 'Tak. Kurs jest odpowiedni nawet wtedy, gdy jeszcze nie prowadzisz bloga. Wręcz przeciwnie — to dobry start, ponieważ od razu budujesz treści we właściwy sposób, bez nawyku chaotycznych nagrań i wypalenia. Od samego początku tworzysz system treści z AI-avatara, zamiast próbować „jakoś zacząć".',
  },
  {
    q: "CZY TO KURS O HYPE\u2019IE CZY O STABILNYCH TREŚCIACH?",
    a: "To nie jest hype dla samego hype\u2019u. To kurs o systematyczności, optymalizacji procesów i regularnym tworzeniu treści, które można skalować bez stresu.",
  },
  {
    q: "CZY MOŻNA WYKORZYSTYWAĆ AVATARA DO RÓŻNYCH FORMATÓW I NISZ?",
    a: "Tak. Tego samego avatara można dostosować do: wideo eksperckich, trendów, treści edukacyjnych, bloga osobistego. Osobno pokazuję, jak zmieniać format bez ponownych nagrań.",
  },
  {
    q: "CZY KURS JEST ODPOWIEDNI, JEŚLI NIE JESTEM OSOBĄ TECHNICZNĄ?",
    a: "Tak. Wszystkie działania są pokazane krok po kroku, maksymalnie prosto. Jeśli potrafisz korzystać z telefonu — to w zupełności wystarczy.",
  },
  {
    q: "CZY MOGĘ STWORZYĆ AVATARA, KORZYSTAJĄC WYŁĄCZNIE Z TELEFONU?",
    a: "Tak. Większość procesów można wykonać z telefonu. Komputer — nie jest obowiązkowy.",
  },
  {
    q: "KIEDY ZOBACZĘ PIERWSZE REZULTATY?",
    a: "Pierwsze wideo z AI-avatara możesz stworzyć już w dniu przejścia pierwszych lekcji. Dalej wszystko zależy od regularności publikacji.",
  },
  {
    q: "A CO, JEŚLI KURS NIE BĘDZIE DLA MNIE?",
    a: "Masz 14 dni gwarancji zwrotu pieniędzy. Spokojnie testujesz kurs — bez ryzyka.",
  },
];

const resultItems = [
  {
    emoji: "😮‍💨",
    title: "Nie odkładasz już tworzenia treści",
    desc: 'z powodu „nie jestem gotowy(-a) do nagrań". AI-avatar pozwala tworzyć wideo nawet wtedy, gdy nie masz nastroju, czasu ani chęci być w kadrze.',
  },
  {
    emoji: "⚙️",
    title: "Masz jasny i zrozumiały proces tworzenia wideo",
    desc: "— dokładnie wiesz, jak z tekstu lub pomysłu szybko uzyskać gotowe wideo na Reels i TikToka.",
  },
  {
    emoji: "📈",
    title: "Treści publikowane są regularnie, a nie chaotycznie",
    desc: "— więcej publikacji → większe zasięgi → stabilny wzrost odbiorców.",
  },
  {
    emoji: "🎬",
    title: "Możesz testować hipotezy i trendy bez ryzyka",
    desc: "— ten sam avatar pozwala skalować to, co działa, bez dodatkowych nagrań.",
  },
  {
    emoji: "🧠",
    title: "Tworzenie treści przestaje być źródłem stresu",
    desc: "— nie myślisz o świetle, tle, wyglądzie ani lokalizacji — system pracuje za Ciebie.",
  },
];

export default function AiAvatarPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const startDate = useMemo(() => getTomorrowDate(), []);
  const stickyTriggerRef = useRef<HTMLDivElement>(null);

  const openPopup = () => setIsPopupOpen(true);

  useEffect(() => {
    const trigger = stickyTriggerRef.current;
    if (!trigger) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCta(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-8 pb-6">
        {/* Blurred kamera decoration */}
        <div className="absolute -top-4 -right-8 w-72 h-72 opacity-25 pointer-events-none">
          <Image
            src="/kamera.png"
            alt=""
            width={288}
            height={288}
            className="blur-[8px]"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-gray-400 text-xs uppercase tracking-widest">
              kurs online
            </p>
            <div className="bg-accent/90 rounded-full px-3 py-1">
              <p className="text-white text-xs font-bold">
                data startu: <span className="text-white">{startDate}</span>
              </p>
            </div>
          </div>

          {/* Main heading — centered */}
          <h1 className="font-bebas text-[2.6rem] leading-[1.05] text-white uppercase mb-4 text-center">
            Stwórz realistycznego{" "}
            <span className="text-accent">AI-avatara</span> w 2 godziny
          </h1>

          {/* Subheading — centered */}
          <p className="text-gray-300 text-lg mb-6 text-center">
            i generuj{" "}
            <span className="text-accent font-bold">
              nielimitowaną liczbę wideo
            </span>{" "}
            na Reels i TikToka
          </p>

          {/* Video embed — iframe oversized to crop YT letterbox */}
          <div
            className="relative rounded-xl overflow-hidden mb-6 pointer-events-none"
            style={{ aspectRatio: "16/9" }}
          >
            <iframe
              src="https://www.youtube-nocookie.com/embed/3hirtdC3CrM?autoplay=1&mute=1&loop=1&playlist=3hirtdC3CrM&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&fs=0&cc_load_policy=0"
              title="AI Avatar Demo"
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
              className="absolute border-0"
              style={{
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
              }}
            />
          </div>

          {/* 3 benefit items — icon inline with text, compact */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
            <div className="flex flex-col items-center text-center gap-1">
              <Image
                src="/kamera-icon.png"
                alt=""
                width={24}
                height={24}
                className="shrink-0"
              />
              <p className="text-gray-300 text-xs leading-snug">
                więcej wideo = większe zasięgi = więcej obserwujących
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Image
                src="/kamera-icon.png"
                alt=""
                width={24}
                height={24}
                className="shrink-0"
              />
              <p className="text-gray-300 text-xs leading-snug">
                bez ciągłych nagrań siebie i bez wkuwania scenariuszy
              </p>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center text-center gap-1">
              <Image
                src="/kamera-icon.png"
                alt=""
                width={24}
                height={24}
                className="shrink-0"
              />
              <p className="text-gray-300 text-xs leading-snug">
                bez idealnego światła, tła ani wynajmu studia
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-5">
            <span className="font-bebas text-5xl text-accent">79 zł</span>
            <span className="text-gray-500 line-through text-2xl ml-3">
              340 zł
            </span>
          </div>

          {/* CTA button with arrow + -75% badge */}
          <div className="relative mb-5">
            <button
              onClick={openPopup}
              className="w-full bg-accent hover:bg-[#e07e00] text-white font-bold py-4 rounded-lg text-lg transition-colors uppercase tracking-wide flex items-center justify-center gap-2"
            >
              <span className="text-xl">→</span>
              <span>Dołącz do kursu</span>
            </button>
            <div className="absolute -right-1 -top-3 bg-dark-card border-2 border-accent rounded-md px-2 py-0.5">
              <span className="text-accent font-bold text-sm">-75%</span>
            </div>
          </div>

          {/* Bonus block */}
          <div className="flex items-start gap-3 bg-dark-card rounded-lg p-4 border border-gray-700">
            <span className="text-2xl shrink-0 mt-0.5">🎁</span>
            <div>
              <p className="text-gray-300 text-sm">
                <span className="text-white font-bold">
                  Po rejestracji otrzymasz BONUS:
                </span>
              </p>
              <p className="text-gray-300 text-xs mt-1">
                Lekcja bonusowa: Powielanie trendów, dowolnych wideo i ruchów za
                pomocą avatara
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trigger for sticky CTA — appears after hero */}
      <div ref={stickyTriggerRef} />

      {/* Na czym to polega — 3 numbered cards */}
      <section className="px-4 py-10">
        <h2 className="font-bebas text-4xl text-white text-center mb-8 uppercase">
          Na czym to polega?
        </h2>

        <div className="space-y-5">
          {/* Card 1 */}
          <div className="relative bg-dark-card rounded-2xl p-5 pl-[4.5rem] border border-gray-700/60">
            <div className="absolute left-4 top-5 w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center font-bebas text-2xl text-white shadow-lg">
              1
            </div>
            <h3 className="text-accent font-bebas text-lg uppercase leading-tight mb-3">
              Tworzysz swoją realistyczną cyfrową kopię
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Ten kurs w większości nie jest o wymyślonych postaciach AI ani o
              „zabawie obrazami". Uczysz się tworzyć cyfrowego avatara, który
              wygląda jak Ty, mówi Twoim głosem i może nagrywać wideo zamiast
              Ciebie.
            </p>
          </div>

          {/* Card 2 */}
          <div className="relative bg-dark-card rounded-2xl p-5 pl-[4.5rem] border border-gray-700/60">
            <div className="absolute left-4 top-5 w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center font-bebas text-2xl text-white shadow-lg">
              2
            </div>
            <h3 className="text-accent font-bebas text-lg uppercase leading-tight mb-3">
              Główny fokus — optymalizacja procesu tworzenia treści
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              Problem nie polega na tym, że nie masz światła, kamery czy studia.
              Problem w tym, że każde wideo to:
            </p>
            <ul className="text-gray-400 text-sm leading-relaxed mb-4 space-y-0.5">
              <li>- przygotowanie</li>
              <li>- ustawianie światła</li>
              <li>- szukanie tła</li>
              <li>- kadrowanie</li>
              <li>- uczenie się scenariusza na pamięć</li>
              <li>- stracony czas i energia</li>
            </ul>
            <p className="text-accent font-bold text-sm">
              AI-avatar przejmuje te zadania za Ciebie.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative bg-dark-card rounded-2xl p-5 pl-[4.5rem] border border-gray-700/60">
            <div className="absolute left-4 top-5 w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center font-bebas text-2xl text-white shadow-lg">
              3
            </div>
            <h3 className="text-accent font-bebas text-lg uppercase leading-tight mb-3">
              AI-avatar – to narzędzie, które oszczędza Twój czas
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              Zamiast za każdym razem przygotowywać się do nagrań, uruchamiasz
              system tworzenia treści, w którym:
            </p>
            <ul className="text-gray-400 text-sm leading-relaxed space-y-0.5">
              <li>- wideo powstają szybciej</li>
              <li>- treści publikowane są regularniej</li>
              <li>- efekt nie zależy od Twojego nastroju ani warunków</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Ten kurs jest dla Ciebie */}
      <section className="px-4 py-10">
        <h2 className="font-bebas text-4xl text-white text-center mb-2 uppercase">
          Ten kurs jest dla
        </h2>
        <h2 className="font-bebas text-4xl text-accent text-center mb-8 uppercase">
          Ciebie, jeśli:
        </h2>
        <div className="space-y-4">
          {checkItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-gradient-to-r from-dark-card to-dark-lighter rounded-2xl p-4 border border-gray-700/50"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-100 flex items-center justify-center text-3xl shrink-0 shadow-md">
                {item.emoji}
              </div>
              <p className="text-[15px] leading-snug">
                <span className="text-accent font-bold">{item.accent}</span>{" "}
                <span className="text-white">{item.text}</span>
                {item.accent2 && (
                  <>
                    {" "}
                    <span className="text-accent font-bold">{item.accent2}</span>{" "}
                    <span className="text-white">{item.text2}</span>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Program nauczania */}
      <section className="px-4 py-10">
        <h2 className="font-bebas text-4xl text-white text-center mb-8 uppercase">
          Program nauczania
        </h2>
        <div className="space-y-6">
          {programItems.map((item, i) => (
            <div
              key={i}
              className="bg-dark-card rounded-2xl overflow-hidden border border-gray-700/50"
            >
              {/* Lesson header with accent gradient */}
              <div className="bg-gradient-to-r from-accent/90 to-accent/60 px-5 py-4">
                <p className="font-bebas text-2xl text-white leading-tight">
                  {item.title}
                </p>
                <p className="text-white font-bold text-sm mt-1 leading-snug">
                  {item.subtitle}
                </p>
              </div>

              {/* Video placeholder */}
              <div className="mx-4 mt-4 rounded-xl overflow-hidden border-2 border-accent/40">
                {item.videoId ? (
                  <div className="aspect-video relative pointer-events-none overflow-hidden">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&mute=1&loop=1&playlist=${item.videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&fs=0&cc_load_policy=0`}
                      title={item.title}
                      allow="autoplay; encrypted-media"
                      allowFullScreen={false}
                      className="absolute border-0"
                      style={{
                        width: "105%",
                        height: "140%",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-dark flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg
                          className="w-7 h-7 text-accent ml-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xs">Wideo wkrótce</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Result */}
              <div className="px-5 py-4">
                <p className="text-accent font-bold text-sm italic mb-2">
                  REZULTAT:
                </p>
                {item.result.map((r, ri) => (
                  <p
                    key={ri}
                    className="text-gray-300 text-sm leading-relaxed mb-1.5 last:mb-0"
                  >
                    {r}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Jak odbywa się nauka */}
      <section className="px-4 py-10">
        <h2 className="font-bebas text-4xl text-white text-center mb-8 uppercase">
          Jak odbywa się nauka:
        </h2>
        <div className="space-y-4">
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-5 flex items-start gap-4">
            <span className="text-3xl shrink-0 mt-0.5">💻</span>
            <div>
              <p className="text-dark font-bold text-[15px] leading-snug mb-1">
                Dostęp do lekcji online bezpośrednio na Twoim telefonie lub
                laptopie
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                oglądasz lekcje w dowolnym momencie i od razu wykorzystujesz
                wiedzę w praktyce
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-5 flex items-start gap-4">
            <span className="text-3xl shrink-0 mt-0.5">▶️</span>
            <div>
              <p className="text-dark font-bold text-[15px] leading-snug mb-1">
                Autorskie prompty-szablony,
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                abyś jak najszybciej stworzył(a) swojego AI-avatara i zaczął(a)
                generować wideo jeszcze dziś
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-5 flex items-start gap-4">
            <span className="text-3xl shrink-0 mt-0.5">🎁</span>
            <div>
              <p className="text-dark font-bold text-[15px] leading-snug mb-1">
                Instrukcje krok po kroku bez „lania wody":
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                co kliknąć, gdzie wgrać materiały i jak uzyskać efekt — nawet
                jeśli pracujesz z AI po raz pierwszy
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-5 flex items-start gap-4">
            <span className="text-3xl shrink-0 mt-0.5">✏️</span>
            <div>
              <p className="text-dark font-bold text-[15px] leading-snug mb-1">
                Czat wsparcia z autorem kursu:
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                możesz zadać dowolne pytanie, otrzymać analizę i pomoc bez
                samodzielnego szukania odpowiedzi
              </p>
            </div>
          </div>
        </div>

        {/* Bottom summary */}
        <div className="flex items-start gap-4 mt-6 px-1">
          <span className="text-4xl shrink-0">👌</span>
          <p className="text-gray-300 text-sm leading-relaxed italic">
            W rezultacie, w ciągu 5 krótkich, ale bardzo merytorycznych lekcji
            stworzysz swojego AI-sobowtóra i przekażesz mu cały proces
            nagrywania treści.
          </p>
        </div>
      </section>

      {/* Price / CTA Section */}
      <section className="px-4 py-8 text-center">
        <div className="bg-dark-card rounded-xl p-6 border border-accent/30">
          <h3 className="font-bebas text-2xl text-white uppercase mb-3">
            Dołącz w specjalnej cenie -75%
          </h3>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="font-bebas text-5xl text-accent">79 zł</span>
            <span className="text-gray-500 line-through text-2xl">340 zł</span>
          </div>
          <p className="text-gray-400 text-xs mb-4">
            więcej wideo = większe zasięgi = więcej obserwujących
          </p>
          <button
            onClick={openPopup}
            className="w-full bg-accent hover:bg-[#e07e00] text-white font-bold py-4 rounded-lg text-lg transition-colors uppercase tracking-wide"
          >
            Dołącz do kursu
          </button>
        </div>
      </section>

      {/* Zero ryzyka */}
      <section className="px-4 py-8">
        <h2 className="font-bebas text-3xl text-accent text-center mb-6 uppercase">
          Zero ryzyka
        </h2>
        <div className="bg-dark-card rounded-xl p-5 border border-gray-700">
          <div className="text-5xl mb-4 text-center">🛡️</div>
          <p className="text-white font-bold text-center mb-4">
            14 dni pełnej gwarancji zwrotu pieniędzy.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Jestem pewien skuteczności tego kursu, dlatego daję Ci 14 dni, abyś
            spokojnie przerobił(a) lekcje, stworzył(a) swojego AI-avatara i
            spróbował(a) wygenerować wideo dla swojego bloga.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            Jeśli w tym czasie:
          </p>
          <ul className="text-gray-300 text-sm leading-relaxed mb-4 space-y-1 pl-4">
            <li>— obejrzysz materiały kursu</li>
            <li>— zastosujesz metody z lekcji</li>
            <li>— spróbujesz stworzyć treści z pomocą AI-avatara</li>
          </ul>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            ale <span className="text-white font-bold">nie zobaczysz wartości ani oczekiwanego rezultatu</span>{" "}
            — bez zbędnych pytań zwrócę Ci pieniądze.
          </p>
          <p className="text-accent font-bold text-sm text-center">
            Żadnego ryzyka. Albo otrzymujesz efekt, albo odzyskujesz pieniądze.
          </p>
        </div>
      </section>

      {/* Rezultaty kursu */}
      <section className="px-4 py-10">
        <h2 className="font-bebas text-4xl text-white text-center mb-2 uppercase">
          Jaki jest rezultat
        </h2>
        <h2 className="font-bebas text-4xl text-accent text-center mb-8 uppercase">
          po kursie?
        </h2>
        <div className="space-y-4">
          {resultItems.map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-5 flex items-start gap-4 border border-accent/20"
            >
              <span className="text-3xl shrink-0 mt-0.5">{item.emoji}</span>
              <p className="text-[15px] leading-snug">
                <span className="text-dark font-bold">{item.title}</span>{" "}
                <span className="text-gray-600">{item.desc}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* O autorze */}
      <section className="px-4 py-8">
        <h2 className="font-bebas text-3xl text-accent text-center mb-6 uppercase">
          O autorze:
        </h2>
        <div className="bg-dark-card rounded-xl p-5 border border-gray-700">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-accent/50">
              <Image
                src="/author.png"
                alt="Roman Prokopov"
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-white font-bold text-lg">Roman Prokopov</h3>
          </div>
          <div className="space-y-4 text-left">
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="text-accent font-bold">4 lata doświadczenia</span>{" "}
              w organicznym promowaniu na Reels i TikToku
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="text-white font-bold">
                Właściciel agencji produkcyjnej,
              </span>{" "}
              która co roku tworzy ponad 2500 wideo dla projektów w ponad 20
              niszach — od eksperckich blogów po komercyjne marki.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Pomagam klientom pozyskiwać{" "}
              <span className="text-white font-bold">
                do 10 000 nowych obserwujących miesięcznie
              </span>{" "}
              dzięki wideo opartym na AI-avatarach — bez ciągłych nagrań,
              studiów, światła i bez angażowania klienta w proces nagraniowy.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="text-white font-bold">Mój system</span> — to
              stabilny proces skalowania zasięgów i wzrostu odbiorców bez
              wypalenia.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-8">
        <h2 className="font-bebas text-3xl text-accent text-center mb-6 uppercase">
          Pytania/Odpowiedzi
        </h2>
        <div className="space-y-2">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="bg-dark-card rounded-lg border border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left p-4 flex items-center justify-between"
              >
                <span className="text-white text-sm font-medium pr-4">
                  {item.q}
                </span>
                <span
                  className={`text-accent text-xl shrink-0 transition-transform ${
                    openFaq === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-10 text-center">
        <h2 className="font-bebas text-3xl text-white mb-3 uppercase">
          Dołącz w specjalnej cenie -75%
        </h2>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="font-bebas text-5xl text-accent">79 zł</span>
          <span className="text-gray-500 line-through text-2xl">340 zł</span>
        </div>
        <button
          onClick={openPopup}
          className="w-full bg-accent hover:bg-[#e07e00] text-white font-bold py-4 rounded-lg text-lg transition-colors uppercase tracking-wide mb-4"
        >
          Dołącz do kursu
        </button>
        <p className="text-gray-500 text-xs">
          Bezpieczna płatność przez Przelewy24
        </p>
        <div className="flex justify-center gap-3 mt-3 opacity-50">
          <span className="text-xs text-gray-400">Visa</span>
          <span className="text-xs text-gray-400">Mastercard</span>
          <span className="text-xs text-gray-400">BLIK</span>
          <span className="text-xs text-gray-400">Przelewy24</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 pt-8 pb-6 border-t border-gray-800">
        {/* Copyright */}
        <p className="text-gray-600 text-xs text-center leading-relaxed mb-6">
          Wszelkie prawa zastrzeżone. Jakiekolwiek kopiowanie materiałów jest
          dozwolone wyłącznie za zgodą właścicieli praw autorskich.
        </p>

        {/* Info grid */}
        <div className="bg-dark-card rounded-2xl p-5 border border-gray-700/50 mb-6">
          <p className="font-bebas text-xl text-white text-center mb-1 tracking-wide">
            ROMAN PROKOPOV
          </p>
          <p className="text-gray-400 text-xs text-center mb-4">
            Jednoosobowa działalność gospodarcza
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-dark rounded-lg p-3 text-center">
              <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">NIP</p>
              <p className="text-gray-300 text-sm font-medium">8952300819</p>
            </div>
            <div className="bg-dark rounded-lg p-3 text-center">
              <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">REGON</p>
              <p className="text-gray-300 text-sm font-medium">544143712</p>
            </div>
          </div>

          <div className="bg-dark rounded-lg p-3 text-center mb-4">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Adres do doręczeń</p>
            <p className="text-gray-300 text-sm">
              ul. Adama Jerzego Czartoryskiego 61/37
            </p>
            <p className="text-gray-300 text-sm">51-126 Wrocław, Polska</p>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <a
              href="mailto:Roman.prockopov@gmail.com"
              className="text-accent text-sm hover:underline transition-colors"
            >
              Roman.prockopov@gmail.com
            </a>
            <a
              href="tel:+48507004909"
              className="text-gray-300 text-sm hover:text-white transition-colors"
            >
              +48507004909
            </a>
          </div>
        </div>

        {/* Legal links */}
        <div className="flex flex-col items-center gap-2.5 mb-6">
          <a href="/ai-avatar/polityka-prywatnosci" className="text-gray-400 text-xs underline underline-offset-2 hover:text-white transition-colors">
            POLITYKA PRYWATNOŚCI
          </a>
          <a href="/ai-avatar/regulamin" className="text-gray-400 text-xs underline underline-offset-2 hover:text-white transition-colors text-center">
            REGULAMIN ŚWIADCZENIA USŁUG / OFERTA PUBLICZNA
          </a>
          <a href="/ai-avatar/polityka-zwrotow" className="text-gray-400 text-xs underline underline-offset-2 hover:text-white transition-colors">
            POLITYKA ZWROTÓW
          </a>
        </div>

        {/* Payment methods */}
        <div className="bg-gray-100 rounded-xl py-4 px-5">
          <div className="flex justify-center items-center gap-4">
            {/* Apple Pay */}
            <svg viewBox="0 0 50 20" className="h-7 w-auto" fill="#000">
              <path d="M9.6 3.8c-.6.7-1.5 1.3-2.4 1.2-.1-1 .4-2 .9-2.6C8.7 1.6 9.7 1 10.5 1c.1 1-.3 2-.9 2.8zm.9 1.4c-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7C3.1 5.3 1.7 6.2 1 7.6c-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.5 2.2 2.7 2.1 1-.1 1.5-.7 2.7-.7 1.3 0 1.7.7 2.8.7 1.1 0 1.9-1 2.6-2.1.8-1.2 1.2-2.3 1.2-2.4 0 0-2.3-.9-2.3-3.5 0-2.2 1.8-3.2 1.8-3.2-1-1.5-2.5-1.6-3.1-1.6z"/>
              <text x="18" y="15" fontSize="11" fontWeight="600" fontFamily="system-ui">Pay</text>
            </svg>
            {/* Google Pay */}
            <svg viewBox="0 0 56 24" className="h-7 w-auto">
              <text x="0" y="17" fontSize="13" fontWeight="500" fontFamily="system-ui" fill="#5f6368">G</text>
              <text x="11" y="17" fontSize="12" fontWeight="500" fontFamily="system-ui" fill="#5f6368">Pay</text>
            </svg>
            {/* Visa */}
            <svg viewBox="0 0 48 16" className="h-6 w-auto">
              <text x="0" y="14" fontSize="16" fontWeight="800" fontFamily="system-ui" fill="#1a1f71" letterSpacing="-0.5">VISA</text>
            </svg>
            {/* Mastercard */}
            <div className="flex items-center -space-x-2">
              <div className="w-6 h-6 rounded-full bg-[#eb001b]" />
              <div className="w-6 h-6 rounded-full bg-[#f79e1b] opacity-90" />
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky bottom CTA */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
          showStickyCta && !isPopupOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`}
      >
        <div className="page-wrapper">
          <div className="px-4 pb-4 pt-2 bg-gradient-to-t from-dark via-dark/95 to-transparent">
            <button
              onClick={openPopup}
              className="w-full bg-accent hover:bg-[#e07e00] text-white font-bold py-3.5 rounded-xl text-sm transition-colors uppercase tracking-wide shadow-lg shadow-accent/30"
            >
              Dołącz w specjalnej cenie -75%
            </button>
          </div>
        </div>
      </div>

      {/* Popup */}
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
}
