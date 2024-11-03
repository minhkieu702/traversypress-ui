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
import { convertImageListToBinaryStrings, handleError, logFormData, normalizeData } from "@/helpers/helpers";

axios.interceptors.response.use(response => {
  response.data = normalizeData(response.data);
  return response;
});

const checkUnauthorized = (response: AxiosError, router: any) => {
  console.log("im in checkresponsestatus");

  if (response.status === 401) {
    console.log("checkresponsestatus", response);
    router.push("/auth");
  }
};

const updateForm = async (data: FishProductUpdateModel) => {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.descriptionDetail)
    formData.append("descriptionDetail", data.descriptionDetail);
  if (data.stockQuantity)
    formData.append("stockQuantity", data.stockQuantity.toString());
  if (data.price) formData.append("price", data.price.toString());
  if (data.originalPrice)
    formData.append("originalPrice", data.originalPrice.toString());
  if (data.deleteImages) {
    console.log("data.deleteImages", data.deleteImages);
    
    // formData.append(`deleteImages`, JSON.stringify(data.deleteImages))
    data.deleteImages.forEach((string, index) => {
      if (string) formData.append(`deleteImages[${index}]`, string);
    });
  }
  
  if (data.updateImages) {
    data.updateImages.forEach((file, index) => {
      formData.append(`updateImages${index}`, file);
    });
  }
  if (data.fishModel) {
    let sex = data.fishModel.sex === "male";
    let fishAward = data.fishModel.fishAward
    fishAward?.forEach((item, index) => {
      if (item.id === null) {
        item.id = uuidv4()
      }
    })
    let fishModel = {
      breedId: data.fishModel.breedId,
      size: data.fishModel.size,
      age: data.fishModel.age,
      origin: data.fishModel.origin,
      sex: sex,
      foodAmount: data.fishModel.foodAmount,
      weight: data.fishModel.weight,
      health: data.fishModel.health,
      deleteAward: data.fishModel.deleteAward,
      fishAward: fishAward
    }
    formData.append("fishModel", JSON.stringify(fishModel));
  }
  return formData;
};

const addForm = async (data: FishProductCreateModel) => {
  const formData = new FormData();

  // Append basic fields
  if (data.name) formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.descriptionDetail)
    formData.append("descriptionDetail", data.descriptionDetail);
  if (data.stockQuantity)
    formData.append("stockQuantity", data.stockQuantity.toString());
  if (data.price) formData.append("price", data.price.toString());
  if (data.originalPrice)
    formData.append("originalPrice", data.originalPrice.toString());

  // Handle image files directly
  if (data.imageFiles) {
    data.imageFiles.forEach((file, index) => {
      formData.append(`imageFile${index}`, file); // Sử dụng trực tiếp các tệp file
    });
  }

  if (data.fishModel){
    let sex = data.fishModel.sex === "male";
    let fishModel = {
      breedId: data.fishModel.breedId,
      size: data.fishModel.size,
      age: data.fishModel.age,
      origin: data.fishModel.origin,
      sex: sex,
      foodAmount: data.fishModel.foodAmount,
      weight: data.fishModel.weight,
      health: data.fishModel.health,
      dateOfBirth: data.fishModel.dateOfBirth
    }
    formData.append("fishModel", JSON.stringify(fishModel));
  }
  // Handle fishAward array
  if (data.fishAward) {
    formData.append("fishAward", JSON.stringify(data.fishAward));
  }  

  return formData;
};

export const handlePostProductFishAPI = async (
  data: FishProductCreateModel
) => {
  try {
    let formData = await addForm(data);
    var res = `${baseURL}/v1/product/fish`;
    var jwtToken = localStorage.getItem("jwt");
    const response = await axios.post(res, formData, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    handleError(error)
    return error as AxiosError
  }
};

export const handleGetProductFishAPI = async (
  pageSize: number,
  pageNumber: number,
  search: string | null,
  breed: string | null,
  sort: string | null,
  direction: string | null
) => {
  try {
    const response = await axios.get(`${baseURL}/v1/product/fishs`, {
      params: {
        PageSize: pageSize,
        PageNumber: pageNumber,
        ...(search && { Search: search }),
        ...(breed && { Breed: breed }),
        ...(sort && { Sort: sort }),
        ...(direction && { Direction: direction }),
      },
    });
    return response;
  } catch (error) {
    handleError(error)
    return error as AxiosError
  }
};

export const handleGetProductFishByIdAPI = async (id: string) => {
  try {
    const response = await axios.get(`${baseURL}/v1/product/fish/${id}`);
    return response;
  } catch (error) {
    handleError(error)
    return error as AxiosError;
  }
};

export const hanldePatchProductFishAPI = async (
  id: string,
  data: FishProductUpdateModel,
) => {
  try {
    let formData = await updateForm(data);
    var res = `${baseURL}/v1/product/fish/${id}`;
    
    var jwtToken = localStorage.getItem("jwt");
    const response = await axios.patch(res, formData, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    handleError(error)
    return error as AxiosError
  }
};
