import { baseURL } from "@/components/config";
import { handleError, normalizeData } from "@/components/helpers/helpers";
import axios from "axios";

axios.interceptors.response.use(response => {
  response.data = normalizeData(response.data);
  return response;
});

export const handleGetCategoryAPI = async () => {
    try {
    var res = `${baseURL}/v1/category`
    const response = await axios.get(res, {
        params:{
            PageSize: 1999,
            PageNumber: 1
        }
    })
    console.log("response", response);
    return response;
    } catch (error) {
      handleError(error)
      throw new Error(error as string);
    }
  };