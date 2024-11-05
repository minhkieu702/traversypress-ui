import { baseURL } from "@/components/config";
import { handleError } from "@/helpers/helpers";
import axios from "axios";

export const handleGetCustomerAPI = async (
  year: number
) => {
  try {
    var res = `${baseURL}/v1/analysis/customers/year`;
    var jwtToken = localStorage.getItem("jwt");
    const response = await axios.get(
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
  } catch (error) {
    handleError(error);
    throw new Error(error as string);
  }
};
