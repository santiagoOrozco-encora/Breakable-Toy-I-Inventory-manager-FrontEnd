import { API_URL } from "../config";
import { Metrics, Product, ProductData } from "../types/Types";

export const getProducts = ({
  name,
  category,
  stock,
  page,
  size,
  sort,
  order,
}: {
  name?: string;
  category?: string;
  stock?: number;
  page?: number;
  size?: number;
  sort?: string[];
  order?: boolean[];
}) => {
  const url = new URL(API_URL);

  if (name) url.searchParams.append("name", name);
  if (category) url.searchParams.append("category", category);
  if (stock) url.searchParams.append("stock", stock.toString());
  if (page) url.searchParams.append("page", page.toString());
  if (size) url.searchParams.append("size", size.toString());
  if (sort) url.searchParams.append("sort", sort.toString());
  if (order) url.searchParams.append("order", order.toString());

  return fetch(url)
    .then((response) => response.json())
    .then((res) => {
      if(res != undefined){
        const categories: string[] = Array.from(
          new Set(
            res.source.map((product: { category: Product }) => product.category)
          )
        );
        const data: ProductData = {
          pageList: res.pageList,
          pageSize: res.pageCount,
          categories: categories,
        };
  
        return data;
      }else{
        const dataEmpy: ProductData = {
          pageList: [],
          pageSize: 0,
          categories: []
        };
        return dataEmpy;
      }
    });
};

export const getMetrics = () => {
  const url = new URL(`${API_URL}/metrics`);

  return fetch(url)
    .then((res) => {
      return res.json(); 
    })
    .then((res: Metrics[]) => {
      const data: Metrics[] = res;
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
};

export const addProduct = (data: any) => {
  const url = new URL(`${API_URL}/addProduct`);

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => {
    if(res.status == 200){
      const productData = getProducts({});
      return productData;
    }
  });
};

export const setOutOfStock = (id: string) => {
  const url = new URL(`${API_URL}/products/${id}/outofstock`);

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then(() => {
    const productData = getProducts({});
    return productData;
  });
};

export const setInStock = (id: string) => {
  const url = new URL(`${API_URL}/products/${id}/instock`);
  console.log(url.toString());

  return fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  }).then(() => {
    const productData = getProducts({});
    return productData;
  });
};

export const updateProduct = (data:any, id:string) =>{
    const url = new URL(`${API_URL}/update`);

    if(id) url.searchParams.append("id",id);
    else throw Error;

    return fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(()=> {
        const productData = getProducts({});
        return productData;
    })


}

export const deleteProduct = (id:string)=>{
  const url = new URL(`${API_URL}`);

  url.searchParams.append("id",id);
  
  return fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  }).then(()=>{
    const productData = getProducts({});
    return productData;
  })
}

export const validateExpirationDate = (value:any) => {
  if (!value) return true;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const selectedDate = new Date(value);
    return (
      selectedDate >= (tomorrow || null) || "Please select a date starting from tomorrow."
    );
  };