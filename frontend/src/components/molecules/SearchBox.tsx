import { FunctionComponent, useContext, useEffect, useState } from "react";
import SelectField from "../atoms/SelectField";
import {
  PaginationContext,
  ProductCategoryContext,
  ProductListContext,
} from "../../App";
import { Controller, useForm } from "react-hook-form";
import Multiselect from "multiselect-react-dropdown";
import { getProducts } from "../../service";

type SearchBoxProps = object;

const SearchBox: FunctionComponent<SearchBoxProps> = () => {
  const categories = useContext(ProductCategoryContext);
  const pagination = useContext(PaginationContext);
  const productList = useContext(ProductListContext);
  const { register, handleSubmit, control } = useForm();
  const [categoryOptions, setCategoryOptions] =
    useState<{ name: string; id: string }[]>();

  const CSStyle = {
    multiselectContainer: {
      width: "100%",
    },
    searchBox: {
      width: "100%",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
      boxShadow: "none",
    },
    inputField: {
      width: "100%",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
    },
    optionContainer: {
      width: "100%",
      borderRadius: "0.375rem",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    },
    chips: {
      background: "#E5E7EB",
      color: "#111827",
      margin: "2px 4px 2px 0",
    },
    option: {
      fontSize: "0.875rem",
      "&:hover": {
        backgroundColor: "#F3F4F6",
      },
    },
  };

  const onSubmit = handleSubmit((data) => {
    const fetchAction = async () => {
      const productAllData = await getProducts({
        name: data?.name,
        category: data?.category,
        stock: data?.stock,
      });
      productList?.[1](productAllData.pageList);
      if (pagination) {
        pagination[1]({
          pageSize: productAllData.pageSize,
          totalItems: productAllData.totalItems,
          currentPage: 0, // Reset to first page on new search
          totalPages: productAllData.totalPages,
        });
      }
    };
    fetchAction();
  });

  useEffect(() => {
    const opts: { name: string; id: string }[] = [];
    categories?.[0].forEach((c) => {
      opts.push({ name: c, id: c });
    });
    setCategoryOptions(opts);
  }, [categories]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Search</h1>
        <p className="text-gray-600 mt-1">
          Find products by name, category, or availability
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Product Name Field */}
          <div className="space-y-1">
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                {...register("name")}
                id="productName"
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="e.g. Milk, Bread, Eggs"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <Controller
              name="category"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <div className="relative">
                  <Multiselect
                    {...field}
                    options={categoryOptions}
                    displayValue="name"
                    placeholder="All categories"
                    className="text-sm"
                    style={{
                      ...CSStyle,
                      searchBox: {
                        ...CSStyle.searchBox,
                        borderRadius: "0.375rem",
                        border: "1px solid #D1D5DB",
                        padding: "0.5rem 0.75rem",
                        minHeight: "38px",
                        fontSize: "0.875rem",
                      },
                      optionContainer: {
                        ...CSStyle.optionContainer,
                        borderRadius: "0.375rem",
                        marginTop: "0.25rem",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      },
                      option: {
                        padding: "0.5rem 1rem",
                        fontSize: "0.875rem",
                      },
                    }}
                    onSelect={(selectedList) => {
                      field.onChange(
                        selectedList.map((item: { name: string }) => item.name)
                      );
                    }}
                    onRemove={(selectedList) => {
                      field.onChange(
                        selectedList.map((item: { name: string }) => item.name)
                      );
                    }}
                  />
                </div>
              )}
            />
          </div>

          {/* Availability Selector */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Availability
            </label>
            <div className="mt-1">
              <SelectField
                {...register("stock")}
                className="w-full"
                optionName="productState"
                label=""
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg
              className="-ml-1 mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Search Products
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
