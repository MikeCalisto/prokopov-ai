# Проєкт: Роман Прокопов — Мультисайт

## Домен та деплой
- **Vercel:** https://prokopov-ai.vercel.app/
- **GitHub:** https://github.com/MikeCalisto/prokopov-ai
- **Один репозиторій, один деплой, 5 різних сайтів**

## Структура проєкту

```
Сайт Роман Прокопов/               ← КОРЕНЕВА ПАПКА ПРОЄКТУ
  CLAUDE.md                        ← ЦЕЙ ФАЙЛ — прочитай перед будь-якою роботою
  
  Сайт АІ реалізм/                ← ГОЛОВНА РОБОЧА ПАПКА (тут .git, package.json)
    .git/                          ← Git репозиторій
    package.json                   ← Next.js (для ai-avatar польського)
    app/                           ← Next.js роути (НЕ ЧІПАТИ з інших сесій)
      ai-avatar/                   ← Польський сайт AI Avatar (Next.js)
      api/                         ← API ендпоінти (payment, webhook)
    public/                        ← СТАТИЧНІ ФАЙЛИ (Vercel обслуговує їх напряму)
      index.html                   ← AI Realism лендінг (корінь сайту /)
      politika.html                ← Політика конфіденційності
      oferta.html                  ← Публічна оферта
      *.png                        ← Зображення для AI Realism
      ai-avatar-ua/                ← Укр. сайт AI Avatar (/ai-avatar-ua/)
        index.html
      ai-konveyer/                 ← Сайт AI Конвеєр (/ai-konveyer/)
        index.html
    ai-realism-v2.html             ← Джерело для index.html (редагуємо тут)
    *.png                          ← Вихідні зображення
  
  Сайт АІ аватар/                  ← Вихідники польського AI Avatar
  Сайт АІ аватар укр/             ← Вихідники укр. AI Avatar
  Сайт АІ конвеер/                ← Вихідники AI Конвеєр
```

## 5 сайтів на одному домені

| Сайт | URL | Тип | Вихідники | Деплой |
|------|-----|-----|-----------|--------|
| AI Realism | `/` (корінь) | Статичний HTML | `Сайт АІ реалізм/ai-realism-v2.html` | `public/index.html` |
| AI Avatar (PL) | `/ai-avatar` | Next.js (app/) | `Сайт АІ аватар/` + `app/ai-avatar/` | Next.js роути |
| AI Avatar (UA) | `/ai-avatar-ua/` | Статичний HTML | `Сайт АІ аватар укр/` | `public/ai-avatar-ua/` |
| AI Конвеєр | `/ai-konveyer/` | Статичний HTML | `Сайт АІ конвеер/` (стара версія) | `public/ai-konveyer/` |
| AI Конвеєр (міні-курс) | `/mini-ai-konveyer/` | Статичний HTML | `Сайт АІ конвеер/index.html` (новий дизайн) | `public/mini-ai-konveyer/` |
| AI Конвеєр v2 | `/mini-ai-konveyer-2/` | Статичний HTML | редагується прямо в `public/` | `public/mini-ai-konveyer-2/` |
| AI Сценарист (міні-курс v2) | `/mini-ai-konveyer-3` | Статичний HTML | редагується прямо в `public/` | `public/mini-ai-konveyer-3/` |
| Презентація вебінару | `/prezentaciya-ai-konveyer/` | Статичний HTML | редагується прямо в `public/` | `public/prezentaciya-ai-konveyer/` |
| Слайди до VSL №1 | `/vsl-slides/` | Статичний HTML | редагується прямо в `public/` | `public/vsl-slides/` |

## КРИТИЧНІ ПРАВИЛА

### НІКОЛИ НЕ РОБИТИ:
1. **НЕ видаляти `app/`, `package.json`, `next.config.mjs`, `tsconfig.json`** — це Next.js для польського AI Avatar
2. **НЕ видаляти файли з `public/` що не належать твоєму сайту** — там живуть інші сайти
3. **НЕ видаляти папки `public/ai-avatar-ua/`, `public/ai-konveyer/`, `public/mini-ai-konveyer/`** — це інші сайти
4. **НЕ змінювати `package.json`** — якщо ти не працюєш з AI Avatar (PL)
5. **НЕ робити `git rm` або масове видалення** без перевірки що саме видаляєш

