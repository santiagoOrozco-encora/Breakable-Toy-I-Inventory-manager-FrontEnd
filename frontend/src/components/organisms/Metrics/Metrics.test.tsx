import { describe, expect, it } from "vitest";
import ShowMetrics from "./Metrics";
import { Metrics } from "../../../types/Types";
import { render, screen } from "@testing-library/react";


describe("Metrics component",()=>{
    // export type Metrics = {
    //   averageInStock: number;
    //   category: string;
    //   totalInStock: number;
    //   valueInStock: number;
    // };
    const mockMetricsData: Metrics[] = [
      {
        averageInStock: 4,
        category: "Category 1",
        totalInStock: 10,
        valueInStock: 20,
      },
      {
        averageInStock: 12,
        category: "Category 2",
        totalInStock: 13,
        valueInStock: 25,
      },
    ];

    it("renders Metrics correctly",()=>{
        render(
            <ShowMetrics data={mockMetricsData}/>
        );

        expect(screen.getByText("Category 1"));
        expect(screen.getByText("4.00"));
        expect(screen.getByText("10.00"));
        expect(screen.getByText("20.00"));

        expect(screen.getByText("Category 2"));
        expect(screen.getByText("12.00"));
        expect(screen.getByText("13.00"));
        expect(screen.getByText("25.00"));
    })
})