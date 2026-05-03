# Проєкт: Роман Прокопов — Мультисайт

## Домен та деплой
- **Vercel:** https://prokopov-ai.vercel.app/
- **GitHub:** https://github.com/MikeCalisto/prokopov-ai
- **Один репозиторій, один деплой, 4 різні сайти**

## Структура проєкту

```
Роман Прокопов/
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

## 4 сайти на одному домені

| Сайт | URL | Тип | Вихідники | Деплой |
|------|-----|-----|-----------|--------|
| AI Realism | `/` (корінь) | Статичний HTML | `Сайт АІ реалізм/ai-realism-v2.html` | `public/index.html` |
| AI Avatar (PL) | `/ai-avatar` | Next.js (app/) | `Сайт АІ аватар/` + `app/ai-avatar/` | Next.js роути |
| AI Avatar (UA) | `/ai-avatar-ua/` | Статичний HTML | `Сайт АІ аватар укр/` | `public/ai-avatar-ua/` |
| AI Конвеєр | `/ai-konveyer/` | Статичний HTML | `Сайт АІ конвеер/` | `public/ai-konveyer/` |

## КРИТИЧНІ ПРАВИЛА

### НІКОЛИ НЕ РОБИТИ:
1. **НЕ видаляти `app/`, `package.json`, `next.config.mjs`, `tsconfig.json`** — це Next.js для польського AI Avatar
2. **НЕ видаляти файли з `public/` що не належать твоєму сайту** — там живуть інші сайти
3. **НЕ видаляти папки `public/ai-avatar-ua/` і `public/ai-konveyer/`** — це інші сайти
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

#### AI Конвеєр:
1. Редагуй в папці `Сайт АІ конвеер/`
2. Копіюй результат в `public/ai-konveyer/`
3. Пуш

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
