import { baseURL } from "@/components/config";
import { handleError, normalizeData } from "../../helpers/helpers";
import axios, { AxiosResponse } from "axios";
import { CategoryRequestModel } from "../../../types/CreateModel/CategoryRequestModel";

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
    return response;
    } catch (error) {
      handleError(error)
      throw new Error(error as string);
    }
  };

  export const handleGetCategoryPaginationAPI = async (pageSize: number, pageNumber: number) => {
    try {
    var res = `${baseURL}/v1/category`
    const response = await axios.get(res, {
        params:{
            PageSize: pageSize,
            PageNumber: pageNumber
        }
    })
    return response;
    } catch (error) {
      handleError(error)
      throw new Error(error as string);
    }
  };

  export const handlePostCategoryAPI = async (data: CategoryRequestModel) => {
    try {
      var res = `${baseURL}/v1/category`
      console.log(res);
      
      const response = await axios.post(res, data)      
      return response
    } catch (error) {
      handleError(error)
      return error as AxiosResponse
    }
  }

  export const handlePatchCategoryAPI = async (id: string, data: CategoryRequestModel) => {
    try {
      var res = `${baseURL}/v1/category/${id}`
      console.log(res);
      const response = await axios.patch(res, data)
      return response
    } catch (error) {
      handleError(error)
      return error as AxiosResponse
    }
  }

  export const handleDeleteCategoryAPI = async (id: string) => {
    try {
      var res = `${baseURL}/v1/category/${id}`
      console.log(res);
      const response = await axios.delete(res)
      return response
    } catch (error) {
      handleError(error)
      return error as AxiosResponse
    }
  }