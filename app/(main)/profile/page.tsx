"use client";

import {
  handleGetStaffAPI,
  handleUpdateStaffAPI,
} from "@/components/api/person/staff";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { toast, useToast } from "@/components/ui/use-toast";
import { jwtToken } from "@/helpers/helpers";
import { StaffRequestModel } from "@/types/CreateModel/StaffRequestModel";
import { StaffResponseModel } from "@/types/ResponseModel/StaffType";
import { StaffUpdateRequestModel } from "@/types/UpdateModel/StaffUpdateRequestModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { ChevronDown, Icon, LogOut, User } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  fullName: z.string().min(1, "Required"),
  facebook: z.string().min(1, "Required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters") // Đổi độ dài tối thiểu thành 8
    .regex(/[A-Z]+/, "Password must contain at least one uppercase letter") // Kiểm tra chữ cái hoa
    .regex(/[a-z]+/, "Password must contain at least one lowercase letter") // Kiểm tra chữ cái thường
    .regex(/[0-9]+/, "Password must contain at least one number") // Kiểm tra số
    .regex(
      /[#$%!@&^*]+/,
      "Password must contain at least one special character (#$%!@&^*)"
    ), // Kiểm tra ký tự đặc biệt
});

interface CustomJwtPayload extends JwtPayload {
  UserId: string;
}

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { setValue } = form;
  useEffect(() => {
    const fetchstaff = async () => {
      try {
        setIsLoading(true);
        handleGetStaffs();
      } catch (error) {
        console.error("Error fetching staff data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchstaff();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("jwtToken");
    router.push("/login");
  };
  const handleGetStaffs = async () => {
    setIsLoading(true);
    const token = jwtToken();
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const response = await handleGetStaffAPI();
        if (response?.status === 200) {
          let listStaffs = response.data as StaffResponseModel[];
          listStaffs.forEach((e, index) => {
            if (e.id == decoded.UserId) {
              e.facebook && setValue("facebook", e.facebook);
              e.fullName && setValue("fullName", e.fullName);
            }
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (isLoading == true) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      let response = await handleUpdateStaffAPI(data);
      if (response && response.status === 200) {
        toast({
          title: "Changing information successful",
        });
        handleGetStaffs();
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BackButton text="Go Back" link="/" />
      <div className="cart-block md:py-20 py-10">
        <div className="container">
          <div className="content-main lg:px-[60px] md:px-4 flex gap-y-8 max-md:flex-col w-full">
            <div className="right xl:w-2/3 md:w-7/12 w-full xl:pl-[40px] lg:pl-[28px] md:pl-[16px] flex items-center">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder="Enter Full Name"
                  {...form.register("fullName")}
                />
                <input
                  className="w-full h-30 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder="Enter Facebook"
                  {...form.register("facebook")}
                />
                <input
                  className="w-full h-30 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder="Enter Password To Verify"
                  {...form.register("password")}
                />
                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    className="text-white font-semibold py-2 px-4 rounded-md"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
