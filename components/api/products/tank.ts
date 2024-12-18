import { baseURL } from "@/components/config";
import { handleError, jwtToken, logFormData, normalizeData } from "@/helpers/helpers";
import { TankProductCreateModel } from "@/types/CreateModel/TankProductCreateModel";
import { TankProductUpdateModel } from "@/types/UpdateModel/TankProductUpdateModel";
import axios, { AxiosError } from "axios";

const updateForm = async (data: TankProductUpdateModel) => {
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
    data.deleteImages.forEach((string, index) => {
      if (string) formData.append(`deleteImages[${index}]`, string);
    });
    if (data.updateImages) {
        data.updateImages.forEach((file, index) => {
          formData.append(`updateImages${index}`, file);
        });
      }
    if (data.tankModel) {
      let dataTank = data.tankModel;
      let tankModel = {
        size: dataTank.size,
        sizeInformation: dataTank.sizeInformation,
        glassType: dataTank.glassType,
        deleteCategories: dataTank.deleteCategories,
        updateCategories: dataTank.updateCategories,
      };
      formData.append("tankModel", JSON.stringify(tankModel));
    }
  }
  return formData
};

const addForm = async (data: TankProductCreateModel) => {
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
  
    if (data.tankModel){
        let dataTank = data.tankModel
      let tankModel = {
        size: dataTank.size,
        sizeInformation: dataTank.sizeInformation,
        glassType: dataTank.glassType,
      }
      formData.append("tankModel", JSON.stringify(tankModel));
    }
    // Handle tankAward array
    if (data.categoriesIds) {
      data.categoriesIds.forEach((cat, index) => {
        formData.append(`categoriesIds[${index}]`, cat);
      })
    }  
  
    return formData;
  };
  axios.interceptors.response.use(response => {
    response.data = normalizeData(response.data);
    return response;
  });
  export const handleGetProductTankAPI = async (
    pageSize: number,
    pageNumber: number,
    search: string | null,
    category: string | null,
    sort: string | null,
    direction: string | null
  ) => {
    try {
      const response = await axios.get(`${baseURL}/v1/product/tanks`, {
        params: {
          PageSize: pageSize,
          PageNumber: pageNumber,
          ...(search && { Search: search }),
          ...(category && { Category: category }),
          ...(sort && { Sort: sort }),
          ...(direction && { Direction: direction }),
        },
        headers: {
          Authorization: `Bearer ${jwtToken()}`
        }
      });
      return response;
    } catch (error) {
      handleError(error)
      return error as AxiosError;
    }
  };

  export const handleGetProductTankByIdAPI = async (id: string) => {
    try {
      const response = await axios.get(`${baseURL}/v1/product/tank/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken()}`
        }
      });
      return response;
    } catch (error) {
      handleError(error)
      return error as AxiosError;
    }
  };

  export const  hanldePatchProductTankAPI = async (
    id: string,
    data: TankProductUpdateModel,
  ) => {
    try {
      let formData = await updateForm(data);
      var res = `${baseURL}/v1/product/tank/${id}`;
      logFormData(formData)
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

  export const handlePostProductTankAPI = async (
    data: TankProductCreateModel
  ) => {
    try {
      let formData = await addForm(data);
      var res = `${baseURL}/v1/product/tank`;
      logFormData(formData);
      var jwtToken = localStorage.getItem("jwt");
      console.log(res);
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