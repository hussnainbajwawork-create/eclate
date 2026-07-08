export const formatPKR = (n: number | string) =>
  `PKR ${Number(n).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

export const INSTAGRAM_URL = "https://www.instagram.com/eclat14_?igsh=bTN0c2hjdWgwbTF4";
export const FACEBOOK_URL = "https://facebook.com/eclat.pk";

/** Payment methods customers can use */
export const PAYMENT_METHODS = [
  "Bank Transfer",
  "JazzCash",
  "EasyPaisa",
] as const;

/** Store bank details for customers to make payment */
export const STORE_PAYMENT_INFO = {
  bankName: "Bank Al Habib",
  accountTitle: "ÉCLAT",
  accountNumber: "0123-4567890123",
  iban: "PK00BAHL0000012345678901",
  jazzcash: "0300-1234567",
  easypaisa: "0300-1234567",
} as const;
