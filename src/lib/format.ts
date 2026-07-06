export const formatPKR = (n: number | string) =>
  `PKR ${Number(n).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

export const WHATSAPP_NUMBER = "923001234567"; // E.164 sans plus
export const INSTAGRAM_URL = "https://www.instagram.com/eclat14_?igsh=bTN0c2hjdWgwbTF4";
export const FACEBOOK_URL = "https://facebook.com/eclat.pk";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
