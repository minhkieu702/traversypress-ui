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
  const [pageSize, setPageSize] = useState(1);
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
    setLoading(true);
    try {
      let response = await handleDeleteCategoryAPI(id);
      if (response.status === 200) {
        toast({
          title: "Successful",
          description: "Category was deleted successfully",
        });
      }
      handleGetCategories();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
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
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetCategories = async () => {
    setLoading(true);
    try {
      const response = await handleGetCategoryAPI(pageSize, pageNumber);
      if (response?.status === 200) {
        setListCategory(response.data);
        getTotalCount(response);
        setLoading(false);
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
        <>
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
        </>
      ) : (
        <>
          <BackButton text="Go Back" link="/" />
          <button
            onClick={() => handleOpenPopup()}
            className="bg-black text-white font-bold py-2 px-4 rounded text-xs"
          >
            Add new category
          </button>
          {popup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              {/* Modal container */}
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Thêm Loại Hồ Cá</h2>
                  <button
                    onClick={handleClosePopup}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    placeholder="Enter Level"
                    {...form.register("level")}
                  />
                  <textarea
                    className="w-full h-30 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    placeholder="Enter Tank Type"
                    {...form.register("tankType")}
                  />
                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      className="text-white font-semibold py-2 px-4 rounded-md"
                    >
                      Submit
                    </Button>

                    <Button
                      type="button"
                      onClick={handleClosePopup}
                      className="text-white font-semibold py-2 px-4 rounded-md"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
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
                          className="bg-black text-white font-bold py-2 px-4 rounded text-xs"
                          onClick={() => handleOpenPopup(product)}
                        >
                          Edit
                        </button>
                        <>{" "}</>
                        <button
                          className="bg-black text-white font-bold py-2 px-4 rounded text-xs"
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
          {totalPage > 1 && (
            <div className="list-pagination flex items-center md:mt-10 mt-7">
              <HandlePagination
                onPageChange={handleChangePage}
                pageCount={totalPage}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Page;
