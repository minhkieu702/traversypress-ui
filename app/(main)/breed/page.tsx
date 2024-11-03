"use client";

import {
  handleGetBreedAPI,
  handlePutBreedAPI,
  handlePostBreedAPI,
} from "@/components/api/products/breed";
import BackButton from "@/components/BackButton";
import HandlePagination from "@/components/Pagination";
import { BreedType } from "@/types/ResponseModel/BreedType";
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
import { set, z } from "zod";
import { Form, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AxiosError, AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";
import { Jacquarda_Bastarda_9 } from "next/font/google";
import { ThreeDots } from "react-loader-spinner";

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
});
const Page = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { setValue } = form;
  const [listBreed, setListBreed] = useState<BreedType[]>([]);
  const [pageSize, setPageSize] = useState(9);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalBreeds, setTotalBreeds] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [popup, setPopup] = useState(false);
  const [breed, setBreed] = useState<BreedType | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    handleGetBreeds();
  }, [pageNumber]);

  useEffect(() => {
    setTotalPage(Math.ceil(totalBreeds / pageSize));
  }, [totalBreeds, pageSize]);

  const handleOpenPopup = (breed?: BreedType) => {
    setPopup(true);
    if (breed) {
      setBreed(breed);
      setValue("id", breed.id);
      setValue("name", breed.name);
      setValue("description", breed.description);
    } else {
      setBreed(null);
      setValue("id", uuidv4()); // Only set a new UUID for new breeds
      form.reset({ id: uuidv4() });
    }
  };

  const handleClosePopup = () => {
    setPopup(false);
    setBreed(null);
    form.reset();
  };
  //   const handleDeleteItem = async (id: string) => {
  //     try {
  //         let response = await handleDeleteBreedAPI(id)
  //     if (response.status === 200) {
  //         toast({
  //             title: "Successful",
  //             description: "Breed was deleted successfully",
  //           });
  //     }
  //     handleGetBreeds();
  //     } catch (error) {
  //         console.log(error);

  //     }
  //   }
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response: AxiosResponse = breed
        ? await handlePutBreedAPI(breed.id, data)
        : await handlePostBreedAPI(data);
      if (response.status === 200) {
        toast({
          title: "Successful",
          description: breed
            ? `${breed.name} updated successfully`
            : "New breed added successfully",
        });
        handleClosePopup();
        handleGetBreeds();
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetBreeds = async () => {
    setLoading(true);
    try {
      const response = await handleGetBreedAPI(9, pageNumber);
      if (response?.status === 200) {
        setListBreed(response.data);
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
      setTotalBreeds(totalCount);
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
          <div className="button">
            <BackButton text="Go Back" link="/" />
          </div>

          <button
            onClick={() => handleOpenPopup()}
            className="bg-black text-white font-bold py-2 px-4 rounded text-xs"
          >
            Add new breed
          </button>

          {popup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              {/* Modal container */}
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add New Breed</h2>
                  <button
                    onClick={handleClosePopup}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>

                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <input type="hidden" {...form.register("id")} />

                  <div>
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      placeholder="Enter Name"
                      {...form.register("name")}
                    />
                  </div>

                  <div>
                    <textarea
                      className="w-full h-30 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      placeholder="Enter Description"
                      {...form.register("description")}
                    />
                  </div>

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

          {listBreed && (
            <div className="mt-10">
              <Table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
                <TableCaption className="text-gray-500 text-sm p-4">
                  A list of recent products
                </TableCaption>

                <TableHeader className="bg-gray-100 text-gray-600 font-semibold">
                  <TableRow>
                    <TableHead className="py-3 px-6 text-left">Type</TableHead>
                    <TableHead className="py-3 px-6 text-left">Level</TableHead>
                    <TableHead className="py-3 px-6 text-left">
                      Create At
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {listBreed.map((product) => (
                    <TableRow
                      key={product.id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <TableCell className="py-3 px-6">
                        {product.name}
                      </TableCell>
                      <TableCell className="py-3 px-6 hidden md:table-cell break-words">
                        {product.description}
                      </TableCell>
                      <TableCell className="py-3 px-6">
                        <button
                          className="bg-black text-white font-bold py-2 px-4 rounded text-xs"
                          onClick={() => handleOpenPopup(product)}
                        >
                          Edit
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
