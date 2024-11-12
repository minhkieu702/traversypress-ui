import { baseURL } from "@/components/config";
import { handleError, jwtToken, normalizeData } from "@/helpers/helpers";
import { BreedRequestModel } from "@/types/CreateModel/BreedRequestModel";
import { BreedType } from "@/types/ResponseModel/BreedType";
import axios, { AxiosResponse } from "axios";
axios.interceptors.response.use(response => {
  response.data = normalizeData(response.data);
  return response;
});

export const handleGetBreedAPI = async (pageSize?: number, pageNumber?: number) => {
    try {
    var res = `${baseURL}/v1/breed`
    const response = await axios.get(res, {
        params:{
            ...(pageSize && {PageSize: pageSize}),
            ...(pageNumber && {PageNumber: pageNumber})
        },
        headers:{
          Authorization: `Bearer ${jwtToken()}`,
        }
    })
    return response;
    } catch (error) {
      handleError(error)
      throw new Error(error as string);
    }
  };
 
  export const handlePostBreedAPI = async (data: BreedRequestModel) => {
    try {
      var res = `${baseURL}/v1/breed`
      const response = await axios.post(res, data, {
        headers: {
          Authorization: `Bearer ${jwtToken()}`,
        }
      })
      return response
    } catch (error) {
      handleError(error)
      return error as AxiosResponse

    }
  }

  export const handlePutBreedAPI = async (id: string, data: BreedRequestModel) => {
    try {
      var res = `${baseURL}/v1/breed/${id}?id=${id}`
      const response = await axios.put(res, data, {
        headers: {
          Authorization: `Bearer ${jwtToken()}`,
        }
      })
      return response
    } catch (error) {
      handleError(error)
      return error as AxiosResponse

    }
  }