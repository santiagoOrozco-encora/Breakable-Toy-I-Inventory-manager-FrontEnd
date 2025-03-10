import { createContext, useEffect, useState } from 'react';
import './App.css'
import Header from './components/organisms/Header';
import Metrics from './components/organisms/Metrics';
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


export const ProductListContext = createContext<ProductListContextType | undefined>(
  undefined
);

export const ProductCategoryContext = createContext<ProductCategoryContextType | undefined>(undefined);


function ProductManager() {

  const [productData, setProductData] = useState<Product[]>([]);
  const [productCategory, setproductCategory] = useState<string[]>([]);

  useEffect(()=>{
    fetch("http://localhost:9090/api/v1/product")
      .then((response) => response.json())
      .then((data) => setProductData(data));
      

  },[]);

  useEffect(() => {
    if (productData.length > 0) {
      const categories = Array.from(
        new Set(productData.map((product) => product.category))
      );
      setproductCategory(categories);
    }
  }, [productData]);
  return (
    <>
      <ProductListContext.Provider value={[productData, setProductData]}>
        <ProductCategoryContext.Provider value={[productCategory,setproductCategory]}>
          <Header />
        </ProductCategoryContext.Provider>
        <main className="w-full m-10 flex justify-center">
          <TableProducts products={productData || []} />
          <Metrics />
        </main>
      </ProductListContext.Provider>
    </>
  );
}

export default ProductManager;
