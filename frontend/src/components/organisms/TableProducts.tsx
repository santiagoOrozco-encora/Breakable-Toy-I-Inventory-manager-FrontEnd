import { FunctionComponent, useContext, useState } from "react"
import TableComponent, { Product } from "../atoms/TableComponent"
import Modal from "react-modal";
import Button from "../atoms/Button";
import InputField from "../atoms/InputField";
import SelectField from "../atoms/SelectField";
import { useForm } from "react-hook-form";
import { ProductCategoryContext, ProductListContext } from "../../App";


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


const TableProducts:FunctionComponent<TableProductsProps> = ({products}) =>{

    const categoryProducts = useContext(ProductCategoryContext);
    const productList = useContext(ProductListContext);
    const [showModal,setShowModal] = useState(false);
    const {register,handleSubmit} = useForm();

    const openModal =() =>{
        setShowModal(true);
    }
    const closeModal = () => {
      setShowModal(false);
    };

    const onSubmit = handleSubmit((async data=>{
      try{
        console.log(JSON.stringify(data))
        const res = await fetch(`http://localhost:9090/api/v1/product`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      if(res.ok){
         fetch("http://localhost:9090/api/v1/product")
           .then((response) => response.json())
           .then((data) => {
             productList?.[1](data);
             const categories: string[] = Array.from(
               new Set(
                 data.map((product: { category: Product }) => product.category)
               )
             );
             categoryProducts?.[1](categories);
           });
      }
      
      console.log(data);
    }catch(error){

    }
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
          data={products}
        ></TableComponent>

        {/* Add product modal */}
        {/* <Modal
          isOpen={showModal}
          onRequestClose={closeModal}
          contentLabel="Add product"
          style={customStyles}
        >
          <div className="gap-3 flex flex-col">
            <h3 className="text-xl font-semibold">Add a new product</h3>
            <form onSubmit={onSubmit} className="gap-2.5 flex flex-col ">
              <InputField
                type={"text"}
                field={"productName"}
                placeholder={"Milk, Beef, ..."}
                label={"Product name"}
              />
              <SelectField
                optionName={"category"}
                options={[]}
                label={"Product category"}
              ></SelectField>
              <InputField
                type={"number"}
                field={"stock"}
                placeholder={"5"}
                label={"Product stock"}
              />
              <InputField
                type={"number"}
                field={"price"}
                placeholder={"$32.5"}
                label={"Product price"}
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
        </Modal> */}

        {/* Edit product modal */}
        <Modal
          isOpen={showModal}
          onRequestClose={closeModal}
          contentLabel="Add product"
          style={customStyles}
        >
          <div className="gap-3 flex flex-col">
            <h3 className="text-xl font-semibold">Add a new product</h3>
            <form action="" className="gap-2.5 flex flex-col " onSubmit={onSubmit}>
              <InputField
                {...register("name", { required: true })}
                type={"text"}
                field={"productName"}
                placeholder={"Milk, Beef, ..."}
                label={"Product name"}
              />
              <SelectField
                {...register("category", { required: true })}
                optionName={"category"}
                options={categoryProducts?.[0]}
                label={"Product category"}
              ></SelectField>
              <InputField
                {...register("stock", { required: true })}
                type={"number"}
                field={"stock"}
                placeholder={"5"}
                label={"Product stock"}
              />
              <InputField
                {...register("unitPrice", { required: true })}
                type={"number"}
                field={"price"}
                placeholder={"$32.5"}
                label={"Product price"}
              />
              <InputField
                {...register("expirationDate", { required: true })}
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