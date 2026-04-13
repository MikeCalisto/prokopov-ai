import LegalPage from "@/components/ai-avatar/LegalPage";

export default function PolitikaZwrotowPage() {
  return (
    <LegalPage title="Polityka Zwrotów">
      <Section title="1. Informacje ogólne">
        <p>
          Niniejsza Polityka Zwrotów określa zasady zwrotów oraz odstąpienia od
          umowy w przypadku zakupu usług oraz produktów cyfrowych dostępnych na
          stronie: https://romanprokopov.weblium.site
        </p>
        <p>
          Sprzedawcą usług jest:<br />
          ROMAN PROKOPOV<br />
          NIP: 8952300819<br />
          REGON: 544143712<br />
          Adres: ul. Adama Jerzego Czartoryskiego 61/37, 51-126 Wrocław, Polska
        </p>
      </Section>

      <Section title="2. Prawo odstąpienia od umowy">
        <p>
          Zgodnie z ustawą o prawach konsumenta z dnia 30 maja 2014 r.,
          konsument ma prawo odstąpić od umowy zawartej na odległość w terminie
          14 dni od dnia zawarcia umowy, bez podania przyczyny.
        </p>
        <p>
          Aby skorzystać z prawa odstąpienia od umowy, Klient powinien przesłać
          oświadczenie o odstąpieniu drogą elektroniczną.
        </p>
      </Section>

      <Section title="3. Wyjątki od prawa odstąpienia">
        <p>
          Prawo odstąpienia od umowy nie przysługuje w przypadku: usług
          cyfrowych dostarczanych drogą elektroniczną, jeśli realizacja usługi
          rozpoczęła się za wyraźną zgodą Klienta przed upływem 14 dni od
          zawarcia umowy, oraz Klient został poinformowany o utracie prawa
          odstąpienia od umowy.
        </p>
        <p>W szczególności dotyczy to:</p>
        <ul>
          <li>kursów online</li>
          <li>webinarów</li>
          <li>nagrań szkoleniowych</li>
          <li>materiałów cyfrowych</li>
        </ul>
        <p>
          Jeżeli Klient uzyskał dostęp do materiałów szkoleniowych, uważa się
          usługę za rozpoczętą.
        </p>
      </Section>

      <Section title="4. Zwrot środków">
        <p>
          Zwrot środków może nastąpić w następujących przypadkach:
        </p>
        <ul>
          <li>Usługa została anulowana przez Sprzedawcę.</li>
          <li>
            Usługa nie została zrealizowana z przyczyn leżących po stronie
            Sprzedawcy.
          </li>
          <li>
            Klient skutecznie skorzystał z prawa odstąpienia od umowy zgodnie z
            punktem 2 niniejszej Polityki.
          </li>
        </ul>
        <p>
          Zwrot środków następuje w terminie do 14 dni od dnia pozytywnego
          rozpatrzenia wniosku.
        </p>
        <p>
          Zwrot dokonywany jest przy użyciu takiej samej metody płatności, jaka
          została użyta przy zakupie, chyba że Klient zgodzi się na inną formę
          zwrotu.
        </p>
      </Section>

      <Section title="5. Reklamacje">
        <p>
          Klient ma prawo złożyć reklamację dotyczącą świadczonych usług.
          Reklamacja powinna zawierać:
        </p>
        <ul>
          <li>imię i nazwisko Klienta</li>
          <li>adres e-mail użyty podczas zakupu</li>
          <li>opis problemu</li>
        </ul>
        <p>
          Reklamacje rozpatrywane są w terminie do 14 dni roboczych od momentu
          ich otrzymania.
        </p>
      </Section>

      <Section title="6. Kontakt">
        <p>
          W sprawach dotyczących zwrotów lub reklamacji Klient może
          skontaktować się ze Sprzedawcą poprzez formularz kontaktowy dostępny
          na stronie: https://romanprokopov.weblium.site
        </p>
      </Section>
    </LegalPage>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-white font-bold text-base mb-2">{title}</h2>
      <div className="space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-gray-400">
        {children}
      </div>
    </div>
  );
}
