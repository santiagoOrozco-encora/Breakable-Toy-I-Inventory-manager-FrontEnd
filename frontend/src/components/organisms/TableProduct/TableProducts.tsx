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
    const [newcategory,setNewCategory] = useState(false);
    const [addingCategory, setAddingCategory] = useState(true);
    const [error,setError] = useState(false);
    const {register,handleSubmit,watch,setValue,reset} = useForm();

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
      reset();
      setShowModal(false);
    };

    //Add product function
    const onSubmit = handleSubmit((async data=>{
      const productData = await addProduct(data);
      if(productData != undefined){
        productList?.[1](productData.pageList);
        pagination?.[1](productData.pageSize);
        categoryProducts?.[1](productData.categories);
        reset();
      }else{
        setError(true);
        console.log(productData);
      }
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
          ariaHideApp={false}
          style={customStyles}
        >
          <div className="gap-3 flex flex-col">
            <h3 className="text-xl font-semibold">Add a new product</h3>
            <form
              action=""
              className="gap-2.5 flex flex-col "
              onSubmit={onSubmit}
            >
              {/* Product name */}
              <InputField
                {...register("name", { required: true, max: 120 })}
                type={"text"}
                field={"productName"}
                placeholder={"Milk, Beef, ..."}
                label={"Product name"}
              />
              {/* Select of category */}
              {addingCategory == true && (
                <SelectField
                  {...register("category", { required: true })}
                  optionName={"category"}
                  disabled={!addingCategory}
                  options={categoryProducts?.[0]}
                  label={"Product category"}
                  onChange={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    if (value) {
                      setNewCategory(false);
                      setValue("category", value);
                    } else {
                      setNewCategory(true);
                      setValue("category", value);
                    }
                  }}
                >
                  Select category
                </SelectField>
              )}
              {/* Add a new category input */}
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
                        setAddingCategory(false);
                      } else {
                        setAddingCategory(true);
                      }
                    }}
                    placeholder="New category name"
                    label="New Category"
                  />
                </div>
              )}
              {/* Stock input */}
              <InputField
                {...register("stock", { required: true })}
                type={"number"}
                field={"stock"}
                placeholder={"5"}
                label={"Product stock"}
              />
              {/* Unit price input */}
              <InputField
                {...register("unitPrice", { required: true })}
                type={"decimal"}
                field={"price"}
                placeholder={"$32.5"}
                label={"Product price"}
              />
              {/* Expiration date input */}
              <InputField
                {...register("expirationDate", { required: false })}
                type={"date"}
                field={"expirationDate"}
                placeholder={"25-05-2025"}
                label={"Expiration date"}
              />
              {/* Action buttons */}
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
        {error &&<dialog open>
          Product duplicated
          <Button variant={"primary"} typeof="close" onClick={()=>setError(false)}>Close</Button>
        </dialog>}

      </div>
    );
}

export default TableProducts;