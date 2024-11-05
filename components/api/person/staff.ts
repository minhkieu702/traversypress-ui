import { baseURL } from "@/components/config";
import { handleError } from "@/helpers/helpers";
import { StaffRequestModel } from "@/types/CreateModel/StaffRequestModel";
import axios, { AxiosResponse } from "axios";

export const handlePostStaffAPI = async(staff: StaffRequestModel) => {
    try {
        var res = `${baseURL}/v1/admin/staff`
        var jwtToken = localStorage.getItem("jwt");
    const response = await axios.post(res, res, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response
    } catch (error) {
        handleError(error)
        return error as AxiosResponse
    }
}