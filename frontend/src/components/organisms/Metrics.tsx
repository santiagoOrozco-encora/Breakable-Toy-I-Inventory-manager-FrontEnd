import { FunctionComponent } from "react";

export type Metrics = {
  averageInStock: number;
  category: string;
  totalInStock: number;
  valueInStock: number;
};

interface MetricsProps{
    data: Metrics[]
}

const ShowMetrics:FunctionComponent<MetricsProps> = ({data}) =>{
    return (
      <section className="w-9/12 m-10 flex justify-center flex-col gap-3">
        <table>
          <thead>
            <tr className="text-end">
              <th></th>
              <th>Total products in stock</th>
              <th>Total value in stock</th>
              <th>Average price in stock</th>
            </tr>
          </thead>
          <tbody>
            {data.map((category) => (
              <>
                <tr className="items-center justify-center text-end gap-3 my-3">
                  <td className="my-3 font-bold">{category.category}</td>
                  <td className="my-3">{category.totalInStock}</td>
                  <td className="my-3">{category.valueInStock}</td>
                  <td className="my-3">{category.averageInStock}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </section>
    );
}

export default ShowMetrics;