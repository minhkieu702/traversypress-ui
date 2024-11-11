import { baseURL } from "@/components/config";
import { handleError, jwtToken, normalizeData } from "@/helpers/helpers";
import axios from "axios";
axios.interceptors.response.use(response => {
    response.data = normalizeData(response.data);
    return response;
  });
export const handleGetFeedbackAPI = async (
  pageSize: number,
  pageNumber: number,
  rate?: number
) => {
  try {
    var res = `${baseURL}/v1/feedback`;
    const response = await axios.get(res, {
      headers: {
        Authorization: `Bearer ${jwtToken()}`
    },
      params: {
        PageSize: pageSize,
        PageNumber: pageNumber,
        ...(rate && { Rate: rate }),
      },
    });
    return response;
  } catch (error) {
    handleError(error);
    throw new Error(error as string);
  }
};

export const handleDeleteFeedbackAPI = async (feedbackId?: string) => {
  try {    
    var res = `${baseURL}/v1/feedback/${feedbackId}`;
    const response = await axios.delete(res, {
      headers: {
        Authorization: `Bearer ${jwtToken()}`
    }
    });    
    return response;
  } catch (error) {
    handleError(error);
    throw new Error(error as string);
  }
};
