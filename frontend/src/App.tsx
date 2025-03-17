/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react';
import './App.css'
import Header from './components/organisms/Header/Header';
import TableProducts from './components/organisms/TableProduct/TableProducts';
import { getMetrics, getProducts } from './service';
import { Metrics, PaginationContextType, Product, ProductCategoryContextType, ProductListContextType } from './types/Types';
import ShowMetrics from './components/organisms/Metrics/Metrics';



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
    const fetchAction =async () =>{
      const productAllData = await getProducts({});
      setProductData(productAllData.pageList);
      setPagination(productAllData.pageSize);
      setproductCategory(productAllData.categories);
    };

    fetchAction();
  },[]);

  useEffect(()=>{
    const fetchAction = async ()=>{
      const metrics = await getMetrics();
      setMetrics(metrics);
    }

    fetchAction();
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
