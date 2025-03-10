import { FunctionComponent, HTMLAttributes,useContext,useMemo, useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  Column,
  ColumnDef,
  flexRender,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import Checkbox from "../atoms/Checkbox";
import Button from "../atoms/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { ProductListContext } from "../../App";

interface TableComponentProps extends HTMLAttributes<HTMLTableElement>{
    data: Product[]
}

export type Product = {
  name: string;
  category: string;
  unitPrice: number;
  expirationDate: Date;
  stock: number;
};

const TableComponent: FunctionComponent<TableComponentProps> =({data})=>{

  const productList = useContext(ProductListContext);
    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]); 
        const columns = useMemo<ColumnDef<Product>[]>(
          () => [
            {
              id: "select",
              header: ({ table }) => <Checkbox />,
              cell: ({ row }) => (
                <div>
                  <Checkbox />
                </div>
              ),
              enableSorting: false,
            },
            { header: "Product name", accessorKey: "name" },
            {
              header: "Price",
              accessorKey: "unitPrice",
            },
            {
              header: "Expiration Date",
              accessorKey: "expirationDate",
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
                  <Button className="w-3 h-auto" variant={"secondary"}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </Button>
                  <Button variant={"secondary"}>
                    <FontAwesomeIcon icon={faTrashAlt} />{" "}
                  </Button>
                </div>
              ),
              enableSorting: false,
            },
          ],
          []
        );

        const table = useReactTable({
          data,
          columns,
          getCoreRowModel: getCoreRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
          onPaginationChange: setPagination,
          getSortedRowModel: getSortedRowModel(),
          onSortingChange:setSorting,
          initialState: {
            sorting: [{ id: "name", desc: true }],
          },
          state: {
            pagination,
            sorting,
          },
        });
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
              return (
                <tr key={row.id} className="border-b">
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
              onClick={() => table.nextPage()} variant={"alt"}              
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
      </div>
    );
}


export default TableComponent;