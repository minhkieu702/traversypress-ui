import { baseURL } from "@/components/config";
import { handleError, jwtToken, normalizeData } from "@/helpers/helpers";
import { CategoryRequestModel } from "@/types/CreateModel/CategoryRequestModel";
import axios, { AxiosResponse } from "axios";

axios.interceptors.response.use(response => {
  response.data = normalizeData(response.data);
  return response;
});

export const handleGetCategoryAPI = async (pageSize?: number, pageNumber?: number) => {
    try {
    var res = `${baseURL}/v1/tankcategory`
    const response = await axios.get(res, {
      params:{
        ...(pageSize && {PageSize: pageSize}),
        ...(pageNumber && {PageNumber: pageNumber})
    },
    headers: {
      Authorization: `Bearer ${jwtToken()}`,
      "Content-Type": "multipart/form-data",
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
      var res = `${baseURL}/v1/tankcategory`
      console.log(res);
      
      const response = await axios.post(res, data, {
        headers: {
          Authorization: `Bearer ${jwtToken()}`,
          "Content-Type": "multipart/form-data",
        }
      })      
      return response
    } catch (error) {
      handleError(error)
      return error as AxiosResponse
    }
  }

  export const handlePatchCategoryAPI = async (id: string, data: CategoryRequestModel) => {
    try {
      var res = `${baseURL}/v1/tankcategory/${id}`
      console.log(res);
      const response = await axios.patch(res, data,{
        headers: {
          Authorization: `Bearer ${jwtToken()}`,
          "Content-Type": "multipart/form-data",
        }
      })
      return response
    } catch (error) {
      handleError(error)
      return error as AxiosResponse
    }
  }

  export const handleDeleteCategoryAPI = async (id: string) => {
    try {
      var res = `${baseURL}/v1/tankcategory/${id}`
      console.log(res);
      const response = await axios.delete(res,{
        headers: {
          Authorization: `Bearer ${jwtToken()}`,
          "Content-Type": "multipart/form-data",
        }
      })
      return response
    } catch (error) {
      handleError(error)
      return error as AxiosResponse
    }
  }