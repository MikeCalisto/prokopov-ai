/**
 * Telegram notifications helper.
 *
 * Sends messages to a list of admin chat IDs configured via env vars.
 * Never throws — failures are logged and the main flow continues.
 *
 * Env vars:
 *   TELEGRAM_BOT_TOKEN       — bot token from @BotFather
 *   TELEGRAM_ADMIN_CHAT_IDS  — comma-separated numeric chat IDs
 *                              e.g. "513664953,111111111,222222222"
 *
 * IMPORTANT: this module only calls sendMessage. It must NEVER call
 * setWebhook or getUpdates — that would break Zenedu which owns the
 * bot's webhook.
 */

const TELEGRAM_API_BASE = "https://api.telegram.org";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendToChat(
  token: string,
  chatId: string,
  text: string
): Promise<void> {
  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(
        `Telegram sendMessage failed for chat ${chatId}: ${res.status} ${body.substring(0, 200)}`
      );
    }
  } catch (err) {
    console.error(`Telegram sendMessage error for chat ${chatId}:`, err);
  }
}

/**
 * Send a message to all configured admin chat IDs in parallel.
 * Safe to call without await — but await is recommended so the
 * serverless function doesn't terminate before the request completes.
 */
export async function notifyTelegram(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdsRaw = process.env.TELEGRAM_ADMIN_CHAT_IDS;

  if (!token || !chatIdsRaw) {
    console.warn(
      "Telegram notifications skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_IDS not set"
    );
    return;
  }

  const chatIds = chatIdsRaw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (chatIds.length === 0) return;

  await Promise.all(chatIds.map((id) => sendToChat(token, id, message)));
}

// ===== Formatted notification builders =====

export interface LeadInfo {
  site: "P24" | "PayU";
  page: string; // e.g. "/ai-avatar" or "/ai-avatar-pl"
  email: string;
  phone: string;
  amount?: string; // e.g. "79 zł"
  orderId?: string;
}

export interface PaymentInfo {
  site: "P24" | "PayU";
  amount: string;
  currency: string;
  email?: string;
  orderId: string;
  status: string;
}

/**
 * Build a "new lead" message (someone submitted the popup form).
 * Triggered BEFORE actual payment — captures even abandoned carts.
 */
export function formatLead(lead: LeadInfo): string {
  const lines = [
    `🔥 <b>Нова заявка</b> — AI Avatar (${lead.site})`,
    ``,
    `📧 <code>${escapeHtml(lead.email)}</code>`,
    `📱 <code>${escapeHtml(lead.phone)}</code>`,
    `🌐 ${escapeHtml(lead.page)}`,
  ];
  if (lead.amount) lines.push(`💰 ${escapeHtml(lead.amount)}`);
  if (lead.orderId) lines.push(`🆔 <code>${escapeHtml(lead.orderId)}</code>`);
  return lines.join("\n");
}

/**
 * Build a "payment received" message (webhook confirmed payment).
 */
export function formatPayment(p: PaymentInfo): string {
  const lines = [
    `✅ <b>Оплата отримана</b> — AI Avatar (${p.site})`,
    ``,
    `💳 <b>${escapeHtml(p.amount)} ${escapeHtml(p.currency)}</b>`,
  ];
  if (p.email) lines.push(`📧 <code>${escapeHtml(p.email)}</code>`);
  lines.push(`🆔 <code>${escapeHtml(p.orderId)}</code>`);
  lines.push(`📋 Статус: ${escapeHtml(p.status)}`);
  return lines.join("\n");
}
