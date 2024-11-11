import { baseURL } from "@/components/config";
import { handleError, normalizeData } from "@/helpers/helpers";
import axios, { AxiosResponse } from "axios";
axios.interceptors.response.use(response => {
  response.data = normalizeData(response.data);
  return response;
});
export const handleGetCustomerAPI = async (
  year: number, 
  month: number
) => {
  try {
    var jwtToken = localStorage.getItem("jwt");
    if (month === 0) {
      let res = `${baseURL}/v1/analysis/customers/year`
      let response = await axios.get(
        res,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
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


export const handleGetDetailCustomersAPI = async (pageSize?: number, pageNumber?: number, search?:string|null) => {
  try {
  var res = `${baseURL}/v1/customers`
  var jwtToken = localStorage.getItem("jwt");
  const response = await axios.get(res, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    params:{
      ...(pageSize && {PageSize: pageSize}),
      ...(pageNumber && {PageNumber: pageNumber}),
      ...(search && {Search: search})
  }
  })
  return response;
  } catch (error) {
    handleError(error)
    console.log(error);
    
  }
};