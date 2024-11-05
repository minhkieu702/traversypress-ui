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
import { CustomersGroupByWeek } from "@/types/ResponseModel/CustomersGroupByWeek";

interface DataPerYear {
  totalCustomes: number;
  customersGroupByYear: CustomersGroupByYear[];
}
interface DataPerMonth {
  totalCustomes: number;
  customersGroupByWeek: CustomersGroupByWeek[];
}
interface AnalyticsChartProps {
  year: number;
  month: number;
}
const AnalyticsChart = ({ year, month }: AnalyticsChartProps) => {
  const [dataIsYear, setDataIsYear] = useState<DataPerYear>();
  const [dataIsMonth, setDataIsMonth] = useState<DataPerMonth>();

  const [loading, setLoading] = useState(false);

  const handleGetCustomerPerYear = async () => {
    setLoading(true);
    try {
      var response = await handleGetCustomerAPI(year, month);
      if (response?.status === 200) {
        var content = response as AxiosResponse;
        let list = content.data.data as DataPerYear;
        console.log(list);
        setDataIsMonth(undefined);
        setDataIsYear(list);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetCustomerPerMonth = async () => {
    setLoading(true);
    try {
      var response = await handleGetCustomerAPI(year, month);
      if (response?.status === 200) {
        var content = response as AxiosResponse;
        let list = content.data.data as DataPerMonth;
        setDataIsMonth(list);
        setDataIsYear(undefined);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (month === 0) {
      handleGetCustomerPerYear();
    } else {
      handleGetCustomerPerMonth();
    }
  }, [year, month]);

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
            {dataIsYear?.totalCustomes == 0 ? (
              <>Không có dữ liệu</>
            ) : month === 0 ? (
              <CardContent>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart
                      width={12}
                      height={dataIsYear?.totalCustomes}
                      data={dataIsYear?.customersGroupByYear}
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
            ) : (
              <CardContent>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart
                      width={12}
                      height={dataIsMonth?.totalCustomes}
                      data={dataIsMonth?.customersGroupByWeek}
                    >
                      <Line
                        type="monotone"
                        dataKey="customersCount" // Update to match data structure
                        stroke="#8884d8"
                      />
                      <CartesianGrid stroke="#ccc" />
                      <XAxis dataKey="week" />{" "}
                      {/* Set X-axis to display week numbers */}
                      <YAxis
                        label={{
                          value: "Customers",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            )}
          </Card>
        </>
      )}
    </>
  );
};
export default AnalyticsChart;
