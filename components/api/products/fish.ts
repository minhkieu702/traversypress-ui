import { baseURL } from "@/components/config";
import { convertImageListToBinaryStrings } from "@/components/helpers/Helpers";
import data from "@/data/analytics";
import { FishProductCreateModel } from "@/types/CreateModel/FishProductCreateModel";
import { ProductType } from "@/types/ResponseModel/ProductType";
import { FishProductUpdateModel } from "@/types/UpdateModel/FishProductUpdateModel";
import axios, { AxiosResponse } from "axios";
import { string } from "zod";

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
    let fishModel = {
      breedId: data.fishModel.breedId,
      size: data.fishModel.size,
      age: data.fishModel.age,
      origin: data.fishModel.origin,
      sex: sex,
      foodAmount: data.fishModel.foodAmount,
      weight: data.fishModel.weight,
      health: data.fishModel.health
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

  // Append fishModel fields
  formData.append("fishModel", JSON.stringify(data.fishModel));
  formData.append("fishModel.breedId", data.fishModel.breedId);
  if (data.fishModel.size)
    formData.append("fishModel.size", data.fishModel.size.toString());
  if (data.fishModel.age)
    formData.append("fishModel.age", data.fishModel.age.toString());
  if (data.fishModel.origin)
    formData.append("fishModel.origin", data.fishModel.origin);
  formData.append("fishModel.sex", data.fishModel.sex.toString());
  if (data.fishModel.foodAmount)
    formData.append(
      "fishModel.foodAmount",
      data.fishModel.foodAmount.toString()
    );
  if (data.fishModel.weight)
    formData.append("fishModel.weight", data.fishModel.weight.toString());
  if (data.fishModel.health)
    formData.append("fishModel.health", data.fishModel.health);
  if (data.fishModel.dateOfBirth)
    formData.append("fishModel.dateOfBirth", data.fishModel.dateOfBirth);

  // Handle fishAward array
  if (data.fishAward) {
    data.fishAward.forEach((award, index) => {
      if (award) {
        formData.append("fishAward", JSON.stringify(data.fishAward));
        if (award.name) formData.append(`fishAward[${index}].name`, award.name);
        if (award.description)
          formData.append(`fishAward[${index}].description`, award.description);
        if (award.awardDate)
          formData.append(`fishAward[${index}].awardDate`, award.awardDate);
      }
    });
  }

  return formData;
};

const logFormData = (formData: FormData) => {
  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });
};
export const handlePostProductFishAPI = async (
  data: FishProductCreateModel
) => {
  try {
    let formData = await addForm(data);
    var res = `${baseURL}/v1/product/fish`;
    logFormData(formData);
    var jwtToken = localStorage.getItem("jwt");
    console.log("jwtToken", jwtToken);
    console.log(res);
    const response = await axios.post(res, formData, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response", response);
    return response;
  } catch (error) {
    console.log("error", error);
    throw new Error(error as string);
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
    console.log("response", response);
    console.log("data", response.data);
    console.log("fishes response", response.data as ProductType[]);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching fish products:", error);
  }
};

export const handleGetProductFishByIdAPI = async (id: string) => {
  try {
    const response = await axios.get(`${baseURL}/v1/product/fish/${id}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return error as AxiosResponse;
  }
};

export const hanldePatchProductFishAPI = async (
  id: string,
  data: FishProductUpdateModel
) => {
  try {
    let formData = await updateForm(data);
    var res = `${baseURL}/v1/product/fish/${id}`;
    logFormData(formData);
    var jwtToken = localStorage.getItem("jwt");
    console.log("jwtToken", jwtToken);
    console.log(res);
    const response = await axios.patch(res, formData, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response", response);
    return response;
  } catch (error) {
    console.log("error", error);
    throw new Error(error as string);
  }
};
