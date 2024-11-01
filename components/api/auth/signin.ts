import { baseURL } from "@/components/config";
import { handleError } from "@/components/helpers/helpers";
import axios from "axios"
export const handleSignInAPI = async (data: any) => {
    try {
      const user = {
        username: data.username,
        password: data.password
    }
    console.log("data", data);
    var res = `${baseURL}/auth/login-staff`
    console.log(res)
    const response = await axios.post(res, user)
    console.log("response", response);
    return response;
    } catch (error) {
      handleError(error)
      throw new Error(error as string);
    }
  };