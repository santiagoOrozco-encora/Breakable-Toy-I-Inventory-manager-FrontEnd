import { FunctionComponent, useState } from "react"
import TableComponent, { Product } from "../atoms/TableComponent"
import Modal from "react-modal";
import Button from "../atoms/Button";
import InputField from "../atoms/InputField";
import SelectField from "../atoms/SelectField";


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

    const [showModal,setShowModal] = useState(false);

    const openModal =() =>{
        setShowModal(true);
    }
    const closeModal = () => {
      setShowModal(false);
    };

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
        <Modal
          isOpen={showModal}
          onRequestClose={closeModal}
          contentLabel="Add product"
          style={customStyles}
        >
          <div className="gap-3 flex flex-col">
            <h3 className="text-xl font-semibold">Add a new product</h3>
            <form action="" className="gap-2.5 flex flex-col ">
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
        </Modal>

        {/* Edit product modal */}
        <Modal
          isOpen={showModal}
          onRequestClose={closeModal}
          contentLabel="Add product"
          style={customStyles}
        >
          <div className="gap-3 flex flex-col">
            <h3 className="text-xl font-semibold">Add a new product</h3>
            <form action="" className="gap-2.5 flex flex-col ">
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
        </Modal>
      </div>
    );
}

export default TableProducts;