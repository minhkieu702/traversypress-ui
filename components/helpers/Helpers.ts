import axios from "axios";
import { toast } from "../ui/use-toast";

const convertToBinaryString = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        resolve(binaryString);
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  };
  
 export const convertImageListToBinaryStrings = async (files: File[]): Promise<string[]> => {
    const promises = files.map(file => convertToBinaryString(file));
    return Promise.all(promises);
  };
  
  export const logFormData = (formData: FormData) => {
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
  };

  export const normalizeData = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map(normalizeData);
    } else if (data !== null && typeof data === 'object') {
      return Object.keys(data).reduce((acc: any, key) => {
        const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelCaseKey] = normalizeData(data[key]);
        return acc;
      }, {});
    }
    return data;
  };

export const handleError = (error: unknown) => {
  console.log(error);
  
  if (axios.isAxiosError(error)) {
    if (error.response && error.response.data) {
      const errorData = error.response.data.data;
let message = ''
      // Check if `errorData` is an array and contains error messages
      if (Array.isArray(errorData) && errorData.length > 0) {
        errorData.forEach((err, index) => {
          message += err.errorMessage
          message += "\n"
        })
      }
      toast({
        title: "Error",
        description: message
      })
    }
  }
};

  