import { FunctionComponent, useContext, useEffect, useState } from "react";
import InputField from "../atoms/InputField";
import SelectField from "../atoms/SelectField";
import Button from "../atoms/Button";
import { PaginationContext, ProductCategoryContext, ProductListContext } from "../../App";
import { Controller, useForm } from "react-hook-form";
import Multiselect from "multiselect-react-dropdown";

type SearchBoxProps = object


const SearchBox: FunctionComponent<SearchBoxProps> = () =>{
  
  const categories = useContext(ProductCategoryContext);
  const pagination = useContext(PaginationContext);
  const productList = useContext(ProductListContext);
  const {register,handleSubmit,control} =useForm();
  const [categoryOptions, setCategoryOptions] = useState<{name:string,id:string}[]>();

  const onSubmit = handleSubmit((data) => {
    console.log(data.category);
    fetch(
      `http://localhost:9090/api/v1/product?name=${data.name}&category=${data.category}&stock=${data.stock}`
    )
      .then((response) => response.json())
      .then((data) => {
        productList?.[1](data.pageList);
        pagination?.[1](data.pageCount);
      })
      .catch((error) =>
        console.error("Error fetching searched products:", error)
      );
  });

  useEffect(()=>{
    const opts: { name: string; id: string; }[] = [];
    categories?.[0].forEach((c)=>{
      opts.push({name:c, id:c})
    })

    setCategoryOptions(opts);
  },[categories])

    return (
      <div className="flex flex-col border rounded p-3 px-5 gap-5 w-9/12">
        <h1 className="font-semibold text-2xl w-fit">Search of products</h1>
        <form
          className="flex flex-col items-start lg:w-3/6 gap-5 w-full"
          onSubmit={onSubmit}
        >
          <InputField
            {...register("name")}
            type={"text"}
            field={"productName"}
            placeholder={"Milk"}
            label={"Name of the product"}
          />
          <Controller
            name="category"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Multiselect
                {...field}
                className="w-full"
                options={categoryOptions}
                displayValue="name"
                placeholder="Select categories"
                onSelect={(selectedList) => {
                  field.onChange(selectedList.map((item: { name: string; }) => item.name)); // Se pasa solo el nombre de las categorías seleccionadas
                }}
                onRemove={(selectedList) => {
                  field.onChange(selectedList.map((item: {name:string}) => item.name)); // Se actualiza cuando se deselecciona una categoría
                }}
              />
            )}
          />

          <SelectField
            {...register("stock")}
            optionName={"productState"}
            label="Availability"
          >
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