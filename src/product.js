export const CATEGORIES = ["All", "Classic", "Sport", "Minimal", "Automatic"];

export const PRODUCTS = [
  {
    id: 1, name: "The Meridian", category: "Classic", price: 6890,
    description: "A quiet statement in brushed steel. The Meridian pairs a clean ivory dial with a considered, everyday silhouette.",
    movement: "Quartz", case: "40 mm stainless steel", strap: "Italian leather", water: "5 ATM",
    tag: "BESTSELLER", color: "Silver / Ivory",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 2, name: "The Field One", category: "Sport", price: 7490,
    description: "Built for the days that move. A legible dial, durable case, and comfortable strap make this a dependable companion.",
    movement: "Quartz", case: "42 mm stainless steel", strap: "Textured rubber", water: "10 ATM",
    tag: "EVERYDAY", color: "Black / Steel",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 3, name: "The No. 02", category: "Minimal", price: 5990,
    description: "Nothing extra, nothing missing. The No. 02 is an exercise in restraint, with a slim profile and uncluttered dial.",
    movement: "Quartz", case: "38 mm stainless steel", strap: "Mesh steel", water: "3 ATM",
    tag: "NEW", color: "Silver / White",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 4, name: "The Regent", category: "Automatic", price: 12900,
    description: "Mechanical character with a modern point of view. A detailed dial and exhibition-inspired finish reward a closer look.",
    movement: "Automatic", case: "41 mm stainless steel", strap: "Italian leather", water: "5 ATM",
    tag: "MECHANICAL", color: "Gold / Black",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 5, name: "The Coastline", category: "Sport", price: 8290,
    description: "Inspired by open water and long weekends. A confident sports watch designed to transition from outdoors to evening.",
    movement: "Quartz", case: "43 mm stainless steel", strap: "Silicone", water: "10 ATM",
    tag: "LIMITED", color: "Navy / Silver",
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 6, name: "The Heritage", category: "Classic", price: 9990,
    description: "A timeless profile with warm details. The Heritage brings traditional watchmaking cues into a versatile modern piece.",
    movement: "Automatic", case: "39 mm stainless steel", strap: "Brown leather", water: "5 ATM",
    tag: "SIGNATURE", color: "Rose Gold / Cream",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1000&q=85"
  }
];

export const formatPrice = (price) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0
  }).format(price);