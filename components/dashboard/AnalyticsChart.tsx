"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { handleGetCustomerAPI } from "../api/person/customer";
import { handleGetOrderAPI } from "../api/order/order";
import { ThreeDots } from "react-loader-spinner";
import { AxiosResponse } from "axios";
import { SalesPerYear } from "@/types/ResponseModel/SalesGroupByYear";

interface CustomersPerYear {
  totalCustomes: number;
  customersGroupByYear: { month: number; customerCount: number }[];
}

interface SalesGroupByYear {
  totalSales: number;
  salesGroupByMonth: { month: number; sales: number }[];
}

interface AnalyticsChartProps {
  year: number;
  month: number;
}

const AnalyticsChart = ({ year, month }: AnalyticsChartProps) => {
  const [data, setData] = useState<{
    yearData?: { customer: CustomersPerYear; sales: SalesPerYear };
    monthData?: any; // Define as per month structure
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [customersResponse, salesResponse] = await Promise.all([
        handleGetCustomerAPI(year, month),
        handleGetOrderAPI(year, month),
      ]);

      if (customersResponse?.status === 200 && salesResponse?.status === 200) {
        const customerData = (customersResponse as AxiosResponse).data.data;
        const salesData = (salesResponse as AxiosResponse).data.data;

        setData({
          yearData: month === 0 ? { customer: customerData, sales: salesData } : undefined,
          monthData: month !== 0 ? { customer: customerData, sales: salesData } : undefined,
        });
        console.log("salesData", data.yearData?.sales);

      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year, month]);

  const renderChart = (data: any, dataKey: string, xAxisKey: string) => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <ThreeDots visible={true} height="80" width="80" color="#000000" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Analytics For {month === 0 ? "This Year" : "This Month"}</CardTitle>
            <CardDescription>{month === 0 ? "Registrations Per Month" : "Registrations Per Week"}</CardDescription>
          </CardHeader>
          {data.yearData ? (
            <>
              <CardContent>{renderChart(data.yearData.customer.customersGroupByYear, "customerCount", "month")}</CardContent>
              <CardContent>{renderChart(data.yearData.sales.salesGroupByMoth, "orders", "month")}</CardContent>
            </>
          ) : data.monthData ? (
            <>
              <CardContent>{renderChart(data.monthData.customer.customersGroupByWeek, "customersCount", "week")}</CardContent>
              <CardContent>{renderChart(data.monthData.sales.sales, "sales", "week")}</CardContent>
            </>
          ) : (
            <div className="text-center">No data available.</div>
          )}
        </Card>
      )}
    </>
  );
};

export default AnalyticsChart;
