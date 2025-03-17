import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  ProductCategoryContext,
  PaginationContext,
  ProductListContext,
} from "../../App";
import  SearchBox  from "./SearchBox"; // adjust path if needed
import { getProducts } from "../../service";
import { describe, expect, it, vi } from "vitest";
import { PaginationContextType, ProductCategoryContextType, ProductListContextType } from "../../types/Types";

vi.mock("../../service", () => ({
  getProducts: vi.fn(),
}));

describe("SearchBox component",()=>{
  const mockCategories:ProductCategoryContextType = [["Electronics", "Groceries", "Clothing"],vi.fn()];
  const mockPagination: PaginationContextType = [1, vi.fn()]; // current page 1
  const mockProductList: ProductListContextType = [[], vi.fn()];

  it("renders SearchBox correctly", () => {
    render(
      <ProductCategoryContext.Provider value={mockCategories}>
        <PaginationContext.Provider value={mockPagination}>
          <ProductListContext.Provider value={mockProductList}>
            <SearchBox />
          </ProductListContext.Provider>
        </PaginationContext.Provider>
      </ProductCategoryContext.Provider>
    );

    // Check if elements are present
    expect(screen.getByPlaceholderText("Milk"));
    expect(screen.getByText("Search of products"));
    expect(screen.getByLabelText("Select the category"));
    expect(screen.getByText("In stock"));
    expect(screen.getByText("Out of stock"));
    expect(screen.getByText("All"));
    expect(screen.getByText("Search product"));
  });

  it("Fetches data and submit with the form",async()=>{
    const mockResponse = {
      pageList: [
        {
          id: "4239239de932d",
          name: "Product 1",
          category: "Electronics",
          stock: 10,
          unitPrice: 32.4,
          expirationDate: "2025-03-12",
        },
      ],
      pageSize: 1,
      categories: ["Electronics", "Groceries", "Clothing"],
    };

    (getProducts as vi.Mock).mockResolvedValue(mockResponse);
    render(
      <ProductCategoryContext.Provider value={mockCategories}>
        <PaginationContext.Provider value={mockPagination}>
          <ProductListContext.Provider value={mockProductList}>
            <SearchBox />
          </ProductListContext.Provider>
        </PaginationContext.Provider>
      </ProductCategoryContext.Provider>
    );

    // Simulate user typing in the search input
    const searchInput = screen.getByPlaceholderText("Milk");
    fireEvent.change(searchInput, { target: { value: "Product 1" } });
    const categoryDropdown = screen.getByLabelText("Select the category");
    fireEvent.click(categoryDropdown);
    const electronicsOption = screen.getByText("Electronics");
    fireEvent.click(electronicsOption);

    // Simulate selecting stock availability
    const stockDropdown = screen.getByLabelText("Availability");
    fireEvent.change(stockDropdown, { target: { value: 1 } }); 

    // Simulate form submission
    const searchButton = screen.getByText("Search product");
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(getProducts).toHaveBeenCalledWith({
        name:"Product 1",
        category: ["Electronics"],
        stock:"1"
      });
    });
    expect(mockProductList[1]).toHaveBeenCalledWith(mockResponse.pageList);
    expect(mockPagination[1]).toHaveBeenCalledWith(mockResponse.pageSize);
  });

})
