

"use client";

import {
    handleDeleteCategoryAPI,
  handleGetCategoryAPI,
  handlePatchCategoryAPI,
  handlePostCategoryAPI,
} from "@/components/api/products/category";
import BackButton from "@/components/BackButton";
import HandlePagination from "@/components/Pagination";
import { CategoryType } from "@/types/ResponseModel/CategoryType";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { z } from "zod";
import { Form, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AxiosError, AxiosResponse } from "axios";
import { ThreeDots } from "react-loader-spinner";

const formSchema = z.object({
  tankType: z.string().min(1, "required"),
  level: z.string().min(1, "required"),
});
const Page = () => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });
  
    const { setValue } = form;
    const [listCategory, setListCategory] = useState<CategoryType[]>([]);
    const [pageSize, setPageSize] = useState(9);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalCategories, setTotalCategories] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [popup, setPopup] = useState(false);
    const [category, setCategory] = useState<CategoryType | null>(null);
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();
  
    useEffect(() => {
      handleGetCategories();
    }, [pageNumber]);
  
    useEffect(() => {
      setTotalPage(Math.ceil(totalCategories / pageSize));
    }, [totalCategories, pageSize]);
  
    const handleOpenPopup = (category?: CategoryType) => {
      setPopup(true);
      if (category) {
        setCategory(category);
        setValue("level", category.level);
        setValue("tankType", category.tankType);
      } else {
        setCategory(null);
        form.reset();
      }
    };
  
    const handleClosePopup = () => {
      setPopup(false);
      setCategory(null);
      form.reset();
    };
  const handleDeleteItem = async (id: string) => {
    setLoading(true)
    try {
        let response = await handleDeleteCategoryAPI(id)
    if (response.status === 200) {
        toast({
            title: "Successful",
            description: "Category was deleted successfully",
          });
    }          
    handleGetCategories();
    setLoading(false)
    } catch (error) {
        console.log(error);
        
    }
  }
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      setLoading(true)
      try {
        const response: AxiosResponse = category
          ? await handlePatchCategoryAPI(category.id, data)
          : await handlePostCategoryAPI(data);
        if (response.status === 200) {
          toast({
            title: "Successful",
            description: category
              ? `${category.tankType} - ${category.level} updated successfully`
              : "New category added successfully",
          });
          handleClosePopup();
          handleGetCategories();
          setLoading(false)
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleGetCategories = async () => {
      setLoading(true)
      try {
        const response = await handleGetCategoryAPI();
        if (response?.status === 200) {
          setListCategory(response.data);
          getTotalCount(response);
          setLoading(false)
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    const getTotalCount = (response: any) => {
      const paginationHeader = response?.headers["x-pagination"];
      if (paginationHeader) {
        const paginationData = JSON.parse(paginationHeader);
        const totalCount = paginationData.TotalCount;
        setTotalCategories(totalCount);
      }
    };
  
    const handleChangePage = (opt: number) => {
      setPageNumber(opt + 1);
    };
  
    return (
      <>
      {loading ? (
        <><div className="flex items-center justify-center h-screen">
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
        </div></>
      ) : (
      <>
        <BackButton text="Go Back" link="/" />
        <button onClick={() => handleOpenPopup()}>Add new category</button>
        {popup && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <input
          className="uppercase text-xs font-bold text-zinc-500 dark:text-white"
            placeholder="Enter Level"
            {...form.register("level")}
          />
          <input
          className="uppercase text-xs font-bold text-zinc-500 dark:text-white"
            placeholder="Enter Tank Type"
            {...form.register("tankType")}
          />
          <Button type="submit">Submit</Button>
          <Button type="button" onClick={handleClosePopup}>
            Cancel
          </Button>
        </form>
      )}
        {listCategory && (
          <div className="mt-10">
            <Table>
              <TableCaption>A list of recent products</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Create At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listCategory.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.tankType}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.level}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.createdAt}
                    </TableCell>
                    <TableCell>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
                        onClick={() => handleOpenPopup(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
                        onClick={() => handleDeleteItem(product.id)}
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {totalPage > 0 && (
          <div className="list-pagination flex items-center md:mt-10 mt-7">
            <HandlePagination onPageChange={handleChangePage} pageCount={totalPage} />
          </div>
        )}
      </>
      )
    }
    </>
    );
  };
  
  export default Page;
  