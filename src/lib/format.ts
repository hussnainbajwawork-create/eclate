export const formatPKR = (n: number | string) =>
  `PKR ${Number(n).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

export const INSTAGRAM_URL = "https://www.instagram.com/eclat14_?igsh=bTN0c2hjdWgwbTF4";
export const FACEBOOK_URL = "https://facebook.com/eclat.pk";

/** Payment methods customers can use */
export const PAYMENT_METHODS = [
  "Bank Transfer",
] as const;

/** Store bank details for customers to make payment */
export const STORE_PAYMENT_INFO = {
  bankName: "MEEZAN DIGITAL CENTRE",
  accountTitle: "HASNAIN MASOOD",
  accountNumber: "00300115411376",
  iban: "PK33MEZN0000300115411376",
} as const;
