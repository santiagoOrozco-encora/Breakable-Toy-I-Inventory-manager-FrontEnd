export type Product = {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  expirationDate: Date;
  stock: number;
};
export type Metrics = {
  averageInStock: number;
  category: string;
  totalInStock: number;
  valueInStock: number;
};
export type ProductData = {
    pageList: Product[];
    pageSize: number;
    categories: string[];
}
export type ProductListContextType = [
   Product[],
   React.Dispatch<React.SetStateAction<Product[]>>,
];
export type ProductCategoryContextType = [
  string[],
  React.Dispatch<React.SetStateAction<string[]>>,
];
export type PaginationContextType = [
  number,
  React.Dispatch<React.SetStateAction<number>>,
];

export const sample = [
  {
    name: "Monkfish Fresh - Skin Off",
    category: "Electrical",
    stock: 59,
    unitPrice: 42.18,
    expirationDate: "2025-05-10",
  },
  {
    name: "Grapefruit - White",
    category: "RF Shielding",
    stock: 2,
    unitPrice: 97.27,
    expirationDate: "2025-05-28",
  },
  {
    name: "Pomegranates",
    category: "Masonry & Precast",
    stock: 60,
    unitPrice: 95.72,
    expirationDate: "2025-03-25",
  },
  {
    name: "Beans - Green",
    category: "Epoxy Flooring",
    stock: 96,
    unitPrice: 38.02,
    expirationDate: "2025-05-18",
  },
  {
    name: "Beer - Sleeman Fine Porter",
    category: "Casework",
    stock: 37,
    unitPrice: 73.12,
    expirationDate: "2025-05-24",
  },
  {
    name: "Oil - Shortening - All - Purpose",
    category: "Exterior Signage",
    stock: 53,
    unitPrice: 64.9,
    expirationDate: "2025-04-05",
  },
  {
    name: "Olives - Green, Pitted",
    category: "Framing (Wood)",
    stock: 60,
    unitPrice: 71.91,
    expirationDate: "2025-05-27",
  },
  {
    name: "Nacho Chips",
    category: "Epoxy Flooring",
    stock: 63,
    unitPrice: 21.62,
    expirationDate: "2025-04-06",
  },
  {
    name: "Veal - Inside Round / Top, Lean",
    category: "Elevator",
    stock: 72,
    unitPrice: 85.21,
    expirationDate: "2025-05-30",
  },
  {
    name: "Steamers White",
    category: "Temp Fencing, Decorative Fencing and Gates",
    stock: 40,
    unitPrice: 10.38,
    expirationDate: "2025-04-28",
  },
  {
    name: "Wine - Rioja Campo Viejo",
    category: "Painting & Vinyl Wall Covering",
    stock: 97,
    unitPrice: 77.99,
    expirationDate: "2025-05-22",
  },
  {
    name: "Tea - Decaf 1 Cup",
    category: "Electrical",
    stock: 3,
    unitPrice: 18.43,
    expirationDate: "2025-04-23",
  },
  {
    name: "Pastry - Cherry Danish - Mini",
    category: "Masonry & Precast",
    stock: 30,
    unitPrice: 35.43,
    expirationDate: "2025-04-02",
  },
  {
    name: "Pork - Belly Fresh",
    category: "Drywall & Acoustical (FED)",
    stock: 13,
    unitPrice: 75.41,
    expirationDate: "2025-04-21",
  },
  {
    name: "Pepper - Gypsy Pepper",
    category: "Fire Protection",
    stock: 16,
    unitPrice: 9.27,
    expirationDate: "2025-05-12",
  },
  {
    name: "Chef Hat 20cm",
    category: "Electrical",
    stock: 69,
    unitPrice: 89.67,
    expirationDate: "2025-05-25",
  },
  {
    name: "Strawberries",
    category: "Masonry & Precast",
    stock: 99,
    unitPrice: 27.29,
    expirationDate: "2025-03-23",
  },
  {
    name: "Cookie Dough - Oatmeal Rasin",
    category: "Asphalt Paving",
    stock: 49,
    unitPrice: 16.58,
    expirationDate: "2025-04-27",
  },
  {
    name: "Chocolate - Liqueur Cups With Foil",
    category: "Plumbing & Medical Gas",
    stock: 77,
    unitPrice: 45.08,
    expirationDate: "2025-03-30",
  },
  {
    name: "Beans - Navy, Dry",
    category: "Soft Flooring and Base",
    stock: 99,
    unitPrice: 59.26,
    expirationDate: "2025-05-17",
  },
  {
    name: "Gatorade - Orange",
    category: "Masonry",
    stock: 50,
    unitPrice: 46.43,
    expirationDate: "2025-04-01",
  },
  {
    name: "Carbonated Water - Raspberry",
    category: "Temp Fencing, Decorative Fencing and Gates",
    stock: 20,
    unitPrice: 89.37,
    expirationDate: "2025-03-29",
  },
  {
    name: "Vector Energy Bar",
    category: "Roofing (Asphalt)",
    stock: 44,
    unitPrice: 7.71,
    expirationDate: "2025-04-04",
  },
  {
    name: "Soup - Campbells, Spinach Crm",
    category: "Roofing (Metal)",
    stock: 5,
    unitPrice: 54.56,
    expirationDate: "2025-05-28",
  },
  {
    name: "Carbonated Water - Blackcherry",
    category: "Fire Protection",
    stock: 48,
    unitPrice: 22.38,
    expirationDate: "2025-04-10",
  },
  {
    name: "Lid Tray - 12in Dome",
    category: "Overhead Doors",
    stock: 56,
    unitPrice: 10.52,
    expirationDate: "2025-05-26",
  },
  {
    name: "Bread - Triangle White",
    category: "Drilled Shafts",
    stock: 14,
    unitPrice: 91.54,
    expirationDate: "2025-03-31",
  },
  {
    name: "Wine - Magnotta - Bel Paese White",
    category: "Construction Clean and Final Clean",
    stock: 19,
    unitPrice: 29.24,
    expirationDate: "2025-04-06",
  },
  {
    name: "Cheese - Le Cru Du Clocher",
    category: "Curb & Gutter",
    stock: 20,
    unitPrice: 86.7,
    expirationDate: "2025-04-13",
  },
  {
    name: "Table Cloth 54x72 White",
    category: "Plumbing & Medical Gas",
    stock: 90,
    unitPrice: 67.75,
    expirationDate: "2025-05-24",
  },
  {
    name: "Syrup - Golden, Lyles",
    category: "Electrical",
    stock: 83,
    unitPrice: 58.94,
    expirationDate: "2025-04-29",
  },
  {
    name: "Ice Cream - Life Savers",
    category: "Asphalt Paving",
    stock: 46,
    unitPrice: 38.85,
    expirationDate: "2025-05-08",
  },
  {
    name: "Lamb - Whole Head Off,nz",
    category: "Elevator",
    stock: 6,
    unitPrice: 23.37,
    expirationDate: "2025-04-27",
  },
  {
    name: "Island Oasis - Magarita Mix",
    category: "Retaining Wall and Brick Pavers",
    stock: 22,
    unitPrice: 33.54,
    expirationDate: "2025-03-24",
  },
  {
    name: "Truffle Shells - White Chocolate",
    category: "Construction Clean and Final Clean",
    stock: 84,
    unitPrice: 46.23,
    expirationDate: "2025-04-10",
  },
  {
    name: "Veal - Knuckle",
    category: "Retaining Wall and Brick Pavers",
    stock: 64,
    unitPrice: 47.21,
    expirationDate: "2025-05-17",
  },
  {
    name: "Wine - Magnotta - Cab Sauv",
    category: "EIFS",
    stock: 92,
    unitPrice: 37.2,
    expirationDate: "2025-03-23",
  },
  {
    name: "Wine - Alicanca Vinho Verde",
    category: "Soft Flooring and Base",
    stock: 98,
    unitPrice: 33.61,
    expirationDate: "2025-04-02",
  },
  {
    name: "Milk - Chocolate 500ml",
    category: "Waterproofing & Caulking",
    stock: 58,
    unitPrice: 39.57,
    expirationDate: "2025-05-02",
  },
  {
    name: "Apple - Royal Gala",
    category: "Fire Protection",
    stock: 9,
    unitPrice: 93.17,
    expirationDate: "2025-04-08",
  },
  {
    name: "Pie Filling - Pumpkin",
    category: "Rebar & Wire Mesh Install",
    stock: 14,
    unitPrice: 69.47,
    expirationDate: "2025-05-14",
  },
  {
    name: "Pork - Ham, Virginia",
    category: "Sitework & Site Utilities",
    stock: 88,
    unitPrice: 15.27,
    expirationDate: "2025-04-06",
  },
  {
    name: "Chocolate Eclairs",
    category: "Drywall & Acoustical (MOB)",
    stock: 61,
    unitPrice: 30.94,
    expirationDate: "2025-04-12",
  },
  {
    name: "Aspic - Light",
    category: "Elevator",
    stock: 87,
    unitPrice: 31.65,
    expirationDate: "2025-03-24",
  },
  {
    name: "Dried Cherries",
    category: "Plumbing & Medical Gas",
    stock: 87,
    unitPrice: 34.18,
    expirationDate: "2025-05-28",
  },
  {
    name: "Salmon Atl.whole 8 - 10 Lb",
    category: "Structural and Misc Steel (Fabrication)",
    stock: 28,
    unitPrice: 52.41,
    expirationDate: "2025-04-09",
  },
  {
    name: "Pork - Inside",
    category: "Electrical and Fire Alarm",
    stock: 91,
    unitPrice: 19.22,
    expirationDate: "2025-03-29",
  },
  {
    name: "Bread - Dark Rye, Loaf",
    category: "Curb & Gutter",
    stock: 63,
    unitPrice: 16.84,
    expirationDate: "2025-05-15",
  },
  {
    name: "The Pop Shoppe Pinapple",
    category: "Marlite Panels (FED)",
    stock: 26,
    unitPrice: 73.68,
    expirationDate: "2025-04-29",
  },
  {
    name: "Pie Pecan",
    category: "Soft Flooring and Base",
    stock: 100,
    unitPrice: 7.51,
    expirationDate: "2025-05-26",
  },
];