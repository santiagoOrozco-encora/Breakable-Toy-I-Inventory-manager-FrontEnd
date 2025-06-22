import { FunctionComponent } from "react";
import { Metrics } from "../../../types/Types";

interface MetricsProps {
  data: Metrics[];
}

const ShowMetrics: FunctionComponent<MetricsProps> = ({ data }) => {
  // Calculate totals
  const totals = data.reduce(
    (acc, curr) => ({
      totalItems: acc.totalItems + curr.totalInStock,
      totalValue: acc.totalValue + curr.valueInStock,
    }),
    { totalItems: 0, totalValue: 0 }
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 leading-tight">
          Inventory Metrics
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your inventory statistics and category breakdown
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-blue-50">
              <svg
                className="h-5 w-5 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="ml-3 text-sm font-medium text-gray-500">
              Total Categories
            </h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{data.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-green-50">
              <svg
                className="h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M10 4a1 1 0 011 1v4.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 9.586V5a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="ml-3 text-sm font-medium text-gray-500">
              Total Items in Stock
            </h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {totals.totalItems.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full bg-purple-50">
              <svg
                className="h-5 w-5 text-purple-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 2v8H4V6h12z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M10 9a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H8a1 1 0 110-2h1v-1a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="ml-3 text-sm font-medium text-gray-500">
              Total Inventory Value
            </h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {formatCurrency(totals.totalValue)}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Category Breakdown
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Detailed metrics by product category
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Items
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Value
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Avg. Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((category) => (
                <tr
                  key={category.category}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900 font-medium">
                      {category.totalInStock.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900 font-medium">
                      {formatCurrency(category.valueInStock)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900 font-medium">
                      {formatCurrency(category.averageInStock)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No category data available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowMetrics;
