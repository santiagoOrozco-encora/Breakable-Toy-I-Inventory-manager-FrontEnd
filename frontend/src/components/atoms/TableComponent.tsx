import { ChangeEvent, FunctionComponent, HTMLAttributes,useContext,useEffect,useMemo, useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  flexRender,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import Button from "../atoms/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { PaginationContext, ProductCategoryContext, ProductListContext } from "../../App";
import Modal from "react-modal";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { useForm } from "react-hook-form";

interface TableComponentProps extends HTMLAttributes<HTMLTableElement>{
    data: Product[]
}

export type Product = {
  id:string;
  name: string;
  category: string;
  unitPrice: number;
  expirationDate: Date;
  stock: number;
};

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

const TableComponent: FunctionComponent<TableComponentProps> =({data})=>{
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

  const { register, handleSubmit, setValue } = useForm();

  //Column definition
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "select",
        // header: () => (
        //   <div>
        //     <input
        //       type="checkbox"
        //       checked={selectAll}
        //       onChange={handleSelectAll}
        //     />
        //   </div>
        // ),
        cell: ({ row }) => (
          <div>
            <input
              type="checkbox"
              // checked={selectedRows.includes(row.original.id)}
              onChange={(e) => handleCheckBox(e, row.original)}
            />
          </div>
        ),
        enableSorting: false,
      },
      {
        header: "Category",
        accessorKey:"category",
      },
      { header: "Product name", accessorKey: "name" },
      {
        header: "Price",
        accessorKey: "unitPrice",
        sortingFn: "basic",
      },
      {
        header: "Expiration Date",
        accessorKey: "expirationDate",
        // sortingFn: 'datetime',
      },
      {
        header: "Stock",
        accessorKey: "stock",
        cell: ({ row }) => {
          if (row.original.stock < 5 && row.original.stock > 0) {
            return (
              <div className="bg-red-400 text-white h-full w-full">
                {row.original.stock}
              </div>
            );
          }
          if (row.original.stock <= 10 && row.original.stock >= 5) {
            return (
              <div className="bg-orange-400 text-white h-full w-full">
                {row.original.stock}
              </div>
            );
          }
          if (row.original.stock <= 0) {
            return (
              <div className="bg-transparent h-full w-full line-through">
                {row.original.stock}
              </div>
            );
          } else {
            return (
              <div className="bg-transparent h-full w-full ">
                {row.original.stock}
              </div>
            );
          }
        },
      },
      {
        header: "Actions",
        accessorKey: "category",
        cell: ({ row }) => (
          <div className="w-full gap-2 flex justify-center m-2">
            <Button
              variant={"secondary"}
              onClick={() => openModal(row.original)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => handleDelete(row.original)}
            >
              <FontAwesomeIcon icon={faTrashAlt} />{" "}
            </Button>
          </div>
        ),
        enableSorting: false,
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
    pageCount: paginationRow?.[0],
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
      try {
        const res = await fetch(
          `http://localhost:9090/api/v1/product?page=${pagination.pageIndex}&size=${pagination.pageSize}&sort=${sorting[0]?.id}`
        );
        const data = await res.json();
        productList?.[1](data.pageList);
        paginationRow?.[1](data.pageCount);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, sorting]);

  //Handle checkbox
  const handleCheckBox = (e: ChangeEvent<HTMLInputElement>, row: Product) => {
    if (e.target.checked == true) {
      outOfStock(row);
    } else {
      inStock(row);
    }
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
    try {
      const res = await fetch(
        `http://localhost:9090/api/v1/product/update?id=${selectedId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        fetch("http://localhost:9090/api/v1/product")
          .then((response) => response.json())
          .then((data) => {
            productList?.[1](data.pageList);
            paginationRow?.[1](data.pageCount);
            const categories: string[] = Array.from(
              new Set(
                data.pageList.map(
                  (product: { category: Product }) => product.category
                )
              )
            );
            productCategory?.[1](categories);
          });
        closeModal();
      }

    } catch (error) {
      console.log(error);
    }
  });

  //Delete product
  const handleDelete = async (row: Product) => {
    try {
      const res = await fetch(
        `http://localhost:9090/api/v1/product?id=${row.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        fetch("http://localhost:9090/api/v1/product")
          .then((response) => response.json())
          .then((data) => {
            productList?.[1](data.pageList);
            paginationRow?.[1](data.pageCount);
            const categories: string[] = Array.from(
              new Set(
                data.pageList.map(
                  (product: { category: Product }) => product.category
                )
              )
            );
            productCategory?.[1](categories);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //SetOutStock
  const outOfStock = async (row: Product) => {
    try {
      const res = await fetch(
        `http://localhost:9090/api/v1/product/products/${row.id}/outofstock`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        fetch("http://localhost:9090/api/v1/product")
          .then((response) => response.json())
          .then((data) => {
            productList?.[1](data.pageList);
            paginationRow?.[1](data.pageCount);
            const categories: string[] = Array.from(
              new Set(
                data.pageList.map(
                  (product: { category: Product }) => product.category
                )
              )
            );
            productCategory?.[1](categories);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  //SetDefaultStock
  const inStock = async (row: Product) => {
    try {
      const res = await fetch(
        `http://localhost:9090/api/v1/product/products/${row.id}/instock`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        fetch("http://localhost:9090/api/v1/product")
          .then((response) => response.json())
          .then((data) => {
            productList?.[1](data.pageList);
            paginationRow?.[1](data.pageCount);
            const categories: string[] = Array.from(
              new Set(
                data.pageList.map(
                  (product: { category: Product }) => product.category
                )
              )
            );
            productCategory?.[1](categories);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Row background color calculation
  const getRowBackgroundColor = (expirationDate: Date) => {
    const expDate = expirationDate ? new Date(expirationDate) : null;
    const actualDate = new Date();
    let bg_color = "";

    if (expDate != null) {
      const diffTime = expDate.getTime()- actualDate.getTime();
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

  //Component
  return (
    <div className="w-full gap-3 flex flex-col">
      <table className="w-full">
        <thead className="border-b bg-gray-200 p-3">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="">
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none flex gap-1.5 items-center justify-center"
                            : ""
                        }
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
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const bg_color = getRowBackgroundColor(row.original.expirationDate);

            return (
              <tr key={row.id} className={`border-b ${bg_color}`}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex items-center justify-center text-2xl gap-4">
          <Button
            //   disabled={!table.getCanPreviousPage()}
            className="border rounded p-1"
            onClick={() => table.firstPage()}
            variant="alt"
          >
            {"<<"}
          </Button>
          <Button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            variant="alt"
            //disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            className="border rounded p-1"
            onClick={() => table.nextPage()}
            variant={"alt"}
            //disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            className="border rounded p-1"
            onClick={() => table.lastPage()}
            variant="alt"
            //disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
      </div>

      {/* Edit product modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Add product"
        style={customStyles}
      >
        <div className="gap-3 flex flex-col">
          <h3 className="text-xl font-semibold">Add a new product</h3>
          <form onSubmit={onSubmit} className="gap-2.5 flex flex-col ">
            <InputField
              {...register("name")}
              type={"text"}
              field={"productName"}
              placeholder={"Milk, Beef, ..."}
              label={"Product name"}
            />
            <SelectField
              {...register("category")}
              optionName={"category"}
              options={productCategory?.[0]}
              label={"Product category"}
            ></SelectField>
            <InputField
              {...register("stock")}
              type={"number"}
              field={"stock"}
              placeholder={"5"}
              label={"Product stock"}
            />
            <InputField
              {...register("unitPrice")}
              type={"number"}
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
  );
}


export default TableComponent;