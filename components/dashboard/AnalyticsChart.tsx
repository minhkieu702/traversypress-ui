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

import data from "@/data/analytics";
import { CustomerType } from "@/types/ResponseModel/CustomerType";
import { useEffect, useState } from "react";
import { handleGetCustomerAPI } from "../api/person/customer";
import { AxiosResponse } from "axios";
import { log } from "console";
import { CustomersGroupByYear } from "@/types/ResponseModel/CustomersGroupByYear";
import { ThreeDots } from "react-loader-spinner";

interface Data {
  totalCustomes: number;
  customersGroupByYear: CustomersGroupByYear[];
}
interface AnalyticsChartProps {
  year: number;
}
const AnalyticsChart = ({year}: AnalyticsChartProps) => {
  const [data, setData] = useState<Data>();
  const [loading, setLoading] = useState(false);

  const handleGetCustomer = async () => {
    setLoading(true);
    try {
      var response = await handleGetCustomerAPI(year);
      if (response?.status === 200) {
        var content = response as AxiosResponse;
        let list = content.data.data as Data;
        console.log(list);
        
        setData(list);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetCustomer();
  }, [year]);

  return (
    <>
      {loading ? (
        <>
          <div className="flex items-center justify-center h-screen">
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#000000"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Analytics For This Year</CardTitle>
              <CardDescription>Registrations Per Month</CardDescription>
            </CardHeader>
            {
              data?.totalCustomes==0 ? (
                <>Không có dữ liệu</>
              ) : (
                <CardContent>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart
                    width={12}
                    height={data?.totalCustomes}
                    data={data?.customersGroupByYear}
                  >
                    <Line
                      type="monotone"
                      dataKey="customerCount"
                      stroke="#8884d8"
                    />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="month" />
                    <YAxis />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
              )
            }
          </Card>
        </>
      )}
    </>
  );
};
export default AnalyticsChart;
