import {
  ChangeEvent,
  FunctionComponent,
  HTMLAttributes,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  flexRender,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import Button from "../../atoms/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  PaginationContext,
  ProductCategoryContext,
  ProductListContext,
} from "../../../App";
import Modal from "react-modal";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { FieldError, useForm } from "react-hook-form";
import { Product, ProductData } from "../../../types/Types";
import {
  deleteProduct,
  getProducts,
  setInStock,
  setOutOfStock,
  updateProduct,
  validateExpirationDate,
} from "../../../service";

interface TableComponentProps extends HTMLAttributes<HTMLTableElement> {
  data: Product[];
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

const TableComponent: FunctionComponent<TableComponentProps> = ({ data }) => {
  const productList = useContext(ProductListContext);
  const paginationRow = useContext(PaginationContext);
  const productCategory = useContext(ProductCategoryContext);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  //Column definition
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "select",
        cell: ({ row }) => (
          <div className="flex items-center justify-center h-full">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              onChange={(e) => handleCheckBox(e, row.original)}
            />
          </div>
        ),
        enableSorting: false,
        size: 40,
      },
      {
        header: "Category",
        accessorKey: "category",
      },
      { header: "Product name", accessorKey: "name" },
      {
        header: "Price",
        accessorKey: "unitPrice",
        sortingFn: "basic",
        cell: ({ row }) => {
          return <div>${row.original.unitPrice}</div>;
        },
      },
      {
        header: "Expiration",
        accessorKey: "expirationDate",
        cell: ({ row }) => {
          if (!row.original.expirationDate) return <div></div>;
          const productDate = new Date(row.original.expirationDate);
          return (
            <div className="text-sm">{productDate.toLocaleDateString()}</div>
          );
        },
        sortingFn: "datetime",
      },
      {
        header: "Stock",
        accessorKey: "stock",
        cell: ({ row }) => {
          if (row.original.stock < 5 && row.original.stock > 0) {
            return (
              <div className="bg-red-400 text-white h-full w-full text-center rounded-md">
                {row.original.stock}
              </div>
            );
          }
          if (row.original.stock <= 10 && row.original.stock >= 5) {
            return (
              <div className="bg-orange-400 text-white h-full w-full text-center rounded-md">
                {row.original.stock}
              </div>
            );
          }
          if (row.original.stock <= 0) {
            return (
              <div className="bg-transparent h-full w-full text-center line-through rounded-md">
                {row.original.stock}
              </div>
            );
          } else {
            return (
              <div className="bg-transparent h-full w-full text-center rounded-md">
                {row.original.stock}
              </div>
            );
          }
        },
        sortingFn: "basic",
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="w-full gap-2 flex justify-center m-2">
            <Button variant={"primary"} onClick={() => openModal(row.original)}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
            <Button
              variant={"primary"}
              onClick={() => handleDelete(row.original)}
            >
              <FontAwesomeIcon icon={faTrashAlt} />{" "}
            </Button>
          </div>
        ),
        enableSorting: false,
        enableMultiSort: false,
      },
    ],
    []
  );

  //Table attributes
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: paginationRow?.[0].totalPages,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    initialState: {
      sorting: [{ id: "name", desc: true }],
    },
    state: {
      pagination,
      sorting,
    },
  });

  //Pagination refresh handler
  useEffect(() => {
    const fetchPage = async () => {
      const sortParams: string[] = [];
      const orderParams: boolean[] = [];
      sorting.map((sort: { id: string; desc: boolean }) => {
        sortParams.push(sort.id);
        orderParams.push(sort.desc);
      });
      const productData = await getProducts({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sort: sortParams,
        order: orderParams,
      });
      console.log(productData);
      productList?.[1](productData.pageList);
      paginationRow?.[1]({
        pageSize: productData.pageSize,
        totalItems: productData.totalItems,
        currentPage: pagination.pageIndex,
        totalPages: productData.totalPages,
      });
    };

    const fetchPageNoSort = async () => {
      const productData = await getProducts({
        page: pagination.pageIndex,
        size: pagination.pageSize,
      });
      productList?.[1](productData.pageList);
      paginationRow?.[1]({
        pageSize: productData.pageSize,
        totalItems: productData.totalItems,
        currentPage: pagination.pageIndex,
        totalPages: productData.totalPages,
      });
    };

    if (sorting?.length > 0) {
      fetchPage();
    } else {
      fetchPageNoSort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, sorting]);

  //Handle checkbox
  const handleCheckBox = async (
    e: ChangeEvent<HTMLInputElement>,
    row: Product
  ) => {
    let productData: ProductData;
    if (e.target.checked == true) {
      //outOfStock(row);
      productData = await setOutOfStock(row.id);
    } else {
      //inStock(row);
      productData = await setInStock(row.id);
    }
    console.log(productData);
    productList?.[1](productData.pageList);
    paginationRow?.[1]({
      pageSize: productData.pageSize,
      totalItems: productData.totalItems,
      currentPage: pagination.pageIndex,
      totalPages: productData.totalPages,
    });
    productCategory?.[1](productData.categories);
  };

  //Edit modal functions
  const openModal = (row: Product) => {
    setShowModal(true);

    setSelectedId(row.id);
    setValue("name", row.name);
    setValue("category", row.category);
    setValue("unitPrice", row.unitPrice);
    setValue("expirationDate", row.expirationDate);
    setValue("stock", row.stock);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Update product
  const onSubmit = handleSubmit(async (data) => {
    if (selectedId) {
      const productData = await updateProduct(data, selectedId);
      productList?.[1](productData.pageList);
      paginationRow?.[1]({
        pageSize: productData.pageSize,
        totalItems: productData.totalItems,
        currentPage: pagination.pageIndex,
        totalPages: productData.totalPages,
      });
      productCategory?.[1](productData.categories);
      closeModal();
    } else {
      throw Error;
    }
  });

  //Delete product
  const handleDelete = async (row: Product) => {
    const productData = await deleteProduct(
      row.id,
      table.getState().pagination.pageIndex
    );
    productList?.[1](productData.pageList);
    paginationRow?.[1]({
      pageSize: productData.pageSize,
      totalItems: productData.totalItems,
      currentPage: pagination.pageIndex,
      totalPages: productData.totalPages,
    });
    productCategory?.[1](productData.categories);
  };

  // Row background color calculation
  const getRowBackgroundColor = (expirationDate: Date) => {
    const expDate = expirationDate ? new Date(expirationDate) : null;
    const actualDate = new Date();
    let bg_color = "";

    if (expDate != null) {
      const diffTime = expDate.getTime() - actualDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);

      if (diffDays <= 7) {
        bg_color = "bg-red-300";
      } else if (diffDays > 7 && diffDays <= 14) {
        bg_color = "bg-yellow-300";
      } else if (diffDays > 14) {
        bg_color = "bg-green-300";
      }
    }

    return bg_color;
  };

  // Component return
  return (
    <div className="w-full flex flex-col bg-white rounded-lg shadow">
      {/* Pagination */}
      <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getPrePaginationRowModel().rows.length
                ) +
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {table.getPrePaginationRowModel().rows.length}
              </span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">First</span>«
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>‹
              </button>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>›
              </button>
              <button
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Last</span>»
              </button>
            </nav>
          </div>
        </div>
      </div>
      <div className="w-full overflow-visible">
        <table className="w-full divide-y divide-gray-200 table-fixed">
          <colgroup>
            <col className="w-16" />
            <col className="w-1/6" />
            <col className="w-1/3" />
            <col className="w-24" />
            <col className="w-32" />
            <col className="w-24" />
            <col className="w-36" />
          </colgroup>
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-1.5 ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none hover:text-gray-700 transition-colors"
                            : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                                ? "Sort descending"
                                : "Clear sort"
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="inline-block ml-1">
                            {{
                              asc: "↑",
                              desc: "↓",
                            }[header.column.getIsSorted() as string] ?? "↕"}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`transition-colors ${getRowBackgroundColor(
                  row.original.expirationDate
                )}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-6 py-4 text-sm ${
                      cell.column.id === "name"
                        ? "font-medium text-gray-900 truncate"
                        : "text-gray-500 truncate"
                    }`}
                    title={String(cell.getValue())}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Edit product modal */}
        <Modal
          isOpen={showModal}
          onRequestClose={closeModal}
          contentLabel="Add product"
          style={customStyles}
          ariaHideApp={false}
        >
          <div className="gap-3 flex flex-col">
            <h3 className="text-xl font-semibold">Edit product</h3>
            <form onSubmit={onSubmit} className="gap-2.5 flex flex-col ">
              <InputField
                {...register("name", { required: true, max: 120 })}
                type={"text"}
                field={"productName"}
                placeholder={"Milk, Beef, ..."}
                label={"Product name"}
              />
              <SelectField
                {...register("category", { required: true })}
                optionName={"category"}
                options={productCategory?.[0]}
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
                type={"decimal"}
                field={"price"}
                placeholder={"$32.5"}
                label={"Product price"}
              />
              <InputField
                {...register("expirationDate", {
                  required: false,
                  validate: validateExpirationDate,
                })}
                type={"date"}
                field={"expirationDate"}
                placeholder={"25-05-2025"}
                label={"Expiration date"}
              />
              {errors.expirationDate && (
                <p style={{ color: "red" }}>
                  {(errors.expirationDate as FieldError).message}
                </p>
              )}
              <div className="flex justify-end gap-3">
                <Button variant={"secondary"} onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant={"primary"} typeof="submit">
                  Update product
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TableComponent;
