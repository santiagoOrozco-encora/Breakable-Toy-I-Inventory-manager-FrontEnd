import { FunctionComponent } from "react";
import { Metrics } from "../../../types/Types";

interface MetricsProps{
    data: Metrics[]
}

const ShowMetrics:FunctionComponent<MetricsProps> = ({data}) =>{
    return (
      <section className="w-9/12 m-10 flex justify-center flex-col gap-3 border p-5">
        <h1 className="font-semibold text-2xl w-fit">
          Metrics for the products
        </h1>
        <table>
          <thead>
            <tr className="text-end border-b-1 bg-zinc-100">
              <th></th>
              <th>Total products in stock</th>
              <th>Total value in stock</th>
              <th>Average price in stock</th>
            </tr>
          </thead>
          <tbody>
            {data.map((category) => (
              <tr key={category.category} className="items-center justify-center text-end gap-3 my-3">
                <td className="my-3 font-bold border-r-black border-r-1 px-2">{category.category}</td>
                <td className="my-3">{category.totalInStock.toFixed(2)}</td>
                <td className="my-3">{category.valueInStock.toFixed(2)}</td>
                <td className="my-3">{category.averageInStock.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
}

export default ShowMetrics;