import { baseURL } from "@/components/config";
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
    // Handle fishAward array
    if (data.categoriesIds) {
      formData.append("categoriesIds", JSON.stringify(data.categoriesIds));
    }  
  
    return formData;
  };

  export const handleGetProductTanlAPI = async (
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
      });
      return response;
    } catch (error) {
      console.error("Error fetching fish products:", error);
      return error as AxiosError;
    }
  };

  export const handleGetProductTankByIdAPI = async (id: string) => {
    try {
      const response = await axios.get(`${baseURL}/v1/product/fish/${id}`);
      return response;
    } catch (error) {
      console.log(error);
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
      
      var jwtToken = localStorage.getItem("jwt");
      const response = await axios.patch(res, formData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.log("error", error);
      return error as AxiosError
    }
  };