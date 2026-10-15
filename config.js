/*
 * KAWIS — SITE SETTINGS
 * ------------------------------------------------------------
 * This is the only file you need to edit for contact details
 * and tracking IDs. Change the text between the quotes "..."
 * Leave a value as "" (empty) if you don't have it yet.
 * ------------------------------------------------------------
 */
window.KAWIS_CONFIG = {

  // WhatsApp Business number: country code + number, digits only.
  // Example: "905321234567"  (no +, no spaces, no leading 0)
  // While empty, WhatsApp buttons are hidden and Telegram is shown instead.
  WHATSAPP_NUMBER: "903522228033",

  // Telegram catalogue channel (new stock added daily)
  TELEGRAM_URL: "https://t.me/+Jx1l1Yuqr8k2YzU0",

  // Contact e-mail
  EMAIL: "info@kawisclothes.com",

  // Google Analytics 4 measurement ID, looks like "G-XXXXXXXXXX"
  GA_ID: "",

  // Google Ads account ID, looks like "AW-123456789"
  ADS_ID: "",

  // Google Ads conversion label for WhatsApp clicks, looks like "AbCdEfGhIjk"
  ADS_CONVERSION_LABEL: "",

  // Optional: separate Google Ads conversion label for Telegram clicks
  ADS_TELEGRAM_LABEL: "",

  // Pre-filled WhatsApp messages. {category} is replaced automatically.
  WA_MESSAGES: {
    home:      "Hi, I found Kawis online and I'm interested in wholesale branded clothing. Here is what I need: ",
    quote:     "Hi Kawis, I'd like a wholesale quote. Products and estimated quantities: ",
    sample:    "Hi Kawis, I'd like to order a sample before a bulk order. I'm interested in: ",
    catalogue: "Hi, I saw your online catalogue and I'm interested in wholesale branded clothing. Here is what I need: ",
    category:  "Hi, I found Kawis online and I'm interested in wholesale {category}. Here is what I need: "
  }
};
