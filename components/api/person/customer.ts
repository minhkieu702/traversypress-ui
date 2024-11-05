import { baseURL } from "@/components/config";
import { handleError } from "@/helpers/helpers";
import axios, { AxiosResponse } from "axios";

export const handleGetCustomerAPI = async (
  year: number, 
  month: number
) => {
  try {
    var jwtToken = localStorage.getItem("jwt");
    // const response: AxiosResponse<any, any>
    if (month === 0) {
      let res = `${baseURL}/v1/analysis/customers/year`
      let response = await axios.get(
        res,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "multipart/form-data",
          },
          params: {
            year: year
            }
        },
      );
      return response;
    }
    else{
      let res = `${baseURL}/v1/analysis/customers/month` 
      let response = await axios.get(
        res,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "multipart/form-data",
          },
          params: {
            year: year,
            month: month
            }
        },
      );
      return response;
    }
  } catch (error) {
    handleError(error);
    throw new Error(error as string);
  }
};
