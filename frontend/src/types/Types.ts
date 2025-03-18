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

