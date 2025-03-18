import { describe, expect, it, vi } from "vitest";
import { PaginationContextType, Product, ProductCategoryContextType, ProductListContextType } from "../../../types/Types";
import { PaginationContext, ProductCategoryContext, ProductListContext } from "../../../App";
import TableComponent from "./TableComponent";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

// Mock data for the table
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Product 1",
    category: "Category 1",
    unitPrice: 20,
    expirationDate: new Date("2025-03-13"),
    stock: 10,
  },
  {
    id: "2",
    name: "Product 2",
    category: "Category 2",
    unitPrice: 15,
    expirationDate: new Date("2025-06-01"),
    stock: 5,
  },
  // Add more mock products as needed
];

vi.mock("../../service", () => ({
  getProducts: vi.fn(),
}));

describe("Table of products component",()=>{
    const mockCategories: ProductCategoryContextType = [
      ["Electronics", "Groceries", "Clothing"],
      vi.fn(),
    ];
    const mockPagination: PaginationContextType = [1, vi.fn()];
    const mockProductList: ProductListContextType = [mockProducts, vi.fn()];

    it("render TableComponent",()=>{
      render(
        <ProductListContext.Provider value={mockProductList}>
          <PaginationContext.Provider value={mockPagination}>
            <ProductCategoryContext.Provider value={mockCategories}>
              <TableComponent data={mockProducts} />
            </ProductCategoryContext.Provider>
          </PaginationContext.Provider>
        </ProductListContext.Provider>
      );

      // Check that the table displays the product name, category, and stock
      expect(screen.getByText("Product 1"));
      expect(screen.getByText("Category 1"));
      expect(screen.getByText("10"));
      expect(screen.getByText("Product 2"));
      expect(screen.getByText("Category 2"));
      expect(screen.getByText("5"));
    });

    it("should show the modal when clicking edit button", async () => {
      render(
        <ProductListContext.Provider value={mockProductList}>
          <PaginationContext.Provider value={mockPagination}>
            <ProductCategoryContext.Provider value={mockCategories}>
              <TableComponent data={mockProducts} />
            </ProductCategoryContext.Provider>
          </PaginationContext.Provider>
        </ProductListContext.Provider>
      );

      // Triggering the modal by clicking the edit button
      const editButton = screen.getAllByRole("button")[0]; // Assuming the first button is "Edit"
      fireEvent.click(editButton);

      // Check if the modal appears
      await waitFor(() =>
        expect(screen.getByText("Edit product"))
      );
    });

    // it("should call pagination function on page change", async () => {
    //   const mockResponse = {
    //     pageList: [
    //       {
    //         id: "4239239de932d",
    //         name: "Product 1",
    //         category: "Electronics",
    //         stock: 10,
    //         unitPrice: 32.4,
    //         expirationDate: "2025-03-12",
    //       },
    //       {
    //         id: "4239239de43232d",
    //         name: "Product 2",
    //         category: "Electronics",
    //         stock: 10,
    //         unitPrice: 32.4,
    //         expirationDate: "2025-03-12",
    //       },
    //     ],
    //     pageSize: 1,
    //     categories: ["Electronics", "Groceries", "Clothing"],
    //   };

    // const fetchPageNoSort = vi.fn().mockResolvedValue(mockResponse);   
    
    // render(
    //     <ProductListContext.Provider value={mockProductList}>
    //       <PaginationContext.Provider value={mockPagination}>
    //         <ProductCategoryContext.Provider value={mockCategories}>
    //           <TableComponent data={mockProducts} />
    //         </ProductCategoryContext.Provider>
    //       </PaginationContext.Provider>
    //     </ProductListContext.Provider>
    //   );

    //   // Trigger a page change
    //   const nextPageButton = screen.getByText(">");
    //   fireEvent.click(nextPageButton);

    //   // Check that the pagination function was called
    //   await waitFor(() => {
    //     expect(fetchPageNoSort).toHaveBeenCalled();
    //   });
    //});
})
