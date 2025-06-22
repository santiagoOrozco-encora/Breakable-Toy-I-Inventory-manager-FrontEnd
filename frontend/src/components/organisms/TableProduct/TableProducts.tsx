import { FunctionComponent, useContext, useState } from "react";
import Modal from "react-modal";
import Button from "../../atoms/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { ProductCategoryContext, ProductListContext } from "../../../App";
import { Product } from "../../../types/Types";
import TableComponent from "../../atoms/TableComponent/TableComponent";
import { addProduct } from "../../../service";

// Define form data type
type ProductFormData = {
  name: string;
  category: string;
  newCategory: string;
  stock: number | string;
  unitPrice: number | string;
  expirationDate: string;
};

interface TableProductsProps {
  products: Product[];
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: "32rem",
    padding: "0",
    border: "none",
    borderRadius: "0.75rem",
    boxShadow:
      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
};

const TableProducts: FunctionComponent<TableProductsProps> = () => {
  const categoryProducts = useContext(ProductCategoryContext);
  const productList = useContext(ProductListContext);
  const [showModal, setShowModal] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>();

  const handleFormSubmit: SubmitHandler<ProductFormData> = async (formData) => {
    try {
      // Ensure we have a valid category
      const category = isNewCategory
        ? (formData.newCategory || "").trim()
        : formData.category || "";

      if (!category) {
        throw new Error("Category is required");
      }
      if (formData.expirationDate === "") {
        formData.expirationDate = "";
      }

      const productData = {
        name: (formData.name || "").trim(),
        category,
        stock: Number(formData.stock) || 0,
        unitPrice: Number(formData.unitPrice) || 0,
        expirationDate: formData.expirationDate || "",
      };

      await addProduct(productData);
      closeModal();

      // Refresh the page to show the new product
      window.location.reload();
    } catch (error) {
      console.error("Failed to add product:", error);
      // Consider adding a toast notification here for better UX
    }
  };

  const openModal = () => {
    reset({
      name: "",
      category: categoryProducts?.[0]?.[0] || "",
      newCategory: "",
      stock: 0,
      unitPrice: 0,
      expirationDate: new Date().toISOString().split("T")[0],
    });
    setIsNewCategory(false);
    setShowModal(true);
  };
  const closeModal = () => {
    reset({
      name: "",
      category: "",
      newCategory: "",
      stock: 0,
      unitPrice: 0,
      expirationDate: "",
    });
    setShowModal(false);
  };

  return (
    <div className="w-9/12 h-[970px] mb-10 flex flex-col py-5">
      {/* Tittle and add product button (Header) */}
      <div className="flex gap-3 m-2 items-start justify-between">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button variant={"primary"} onClick={openModal}>
          Add product
        </Button>
      </div>

      {/* Products table */}
      {productList?.[0].length === 0 ? (
        <div className="flex items-center justify-center p-4">
          <p>No products found</p>
        </div>
      ) : (
        <>
          <TableComponent className="w-full" data={productList?.[0] || []} />
        </>
      )}

      {/* Add product modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add product"
        ariaHideApp={false}
        closeTimeoutMS={200}
      >
        <div className="bg-white w-full p-6">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">
              Add New Product
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to add a new product to your inventory
            </p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Product name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Product name is required",
                  maxLength: {
                    value: 120,
                    message: "Name must be less than 120 characters",
                  },
                })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsNewCategory(!isNewCategory)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
              >
                {isNewCategory ? (
                  <>
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Select Existing
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    New Category
                  </>
                )}
              </button>
              {!isNewCategory ? (
                <select
                  {...register("category", { required: !isNewCategory })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a category</option>
                  {categoryProducts?.[0]?.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="mt-1">
                  <input
                    type="text"
                    {...register("newCategory", { required: isNewCategory })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter new category name"
                  />
                </div>
              )}
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message as string}
                </p>
              )}
              {errors.newCategory && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newCategory.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("stock", {
                  required: "Stock is required",
                  min: { value: 0, message: "Stock cannot be negative" },
                  valueAsNumber: false,
                  setValueAs: (v) => (v === "" ? "" : Number(v)),
                })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                min="0"
                step="1"
                placeholder="Enter stock quantity"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.stock.message as string}
                </p>
              )}
            </div>
            {/* Unit price input */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Unit Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("unitPrice", {
                  required: "Unit price is required",
                  min: { value: 0, message: "Price cannot be negative" },
                  valueAsNumber: false,
                  setValueAs: (v) => (v === "" ? "" : Number(v)),
                })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                step="0.01"
                min="0"
                placeholder="Enter unit price"
              />
              {errors.unitPrice && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.unitPrice.message as string}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Expiration Date
              </label>
              <input
                type="date"
                {...register("expirationDate", {
                  required: false,
                  validate: (value) => {
                    if (new Date(value) < new Date()) {
                      return "Expiration date must be in the future";
                    }
                    return true;
                  },
                })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.expirationDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.expirationDate.message as string}
                </p>
              )}
            </div>
            {/* Action buttons */}
            <div className="space-y-1">
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
};

export default TableProducts;
