import { baseURL } from "@/components/config";
import { handleError, jwtToken, normalizeData } from "@/helpers/helpers";
import { StaffRequestModel } from "@/types/CreateModel/StaffRequestModel";
import { StaffUpdateRequestModel } from "@/types/UpdateModel/StaffUpdateRequestModel";
import axios, { AxiosResponse } from "axios";

axios.interceptors.response.use(response => {
  response.data = normalizeData(response.data);
  return response;
});

export const handleUpdateStaffAPI = async(staff: StaffUpdateRequestModel) => {
  try {
      var res = `${baseURL}/v1/staff`
  const response = await axios.patch(res, staff, {
    headers: {
      Authorization: `Bearer ${jwtToken()}`,
    },
  });
  return response
  } catch (error) {
      handleError(error)
      return error as AxiosResponse
  }
}

export const handlePostImageStaffAPI = async(staffId: string, file: File) => {
  try {
      var res = `${baseURL}/v1/staff/image/${staffId}`
  const response = await axios.patch(res, file, {
    headers: {
      Authorization: `Bearer ${jwtToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response
  } catch (error) {
      handleError(error)
      return error as AxiosResponse
  }
}

export const handlePostStaffAPI = async(staff: StaffRequestModel) => {
  try {
      var res = `${baseURL}/v1/admin/staff`
  const response = await axios.post(res, staff, {
    headers: {
      Authorization: `Bearer ${jwtToken()}`,
    },
  });
  return response
  } catch (error) {
      handleError(error)
      return error as AxiosResponse
  }
}

export const handlePatchStaffAPI = async(staff: string) => {
  try {
      var res = `${baseURL}/v1/admin/staff/${staff}`
  const response = await axios.patch(res, staff, {
    headers: {
      Authorization: `Bearer ${jwtToken()}`,
    },
  });
  return response
  } catch (error) {
      handleError(error)
      return error as AxiosResponse
  }
}

export const handleGetStaffAPI = async (pageSize?: number, pageNumber?: number, search?:string) => {
  try {
  var res = `${baseURL}/v1/admin/staffs`
  const response = await axios.get(res, {
    headers: {
      Authorization: `Bearer ${jwtToken()}`,
    },
    params:{
      ...(pageSize && {PageSize: pageSize}),
      ...(pageNumber && {PageNumber: pageNumber}),
      ...(search?.trim() && {Search: search})
  }
  })
  return response;
  } catch (error) {
    handleError(error)
    throw new Error(error as string);
  }
};

export const handleDeleteStaffAPI = async (id: string) => {
  try {
    var res = `${baseURL}/v1/admin/staff/${id}`
    const response = await axios.delete(res, {
      headers: {
        Authorization: `Bearer ${jwtToken()}`,
      }
    })
    return response;
    } catch (error) {
      handleError(error)
      throw new Error(error as string);
    }
}