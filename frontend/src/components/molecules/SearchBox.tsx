import { FunctionComponent, useContext } from "react";
import InputField from "../atoms/InputField";
import SelectField from "../atoms/SelectField";
import Button from "../atoms/Button";
import { ProductCategoryContext, ProductListContext } from "../../App";

interface SearchBoxProps{
}


const SearchBox: FunctionComponent<SearchBoxProps> = ({}) =>{
  //const products = useContext(ProductListContext);
  const categories = useContext(ProductCategoryContext);

    return (
      <div className="flex flex-col border rounded p-3 px-5 gap-5 w-9/12">
        <h1 className="font-semibold text-2xl w-fit">
          Search of products
        </h1>
        <form className="flex flex-col items-start lg:w-3/6 gap-5 w-full">
          <InputField
            type={"text"}
            field={"productName"}
            placeholder={"Milk"}
            label={"Name of the product"}
          />
          <SelectField optionName={"Category"} options={categories?.[0] ? categories?.[0] : [] } label="Category">
            Select the product category
          </SelectField>
          <SelectField optionName={"productState"} label="Availability">
            State of the product
          </SelectField>
          <div className="w-full justify-center lg:justify-end flex">
            <Button variant={"primary"}>Search product</Button>
          </div>
        </form>
      </div>
    );
}


export default SearchBox;