import { FunctionComponent, useContext, useState } from "react";
import SearchBox from "../../molecules/SearchBox";
import Button from "../../atoms/Button";
import { addProducts } from "../../../service";
import {
  ProductCategoryContext,
  PaginationContext,
  ProductListContext,
} from "../../../App";

type HeaderProps = object;

const Header: FunctionComponent<HeaderProps> = () => {
  const categoryProducts = useContext(ProductCategoryContext);
  const pagination = useContext(PaginationContext);
  const productList = useContext(ProductListContext);
  const [able, setAble] = useState(true);

  const handleSample = async () => {
    const dataProduct = await addProducts();
    if (dataProduct != undefined) {
      productList?.[1](dataProduct.pageList);
      pagination?.[1]({
        pageSize: dataProduct.pageSize,
        totalItems: dataProduct.totalItems,
        currentPage: 0,
        totalPages: dataProduct.totalPages,
      });
      categoryProducts?.[1](dataProduct.categories);
    }
    setAble(false);
  };

  return (
    <section className="w-9/12 m-10 mb-0 flex flex-col gap-5 items-center justify-center p-5">
      <SearchBox />
      {able && (
        <Button variant={"secondary"} onClick={handleSample}>
          Set demo
        </Button>
      )}
      <hr className="w-full" />
    </section>
  );
};

export default Header;
