# AI Avatar — Landing Page

Landing page for the AI Avatar online course by Roman Prokopov.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Przelewy24 payment integration

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file and fill in your P24 credentials
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000/ai-avatar](http://localhost:3000/ai-avatar)

## Environment Variables

| Variable | Description |
|---|---|
| `P24_MERCHANT_ID` | Przelewy24 Merchant ID |
| `P24_POS_ID` | Przelewy24 POS ID |
| `P24_CRC_KEY` | CRC key for signature generation |
| `P24_API_KEY` | REST API key |
| `P24_ORDER_KEY` | Order key |
| `P24_SANDBOX` | `true` for sandbox, `false` for production |

## Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Set `P24_SANDBOX=false` for production
5. Deploy

## Pages

- `/ai-avatar` — Main landing page
- `/ai-avatar/thank-you` — Post-payment confirmation
- `/api/payment` — P24 transaction registration
- `/api/webhook` — P24 payment notification handler
