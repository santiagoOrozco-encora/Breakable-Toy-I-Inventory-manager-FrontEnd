import { FunctionComponent, useContext, useEffect, useState } from "react"
import Modal from "react-modal";
import Button from "../../atoms/Button";
import InputField from "../../atoms/InputField";
import SelectField from "../../atoms/SelectField";
import { useForm } from "react-hook-form";
import { PaginationContext, ProductCategoryContext, ProductListContext } from "../../../App";
import { Product } from "../../../types/Types";
import TableComponent from "../../atoms/TableComponent/TableComponent";
import { addProduct } from "../../../service";


interface TableProductsProps{
    products: Product[];
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "350px",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};


const TableProducts:FunctionComponent<TableProductsProps> = () =>{

    const categoryProducts = useContext(ProductCategoryContext);
    const pagination = useContext(PaginationContext);
    const productList = useContext(ProductListContext);
    const [showModal,setShowModal] = useState(false);
    const [newcategory,setNewCategory] = useState(true);
    const [addingCategory, setAddingCategory] = useState(true);
    const {register,handleSubmit,watch,setValue} = useForm();

    const categoryValue = watch("category");

    useEffect(()=>{
        if(!categoryValue){
          setNewCategory(true);
          setAddingCategory(true);
        }}
      ,[categoryValue]);

    const openModal =() =>{
        setShowModal(true);
    }
    const closeModal = () => {
      setShowModal(false);
    };

    //Add product function
    const onSubmit = handleSubmit((async data=>{
      const productData = await addProduct(data);
      productList?.[1](productData.pageList);
      pagination?.[1](productData.pageSize);
      categoryProducts?.[1](productData.categories);
      closeModal();
  }))    

    return (
      <div className="w-9/12 m-10 flex justify-center flex-col gap-3">
        
        {/* Tittle and add product button (Header) */}
        <div className="flex gap-3 m-2 items-start">
          <h2 className="text-2xl font-semibold">Products</h2>
          <Button variant={"primary"} onClick={openModal}>
            Add product
          </Button>
        </div>

        {/* Products table */}
        <TableComponent
          className="w-full m-10 flex justify-center"
          data={productList?.[0] || []}
        ></TableComponent>

        {/* Add product modal */}
        <Modal
          isOpen={showModal}
          onRequestClose={closeModal}
          contentLabel="Add product"
          style={customStyles}
        >
          <div className="gap-3 flex flex-col">
            <h3 className="text-xl font-semibold">Add a new product</h3>
            <form
              action=""
              className="gap-2.5 flex flex-col "
              onSubmit={onSubmit}
            >
              <InputField
                {...register("name", { required: true,max:120 })}
                type={"text"}
                field={"productName"}
                placeholder={"Milk, Beef, ..."}
                label={"Product name"}
              />
              <SelectField
                {...register("category", { required: true })}
                optionName={"category"}
                disabled={!addingCategory}
                options={categoryProducts?.[0]}
                label={"Product category"}
                onChange={(e) => {
                  const value = (e.target as HTMLInputElement).value;
                  if(value){
                    setNewCategory(false)
                    setValue("category",value)
                  }else{
                    setNewCategory(true);
                  }
                }}
              >
                Select category
              </SelectField>
              {newcategory && (
                <div className="flex flex-col gap-2">
                  <InputField
                    {...register("category", { required: true })}
                    type="text"
                    field="newCategory"
                    disabled={!newcategory}
                    onChange={(e) => {
                      const value = (e.target as HTMLInputElement).value;
                      setValue("category", value);
                      if (value) {
                        setAddingCategory(true);
                      }else{
                        setAddingCategory(false);
                      }
                    }}
                    placeholder="New category name"
                    label="New Category"
                  />
                </div>
              )}

              <InputField
                {...register("stock", { required: true })}
                type={"number"}
                field={"stock"}
                placeholder={"5"}
                label={"Product stock"}
              />
              <InputField
                {...register("unitPrice", { required: true })}
                type={"decimal"}
                field={"price"}
                placeholder={"$32.5"}
                label={"Product price"}
              />
              <InputField
                {...register("expirationDate", { required: false })}
                type={"date"}
                field={"expirationDate"}
                placeholder={"25-05-2025"}
                label={"Expiration date"}
              />
              <div className="flex justify-end gap-3">
                <Button variant={"secondary"} onClick={closeModal}>
                  Cancelar
                </Button>
                <Button variant={"primary"} typeof="submit">
                  Add product
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    );
}

export default TableProducts;