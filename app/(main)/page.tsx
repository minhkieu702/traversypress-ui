"use client"
import DashboardCard from "@/components/dashboard/DashboardCard";
import PostsTable from "@/components/posts/PostsTable";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { Fish, Folder, MessageCircle, Newspaper, Square, User } from "lucide-react";
import { useEffect, useState } from "react";
import { handleGetProductTankAPI } from "@/components/api/products/tank";
import { AxiosError, AxiosResponse } from "axios";
import { ProductType } from "@/types/ResponseModel/ProductType";
import { getTotalCount } from "@/helpers/helpers";
import { toast } from "@/components/ui/use-toast";
import { handleGetProductFishAPI } from "@/components/api/products/fish";
import { handleGetCategoryAPI } from "@/components/api/products/category";
import { CategoryType } from "@/types/ResponseModel/CategoryType";
import { BreedType } from "@/types/ResponseModel/BreedType";
import { handleGetBreedAPI } from "@/components/api/products/breed";
import { ThreeDots } from "react-loader-spinner";
export default function Home() {
  const [fishCount, setFishCount] = useState(0);
  const [tankCount, setTankCount] = useState(0);
  const [breedCount, setBreedCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    try {
    handleGetBreed()
    handleGetCategory()
    handleGetFishProduct()
    handleGetTankProduct()
    } catch (error) {
      toast({
        title: "Error",
    })
    }
    setLoading(false)
  }, []);

  const handleGetTankProduct = async () => {
    try {
      let response = await handleGetProductTankAPI(
        1,
        1,
        null,
        null,
        null,
        null
      );
      if (response?.status === 200) {
        var data = response as AxiosResponse;
        let listporudct = data.data as ProductType[];
        console.log("listporudct", listporudct);
        setTankCount(getTotalCount(response));
        return;
      } else {
        var error = response as AxiosError;
        toast({
          title: "Error",
          content: error.response?.data as string,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetFishProduct = async () => {
    try {
      let response = await handleGetProductFishAPI(
        1,
        1,
        null,
        null,
        null,
        null
      );
      if (response?.status === 200) {
        var data = response as AxiosResponse;
        let listporudct = data.data as ProductType[];
        console.log("listporudct", listporudct);
        setFishCount(getTotalCount(response));
        return;
      } else {
        var error = response as AxiosError;
        toast({
          title: "Error",
          content: error.response?.data as string,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetCategory = async () => {
    try {        
        let response = await handleGetCategoryAPI()
    if (response?.status === 200) {
        var data = response as AxiosResponse
        let listporudct = data.data as CategoryType[]
        console.log("listporudct", listporudct);
        console.log("category", response);
        
        setCategoryCount(getTotalCount(response));
        return
    }
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetBreed = async () => {
    try {        
        let response = await handleGetBreedAPI()
    if (response?.status === 200) {
        var data = response as AxiosResponse
        let listporudct = data.data as BreedType[]
        console.log("listporudct", listporudct);
        setBreedCount(getTotalCount(response));
        return
    }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
    {loading ? (
      <div className="flex items-center justify-center h-screen">
<ThreeDots
  visible={true}
  height="80"
  width="80"
  color="#000000"
  radius="9"
  ariaLabel="three-dots-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
</div>
    ) : (
      <>
      <div className="flex flex-col md:flex-row justify-between gap-5 mb-5">
        <DashboardCard
          title="Fish Products"
          count={fishCount}
          icon={<Fish className="text-slate-500" size={72} />}
        />
        <DashboardCard
          title="Tank Products"
          count={tankCount}
          icon={<Square className="text-slate-500" size={72} />}
        />
        {/* <DashboardCard
          title="Posts"
          count={100}
          icon={<Newspaper className="text-slate-500" size={72} />}
        /> */}
        <DashboardCard
          title="Categories"
          count={categoryCount}
          icon={<Folder className="text-slate-500" size={72} />}
        />
        <DashboardCard
        title="Breeds"
        count={breedCount}
        icon={<Folder className="text-slate-500" size={72} />}
      />
        {/* <DashboardCard
          title="Users"
          count={750}
          icon={<User className="text-slate-500" size={72} />}
        /> */}
        {/* <DashboardCard
          title="Comments"
          count={1200}
          icon={<MessageCircle className="text-slate-500" size={72} />}
        /> */}
      </div>
      <AnalyticsChart />
      <PostsTable title="Latest Posts" limit={5} />
    </>
    )}
    </>
  );
}
