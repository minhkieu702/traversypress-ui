import { baseURL } from "@/components/config";
import { normalizeData } from "@/components/helpers/helpers";
import { BreedType } from "@/types/ResponseModel/BreedType";
import axios from "axios";
axios.interceptors.response.use(response => {
  response.data = normalizeData(response.data);
  return response;
});
export const handleGetBreedAPI = async () => {
    try {
    var res = `${baseURL}/v1/breed`
    const response = await axios.get(res, {
        params:{
            PageSize: 1999,
            PageNumber: 1
        }
    })
    console.log("response", response);
    return response;
    } catch (error) {
      console.log("error", error)
      throw new Error(error as string);
    }
  };