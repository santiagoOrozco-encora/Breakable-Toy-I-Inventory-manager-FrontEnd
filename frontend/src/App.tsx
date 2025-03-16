/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react';
import './App.css'
import Header from './components/organisms/Header';
import ShowMetrics, { Metrics } from './components/organisms/Metrics';
import TableProducts from './components/organisms/TableProducts';
import { Product } from './components/atoms/TableComponent';

type ProductListContextType = [
   Product[],
   React.Dispatch<React.SetStateAction<Product[]>>,
];
type ProductCategoryContextType = [
  string[],
  React.Dispatch<React.SetStateAction<string[]>>,
];

type PaginationContextType = [
  number,
  React.Dispatch<React.SetStateAction<number>>,
];


export const ProductListContext = createContext<ProductListContextType | undefined>(
  undefined
);

export const ProductCategoryContext = createContext<ProductCategoryContextType | undefined>(undefined);
export const PaginationContext = createContext<PaginationContextType | undefined>(undefined);


function ProductManager() {

  const [productData, setProductData] = useState<Product[]>([]);
  const [productCategory, setproductCategory] = useState<string[]>([]);
  const [pagination,setPagination] = useState<number>(0);
  const [metrics,setMetrics] = useState<Metrics[]>([]);

  useEffect(()=>{
    fetch("http://localhost:9090/api/v1/product")
      .then((response) => response.json())
      .then((data) => {
        setProductData(data.pageList);
        setPagination(data.pageCount);
        const categories: string[] = Array.from(
          new Set(
            data.pageList.map(
              (product: { category: Product }) => product.category
            )
          )
        );
        setproductCategory(categories);
      }
      
    );
  },[]);

  useEffect(()=>{
    fetch("http://localhost:9090/api/v1/product/metrics")
      .then((response) => response.json())
      .then((data) => {
        setMetrics(data);
      });
  },[productData])

  return (
    <>
      <ProductListContext.Provider value={[productData, setProductData]}>
        <ProductCategoryContext.Provider
          value={[productCategory, setproductCategory]}
        >
          <PaginationContext.Provider value={[pagination,setPagination]}>
          <Header />
            <main className="w-full m-10 flex flex-col justify-center items-center">
              <TableProducts products={productData || []} />
              <ShowMetrics data={metrics || []} />
            </main>
          </PaginationContext.Provider>
        </ProductCategoryContext.Provider>
      </ProductListContext.Provider>
    </>
  );
}

export default ProductManager;
