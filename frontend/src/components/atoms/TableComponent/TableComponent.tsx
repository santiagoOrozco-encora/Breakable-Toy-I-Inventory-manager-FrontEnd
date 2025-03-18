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
import Button from "../../atoms/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { PaginationContext, ProductCategoryContext, ProductListContext } from "../../../App";
import Modal from "react-modal";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { useForm } from "react-hook-form";
import { Product } from "../../../types/Types";
import { deleteProduct, getProducts, setInStock, setOutOfStock, updateProduct} from "../../../service";

interface TableComponentProps extends HTMLAttributes<HTMLTableElement>{
    data: Product[]
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
        cell: ({row}) => {
          const productDate =new Date(row.original.expirationDate);
          return (
          <div>{productDate.toLocaleDateString()}</div>
        )},
        sortingFn: 'datetime',
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
        sortingFn: 'basic'
      },
      {
        header: "Actions",
        accessorKey: "",
        cell: ({ row }) => (
          <div className="w-full gap-2 flex justify-center m-2">
            <Button
              variant={"primary"}
              onClick={() => openModal(row.original)}
            >
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
        enableMultiSort: false
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
        const sortParams:string[] = [];
        const orderParams:boolean[] = [];
        sorting.map((sort: { id: string; desc: boolean; }) => {
          sortParams.push(sort.id);
          orderParams.push(sort.desc);
      });
      const productData = await getProducts({page:pagination.pageIndex,size:pagination.pageSize,sort:sortParams,order:orderParams});
      productList?.[1]((productData).pageList);
      paginationRow?.[1]((productData).pageSize);
  };

    const fetchPageNoSort = async () => {
      const productData = await getProducts({page:pagination.pageIndex,size:pagination.pageSize});
      productList?.[1]((productData).pageList);
      paginationRow?.[1]((productData).pageSize);
    };

    if (sorting?.length > 0) {
      fetchPage();
    } else {
      fetchPageNoSort();
    }
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
    if(selectedId){
      const productData = await updateProduct(data,selectedId)
      productList?.[1](productData.pageList);
      paginationRow?.[1](productData.pageSize);
      productCategory?.[1](productData.categories);
      closeModal();
    }else{
      throw Error;
    };
  });

  //Delete product
  const handleDelete = async (row: Product) => {
    const productData = await deleteProduct(row.id);
    productList?.[1](productData.pageList);
    paginationRow?.[1](productData.pageSize);
    productCategory?.[1](productData.categories);
  };

  //SetOutStock
  const outOfStock = async (row: Product) => {
    const productData = await setOutOfStock(row.id);
     productList?.[1](productData.pageList);
     paginationRow?.[1](productData.pageSize);
     productCategory?.[1](productData.categories);
  };
  //SetDefaultStock
  const inStock = async (row: Product) => {
        const productData = await setInStock(row.id);
        productList?.[1](productData.pageList);
        paginationRow?.[1](productData.pageSize);
        productCategory?.[1](productData.categories);
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