import { baseURL } from "@/components/config";
import { handleError, normalizeData } from "../../helpers/helpers";
import axios, { AxiosResponse } from "axios";
import { BreedRequestModel } from "../../../types/CreateModel/BreedRequestModel";
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
      handleError(error)
      throw new Error(error as string);
    }
  };

  export const handlePostBreedAPI = async (data: BreedRequestModel) => {
    try {
      console.log(data);
      
      var res = `${baseURL}/v1/breed`
      const response = await axios.post(res, data)
      return response
    } catch (error) {
      handleError(error)
      return error as AxiosResponse

    }
  }

  export const handlePutBreedAPI = async (id: string, data: BreedRequestModel) => {
    try {
      console.log("id", id);
      
      console.log(data);
      
      var res = `${baseURL}/v1/breed/${id}?id=${id}`
      const response = await axios.put(res, data)
      return response
    } catch (error) {
      handleError(error)
      return error as AxiosResponse

    }
  }