### Воркфлоу для кожного сайту:

#### AI Realism (цей сайт):
1. Редагуй `ai-realism-v2.html` в папці `Сайт АІ реалізм/`
2. Копіюй в `public/index.html`: `cp ai-realism-v2.html public/index.html`
3. Також копіюй `politika.html` і `oferta.html` в `public/` якщо змінюєш їх
4. `git add` тільки свої файли → `git commit` → `git push`

#### AI Avatar UA:
1. Редагуй в папці `Сайт АІ аватар укр/`
2. Копіюй результат в `public/ai-avatar-ua/`
3. Пуш

#### AI Конвеєр (стара версія, `/ai-konveyer/`):
1. Стара версія цього сайту збережена в `public/ai-konveyer/index.html` (НЕ перезаписувати з `Сайт АІ конвеер/index.html` — там новий дизайн міні-курсу!)
2. Якщо потрібно редагувати стару версію — роби це безпосередньо в `public/ai-konveyer/index.html`
3. Пуш

#### AI Конвеєр міні-курс (новий, `/mini-ai-konveyer/`):
1. Редагуй `Сайт АІ конвеер/index.html`
2. Копіюй в `public/mini-ai-konveyer/index.html`: `cp "Сайт АІ конвеер/index.html" "Сайт АІ реалізм/public/mini-ai-konveyer/index.html"`
3. Пуш

#### AI Сценарист (`/mini-ai-konveyer-3`):
1. Редагуй `public/mini-ai-konveyer-3/index.html` напряму
2. НЕ плутати з `/mini-ai-konveyer-2/` — це два різні сайти
3. Верстка успадкована з `/mini-ai-konveyer-2/`, але палітра смарагдова (`--accent:#00d09c`), а не помаранчева
4. Асети (`hero.mp4`, `hero-poster.jpg`, `roman.jpg`) лежать поруч, шляхи абсолютні: `/mini-ai-konveyer-3/...`
5. Превью: `.claude/launch.json` → `mini-ai-konveyer-3-preview` (WEBrick, порт 8083, з `/tmp/mini-ai-konveyer-3-preview`)
6. Пуш

#### Слайди до VSL (`/vsl-slides/`):
1. Редагуй `public/vsl-slides/index.html` напряму — весь текст лежить у масиві `SLIDES` вгорі `<script>`, вёрстку не чіпаємо
2. Канвас **1280×1080** (права частина кадру 1920×1080), змінні `--slide-w` / `--slide-h`
3. Стиль успадкований з `/prezentaciya-ai-konveyer/` (Tektur + Manrope, помаранчева палітра)
4. Скріншоти — `public/vsl-slides/screens/`, шляхи абсолютні: `/vsl-slides/screens/...`. Нема файла — рендериться плейсхолдер з іменем
5. Клавіші: `H` — службові елементи, `P` — режим монтажера (cue), номер+`Enter` — перехід
6. Превью: `.claude/launch.json` → `vsl-slides-preview` (WEBrick, порт 8084, з `/tmp/vsl-slides-preview`)
7. Пуш

#### AI Avatar PL (Next.js):
1. Редагуй в `app/ai-avatar/` та `Сайт АІ аватар/`
2. Пуш — Vercel білдить Next.js автоматично

## Превью сервер
- Використовуємо Ruby WEBrick на порті 8080
- Файли для превью копіюємо в `/tmp/ai-realism-site/`
- `.claude/launch.json` налаштований на WEBrick (НЕ змінювати на npm/next)

## Юридична інформація
- **ФОП:** Земляний Михайло Сергійович
- **ЄДРПОУ:** 3758302175
- **Email:** m.zemlyanie@gmail.com
- **Meta Pixel:** init `1490743968843269`, noscript `1320081970032144`
