export type Category = "Tote" | "Shoulder" | "Crossbody" | "Mini";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  colors: { name: string; hex: string }[];
  isNew?: boolean;
}

export const products: Product[] = [
  {
    id: "aurora-tote",
    name: "Aurora Tote",
    price: 8500,
    category: "Tote",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    colors: [{ name: "Camel", hex: "#C6A76A" }, { name: "Noir", hex: "#111111" }, { name: "Ivory", hex: "#F8F6F2" }],
    isNew: true,
  },
  {
    id: "luna-shoulder",
    name: "Luna Shoulder Bag",
    price: 7200,
    category: "Shoulder",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
    colors: [{ name: "Beige", hex: "#D9C9B6" }, { name: "Noir", hex: "#111111" }],
  },
  {
    id: "noire-crossbody",
    name: "Noire Crossbody",
    price: 6800,
    category: "Crossbody",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80",
    colors: [{ name: "Noir", hex: "#111111" }, { name: "Gold", hex: "#C6A76A" }],
  },
  {
    id: "celeste-mini",
    name: "Celeste Mini Bag",
    price: 5900,
    category: "Mini",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80",
    colors: [{ name: "Ivory", hex: "#F8F6F2" }, { name: "Beige", hex: "#D9C9B6" }],
    isNew: true,
  },
  {
    id: "ivory-tote",
    name: "Ivory Tote",
    price: 8900,
    category: "Tote",
    image: "https://images.unsplash.com/photo-1564422170194-896b89110ef8?auto=format&fit=crop&w=900&q=80",
    colors: [{ name: "Ivory", hex: "#F8F6F2" }, { name: "Camel", hex: "#C6A76A" }],
  },
  {
    id: "verona-shoulder",
    name: "Verona Shoulder Bag",
    price: 7500,
    category: "Shoulder",
    image: "https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cb3?auto=format&fit=crop&w=900&q=80",
    colors: [{ name: "Beige", hex: "#D9C9B6" }, { name: "Noir", hex: "#111111" }],
  },
  {
    id: "midnight-crossbody",
    name: "Midnight Crossbody",
    price: 6400,
    category: "Crossbody",
    image: "https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&w=900&q=80",
    colors: [{ name: "Noir", hex: "#111111" }],
    isNew: true,
  },
  {
    id: "belle-mini",
    name: "Belle Mini Bag",
    price: 5500,
    category: "Mini",
    image: "https://images.unsplash.com/photo-1597633244018-0201d0158aab?auto=format&fit=crop&w=900&q=80",
    colors: [{ name: "Beige", hex: "#D9C9B6" }, { name: "Gold", hex: "#C6A76A" }],
  },
];

export const formatPKR = (n: number) => `PKR ${n.toLocaleString("en-PK")}`;
