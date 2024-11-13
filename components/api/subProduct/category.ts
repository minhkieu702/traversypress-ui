import { baseURL } from "@/components/config";
import data from "@/data/analytics";
import { FishProductCreateModel } from "@/types/CreateModel/FishProductCreateModel";
import { ProductType } from "@/types/ResponseModel/ProductType";
import { FishProductUpdateModel } from "@/types/UpdateModel/FishProductUpdateModel";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Award } from "lucide-react";
import { describe } from "node:test";
import { any, string } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { convertImageListToBinaryStrings, handleError, jwtToken, logFormData, normalizeData } from "@/helpers/helpers";
import { CategorySubProductRequestModel } from "@/types/CreateModel/CategorySubProductRequestModel";

axios.interceptors.response.use(response => {
  response.data = normalizeData(response.data);
  return response;
});

export const handleGetCategoryAPI = async (type: string, pageSize?: number, pageNumber?: number) => {
    try {
    var res = `${baseURL}/v1/category`
    const response = await axios.get(res, {
      params:{
        CategoryType: type,
        ...(pageSize && {PageSize: pageSize}),
        ...(pageNumber && {PageNumber: pageNumber})
    },
    headers: {
      Authorization: `Bearer ${jwtToken()}`,
    }
    })
    return response;
    } catch (error) {
      handleError(error)
      throw new Error(error as string);
    }
  };

  export const handlePostCategoryAPI = async (data: CategorySubProductRequestModel) => {
    try {
      var res = `${baseURL}/v1/category`      
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

  export const handlePatchCategoryAPI = async (id: string, data: CategorySubProductRequestModel) => {
    try {
      var res = `${baseURL}/v1/category/{categoryId}?tankcategoryId=${id}`
      
      const response = await axios.patch(res, data,{
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

  export const handleDeleteCategoryAPI = async (id: string) => {
    try {
      var res = `${baseURL}/v1/category/${id}`
      console.log(res);
      const response = await axios.delete(res,{
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